/** @format */

import { IDBConnection } from '../database/dbConnection';
import UserRepository from './userRepository';

export default class RepositoryManager {
	public userRepository: UserRepository;
	constructor(db: IDBConnection) {
		this.userRepository = new UserRepository(db);
	}
}
