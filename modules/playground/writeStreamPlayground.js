import { pipeline, Readable, Transform, Writable } from "stream";
import fs from "fs";
import path from "path";
import { dataWriteFolder } from "../constants.js";
import { cleanFolder } from "../utils/files.js";
const outputFolder = path.resolve(dataWriteFolder, "check");
cleanFolder(outputFolder);

function trial1() {
	const evenNumStream = new Transform({
		transform(chunk, _, callback) {
			if (isNaN(chunk.toString())) {
				return callback();
			}
			if (+chunk.toString() % 2 !== 0) {
				return callback();
			}

			//return only even numbers
			callback(null, chunk);
		},
	});

	function* gen() {
		const number = 50000000;
		let i = number;
		while (i-- > number - 50000000) {
			yield i + "\n";
		}
	}
	w.on("drain", () => console.log("drained"));
	Readable.from(gen()).pipe(evenNumStream).pipe(w);
}

function trial2() {
	const logTime = async (fn) => {
		try {
			console.time("timeTaken");
			await fn();
			console.timeEnd("timeTaken");
		} catch (error) {
			console.timeEnd("timeTaken");
			throw error;
		}
	};

	const mark = 20480;
	function main() {
		const rs = fs.createReadStream("data/read/800mb.txt", {
			highWaterMark: mark,
		});
		const ws = fs.createWriteStream("data/write/800mb.txt", {
			highWaterMark: mark,
		});

		return new Promise((res) => {
			pipeline(rs, ws, res);
		});
	}

	logTime(() => main());
}

function trial3() {
	const w1 = new Writable({
		highWaterMark: 10,
		write(chunk, _, callback) {
			console.log(chunk.toString(), chunk.length);
			setTimeout(callback, 0);
		},
	});

	w1.on("drain", () => {
		console.log("drained");
	});
	console.log(w1.write("first line"));
	console.log(w1.write("se"));
	console.log(w1.write("con"));
}

trial3();
