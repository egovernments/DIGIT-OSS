import mergeConfig from "./config/mergeConfig";
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";

const setupLibraries = (Library, props) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library] = { ...window.Digit[Library], ...props };
};

const initLibraries = () => {
  setupLibraries("Config", { mergeConfig });
  setupLibraries("Services", { useStore });
  setupLibraries("Translation", { initI18n });
};

export default initLibraries;
