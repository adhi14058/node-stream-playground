import { Writable } from "stream";
import fs from "fs";
import path from "path";
import { fileSize } from "../../../utils/files.js";
import { randomUUID } from "crypto";

const defaultHighWaterMark = 16 * 1024;
const defaultDelay = 1 * 1000;

export class CustomWriteStreamWithDelay extends Writable {
	constructor({
		highWaterMark = defaultHighWaterMark,
		delayInMs = defaultDelay,
		context = {}, // {outputFolder, originalSizeRead, print : func}
	}) {
		super({ highWaterMark });
		this.fd = null;
		this.delay = delayInMs;
		this.destFilename = `${delayInMs}ms-delay.txt`;

		this.context = context;
		this.writeFilePath = path.resolve(context.outputFolder, this.destFilename);
		this.originalSizeRead = context.originalSizeRead;
	}

	print(from, chunk) {
		console.group(`${this.delay}ms ${from}:`);
		this.context.print?.();
		console.log(
			`write: ${this.writableLength} / ${this.writableHighWaterMark}`
		);
		console.log(chunk.slice(0, 10));
		console.groupEnd(`${this.delay}ms ${from}:`);
	}

	fileOperation(chunk, callback) {
		fs.write(this.fd, chunk, (err) => {
			if (err) {
				return callback(err);
			}
			setTimeout(() => {
				this.print("callback()", chunk);
				callback();
			}, this.delay);
		});
	}

	_write(chunk, _, callback) {
		this.print("_write", chunk);
		if (this.fd === null) {
			fs.open(this.writeFilePath, "w", (err, fd) => {
				if (err) return callback(err);
				this.fd = fd;
				this.fileOperation(chunk, callback);
			});
		} else {
			this.fileOperation(chunk, callback);
		}
	}

	_final(callback) {
		callback();
	}

	_destroy(error, callback) {
		const size = fileSize(this.writeFilePath);
		console.log(
			`${this.destFilename}-fileSize ${size} / ${this.originalSizeRead}`
		);
		if (this.fd) {
			fs.close(this.fd, (err) => {
				callback(err || error);
			});
		} else {
			callback(error);
		}
	}
}

export class CustomWriteStream extends Writable {
	constructor({
		highWaterMark = defaultHighWaterMark,
		id = randomUUID(),
		context = {},
	}) {
		super({ highWaterMark });
		this.fd = null;
		this.id = id;
		this.destFilename = `${id}.txt`;

		this.context = context;
		this.writeFilePath = path.resolve(context.outputFolder, this.destFilename);
		this.originalSizeRead = context.originalSizeRead;
	}

	print(from, chunk) {
		console.group(`${this.id}: ${from}:`);
		console.log(
			`write: ${this.writableLength} / ${this.writableHighWaterMark}`
		);
		console.log(chunk.slice(0, 10));
		console.groupEnd(`${this.id}: ${from}:`);
	}

	fileOperation(chunk, callback) {
		fs.write(this.fd, chunk, (err) => {
			if (err) {
				return callback(err);
			}
			this.print("callback()", chunk);
			callback();
		});
	}

	_write(chunk, _, callback) {
		this.print("_write", chunk);
		if (this.fd === null) {
			fs.open(this.writeFilePath, "w", (err, fd) => {
				if (err) return callback(err);
				this.fd = fd;
				this.fileOperation(chunk, callback);
			});
		} else {
			this.fileOperation(chunk, callback);
		}
	}

	_final(callback) {
		callback();
	}

	_destroy(error, callback) {
		const size = fileSize(this.writeFilePath);
		console.log(
			`${this.destFilename}-fileSize ${size} / ${this.originalSizeRead}`
		);
		if (this.fd) {
			fs.close(this.fd, (err) => {
				callback(err || error);
			});
		} else {
			callback(error);
		}
	}
}
