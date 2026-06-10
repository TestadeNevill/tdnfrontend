import { isOpenAiConfigured } from "../_lib/openai.js";
import { isGooglePlacesConfigured } from "../_lib/googlePlaces.js";
import { isOrsConfigured } from "../_lib/openRouteService.js";
import { getAirNowApiKey } from "../_lib/airnow.js";
import { getTransitlandApiKey } from "../_lib/transitland.js";
import { LAYER_HANDLERS } from "../_lib/mapsRouter.js";

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    services: {
      parksNearby: true,
      googlePlaces: isGooglePlacesConfigured(),
      openRouteService: isOrsConfigured(),
      airNow: Boolean(getAirNowApiKey()),
      transitland: Boolean(getTransitlandApiKey()),
      mapLayers: Object.keys(LAYER_HANDLERS),
      aiComplete: true,
      formspree: Boolean(process.env.VITE_FORMSPREE_ID?.trim()),
      openai: isOpenAiConfigured(),
    },
  });
}
