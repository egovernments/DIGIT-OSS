import mergeConfig from "./config/mergeConfig";
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";
import { Storage } from "./services/Utils/Storage";
import Enums from "./enums/index";
import { LocationService } from "./services/Location";
import { LocalityService } from "./services/Localities";
import { LocalizationService } from "./services/Localization/service";
import { PGRService } from "./services/PGR";
import { MdmsService } from "./services/MDMS";

const setupLibraries = (Library, props) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library] = { ...window.Digit[Library], ...props };
};

const initLibraries = () => {
  setupLibraries("Config", { mergeConfig });
  setupLibraries("Services", { useStore });
  setupLibraries("Translation", { initI18n });
  setupLibraries("Enums", Enums);
  setupLibraries("SessionStorage", Storage);
  setupLibraries("LocationService", LocationService);
  setupLibraries("LocalityService", LocalityService);
  setupLibraries("LocalizationService", LocalizationService);
  setupLibraries("PGRService", PGRService);
  setupLibraries("MDMSService", MdmsService);
  initI18n();
};

export { Enums };

export default initLibraries;
