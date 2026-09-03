import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Render the unchanged brand asset in a square document, not a new/re-drawn logo.
// Opaque white also keeps the original transparent logo legible in dark browser UI.
const brandSource = readFile(join(process.cwd(), "public/images/logojas.png"))
  .then(data => `data:image/png;base64,${data.toString("base64")}`);

export async function renderBrandIcon(size: number) {
  const width = Math.round(size * 0.94);
  const height = width * 1600 / 2480;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* ImageResponse renders plain image elements, not next/image components. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={await brandSource} alt="JAS PlastikAL" width={width} height={height} />
    </div>,
    { width: size, height: size },
  );
}

export async function renderIco() {
  const sizes = [16, 32, 48, 256];
  const images = await Promise.all(sizes.map(async size => Buffer.from(await (await renderBrandIcon(size)).arrayBuffer())));
  const directory = Buffer.alloc(6 + 16 * sizes.length);
  directory.writeUInt16LE(1, 2); // ICO, not a cursor.
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  for (const [index, size] of sizes.entries()) {
    const entry = 6 + index * 16;
    directory[entry] = directory[entry + 1] = size === 256 ? 0 : size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(images[index].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  }
  return new Response(new Uint8Array(Buffer.concat([directory, ...images])), {
    headers: { "Content-Type": "image/x-icon" },
  });
}
