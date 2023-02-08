const defaultHighWaterMark = 16 * 1024;

export class CustomPassThrough extends Transform {
	constructor({
		readableHighWaterMark = defaultHighWaterMark,
		writableHighWaterMark = defaultHighWaterMark,
		id = randomUUID(),
	}) {
		super({
			readableHighWaterMark,
			writableHighWaterMark,
		});
		this.id = id;
	}

	print() {
		console.group(`${this.id} transform():`);
		console.log(`r: ${this.readableLength} / ${this.readableHighWaterMark}`);
		console.log(`w: ${this.writableLength} / ${this.writableHighWaterMark}`);
		console.log(chunk.slice(0, 10));
		console.groupEnd(`${this.id} transform():`);
	}

	_transform(chunk, encoding, callback) {
		this.print();
		callback(null, chunk);
	}
}
