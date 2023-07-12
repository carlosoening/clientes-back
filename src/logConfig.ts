import { log } from './deps.ts';
import { formatDateToTimestamp } from './utils/date.ts';

export const fileHandler = new log.handlers.FileHandler("INFO", { 
  filename: './log.txt',
  formatter: rec => `${formatDateToTimestamp(rec.datetime)} ${rec.levelName} ${rec.msg}`
});

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("INFO", {
          formatter: rec => `${formatDateToTimestamp(rec.datetime)} ${rec.levelName} ${rec.msg}`
        }),
        file: fileHandler,
    },
    loggers: {
        default: {
            level: "INFO",
            handlers: ["console", "file"],
        },
    },
});

export const logger = log.getLogger();