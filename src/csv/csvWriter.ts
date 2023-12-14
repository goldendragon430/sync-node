/** @format */

import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
export type CSVWriterType = ReturnType<typeof createObjectCsvWriter>;
export type CSVHeaderItemType = {
	id: string;
	title: string;
};
export type CSVHeaderType = Array<CSVHeaderItemType>;
export type CSVRecordItemType = {
	[key in CSVHeaderItemType['id']]: string;
};
export type CSVRecordsType = Array<CSVRecordItemType>;

export class CSVWriter {
	private csvWriter: CSVWriterType;
	private records: CSVRecordsType;
	private header: CSVHeaderType;
	constructor(header: CSVHeaderType, path: string, records: CSVRecordsType) {
		const fullPath = this.getCSVWriterPath(path);
		this.csvWriter = createObjectCsvWriter({
			path: fullPath,
			header,
		});

		this.header = header;

		this.records = records;
	}
	getCSVWriter(): CSVWriterType {
		return this.csvWriter;
	}

	setRecords(records: CSVRecordsType) {
		this.records = records;
	}
	getRecords(): CSVRecordsType | undefined {
		return this.records;
	}
	getHeader(): CSVHeaderType {
		return this.header;
	}
	write() {
		return this.csvWriter.writeRecords(this.records);
	}
	getCSVWriterPath(file: string): string {
		if (!this.checkFileExtension(file))
			throw new Error('CSV File Extension Exception');

		const rootDir = path.resolve('./src');
		const filepath = path.join(rootDir, 'tmp', file);

		return filepath;
	}
	checkFileExtension(file: string): boolean {
		const extension = path.extname(file);
		return extension === '.csv';
	}
	removeCSV(file: string) {
		fs.unlink(file, (err) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(`${file} was deleted`);
		});
	}
}
