import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import * as Config from 'lamcfg';
import * as Logger from 'lamlog';
import {DBConnect} from "@libs/dbConnect";
import {InventoryStorage} from "@libs/db/InventoryStorage";
import {INVResponse} from "../../_interfaces/INVResponse.interface";
import {InventoryOperations} from "./InventoryOperations";

const config = new Config();
const logger = new Logger({name: "inventory-endpoints-process", level: "trace"});
const dbConnect = new DBConnect(config, logger);
const inventoryStorage = new InventoryStorage(logger, dbConnect);
const inventoryOps = new InventoryOperations(logger, inventoryStorage);

const inventory: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
	let res: INVResponse;
	try {
		switch (event.httpMethod) {
			case 'GET':
				if (event.pathParameters && event.pathParameters.id) {
					res = await inventoryOps.getInventoryDetailsByID(event);
				} else {
					res = await inventoryOps.getInventories(event);
				}
				break;
			case 'POST':
				if (event.path.includes('bulk')) {
					res = await inventoryOps.createBulkInventories(event);
				} else {
					res = await inventoryOps.createInventory(event);
				}
				break;
			case 'PUT':
				if (event.path.includes('bulk')) {
					res = await inventoryOps.updateBulkInventories(event);
				} else {
					res = await inventoryOps.updateInventory(event);
				}
				break;
			case 'DELETE':
				if (event.path.includes('bulk')) {
					res = await inventoryOps.deleteBulkInventories(event);
				} else {
					res = await inventoryOps.deleteInventory(event);
				}
				break;
			default:
				res = {status: 400, message: 'invalid request', data: {requestEvent: event}};
		}
	} catch (e) {
		res = {status: 500, message: 'something went wrong', data: {error: e}};
	}
	return formatJSONResponse(res);
}

export const main = middyfy(inventory);
