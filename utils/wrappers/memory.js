import printMemoryUsage from "../memoryUsage.js";

export const memoryWrapper = async (fn) => {
	try {
		const stats = printMemoryUsage({ maxTimeToRun: 60 * 1000 });
		stats.startStats();
		await fn();
		stats.endStats();
	} catch (error) {
		stats.endStats();
		throw error;
	}
};
