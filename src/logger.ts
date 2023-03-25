import chalk from "chalk";

const prefix = {
  info: chalk.blue("[info]"),
  error: chalk.red("[error]"),
  warn: chalk.yellow("[warn]"),
  success: chalk.green("[success]"),
};

export function log(message: string) {
  console.log(`${prefix.info} - ${message}`);
}

export function error(message: string) {
  console.error(`${prefix.error} - ${message}`);
}

export function warn(message: string) {
  console.warn(`${prefix.warn} - ${message}`);
}

export function success(message: string) {
  console.log(`${prefix.success} - ${message}`);
}

export function time(message: string, level: keyof typeof prefix = "info") {
  const label = `${prefix[level]} - ${message}`;
  console.time(label);
  return () => console.timeEnd(label);
}
