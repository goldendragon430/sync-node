/** @format */
import fs, { createReadStream, ReadStream } from 'fs';
import csvReaderStream, { Line } from 'csv-reader';
export type CSVReadableStreamType = typeof csvReaderStream;
type DataHandler = (row: Line) => void;
type Errorhandler = (error: Error) => void;
type EndHandler = () => void;
type ConnectHandler = {
	data: DataHandler;
	error: Errorhandler;
	end: EndHandler;
};
export class CSVReader {
	fileInputStream: ReadStream;
	csvReadableStream: CSVReadableStreamType;

	constructor(path: string) {
		this.fileInputStream = createReadStream(path, 'utf8');
		this.csvReadableStream = new csvReaderStream({
			parseNumbers: true,
			parseBooleans: true,
			trim: true,
		});
	}
	connect(handler: ConnectHandler) {
		this.fileInputStream
			.pipe(this.csvReadableStream)
			.on('data', handler.data)
			.on('end', handler.end)
			.on('error', handler.error);
	}
}
