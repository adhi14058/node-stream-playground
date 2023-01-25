import { Writable } from "stream";
import fs from "fs";
import { pipeline } from "stream";

import {
	dataWriteFolder,
	dataReadFolder,
	mb1path,
	mb120path,
	mb800path,
	mb3000path,
} from "../constants.js";

class CustomWriteStream extends Writable {
	constructor({ highWaterMark = 64 * 1024 }) {
		super({ highWaterMark });
		this.count = 0;
	}

	_write(chunk, encoding, callback) {
		console.log("=====================");
		console.log(chunk.toString("utf-8"));
		console.log("=====================");
		this.count++;
		setTimeout(callback, 100);
	}

	_final(callback) {
		console.log("final method", this.count);
		callback();
	}

	_destroy(error, callback) {
		console.log("destrop method");
		callback(error);
	}
}

const writeStream = new CustomWriteStream({});
const readStream = fs.createReadStream(mb1path);

pipeline(readStream, writeStream, (err) => {
	if (err) return console.log(err);
	console.log("completed");
});
