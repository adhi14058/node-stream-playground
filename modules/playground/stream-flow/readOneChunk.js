import fs from "fs";
import { mb1path } from "../../../constants.js";

function getStream(rs) {
	return new Promise((resolve) => {
		rs.on("readable", function () {
			return resolve(rs);
		});
	});
}

async function main() {
	const rs = fs.createReadStream(mb1path);
	const stream = await getStream(rs);
	console.log(stream.read());
	console.log(stream.read());
	console.log(stream.read());
}
