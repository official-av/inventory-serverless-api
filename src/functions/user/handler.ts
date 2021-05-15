import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import * as Config from 'lamcfg';
import * as Logger from 'lamlog';
import {DBConnect} from "@libs/dbConnect";
import {INVResponse} from "../../_interfaces/INVResponse.interface";
import {UserStorage} from '@libs/db/UserStorage';
import {UserOperations} from './UserOperations';

const config = new Config();
const logger = new Logger({name: "user-endpoints-process", level: "trace"});
const dbConnect = new DBConnect(config, logger);
const userStorage = new UserStorage(logger, dbConnect);
const userOps = new UserOperations(logger, userStorage);

const user: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
	let res: INVResponse;
	try {
		switch (event.httpMethod) {
			case 'GET':
				if (event.pathParameters && event.pathParameters.id) {
					res = await userOps.getUserDetails(event);
				} else {
					res = await userOps.getAllUsers(event);
				}
				break;
			/*case 'POST':
				res = await userOps.c(event);
				break;*/
			/*case 'PUT':
				res = await inventoryOps.updateInventory(event);
				break;
			case 'DELETE':
				res = await inventoryOps.deleteInventory(event);
				break;*/
			default:
				res = {status: 400, message: 'invalid request', data: {requestEvent: event}};
		}
	} catch (e) {
		res = {status: 500, message: 'something went wrong', data: {error: e}};
	}
	return formatJSONResponse(res);
}

export const main = middyfy(user);
