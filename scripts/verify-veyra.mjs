import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const baseline = JSON.parse(
  await readFile(new URL("veyra-manifest.json", import.meta.url), "utf8"),
);
const failures = [];
for (const entry of baseline.files) {
  try {
    let bytes = await readFile(new URL(entry.localPath, root));
    if (entry.text)
      bytes = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
    if (createHash("sha256").update(bytes).digest("hex") !== entry.sha256)
      failures.push(entry.localPath);
  } catch {
    failures.push(entry.localPath);
  }
}
if (failures.length) {
  console.error(`Reference mismatch: ${failures.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `PASS: ${baseline.files.length} copied media/source files match VEYRA ${baseline.release}.`,
  );
}
