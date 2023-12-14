/** @format */

import {
	IAPIKeyManager,
	IServerUploaderManager,
	ServerUploderURLType,
	SERVER_TYPE,
} from '../config/environment';
import CSVUploader from './csvUploader';
export interface IUploaderList {
	getCSVUploader(): Map<SERVER_TYPE, CSVUploader>;
}
export default class CSVUploaderManager implements IUploaderList {
	protected csvUploaderList: Map<SERVER_TYPE, CSVUploader>;
	protected curServer: SERVER_TYPE;
	protected serverList: ServerUploderURLType;
	protected apiKey: string;
	constructor(
		curServer: SERVER_TYPE,
		serverEnv: IServerUploaderManager,
		apiKey: string
	) {
		this.csvUploaderList = new Map<SERVER_TYPE, CSVUploader>();
		this.curServer = curServer;
		this.serverList = serverEnv.getServerUploaderUrl();
		this.apiKey = apiKey;
	}
	addUploader(server: SERVER_TYPE) {
		if (!this.serverList[server] || this.serverList[server] === '') {
			throw new Error('Invalid Server Upload Url');
		}
		this.csvUploaderList.set(
			server,
			new CSVUploader(
				this.serverList[server],
				this.apiKey,
				server,
				this.curServer
			)
		);
	}

	getCSVUploader(): Map<SERVER_TYPE, CSVUploader> {
		return this.csvUploaderList;
	}

	init(): boolean {
		try {
			Object.keys(this.serverList).forEach((key) => {
				if ((key as SERVER_TYPE) !== this.curServer) {
					this.addUploader(key as SERVER_TYPE);
				}
			});
		} catch (e) {
			throw new Error('CSVUploader Init Error');
		}
		return true;
	}
}
