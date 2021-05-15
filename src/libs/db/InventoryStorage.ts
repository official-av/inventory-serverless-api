import * as Logger from "lamlog";
import {DBConnect} from '../dbConnect';
import {Inventory} from "../../_interfaces/Inventory.interface";

export class InventoryStorage {
	constructor(private logger: Logger, private db: DBConnect) {
		this.logger = logger.child('inventory storage');
	}

	// get Inventories
	async getInventories() {
		const dbClient = this.db.dbClient;
		try {
			return await dbClient`select inv_id as id,inv_name as name, price, weight from inventories`;
		} catch (err) {
			console.log(err);
			this.logger.error('error while getInventories', err);
			throw err;
		}
	}

	// get Inventory details by ID
	async getInventoryDetailsByID(inventoryID: number) {
		const dbClient = this.db.dbClient;
		try {
			let invDetailsPromise = dbClient`select inv_id as id,inv_name as name, price, weight from inventories where inv_id=${inventoryID}`;
			let invUserDetailsPromise = this.getInventoryUserDetailsByID(inventoryID);
			const [first, second] = await Promise.all([invDetailsPromise, invUserDetailsPromise]);
			return {...first[0], users: second};
		} catch (err) {
			console.log(err);
			this.logger.error('error while getInventoryDetailsByID', err);
			throw err;
		}
	}

	// get Inventory User Details by ID
	async getInventoryUserDetailsByID(inventoryID: number) {
		const dbClient = this.db.dbClient;
		try {
			return await dbClient`select user_id as id, fname from users where user_id in (select user_id from inv_access where inv_id = ${inventoryID})`;
		} catch (err) {
			console.log(err);
			this.logger.error('error while getInventoryUserDetailsByID', err);
			throw err;
		}
	}

	// create inventory
	async createInventory(inventory: Inventory) {
		const dbClient = this.db.dbClient;
		try {
			// insert inv record and get id
			const [{id}] = await dbClient`INSERT INTO inventories (inv_name, price, weight)
			VALUES(${inventory.name},${inventory.price},${inventory.weight}) RETURNING inventories.inv_id as id`;
			// link inv record with users
			return await this.linkUserIDsWithInventory(id, inventory.users);
		} catch (err) {
			console.log(err);
			this.logger.error('error while createInventory', err);
			throw err;
		}
	}

	// create inventory
	async createMultipleInventories(inventories: Array<any>) {
		const dbClient = this.db.dbClient;
		inventories.forEach(x => x.inv_name = x.name);
		try {
			// insert inv records and get ids
			const result = await dbClient`INSERT INTO inventories ${dbClient(inventories, 'inv_name', 'price', 'weight')} RETURNING inv_id`;
			// insert inv_access users records for each inv_id
			let promisesArr = [];
			result.forEach((x, index) =>
				promisesArr.push(this.linkUserIDsWithInventory(x.inv_id, inventories[index].users)));
			return await Promise.all(promisesArr);
		} catch (err) {
			console.log(err);
			this.logger.error('error while createInventory', err);
			throw err;
		}
	}

	async linkUserIDsWithInventory(inventoryID: number, users: Array<any>) {
		const dbClient = this.db.dbClient;
		try {
			let insertArr = Array.from(users, user => {
				return {inv_id: inventoryID, user_id: user.id}
			});
			return await dbClient`INSERT INTO inv_access ${dbClient(insertArr, 'inv_id', 'user_id')}`;
		} catch (err) {
			console.log(err);
			this.logger.error('error while createInventory', err);
			throw err;
		}
	}


	// update inventory
	async updateInventory(inventory: Inventory) {
		const dbClient = this.db.dbClient;
		try {
			// delete all existing users linked with inv
			await dbClient`DELETE from inv_access where inv_id = ${inventory.id}`;
			// update inv record
			let updateINVPromise = dbClient`UPDATE inventories SET inv_name = ${inventory.name}, price = ${inventory.price}, weight = ${inventory.weight} where inv_id=${inventory.id}`;
			// insert new users linked with inv
			let insertUsersPromise = this.linkUserIDsWithInventory(inventory.id, inventory.users);
			return await Promise.all([updateINVPromise, insertUsersPromise]);
		} catch (err) {
			console.log(err);
			this.logger.error('error while updateInventory', err);
			throw err;
		}
	}

	// update bulk inventories
	async updateBulkInventories(inventories: Array<any>) {
		const dbClient = this.db.dbClient;
		try {
			// delete all existing users linked with inv
			// let deletePromisesArr = [];
			let values = [];
			inventories.forEach(x => {
				// deletePromisesArr.push(dbClient`DELETE from inv_access where inv_id = ${x.id}`);
				values.push(`(${x.id},''${x.name}'',${x.price},''${x.weight}'')`);
			});
			// await Promise.all(deletePromisesArr);
			// update inv details records
			let updatePromisesArr = [];
			let invIDs = Array.from(inventories, x => x.id).join(',');
			console.log('invIDs', invIDs);
			let valsString = values.join(',');
			console.log('valsString', valsString);
			let customQuery = `call SPBulkUpdateInventories('${invIDs}','${valsString}');`;
			/*let customQuery = `UPDATE inventories as i SET inv_name = c.inv_name, price = c.price, weight = c.weight from (values
			 ${dbClient(valsString).first}) as c(inv_id,inv_name,weight,price) where c.inv_id=i.inv_id`;*/
			console.log('customQuery', customQuery);
			updatePromisesArr.push(dbClient.unsafe(customQuery));
			// update inv_access records
			inventories.forEach(x => {
				updatePromisesArr.push(this.linkUserIDsWithInventory(x.id, x.users));
			});
			return await Promise.all(updatePromisesArr);
		} catch (err) {
			console.log(err);
			this.logger.error('error while updateInventory', err);
			throw err;
		}
	}

	// delete inventory
	async deleteInventory(inventoryID: number) {
		const dbClient = this.db.dbClient;
		try {
			await dbClient`DELETE FROM inv_access where inv_id=${inventoryID}`;
			return await dbClient`DELETE FROM inventories where inv_id=${inventoryID}`;
		} catch (err) {
			console.log(err);
			this.logger.error('error while deleteInventory', err);
			throw err;
		}
	}

	// update bulk inventories
	async deleteBulkInventories(invIDs: string) {
		const dbClient = this.db.dbClient;
		try {
			await dbClient.unsafe(`delete from inv_access where inv_id IN (${invIDs})`);
			return await dbClient.unsafe(`delete from inventories where inv_id IN (${invIDs})`);
		} catch (err) {
			console.log(err);
			this.logger.error('error while updateInventory', err);
			throw err;
		}
	}
}
