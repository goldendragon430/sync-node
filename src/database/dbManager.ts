/** @format */

import RepositoryManager from '../repository/repositoryManager';
import { IDBConnection } from './dbConnection';

export default class DBManager {
	dbConnection: IDBConnection;
	repositoryManager: RepositoryManager;

	constructor(db: IDBConnection) {
		this.dbConnection = db;

		this.repositoryManager = new RepositoryManager(db);
	}
	getDBConnection(): IDBConnection {
		return this.dbConnection;
	}
	getRepositoryManager(): RepositoryManager {
		return this.repositoryManager;
	}
}
