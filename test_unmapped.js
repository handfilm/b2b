
const fs = require("fs");
const files = JSON.parse(fs.readFileSync("image_list.json", "utf8"));
const content = fs.readFileSync("src/data/unlimitedCatalog.ts", "utf8");

const mappedVals = new Set();
const match = content.match(/export const PRODUCT_IMAGE_FILE_MAP: Record<string, string> = \{([\s\S]*?)\};/);
if (match) {
  const lines = match[1].split("\n");
  for (const line of lines) {
    const m = line.match(/'(.*?)':\s*'(.*?)'/);
    if (m) {
      mappedVals.add(m[2].replace(/^\//, ""));
    }
  }
}

const unmapped = files.filter(f => !mappedVals.has(f));
console.log("Total public images:", files.length);
console.log("Mapped in PRODUCT_IMAGE_FILE_MAP:", mappedVals.size);
console.log("Unmapped images count:", unmapped.length);
console.log("Unmapped images:", unmapped);
