/** @format */
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { SERVER_TYPE } from '../config/environment';
export default class CSVUploader {
	protected url_to: string;
	protected apiKey: string;
	protected serverType: SERVER_TYPE;
	protected curServer: SERVER_TYPE;
	constructor(
		url_to: string,
		apiKey: string,
		serverType: SERVER_TYPE,
		curServer: SERVER_TYPE
	) {
		this.url_to = url_to;
		this.apiKey = apiKey; //jwt token
		this.serverType = serverType;
		this.curServer = curServer;
	}
	async upload(csvPath: string) {
		if (!(await this.checkPath(csvPath))) {
			throw new Error('There is no csv File!');
		}

		const fileBuffer = fs.readFileSync(csvPath);
		const form = new FormData();
		form.append('file', fileBuffer, {
			filename: csvPath.split('/').pop(),
		});
		form.append('curServer', this.curServer);
		try {
			console.log(this.generateCookie());
			const response = await axios.post(this.url_to, form, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Cookie: this.generateCookie(),
				},
			});
			console.log(response);
		} catch (e: any) {
			console.log('uploader error Response:', e?.message);
		}
	}
	async checkPath(csvPath: string): Promise<boolean> {
		try {
			await fs.promises.access(csvPath);
			return true;
		} catch (error) {
			return false;
		}
	}
	generateJWTToken(): string {
		const payload = {
			userId: 111111,
			username: 'john.doe',
		};
		return jwt.sign(payload, this.apiKey, {
			algorithm: 'HS256',
			expiresIn: '1h',
		});
	}
	genrateCookieKey(): string {
		return `backend-token`;
	}
	generateCookie(): string {
		return `${this.genrateCookieKey()}=${this.generateJWTToken()}`;
	}
}
