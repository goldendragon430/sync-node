/** @format */

import { IDBConnection } from '../database/dbConnection';

export default class BaseRepository {
	protected dbConnection: IDBConnection;
	constructor(db: IDBConnection) {
		this.dbConnection = db;
	}
}
