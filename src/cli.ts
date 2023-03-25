import * as path from "node:path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as logger from "./logger.js";
import functionpack from "./mod.js";

import type { ArgumentsCamelCase } from "yargs";

type HandlerArgs = {
  zip?: boolean;
  zipname?: string;
  randomZipname?: boolean;
  outDir: string;
  packageJson: string;
};

yargs(hideBin(process.argv))
  .command(
    "$0",
    "",
    (_yargs) =>
      _yargs
        .option("zip", {
          type: "boolean",
          describe: "output a zip file",
          alias: "z",
        })
        .option("zipname", {
          type: "string",
          describe: "create a zip file with a provided name, cannot used with --random-zipname",
        })
        .option("random-zipname", {
          type: "boolean",
          describe: "create a zip file with a random name, cannot used with --zipname",
        })
        .option("out-dir", {
          type: "string",
          alias: "d",
          demandOption: "the output directory path is required",
          describe: "the output directory",
        })
        .option("package-json", {
          alias: "p",
          type: "string",
          demandOption: "the path of package json is required",
          describe: "the filepath of the package json",
        }),
    async ({ zip, zipname, randomZipname, outDir, packageJson }: ArgumentsCamelCase<HandlerArgs>) => {
      if (typeof zipname === "string" && typeof randomZipname === "boolean") {
        logger.error("Cannot use --zipname and --random-zipname at the same time");
        process.exit(1);
      }

      const absolutePathOfOutDir = path.join(process.cwd(), outDir);
      const absolutePathOfPackageJson = path.join(process.cwd(), packageJson);

      try {
        await functionpack(absolutePathOfOutDir, absolutePathOfPackageJson, {
          zip,
          randomZipName: randomZipname,
          zipFileName: zipname,
        });
      } catch (error) {
        logger.error(`An error occurred: ${error.message}`);
        process.exit(1);
      }
    }
  )
  .help()
  .strict(true)
  .version((process.env.npm_package_version || false) as never)
  .parse();
