import * as Logger from "lamlog";
import {DBConnect} from '../dbConnect';
import {User} from "../../_interfaces/User.interface";

export class UserStorage {
	constructor(private logger: Logger, private db: DBConnect) {
	}

	public async checkEmailExists(email: string): Promise<boolean> {
		const dbClient = this.db.dbClient;
		try {
			let result = await dbClient`select count(email) from users where email=${email}`;
			return result[0].count > 0;
		} catch (err) {
			console.log(err);
			this.logger.error('error while checkEmailExists', err);
			throw err;
		}
	}

	public async createUser(user: User): Promise<any> {
		const dbClient = this.db.dbClient;
		try {
			return await dbClient`INSERT INTO users (fname, lname, email, password, contact)
			VALUES(${user.fname},${user.lname},${user.email},${user.password},${user.contact})
			 RETURNING users.user_id as id`;
		} catch (err) {
			console.log(err);
			this.logger.error('error while createUser', err);
			throw err;
		}
	}

	public async getUserDetailsByEmail(email: string): Promise<User> {
		const dbClient = this.db.dbClient;
		try {
			let result = await dbClient`Select user_id as id, fname, lname,password, email, contact, is_admin as admin, created_at as created from users where email=${email}`;
			return result[0] as User;
		} catch (err) {
			console.log(err);
			this.logger.error('error while getUserDetailsByEmail', err);
			throw err;
		}
	}

	public async getUserDetailsByID(ID: number): Promise<User> {
		const dbClient = this.db.dbClient;
		try {
			let result = await dbClient`Select user_id as id, fname, lname, email, contact, is_admin as admin, created_at as created from users where user_id=${ID}`;
			return result[0] as User;
		} catch (err) {
			console.log(err);
			this.logger.error('error while getUserDetailsByID', err);
			throw err;
		}
	}

	public async getAllUsers(query = ''): Promise<Array<User>> {
		const dbClient = this.db.dbClient;
		try {
			let result;
			if (query && query !== '') {
				result = await dbClient`Select user_id as id, fname, lname, email, contact, is_admin as admin, created_at as created from users  where fname like ${'%' + query + '%'} OR lname like ${'%' + query + '%'} OR email like ${'%' + query + '%'}`;
			} else {
				result = await dbClient`Select user_id as id, fname, lname, email, contact, is_admin as admin, created_at as created from users`;
			}
			return result as Array<User>;
		} catch (err) {
			console.log(err);
			this.logger.error('error while getAllUsers', err);
			throw err;
		}
	}
}
