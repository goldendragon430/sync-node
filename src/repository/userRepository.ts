/** @format */

import { OkPacket, RowDataPacket } from 'mysql2';
import { IDBConnection } from '../database/dbConnection';
import BaseRepository from './baseRepository';

export interface IUser extends RowDataPacket {
	id?: number;
	email: string;
	first_name: string;
	last_name: string;
	image: string;
}

export default class UserRepository extends BaseRepository {
	protected table = 'cg_users';
	constructor(db: IDBConnection) {
		super(db);
	}
	readAll(): Promise<IUser[]> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<IUser[]>(`SELECT * FROM ${this.table}`, (error, res) => {
					if (error) reject(error);
					else resolve(res);
				});
		});
	}
	readByEmail(email: string): Promise<IUser | undefined> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<IUser[]>(
					`SELECT * FROM ${this.table} WHERE email = ?`,
					[email],
					(err, res) => {
						if (err) reject(err);
						else resolve(res?.[0]);
					}
				);
		});
	}
	create(user: IUser): Promise<IUser> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<OkPacket>(
					`INSERT INTO ${this.table} (email,first_name,last_name) VALUES(?,?,?)`,
					[user.email, user.first_name, user.last_name],
					(err, res) => {
						if (err) reject(err);
						else
							this.readByEmail(user.email)
								.then((user) => resolve(user!))
								.catch(reject);
					}
				);
		});
	}
	update(user: IUser): Promise<IUser | undefined> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<OkPacket>(
					`UPDATE ${this.table} SET email = ?, first_name = ?, last_name = ? WHERE id = ? `,
					[user.email, user.first_name, user.last_name, user.id],
					(err, res) => {
						if (err) reject(err);
						else this.readByEmail(user.email).then(resolve).catch(reject);
					}
				);
		});
	}
	remove(user_id: number): Promise<number> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<OkPacket>(
					`DELETE FROM ${this.table} WHERE id = ?`,
					[user_id],
					(err, res) => {
						if (err) reject(err);
						else resolve(res.affectedRows);
					}
				);
		});
	}
	findRecentRecord(start: Date, end: Date): Promise<IUser[]> {
		return new Promise((resolve, reject) => {
			this.dbConnection
				.getDB()
				.query<IUser[]>(
					`SELECT * FROM ${this.table} WHERE (created_at >= ? AND created_at < ?) OR (updated_at >= ? AND updated_at <?)`,
					[start, end, start, end],
					(error, res) => {
						if (error) reject(error);
						else resolve(res);
					}
				);
		});
	}
}
