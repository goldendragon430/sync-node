/** @format */

import { DBOPTION_TYPE } from '../types/config';
import dotenv from 'dotenv';
dotenv.config();
export interface IDBEnvManager {
	setDBOptions(
		db_host: string,
		db_port: number,
		db_user: string,
		db_password: string,
		db_database: string
	): void;
	getDBOptions(): DBOPTION_TYPE;
}

export enum SERVER_TYPE {
	SMS = 'sms',
	// EMAIL = 'email',
	DASHBOARD = 'dashboard',
}

export interface ICurServerType {
	getServerType(type: string): SERVER_TYPE;
	setSerVerType(type: SERVER_TYPE): void;
}

export interface IAPIKeyManager {
	getApiKey(): string;
	setAPiKey(key: string): void;
}

export interface IServerUploaderManager {
	getServerUploaderUrl(): ServerUploderURLType;
	setServerUploaderUrl(urltype: ServerUploderURLType): void;
}

export type ServerUploderURLType = {
	[key in SERVER_TYPE]: string;
};

export default class Environment
	implements
		IDBEnvManager,
		ICurServerType,
		IAPIKeyManager,
		IServerUploaderManager
{
	protected db_host: string;
	protected db_port: number;
	protected db_user: string;
	protected db_password: string;
	protected project_port: number;
	protected api_key: string;

	protected db_database: string;
	protected curServer: SERVER_TYPE;
	protected serverUploderUrls: ServerUploderURLType;
	constructor() {
		this.api_key = process.env.API_KEY || '';
		this.db_host = process.env.DB_HOST || '';
		this.db_port = parseInt(process.env.DB_PORT || '3306');
		this.db_password = process.env.DB_PASSWORD || '';
		this.db_user = process.env.DB_USER || '';
		this.db_database = process.env.DB_DATABASE || '';
		this.project_port = parseInt(process.env.PORT || '4000');

		this.curServer = this.getServerType(process.env.CURRENT_SERVER || '');
		this.serverUploderUrls = {
			sms: process.env.SMS_UPLOAD_URL || '',
			// email: process.env.EMAIL_UPLOAD_URL || '',
			dashboard: process.env.DASHBOARD_UPLOAD_URL || '',
		};
	}
	/**
	 * get database options
	 * @returns DBOPTION_Type
	 */

	getDBOptions(): DBOPTION_TYPE {
		return {
			db_host: this.db_host,
			db_password: this.db_password,
			db_port: this.db_port,
			db_user: this.db_user,
			db_database: this.db_database,
		};
	}

	/**
	 * get project security common token key
	 * @returns string
	 */
	getApiKey(): string {
		return this.api_key;
	}

	/**
	 * get project port
	 * @returns number
	 */
	getProjectPort(): number {
		return this.project_port;
	}

	/**
	 * get current server if sms or dashboard or email
	 * @param type string
	 * @returns  SERVER_TYPE
	 */
	getServerType(type: string): SERVER_TYPE {
		switch (type) {
			case 'sms':
				return SERVER_TYPE.SMS;
			// case 'email':
			// 	return SERVER_TYPE.EMAIL;
			case 'dashboard':
				return SERVER_TYPE.DASHBOARD;
			default:
				throw new Error(`Invalid server type: ${type}`);
		}
	}
	getCurServerType(): SERVER_TYPE {
		return this.curServer;
	}
	/**
	 * set current server if sms or dashbord or email
	 * @param type  SERVER_TYPE
	 */
	setSerVerType(type: SERVER_TYPE): void {
		this.curServer = type;
	}

	/**
	 *
	 * @param db_host string database host
	 * @param db_port number database port
	 * @param db_user string database user
	 * @param db_password string database password
	 * @param db_database string database name
	 */
	setDBOptions(
		db_host: string,
		db_port: number,
		db_user: string,
		db_password: string,
		db_database: string
	): void {
		this.db_host = db_host;
		this.db_port = db_port;
		this.db_user = db_user;
		this.db_password = db_password;
		this.db_database = db_database;
	}
	/**
	 * set tokenKey
	 * @param key string
	 */
	setAPiKey(key: string): void {
		this.api_key = key;
	}

	/**
	 * set project port
	 * @param port number
	 */
	setProjectPort(port: number) {
		this.project_port = port;
	}

	/**
	 * get csv uploader api urls
	 * @returns ServerUploaderUrlType
	 */
	getServerUploaderUrl(): ServerUploderURLType {
		return this.serverUploderUrls;
	}
	/**
	 * set csv uploader api urls
	 * @param urls
	 */
	setServerUploaderUrl(urls: ServerUploderURLType): void {
		this.serverUploderUrls = urls;
	}
}
