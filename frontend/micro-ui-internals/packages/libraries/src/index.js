import mergeConfig from "./config/mergeConfig";
import { initServices } from "./services/index";
import { initI18n } from "./translations/index";

const initConfig = () => {
  window.Digit = window.Digit || {};
  window.Digit.Config = window.Digit.Config || {};
  window.Digit.Config = { ...window.Digit.Config, mergeConfig };
};

const initLibraries = () => {
  initI18n();
  initConfig();
  initServices();
};

export default initLibraries;
