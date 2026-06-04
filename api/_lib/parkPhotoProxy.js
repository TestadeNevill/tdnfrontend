import {
  getPhotoMediaUrl,
  isGooglePlacesConfigured,
  isValidPhotoRef,
} from "./googlePlaces.js";

export async function fetchParkPhoto(ref, maxHeight = 80) {
  if (!isGooglePlacesConfigured()) {
    const error = new Error("Google Places API key is not configured");
    error.status = 502;
    error.code = "missing_api_key";
    throw error;
  }

  if (!isValidPhotoRef(ref)) {
    const error = new Error("Invalid photo reference");
    error.status = 400;
    throw error;
  }

  const clampedHeight = Math.min(Math.max(Number(maxHeight) || 80, 40), 800);
  const mediaUrl = getPhotoMediaUrl(ref, clampedHeight);
  if (!mediaUrl) {
    const error = new Error("Photo proxy unavailable");
    error.status = 502;
    throw error;
  }

  const response = await fetch(mediaUrl, {
    signal: AbortSignal.timeout(12_000),
    redirect: "follow",
  });

  if (response.status === 429) {
    const error = new Error("Google Places rate limit exceeded");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to fetch park photo");
    error.status = 502;
    throw error;
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType };
}
