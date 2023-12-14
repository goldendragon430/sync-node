/** @format */

import { subSeconds } from 'date-fns';
import { CSVHeaderType, CSVRecordsType, CSVWriter } from '../csv/csvWriter';
import CSVUploader from '../csvUploader/csvUploader';
import { IUploaderList } from '../csvUploader/CSVUploaderManager';
import UserRepository, { IUser } from '../repository/userRepository';
import { BaseJob } from './baseJob';
import CronJobSetting from './cronjobSetting';

export class FindUerRecentRecordJob extends BaseJob {
	protected userRep: UserRepository;
	protected uploaderList: IUploaderList;
	constructor(
		repo: UserRepository,
		setting: CronJobSetting,
		uploaderList: IUploaderList
	) {
		super(setting);
		this.uploaderList = uploaderList;
		this.userRep = repo;
	}
	override async task() {
		try {
			const end = new Date();
			const start = subSeconds(end, 30);
			const records = await this.userRep.findRecentRecord(start, end);

			if (!records.length) {
				return;
			}
			const csvFileName = new Date().getTime().toString() + '.csv';
			const writer = new CSVWriter(
				this.makeCSVHeader(),
				csvFileName,
				this.generateUserCSVData(records)
			);
			await writer.write();

			await this.handleUplode(writer.getCSVWriterPath(csvFileName));
			await writer.removeCSV(writer.getCSVWriterPath(csvFileName));
		} catch (e: any) {
			console.log('Find User Recent Record Job Error:', e?.message);
		}
	}

	/**
	 * make the csv header
	 * @returns
	 */
	makeCSVHeader(): CSVHeaderType {
		const header: CSVHeaderType = [
			{ id: 'no', title: 'No' },
			{ id: 'email', title: 'Email' },
			{ id: 'first_name', title: 'First Name' },
			{ id: 'last_name', title: 'Last Name' },
			{ id: 'user_name', title: 'User Name' },
		];
		return header;
	}
	/**
	 * make the csv records data;
	 * @param records
	 * @returns CSVRecordsType
	 */

	generateUserCSVData(records: IUser[]): CSVRecordsType {
		return records.map((user, index) => ({
			no: (index + 1).toString(),
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			user_name: user.first_name,
		}));
	}
	handleUplode(csvPath: string) {
		this.uploaderList.getCSVUploader().forEach((uploader: CSVUploader) => {
			uploader.upload(csvPath);
		});
	}
}
