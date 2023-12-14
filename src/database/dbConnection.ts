/** @format */

import { Connection, createConnection } from 'mysql2';
import { IDBEnvManager } from '../config/environment';
export interface IDBConnection {
	getDB(): Connection;
	getDBSetting(): IDBEnvManager;
	connect(): Promise<boolean>;
}
export default class DBConnection implements IDBConnection {
	protected db: Connection;
	protected db_Setting: IDBEnvManager;

	constructor(dbEnv: IDBEnvManager) {
		this.db_Setting = dbEnv;
		const { db_host, db_password, db_port, db_user, db_database } =
			dbEnv.getDBOptions();
		try {
			this.db = createConnection({
				host: db_host,
				port: db_port,
				user: db_user,
				password: db_password,
				database: db_database,
			});
		} catch (e: any) {
			console.log('DB Connection Error');
			process.exit(0);
		}
	}
	async connect(): Promise<boolean> {
		try {
			await this.db.connect();
			console.log('Database is connected');
			return true;
		} catch (e: any) {
			console.log('Database Connection Error:', e);
			return false;
		}
	}
	getDB(): Connection {
		return this.db;
	}
	getDBSetting(): IDBEnvManager {
		return this.db_Setting;
	}
}
