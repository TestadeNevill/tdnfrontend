import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchNearbyParks } from "../api/_lib/parksNearby.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envLocal = join(__dirname, "..", ".env.local");
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const lat = 40.7829;
const lng = -73.9654;
const radiusM = 2000;

if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) {
  console.error("GOOGLE_PLACES_API_KEY is required. Set it in .env.local or the environment.");
  process.exit(1);
}

try {
  const result = await fetchNearbyParks(lat, lng, radiusM);
  console.log(`Found ${result.parks.length} parks (source: ${result.source})`);
  for (const park of result.parks) {
    console.log("\n---");
    console.log(JSON.stringify(park, null, 2));
  }
} catch (error) {
  console.error("Parks API test failed:", error.message);
  process.exit(1);
}
