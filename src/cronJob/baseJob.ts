/** @format */

import { CronJob } from 'cron';
import { ICronJobSetting } from './cronjobSetting';
export interface IBaseJob {
	task(): void;
	start(): void;
	stop(): void;
	checkIsRun(): boolean | undefined;
}
export type TaskCallbackType = () => void;
export class BaseJob implements IBaseJob {
	protected cronJob: CronJob;
	constructor(setting: ICronJobSetting) {
		this.task = this.task.bind(this);
		this.cronJob = new CronJob(setting.getSetting(), this.task);
	}
	task() {}
	stop(): void {
		this.cronJob.stop();
	}
	start(): void {
		this.cronJob.start();
	}
	checkIsRun(): boolean | undefined {
		return this.cronJob.running;
	}

	getCurrntJob(): CronJob {
		return this.cronJob;
	}
}
