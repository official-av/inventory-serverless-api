import * as Config from 'lamcfg';
import * as Logger from 'lamlog';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {User} from "../_interfaces/User.interface";
import {HttpVerb, PolicyHelper} from '@libs/policyHelper';

export class AuthHelpers {
	public static saltRounds = 10;

	constructor(private config: Config, private logger: Logger) {
		this.logger = this.logger.child('Auth helpers logs');
	}

	public checkPasswordValid(password: string): boolean {
		try {
			let regex = new RegExp(this.config.get('DefaultPasswordRegex'));
			return regex.test(password);
		} catch (e) {
			throw e;
		}
	}

	public async saltAndHashPass(password: string): Promise<string> {
		try {
			let salt = await bcrypt.genSalt(AuthHelpers.saltRounds);
			if (salt) {
				return await bcrypt.hash(password, salt);
			}
		} catch (e) {
			throw e;
		}
	}

	public async comparePasswordWithHash(password: string, hashPass: string): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hashPass);
		} catch (e) {
			throw e;
		}
	}

	public async generateJWT(user: User): Promise<string> {
		let iat = Math.floor(Date.now() / 1000);
		let exp = iat + (Number(this.config.get("DefaultTokenExpiry")));
		let userClaims = {
			id: user.id,
			email: user.email,
			admin: user.admin,
			fname: user.fname,
			lname: user.lname,
			iat,
			exp
		};
		try {
			return await jwt.sign(userClaims, this.config.get("DefaultJWTSecret"));
		} catch (e) {
			throw e;
		}
	}

	public async verifyToken(token): Promise<any> {
		try {
			return await jwt.verify(token, this.config.get("DefaultJWTSecret"));
		} catch (e) {
			throw e;
		}
	}

	public policyGenerator(isAdmin, methodArn, identity) {
		try{
			const tmp = methodArn.split(':');
			const apiGatewayArnTmp = tmp[5].split('/');
			const awsAccountId = tmp[4];
			const apiOptions = {
				region: tmp[3],
				restApiId: apiGatewayArnTmp[0],
				stage: apiGatewayArnTmp[1]
			};
			const policy = new PolicyHelper(JSON.stringify(identity), awsAccountId, apiOptions);
			if (isAdmin) {
				policy.allowMethod(HttpVerb.ALL, `/*`);
			} else { // vendor policy
				policy.allowMethod(HttpVerb.POST, '/login');
				policy.allowMethod(HttpVerb.GET, '/inventory');
				policy.allowMethod(HttpVerb.PUT, '/inventory');
			}
			return policy.build();
		} catch (e) {
			this.logger.error('error in policy generation',e);
			throw e;
		}

		/*const authResponse = {} as any;
		authResponse.principalId = principalId;
		if (effect && resource) {
			const policyDocument = {} as any;
			policyDocument.Version = '2012-10-17';
			policyDocument.Statement = [];
			const statementOne = {} as any;
			statementOne.Action = 'execute-api:Invoke';
			statementOne.Effect = 'Allow';
			if (isAdmin) {
				statementOne.Resource = ['execute-api:/!*!/!*!/!*']
			} else {
				statementOne.Resource = vendorAPIResources;
			}
			policyDocument.Statement[0] = statementOne;
			authResponse.policyDocument = policyDocument;
		}
		return authResponse;*/
	}
}
