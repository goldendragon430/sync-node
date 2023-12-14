/** @format */

import { IUploaderList } from '../csvUploader/CSVUploaderManager';
import DBManager from '../database/dbManager';
import { BaseJob } from './baseJob';
import CronJobSetting from './cronjobSetting';
import { FindUerRecentRecordJob } from './findUserRecentRecordJob';
import { FindFullUserJob } from './fullUserJob';
export enum JobType {
	FULL_USER_RECORD,
	RECENT_USER_RECORD,
}
export default class CronJobManager {
	protected jobList: Map<JobType, BaseJob>;
	protected dbManager: DBManager;
	protected uploaderList: IUploaderList;
	constructor(dbManager: DBManager, uploaderList: IUploaderList) {
		this.dbManager = dbManager;
		this.jobList = new Map<JobType, BaseJob>();
		this.uploaderList = uploaderList;
		this.add(JobType.FULL_USER_RECORD, '*/10 * * * * *');
		this.add(JobType.RECENT_USER_RECORD, '*/10 * * * * *');
		this.startCronJob(JobType.RECENT_USER_RECORD);
		this.startCronJob(JobType.FULL_USER_RECORD);
	}
	add(name: JobType, setting: string): BaseJob {
		//factory pattern
		const _setting = new CronJobSetting(setting);
		let job: BaseJob | null = null;
		if (name === JobType.FULL_USER_RECORD) {
			job = new FindFullUserJob(
				this.dbManager.getRepositoryManager().userRepository,
				_setting,
				this.uploaderList
			);
		} else if (name === JobType.RECENT_USER_RECORD) {
			job = new FindUerRecentRecordJob(
				this.dbManager.getRepositoryManager().userRepository,
				_setting,
				this.uploaderList
			);
		}

		this.jobList.set(name, job!);
		return job!;
	}
	startCronJob(name: JobType) {
		this.jobList.get(name)?.start();
	}
	removeCronJob(name: JobType): boolean {
		return this.jobList.delete(name);
	}
	clear(): void {
		this.jobList.clear();
	}
	getAt(name: JobType): BaseJob | undefined {
		return this.jobList.get(name);
	}
}
