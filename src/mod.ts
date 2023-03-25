import { promisify } from "util";
import * as childProcess from "child_process";
import fsPromise from "fs/promises";
import path from "path";

const exec = promisify(childProcess.exec);

type PackageJson = Record<string, any> & {
  name: string;
  main?: string;
  dependencies?: Record<string, any>;
  version?: string;
  devDependencies?: Record<string, any>;
  scripts?: Record<string, any>;
};
