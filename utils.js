const fs = require("fs");
const path = require("path");
let publicFolderPath = path.resolve(__dirname, "public");

function doSomethingWithStream(stream) {
	return new Promise((res, rej) => {
		let writeStream1a = fs.createWriteStream(getPath("doSomethingWithStream"));
		stream.pipe(writeStream1a);
		writeStream1a.on("close", () => {
			res();
		});
	});
}
function getPath(middlewareNumber) {
	return path.resolve(
		__dirname,
		"public",
		`middleware-${middlewareNumber}.txt`
	);
}

function wait(ms) {
	return new Promise((res) => setTimeout(res, ms));
}

function getStats() {
	let publicFolder = fs.readdirSync(publicFolderPath);
	let result = {};
	for (let fileName of publicFolder) {
		let filePath = path.resolve(publicFolderPath, fileName);
		result[fileName] = fs.statSync(filePath).size;
		if (fileName !== "fileTobeUploaded.txt") fs.unlink(filePath, () => {});
	}
	return result;
}

function print(middlewareNumber, data) {
	console.log(`\nmiddleware-${middlewareNumber}`, data ? data : "");
}
module.exports = {
	doSomethingWithStream,
	getPath,
	wait,
	getStats,
	print,
};
