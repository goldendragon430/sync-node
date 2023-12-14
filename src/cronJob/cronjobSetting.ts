/** @format */

export interface ICronJobSetting {
	checkSetting(setting: string): boolean;
	setSetting(setting: string): boolean;
	getSetting(): string;
}

export default class CronJobSetting implements ICronJobSetting {
	protected setting: string;
	constructor(setting: string) {
		if (this.checkSetting(setting)) this.setting = setting;
		else throw new Error('CronJob Setting is Invalid');
	}
	checkSetting(setting: string): boolean {
		return true;
	}
	setSetting(setting: string): boolean {
		if (this.checkSetting(setting)) {
			this.setting = setting;
			return true;
		} else {
			return false;
		}
	}
	getSetting(): string {
		return this.setting;
	}
}
