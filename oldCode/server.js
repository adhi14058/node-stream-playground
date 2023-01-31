import express from "express";
import { createWriteStream } from "fs";
import path from "path";
import { doSomethingWithStream, getPath, wait, getStats, print } from "./utils";

const app = express();
let middlewareNumber = 0;

app.use(async (req, res, next) => {
	let mNum = ++middlewareNumber;
	print(mNum);
	await wait(2000);
	next();
});

app.use(async (req, res, next) => {
	let mNum = ++middlewareNumber;
	print(mNum);
	let stream = req.stream || req;
	stream.on("data", (data) => print(mNum, data));
	// stream.pause();
	// await doSomethingWithStream(stream);
	// stream.resume();

	let writeStream = createWriteStream(getPath(`${mNum}`));
	stream.pipe(writeStream);
	next();
});

app.use((req, res, next) => {
	let mNum = ++middlewareNumber;
	print(mNum);

	let stream = req.stream || req;
	stream.on("data", (data) => print(mNum, data));

	let writeStream = createWriteStream(getPath(`${mNum}`));
	stream.pipe(writeStream);
	next();
});

app.use((req, res, next) => {
	let mNum = ++middlewareNumber;
	print(mNum);

	let stream = req.stream || req;
	stream.on("data", (data) => print(mNum, data));

	let writeStream3 = createWriteStream(getPath(`${mNum}`));
	stream.pipe(writeStream3);
	next();
});

app.use(async (req, res, next) => {
	let mNum = ++middlewareNumber;
	print(mNum);

	await wait(3000);

	let result = getStats();
	middlewareNumber = 0;
	res.send({ result });
});

app.listen(3001, () => {
	console.log("server listening on 3001");
});
