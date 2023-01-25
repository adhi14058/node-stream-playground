import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dataFolder = path.resolve(__dirname, "data");
export const dataReadFolder = path.resolve(__dirname, "data", "read");
export const dataWriteFolder = path.resolve(__dirname, "data", "write");

export const mb1path = path.resolve(__dirname, "data", "read", "1mb.txt");
export const mb120path = path.resolve(__dirname, "data", "read", "120mb.txt");
export const mb800path = path.resolve(__dirname, "data", "read", "800mb.txt");
export const mb3000path = path.resolve(__dirname, "data", "read", "3000mb.txt");
