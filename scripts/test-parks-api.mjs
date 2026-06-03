import { fetchNearbyParks } from "../api/_lib/parksNearby.js";

const result = await fetchNearbyParks(40.7829, -73.9654, 1500);
console.log(JSON.stringify(result, null, 2));
