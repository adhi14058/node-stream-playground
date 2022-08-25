const express = require("express");
const fs = require("fs");
const path = require("path");
let publicFolderPath = path.resolve(__dirname, "public");
let { doSomethingWithStream, getPath, wait } = require("./utils");
const app = express();

app.use(async (req, res, next) => {
	console.log("first middleware");
	let stream = req.stream || req;
	stream.on("data", (data) => {
		console.log("\n\nfirst middleware", data);
	});

	stream.pause();
	await doSomethingWithStream(stream);
	stream.resume();
	next();
	let writeStream1 = fs.createWriteStream(getPath("1"));
	stream.pipe(writeStream1);
});

app.use((req, res, next) => {
	console.log("second middleware");
	let stream = req.stream || req;
	stream.on("data", (data) => {
		console.log("\n\nsecond middleware", data);
	});
	let writeStream2 = fs.createWriteStream(getPath("2"));
	stream.pipe(writeStream2);
	next();
});

app.use((req, res, next) => {
	console.log("third middleware");
	let stream = req.stream || req;
	stream.on("data", (data) => {
		console.log("\n\nthird middleware", data);
	});
	let writeStream3 = fs.createWriteStream(getPath("3"));
	stream.pipe(writeStream3);
	next();
});

app.use(async (req, res, next) => {
	await wait(3000);
	let publicFolder = fs.readdirSync(publicFolderPath);
	let result = {};
	for (let fileName of publicFolder) {
		let filePath = path.resolve(publicFolderPath, fileName);
		result[fileName] = fs.statSync(filePath).size;
		if (fileName !== "fileTobeUploaded.txt") fs.unlink(filePath, () => {});
	}
	res.send({ result });
});

app.listen(3001, () => {
	console.log("server listening on 3001");
});
