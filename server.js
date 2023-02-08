import express from "express";
import tickId from "tick-id";
import { wait } from "./utils/common.js";

const app = express();

app.use(async (req, res, next) => {
	console.log("middleare1 pre: ", tickId());
	// await wait(1000);
	console.log("middleare1: ", tickId());
	next();
});

app.use(async (req, res, next) => {
	res.once("finish", async () => {
		await wait(2000);
		console.log("hihi");
	});
	next();
});

app.use(async (req, res, next) => {
	console.log("middleare2: ", tickId());
	res.status(200).end("end");
});

app.listen(6001, () => {
	console.log("server listening on 6001");
});

export default app;
