import { PassThrough } from "stream";
import fs from "fs";
import { pipeline } from "stream";
import path from "path";
import { dataWriteFolder, mb1path } from "../../../constants.js";
import { cleanFolder, fileSize } from "../../../utils/files.js";
import { CustomWriteStreamWithDelay } from "../stream/customWriteStream.js";
import { wait } from "../../../utils/common.js";

const highWaterMarkDefault = 128 * 1024;

const outputFolder = path.resolve(dataWriteFolder, `pipeInputAtDifferentTimes`);
cleanFolder(outputFolder);

const originalSizeRead = fileSize(mb1path);
const readStream = fs.createReadStream(mb1path, {
	highWaterMark: highWaterMarkDefault,
});

const context = { outputFolder, originalSizeRead };
const writeStream1 = new CustomWriteStreamWithDelay({
	delayInMs: 1000,
	context,
});
const writeStream2 = new CustomWriteStreamWithDelay({
	delayInMs: 2000,
	context,
});
const writeStream3 = new CustomWriteStreamWithDelay({
	delayInMs: 3000,
	context,
});
function a() {
	pipeline(readStream, writeStream1, pipelineHnadler); //first pipeline
	pipeline(readStream, writeStream2, pipelineHnadler); //second pipeline
}

function b() {
	pipeline(readStream, writeStream1, pipelineHnadler); //first pipeline
	let index = 1;
	let total = 0;
	while (index++ < 10000000000) {
		if (index === 500000) {
			pipeline(readStream, writeStream2, pipelineHnadler); //second pipeline
		}
		total += 1;
	}
	pipeline(readStream, writeStream3, pipelineHnadler); //third pipeline
}

function c() {
	pipeline(readStream, writeStream1, pipelineHnadler); //first pipeline
	setTimeout(() => {
		pipeline(readStream, writeStream2, pipelineHnadler); //second pipeline
	}, 10);
	setTimeout(() => {
		pipeline(readStream, writeStream3, pipelineHnadler); //third pipeline
	}, 350);
}

function d() {
	pipeline(readStream, writeStream1, pipelineHnadler); //first pipeline
	Promise.resolve()
		.then(() => wait(50))
		.then(() => {
			pipeline(readStream, writeStream2, pipelineHnadler); //second pipeline
		});
}

function e() {
	pipeline(readStream, writeStream1, pipelineHnadler); //first pipeline
	process.nextTick(() => {
		pipeline(readStream, writeStream2, pipelineHnadler); //second pipeline
		process.nextTick(() => {
			pipeline(readStream, writeStream3, pipelineHnadler); //third pipeline
		});
	});
}

function pipelineHnadler(err) {
	if (err) console.log(err);
}

// check if _write is called if highWtaerMark is not reached
