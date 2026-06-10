import { handleMapsApi } from "../_lib/mapsRouter.js";

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const layerId = url.searchParams.get("layer") ?? url.pathname.split("/").pop();
  return handleMapsApi(req, res, layerId);
}
