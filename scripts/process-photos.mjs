/**
 * Victorian Casino — photo processing script
 * Dark/gold moody treatment using sharp + mozjpeg
 */
import sharp from "sharp";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../public/images");
const EDITED = join(__dirname, "../public/images/edited");
const MEDIA = join(__dirname, "../public/media");

/**
 * Victorian brand treatment:
 * - Crush blacks / deep shadows via gamma
 * - Boost saturation — pull warm gold/amber forward
 * - Contrast lift via linear curve
 * - Mild denoise (blur → sharpen)
 * - Slight brightness pull-back for moody feel
 */
async function victorian(pipeline) {
  return pipeline
    .blur(0.45)                                     // mild denoise pass
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 3 })       // recover edges / crispness
    .modulate({ brightness: 0.87, saturation: 1.45 }) // darker + richer color
    .gamma(1.22)                                    // crush shadows, deepen blacks
    .linear(1.14, -11);                             // contrast lift, hold highlights
}

/** Saves a landscape/section image (16:9, 1200×675) */
async function section(filename, outName, position = "centre") {
  const pipe = sharp(join(SRC, filename)).resize(1200, 675, {
    fit: "cover",
    position,
  });
  await (await victorian(pipe)).jpeg({ quality: 84, mozjpeg: true }).toFile(
    join(EDITED, outName)
  );
  console.log(`✓ ${outName}`);
}

/** Saves a gallery square (800×800) */
async function gallery(filename, outName, position = "entropy") {
  const pipe = sharp(join(SRC, filename)).resize(800, 800, {
    fit: "cover",
    position,
  });
  await (await victorian(pipe)).jpeg({ quality: 82, mozjpeg: true }).toFile(
    join(EDITED, outName)
  );
  console.log(`✓ ${outName}`);
}

/** Saves the hero poster (1920×1080, slightly lighter for overlay readability) */
async function hero(filename) {
  const pipe = sharp(join(SRC, filename)).resize(1920, 1080, {
    fit: "cover",
    position: "centre",
  });
  // Hero sits behind opacity-40 video element + gradient, so make it punchier
  await pipe
    .blur(0.4)
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 3 })
    .modulate({ brightness: 0.92, saturation: 1.55 })
    .gamma(1.18)
    .linear(1.16, -10)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(join(MEDIA, "hero-poster.jpg"));
  console.log("✓ hero-poster.jpg");
}

async function main() {
  console.log("Processing Victorian Casino photos…\n");

  // ── Hero ──────────────────────────────────────────────────────────────────
  // Best: overhead wide floor shot with rainbow ceiling
  await hero("PXL_20260419_054033588.jpg");

  // ── Gaming section (16:9) ─────────────────────────────────────────────────
  // Main: Montana Gold 3-in-a-row, warm orange glow
  await section("PXL_20260419_053438075.jpg", "gaming-floor-01.jpg");

  // ── Food & Drinks section (16:9) ──────────────────────────────────────────
  // Bar: Fu Dai Lian machines with bar shelf visible in background
  await section("PXL_20260419_053523035.jpg", "bar-interior.jpg");
  // No food shots — use ambient interior (UltraVision + Montana Gold warm floor)
  await section("PXL_20260419_053540824.jpg", "gaming-ambient-01.jpg");

  // ── Gallery (square 800×800) ───────────────────────────────────────────────
  await gallery("PXL_20260419_054027283.jpg", "gallery-floor-overhead.jpg");
  await gallery("PXL_20260419_054003157.jpg",  "gallery-floor-wide.jpg");
  await gallery("PXL_20260419_053443429.jpg",  "gallery-montana-gold.jpg");
  await gallery("PXL_20260419_053835095.jpg",  "gallery-exterior-night.jpg", "attention");
  await gallery("PXL_20260419_053404916.jpg",  "gallery-royal-touch.jpg");
  await gallery("PXL_20260419_053808605.jpg",  "gallery-bigfoot-keno.jpg");
  await gallery("PXL_20260419_053803725.jpg",  "gallery-montana-gambler.jpg");
  await gallery("PXL_20260419_053529155.jpg",  "gallery-deep-seas.jpg");
  await gallery("PXL_20260419_053604088.jpg",  "gallery-atm.jpg");

  console.log("\nAll done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
