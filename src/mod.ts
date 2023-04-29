import * as childProcess from "child_process";
import * as fsPromise from "node:fs/promises";
import path from "path";
import { promisify } from "util";

import AdmZip from "adm-zip";

import * as logger from "./logger.js";

const exec = promisify(childProcess.exec);

export async function copyPackageJson(packageJsonPath: string, outDir: string) {
  logger.log("copying package.json...");

  const timeEnd = logger.time("package.json copied", "success");

  const packageJson = JSON.parse(await fsPromise.readFile(packageJsonPath, { encoding: "utf-8" })) as Record<
    string,
    any
  >;

  const {
    main = "index.js",
    dependencies = {},
    version = "1.0.0",
    devDependencies,
    scripts,
    license = "UNLICENSED",
    ...others
  } = packageJson;

  const newPackageJson = {
    ...others,
    main,
    version,
    dependencies,
    license,
  };

  await fsPromise.writeFile(path.resolve(outDir, "package.json"), JSON.stringify(newPackageJson), {
    encoding: "utf8",
  });

  timeEnd();
}

export async function installDependencies(outDir: string) {
  logger.log("installing dependencies...");

  const timeEnd = logger.time("dependencies installed", "success");

  const { stdout, stderr } = await exec(`cd ${outDir} && npm i && cd -`);
  if (stderr) {
    logger.error(stderr);
    logger.warn("dependencies installed with errors");
  }
  if (stdout) logger.log(stdout);
  timeEnd();
}

export async function createZip(targetDir: string, zipPath: string) {
  logger.log("creating zip...");

  const timeEnd = logger.time("zip created", "success");

  const filesInDir = await fsPromise.readdir(targetDir);

  const zip = new AdmZip();

  for (const file of filesInDir) {
    const fileStat = await fsPromise.stat(path.join(targetDir, file));
    if (fileStat.isSymbolicLink()) continue;

    if (fileStat.isDirectory()) {
      zip.addLocalFolder(path.join(targetDir, file), file);
      continue;
    }

    zip.addLocalFile(path.join(targetDir, file));
  }

  await zip.writeZipPromise(zipPath);

  timeEnd();
}

export type PackOptions = {
  zip?: boolean;
  zipFileName?: string;
  randomZipName?: boolean;
};

export default async function pack(
  outDir: string,
  packageJsonPath: string,
  { zip = false, randomZipName = false, zipFileName }: PackOptions = {}
) {
  logger.log("packing function...");

  const timeEnd = logger.time("function packed", "success");

  await copyPackageJson(packageJsonPath, outDir);
  await installDependencies(outDir);

  if (zip) {
    const filename = zipFileName
      ? zipFileName
      : `${
          randomZipName
            ? Buffer.from(`${Date.now()}`).toString("base64").replace(/=/g, "").toLowerCase()
            : "function"
        }.zip`;
    const zipPath = path.join(outDir, filename);
    await createZip(outDir, zipPath);
  }

  timeEnd();
}
