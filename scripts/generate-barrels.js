import * as fs from "fs";
import * as path from "path";

const baseDir = path.resolve("src/gql");

function createBarrels(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const exports = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      createBarrels(path.join(dir, entry.name));
    } else if (entry.name.endsWith(".generated.tsx")) {
      const name = entry.name.replace(".generated.tsx", "");
      exports.push(`export * from './${name}.generated';`);
    }
  }

  if (exports.length > 0) {
    const barrelPath = path.join(dir, "index.ts");
    fs.writeFileSync(barrelPath, exports.join("\n") + "\n");
    console.log(`🧩 Barrel created: ${barrelPath}`);
  }
}

createBarrels(baseDir);
