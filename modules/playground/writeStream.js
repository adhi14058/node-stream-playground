import fs from "fs";
import path from "path";
import { logTime } from "../utils/wrappers/timer.js";
import { memoryWrapper } from "../utils/wrappers/memory.js";
import { dataWriteFolder } from "../constants.js";

export function dumpData(filename = "test.txt", max = 200 * 1024) {
	//15 * 1000 * 1000
	return new Promise((resolve, reject) => {
		const destinationPath = path.resolve(dataWriteFolder, filename);
		const writeStream = fs.createWriteStream(destinationPath);
		let index = 0;
		function writeData() {
			while (index++ < max) {
				const buffer = Buffer.from(`${index} `, "utf-8");
				if (index === max - 1) {
					//should be called to make sure finish event is called and stream closes
					return writeStream.end(buffer);
				}
				const allowMore = writeStream.write(buffer);
				if (!allowMore) break;
			}
		}
		writeStream.on("drain", writeData);
		writeStream.on("error", reject);
		writeStream.on("finish", resolve);
		writeData();
	});
}

function main() {
	logTime(() => memoryWrapper(dumpData));
}

// main();
