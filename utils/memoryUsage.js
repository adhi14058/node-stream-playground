const getProcessMemory = () =>
	Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;

const printMemoryUsage = function ({
	printInterval = 2 * 1000,
	maxTimeToRun = 60 * 1000,
	logger = console,
}) {
	let timeout = null;
	let interval = null;
	return {
		startStats: function () {
			if (interval) return;
			interval = setInterval(() => {
				if (!timeout) {
					timeout = setTimeout(() => {
						logger.log(`${getProcessMemory()} MB Used - Max Time Reached`);
						this.endStats();
					}, maxTimeToRun);
				}
				logger.log(`${getProcessMemory()} MB Used`);
			}, printInterval);
		},
		endStats: function () {
			interval && clearInterval(interval);
			timeout && clearTimeout(timeout);
		},
	};
};

export default printMemoryUsage;
