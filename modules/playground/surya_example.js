const { spawn } = require("child_process");
const { once } = require("events");
const { pipeline, Transform } = require("stream");

let exifTool = spawn("exiftool", ["-m", "-n", "-", "-ImageSize"]);

class t extends Transform {
	constructor(options) {
		super(options);
		this.height = null;
	}

	writeToExif(chunk, callback) {
		const writeMore = exifTool.stdin.write(chunk);

		exifTool.stdout.on("data", (data) => {
			this.height = data.toString();
		});

		if (writeMore) callback(null, chunk);
		else {
			once(exifTool.stdin, "drain").then(() => {
				callback(null, chunk);
			});
		}
	}

	_transform(chunk, _, callback) {
		if (!!this.height) callback(null, chunk);
		else writeToExif(chunk, callback);
	}

	_destroy(error, callback) {}
}
