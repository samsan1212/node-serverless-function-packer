import { stat, mkdir } from "node:fs/promises";

export async function ensureOutDirExists(outDir: string) {
  try {
    const result = await stat(outDir);
    if (result.isFile()) {
      throw new Error("The output directory cannot be a file");
    }
  } catch (error) {
    await mkdir(outDir, { recursive: true });
  }
}
