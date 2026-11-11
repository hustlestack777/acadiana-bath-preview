import { readFileSync } from "node:fs";
import { join } from "node:path";

const FILENAME = "justin-acadiana-bathrooms.vcf";
const CONTENT_TYPE = "text/vcard; charset=utf-8";

export function justinVcfBytes() {
  return readFileSync(join(process.cwd(), "lib/data/justin.vcf"));
}

export function justinVcfHeaders(disposition: "inline" | "attachment" = "inline") {
  return {
    "Content-Type": CONTENT_TYPE,
    "Content-Disposition": `${disposition}; filename="${FILENAME}"`,
  };
}

export function justinVcfAttachment() {
  return {
    filename: FILENAME,
    content: justinVcfBytes().toString("base64"),
    contentType: "text/vcard",
  };
}
