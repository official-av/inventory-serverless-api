import * as Logger from 'lamlog';
import {UserStorage} from '@libs/db/UserStorage';
import {INVResponse} from '../../_interfaces/INVResponse.interface';

export class UserOperations {
	constructor(private logger: Logger, private userStorage: UserStorage) {
		this.logger = this.logger.child('User operations');
	}

	public async getAllUsers(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			const query = event?.queryStringParameters?.q;
			result.data = await this.userStorage.getAllUsers(query);
			result.message = 'Users fetched successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while fetching all Users';
		}
		this.logger.info('result', result);
		return result;
	}

	public async getUserDetails(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			let userID: number;
			if (event.pathParameters && event.pathParameters.id) {
				userID = event.pathParameters.id;
			} else {
				throw 'No ID in path';
			}
			result.data = await this.userStorage.getUserDetailsByID(userID);
			result.message = 'User Details fetched successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while fetching User Details.';
		}
		this.logger.info('result', result);
		return result;
	}
}
