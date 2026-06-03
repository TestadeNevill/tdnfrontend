import { isOpenAiConfigured } from "../_lib/openai.js";

export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    services: {
      parksNearby: true,
      aiComplete: true,
      formspree: Boolean(process.env.VITE_FORMSPREE_ID?.trim()),
      openai: isOpenAiConfigured(),
    },
  });
}
