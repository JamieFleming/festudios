// Generates transparent + white variants from the opaque (dark-on-white) source logos.
// Source logos live in src/assets/images. We knock out the near-white background to
// produce transparent PNGs, and a white-tinted version for use on dark sections.
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/assets/images");

function processFile(srcName) {
  const base = srcName.replace(/\.png$/, "");
  const src = PNG.sync.read(fs.readFileSync(path.join(dir, srcName)));

  const transparent = new PNG({ width: src.width, height: src.height });
  const white = new PNG({ width: src.width, height: src.height });

  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i];
    const g = src.data[i + 1];
    const b = src.data[i + 2];
    const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    // alpha: opaque where dark (the mark), transparent where white (background)
    const alpha = Math.round((1 - lum) * 255);

    // transparent: keep original dark color, alpha from luminance
    transparent.data[i] = r;
    transparent.data[i + 1] = g;
    transparent.data[i + 2] = b;
    transparent.data[i + 3] = alpha;

    // white: paint the mark white, same alpha (for dark backgrounds)
    white.data[i] = 255;
    white.data[i + 1] = 255;
    white.data[i + 2] = 255;
    white.data[i + 3] = alpha;
  }

  fs.writeFileSync(path.join(dir, `${base}-light.png`), PNG.sync.write(transparent));
  fs.writeFileSync(path.join(dir, `${base}-dark.png`), PNG.sync.write(white));
  console.log(`generated ${base}-light.png and ${base}-dark.png`);
}

processFile("logo.png");
processFile("lg_logo.png");
