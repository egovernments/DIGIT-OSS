import mergeConfig from "./config/mergeConfig";
import { initServices } from "./services/index";
import { initI18n } from "./translations/index";

const initConfig = () => {
  window.eGov = window.eGov || {};
  window.eGov.Config = window.eGov.Config || {};
  window.eGov.Config = { ...window.eGov.Config, mergeConfig };
};

const initLibraries = () => {
  initI18n();
  initConfig();
  initServices();
};

export default initLibraries;
