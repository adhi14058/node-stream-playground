import { Readable, Writable } from "stream";

function trial1() {
	const writeStream = new Writable({
		highWaterMark: 10,
		write(chunk, _, callback) {
			console.log(chunk.toString(), chunk.length);
			setTimeout(callback, 0);
		},
	});
	function* gen() {
		const number = 50000000;
		let i = number;
		while (i-- > number - 50000000) {
			yield i + "\n";
		}
	}
	writeStream.on("drain", () => console.log("drained"));
	Readable.from(gen()).pipe(writeStream);
}
