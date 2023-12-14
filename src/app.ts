/** @format */

import { Express } from 'express';
import Environment from './config/environment';
import CronJobManager from './cronJob/cronJobManager';
import CSVUploaderManager from './csvUploader/CSVUploaderManager';
import DBConnection, { IDBConnection } from './database/dbConnection';
import DBManager from './database/dbManager';
export default class App {
	private express: Express;
	protected envSetting: Environment;
	protected dbManager?: DBManager;
	protected dbConnection: IDBConnection;
	protected cronJobManager?: CronJobManager;
	protected csvUploaderManger?: CSVUploaderManager;
	constructor(express: Express) {
		this.express = express;
		this.envSetting = new Environment();
		this.dbConnection = new DBConnection(this.envSetting);
	}
	/**
	 * Init application
	 * @returns
	 */
	async init(): Promise<boolean> {
		if (await this.dbConnection.connect()) {
			// db connection
			this.dbManager = new DBManager(this.dbConnection);

			// csv uploader handler
			this.csvUploaderManger = new CSVUploaderManager(
				this.envSetting.getCurServerType(),
				this.envSetting,
				this.envSetting.getApiKey()
			);

			// uploader handler init is success
			if (this.csvUploaderManger.init()) {
				// create cronjob Manager
				this.cronJobManager = new CronJobManager(
					this.dbManager,
					this.csvUploaderManger
				);

				return true;
			} else {
				return false;
			}
		}
		return false;
	}
}
