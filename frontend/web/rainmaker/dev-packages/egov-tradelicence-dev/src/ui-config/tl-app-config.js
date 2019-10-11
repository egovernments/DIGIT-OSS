export const defaultLocation = { lat: 30.7333, lng: 76.7794 };
export const MAP_API_KEY = globalConfigExists() ? window.globalConfigs.getConfig("GMAPS_API_KEY") : process.env.REACT_APP_GMAPS_API_KEY;

function globalConfigExists() {
  return typeof window.globalConfigs !== "undefined" && typeof window.globalConfigs.getConfig === "function";
}
