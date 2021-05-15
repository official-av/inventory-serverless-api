import * as Config from 'lamcfg';
import * as Logger from 'lamlog';
import {middyfy} from "@libs/lambda";
import {AuthHelpers} from "@libs/authHelpers";
import {DBConnect} from "@libs/dbConnect";
import {UserStorage} from "@libs/db/UserStorage";
import {INVResponse} from "../../_interfaces/INVResponse.interface";
import {formatJSONResponse} from "@libs/apiGateway";
import {User} from "../../_interfaces/User.interface";
import {AWSSESHelper} from "@libs/AWSSESHelper";

const config = new Config();
const logger = new Logger({name: "auth-endpoints-process", level: "trace"});
const authHelpers = new AuthHelpers(config, logger);
const dbConnect = new DBConnect(config, logger);
const userStorage = new UserStorage(logger, dbConnect);
const awsSES = new AWSSESHelper(logger, config);

const _login = async (event) => {
	logger.info('login event start', event);
	let result = {status: 200} as INVResponse;
	try {
		const pass = event.body.password;
		const email = event.body.email;
		// fetch user details via email
		const userDetails = await userStorage.getUserDetailsByEmail(email);
		// compare password with hashed pass from db
		const comparePass = await authHelpers.comparePasswordWithHash(pass, userDetails.password);
		if (comparePass) {
			// create jwt and return
			result.data = {token: await authHelpers.generateJWT(userDetails)};
			result.message = 'User Login Successful.';
		} else {
			result.status = 400;
			result.message = 'You have entered incorrect credentials.';
		}
	} catch (e) {
		result.status = 400;
		result.message = 'Error Occurred during login.';
		result.data = {error: e};
	}
	return formatJSONResponse(result);
}

const _register = async (event) => {
	logger.info('register event start', event);
	let result = {status: 200} as INVResponse;
	let user = {
		fname: event.body.fname,
		lname: event.body.lname,
		email: event.body.email,
		password: event.body.password,
		contact: event.body.contact
	} as User;
	try {
		// check password valid
		if (authHelpers.checkPasswordValid(user.password)) {
			// check email exists
			if (await userStorage.checkEmailExists(user.email)) {
				result.message = 'User with that email exists.';
			} else { // create new user
				const originalPwd = user.password;
				// hash and salt the pass
				user.password = await authHelpers.saltAndHashPass(user.password);
				// create user
				result.data = await userStorage.createUser(user);
				// mail user credentials
				const mailBody = `Your login credentials for ${config.get("DefaultUIURL")} are:
				email: ${user.email}, password: ${originalPwd}`;
				const mailSubject = `Successful Registration for ${config.get("DefaultUIURL")}`;
				const from = config.get("DefaultFromMail");
				let mailStatus = await awsSES.sendMail([user.email], mailBody, mailSubject, from);
				console.log('mail==================', mailStatus);
				result.data = {...result.data, mailStatus};
				result.message = "User created successfully."
			}
		} else {
			result.status = 400;
			result.message = 'Invalid Input Details';
		}
	} catch (e) {
		console.log('error===============', e);
		result.status = 400;
		result.message = 'Error Occurred during registration.';
		result.data = {error: e};
	}
	return formatJSONResponse(result);
}

const _verifyToken = async (event, _context, callback) => {
	logger.info('verify token event start', event);
	try {
		const authToken = event.authorizationToken.split(' ')[1];
		let res = await authHelpers.verifyToken(authToken);
		logger.info('verifyToken content', res);
		if (res && res.hasOwnProperty('admin')) {
			const policy = authHelpers.policyGenerator(res.admin, event.methodArn, res);
			logger.info('policy', JSON.stringify(policy));
			return callback(null, policy);
		}
	} catch (e) {
		logger.error('error in verify token', e);
		return callback(null, 'Unauthorized');
	}
}

export const login = middyfy(_login);
export const register = middyfy(_register);
export const verifyToken = middyfy(_verifyToken);
