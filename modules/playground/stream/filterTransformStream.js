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
