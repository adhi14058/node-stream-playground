const fs = require("fs");
const path = require("path");
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

module.exports = {
	doSomethingWithStream,
	getPath,
	wait,
};
