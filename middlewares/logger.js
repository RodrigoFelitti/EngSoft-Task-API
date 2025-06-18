import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

//criar a pasta de logs
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

//decide se é para testes ou prod
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.argv.includes('--test') || process.argv.includes('jest');

//monta um nome para o arquivo de log
const now = new Date();
const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
const executionType = isTestEnvironment ? 'test' : 'app';
const logFileName = `log-${executionType}-${dateStr}.txt`;
const logFilePath = path.join(logDir, logFileName);

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `[${info.timestamp}] ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: logFilePath }),
        new transports.Console()
    ]
});

export const log = (message) => {
    logger.log({ level: 'info', message });
};