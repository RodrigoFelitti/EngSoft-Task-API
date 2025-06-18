import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

// Cria a pasta logs se não existir
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Determina se está rodando testes ou aplicação
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.argv.includes('--test') || process.argv.includes('jest');

// Nome do arquivo por execução com formato mais legível
const now = new Date();
const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
const executionType = isTestEnvironment ? 'test' : 'app';
const logFileName = `log-${executionType}-${dateStr}.txt`;
const logFilePath = path.join(logDir, logFileName);

// Formato
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

// Exporta uma função simples
export const log = (message) => {
    logger.log({ level: 'info', message });
};