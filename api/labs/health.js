import { isOpenAiConfigured } from "../_lib/openai.js";
import { isGooglePlacesConfigured } from "../_lib/googlePlaces.js";

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    services: {
      parksNearby: true,
      googlePlaces: isGooglePlacesConfigured(),
      aiComplete: true,
      formspree: Boolean(process.env.VITE_FORMSPREE_ID?.trim()),
      openai: isOpenAiConfigured(),
    },
  });
}
