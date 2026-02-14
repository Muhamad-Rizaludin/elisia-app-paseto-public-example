import { mkdirSync, readdirSync, rmSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { createLogger, format, transports } from "winston";

const logsDir = path.resolve(process.cwd(), "logs");

const ensureLogsDirectory = () => {
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
};

const cleanupLogs = (prefix: string, retentionDays: number) => {
  const now = Date.now();
  const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
  for (const file of readdirSync(logsDir)) {
    if (!file.startsWith(prefix) || !file.endsWith(".log")) continue;
    const fullPath = path.join(logsDir, file);
    const stat = statSync(fullPath);
    if (now - stat.mtimeMs > retentionMs) {
      rmSync(fullPath, { force: true });
    }
  }
};

ensureLogsDirectory();
cleanupLogs("error-", 7);
cleanupLogs("info-", 30);

const today = new Date().toISOString().slice(0, 10);

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new transports.File({ filename: path.join(logsDir, `info-${today}.log`), level: "info" }),
    new transports.File({ filename: path.join(logsDir, `error-${today}.log`), level: "error" })
  ]
});
