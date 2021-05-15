import * as Logger from 'lamlog';
import {InventoryStorage} from "@libs/db/InventoryStorage";
import {INVResponse} from "../../_interfaces/INVResponse.interface";
import {Inventory} from "../../_interfaces/Inventory.interface";

export class InventoryOperations {
	constructor(private logger: Logger, private invStorage: InventoryStorage) {
		this.logger = this.logger.child('Inventory operations');
	}

	// get Inventories
	async getInventories(_event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			result.data = await this.invStorage.getInventories();
			result.message = 'Inventories fetched successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while fetching Inventories';
		}
		this.logger.info('result', result);
		return result;
	}

	// get Inventory details by ID
	async getInventoryDetailsByID(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			let inventoryID: number;
			if (event.pathParameters && event.pathParameters.id) {
				inventoryID = event.pathParameters.id;
			} else {
				throw 'No ID in path';
			}
			result.data = await this.invStorage.getInventoryDetailsByID(inventoryID);
			result.message = 'Inventory fetched successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while fetching Inventory.';
		}
		this.logger.info('result', result);
		return result;
	}

	// create inventory
	async createInventory(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			let inventory = event.body as Inventory;
			result.data = await this.invStorage.createInventory(inventory);
			result.message = 'Inventory created successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while creating Inventory.';
		}
		this.logger.info('result', result);
		return result;
	}

	// create bulk inventories
	async createBulkInventories(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			if (!event.body.inventories) {
				throw 'No inventories object in payload';
			}
			let inventories = event.body.inventories as Array<Inventory>;
			result.data = await this.invStorage.createMultipleInventories(inventories);
			result.message = 'Inventories created successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while creating Inventory.';
		}
		this.logger.info('result', result);
		return result;
	}

	// update inventory
	async updateInventory(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			let inventory = event.body as Inventory;
			result.data = await this.invStorage.updateInventory(inventory);
			result.message = 'Inventory updated successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while creating Inventories.';
		}
		this.logger.info('result', result);
		return result;
	}

	// update bulk inventories
	async updateBulkInventories(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			if (!event.body.inventories) {
				throw 'No inventories object in payload';
			}
			let inventories = event.body.inventories as Array<Inventory>;
			result.data = await this.invStorage.updateBulkInventories(inventories);
			result.message = 'Inventories updated successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while updating Inventories.';
		}
		this.logger.info('result', result);
		return result;
	}

	// delete inventory
	async deleteInventory(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			let inventoryID: number;
			if (event.pathParameters && event.pathParameters.id) {
				inventoryID = event.pathParameters.id;
			} else {
				throw 'No ID in path';
			}
			result.data = await this.invStorage.deleteInventory(inventoryID);
			result.message = 'Inventory deleted successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while deleting Inventory.';
		}
		this.logger.info('result', result);
		return result;
	}

	// delete bulk inventories
	async deleteBulkInventories(event): Promise<INVResponse> {
		let result = {status: 200} as INVResponse;
		try {
			if (!event.body.invIDs) {
				throw 'No invIDs in payload';
			}
			let invIDs = event.body.invIDs as string;
			result.data = await this.invStorage.deleteBulkInventories(invIDs);
			result.message = 'Inventories deleted successfully.'
		} catch (err) {
			result.status = 400;
			result.data = {error: err};
			result.message = 'Error occurred while deleting Inventories.';
		}
		this.logger.info('result', result);
		return result;
	}
}
