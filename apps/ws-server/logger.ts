export class Logger {
	static info(message: string, meta?: any) {
		console.log(
			`[INFO] ${new Date().toISOString()} - ${message}`,
			meta || ""
		);
	}

	static error(message: string, error?: any) {
		console.error(
			`[ERROR] ${new Date().toISOString()} - ${message}`,
			error || ""
		);
	}

	static warn(message: string, meta?: any) {
		console.warn(
			`[WARN] ${new Date().toISOString()} - ${message}`,
			meta || ""
		);
	}

	static debug(message: string, meta?: any) {
		if (process.env.NODE_ENV === "development") {
			console.debug(
				`[DEBUG] ${new Date().toISOString()} - ${message}`,
				meta || ""
			);
		}
	}

	static connection(message: string, userId?: string, meta?: any) {
		Logger.info(`[CONNECTION] ${message}`, { userId, ...meta });
	}

	static room(message: string, roomId?: string, userId?: string, meta?: any) {
		Logger.info(`[ROOM] ${message}`, { roomId, userId, ...meta });
	}

	static rate(message: string, userId?: string, meta?: any) {
		Logger.warn(`[RATE_LIMIT] ${message}`, { userId, ...meta });
	}
}
