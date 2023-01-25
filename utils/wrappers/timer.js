export const logTime = async (fn) => {
	try {
		console.time("timeTaken");
		await fn();
		console.timeEnd("timeTaken");
	} catch (error) {
		console.timeEnd("timeTaken");
		throw error;
	}
};
