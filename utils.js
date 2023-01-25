import { createWriteStream, readdirSync, statSync, unlink } from "fs";
import { resolve } from "path";

let publicFolderPath = resolve(__dirname, "public");

function doSomethingWithStream(stream) {
	return new Promise((res, rej) => {
		let writeStream1a = createWriteStream(getPath("doSomethingWithStream"));
		stream.pipe(writeStream1a);
		writeStream1a.on("close", () => {
			res();
		});
	});
}
function getPath(middlewareNumber) {
	return resolve(__dirname, "public", `middleware-${middlewareNumber}.txt`);
}

function wait(ms) {
	return new Promise((res) => setTimeout(res, ms));
}

function getStats() {
	let publicFolder = readdirSync(publicFolderPath);
	let result = {};
	for (let fileName of publicFolder) {
		let filePath = resolve(publicFolderPath, fileName);
		result[fileName] = statSync(filePath).size;
		if (fileName !== "fileTobeUploaded.txt") unlink(filePath, () => {});
	}
	return result;
}

function print(middlewareNumber, data) {
	console.log(`\nmiddleware-${middlewareNumber}`, data ? data : "");
}
export default {
	doSomethingWithStream,
	getPath,
	wait,
	getStats,
	print,
};
