import { PassThrough, Transform, Writable } from "stream";
import fs from "fs";
import { pipeline } from "stream";
import path from "path";
import {
	dataWriteFolder,
	kb100path,
	mb1path,
	dataReadFolder,
} from "../constants.js";
import { cleanFolder, fileSize } from "../utils/files.js";
import { wait } from "../utils/common.js";

function getStream(rs) {
	return new Promise((resolve) => {
		rs.on("readable", function () {
			return resolve(rs);
		});
	});
}

async function main() {
	const rs = fs.createReadStream(mb1path);
	const stream = await getStream(rs);
	console.log(stream.read());
	console.log(stream.read());
	console.log(stream.read());
}

main();
