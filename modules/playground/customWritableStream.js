import { PassThrough, Transform, Writable } from "stream";
import fs from "fs";
import { pipeline } from "stream";
import path from "path";
import { dataWriteFolder, mb1path } from "../constants.js";
import { cleanFolder, fileSize } from "../utils/files.js";
import { wait } from "../utils/common.js";

const fileName = `customWritableStream`;
const highWaterMarkDefault = 100 * 1024;
const readPath = mb1path;
const outputFolder = path.resolve(dataWriteFolder, fileName);

cleanFolder(outputFolder);

class CustomWriteStream extends Writable {
	constructor({ highWaterMark = highWaterMarkDefault, delayInMs = 1 * 1000 }) {
		super({ highWaterMark });
		this.count = 0;
		this.fd = null;
		this.delay = delayInMs;
		this.destFilename = `${delayInMs}ms-delay.txt`;
	}

	fileOperation(chunk, callback) {
		fs.write(this.fd, chunk, (err) => {
			this.count++;
			if (err) {
				return callback(err);
			}
			setTimeout(callback, this.delay);
		});
	}

	_write(chunk, encoding, callback) {
		console.log(
			`chunk recieved : ${this.destFilename}: chunk.length: ${chunk.length}`
		);
		if (this.fd === null) {
			const writePath = path.resolve(outputFolder, this.destFilename);
			fs.open(writePath, "w", (err, fd) => {
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
		const outptuFilePath = path.resolve(outputFolder, this.destFilename);
		const size = fileSize(outptuFilePath);
		const originalSize = fileSize(readPath);
		console.log(
			`${this.destFilename}-fileSize  size / originalSize: ${size} / ${originalSize}`
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
let transformId = 1;
class PassThroughCustom extends Transform {
	constructor(options) {
		super(options);
		this.id = transformId++;
	}
	_transform(chunk, encoding, callback) {
		console.log(`tranform ${this.id} called: chunk.length: ${chunk.length} `);
		callback(null, chunk);
	}
}

const writeStream1 = new CustomWriteStream({ delayInMs: 30 });
const writeStream2 = new CustomWriteStream({ delayInMs: 100 });
const writeStream3 = new CustomWriteStream({ delayInMs: 1000 });

const readStream = fs.createReadStream(readPath, {
	highWaterMark: highWaterMarkDefault,
});

function pipelineHnadler(err) {
	if (err) console.log(err);
}

// readStream.pipe(writeStream1);
// readStream.pipe(writeStream2);

// console.log("first pipeline");
// pipeline(readStream, writeStream1, (err) => {
// 	if (err) return console.log(err);
// });
// console.log("second pipeline");
// pipeline(readStream, writeStream2, (err) => {
// 	if (err) return console.log(err);
// });

//trial

async function trail2() {
	console.log(1);
	console.log(2);
	pipeline(readStream, writeStream3, pipelineHnadler);
	console.log(3);
	async function check(stream) {
		console.log(4);
		await wait(100);
		console.log(5);
		pipeline(stream, writeStream1, pipelineHnadler);
		console.log(6);
	}
	await check(readStream);
	console.log(7);
	pipeline(readStream, writeStream2, pipelineHnadler);
	console.log(8);
}
trail2();

function trial1() {
	console.log(1);
	const pass = new PassThroughCustom();
	const zippedReadStream = pipeline(readStream, pass, pipelineHnadler);
	console.log(2);
	check(zippedReadStream);
	console.log(3);
	function check(stream) {
		console.log(4);
		let index = 1;
		let total = 0;
		while (index++ < 1000000000) {
			total += 1;
		}
		console.log(5);
		pipeline(stream, writeStream2, console.error);
	}
}

//======================================================================================

/* 
console.log("first pipeline");
pipeline(readStream, new PassThrough(), writeStream1, (err) => {
	if (err) return console.log(err);
});
console.log("second pipeline");
pipeline(readStream, new PassThrough(), writeStream2, (err) => {
	if (err) return console.log(err);
});
 */

/* 
let index = 1;
let total = 0;
while (index++ < 10000000000) {
	total += 1;
}

console.log("second pipeline");
pipeline(readStream, writeStream2, (err) => {
	if (err) return console.log(err);
});
 */

/* 
setTimeout(() => {
  onsole.log("second pipeline");
	pipeline(readStream, writeStream2, (err) => {
		if (err) return console.log(err);
	});
}, 50); 
*/

/* 
Promise.resolve()
	.then(() => {
		return new Promise((res) => setTimeout(res, 50));
	})
	.then(() => {
    onsole.log("second pipeline");
		pipeline(readStream, writeStream2, (err) => {
			if (err) return console.log(err);
		});
	});
 */

/* 
process.nextTick(() => {
  onsole.log("second pipeline");
	pipeline(readStream, writeStream2, (err) => {
		if (err) return console.log(err);
	});
});
 */

// check if _write is called if highWtaerMark is not reached
