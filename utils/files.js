import fs from "fs";

export function cleanFolder(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
	fs.readdirSync(path).forEach((f) => fs.rmSync(`${path}/${f}`));
}

export function fileSize(path) {
	const { size } = (fs.existsSync(path) && fs.statSync(path)) || { size: -1 };
	return size;
}
