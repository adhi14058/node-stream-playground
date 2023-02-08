import { createReadStream, createWriteStream } from "fs";
import util from "util";
const pipeline = util.promisify(stream.pipeline);

async function run() {
	await pipeline(
		createReadStream("lowercase.txt"),
		async function* (source) {
			source.setEncoding("utf8"); // Work with strings rather than `Buffer`s.
			for await (const chunk of source) {
				yield chunk.toUpperCase();
			}
		},
		createWriteStream("uppercase.txt")
	);
	console.log("Pipeline succeeded.");
}

run().catch(console.error);
