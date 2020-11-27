import mergeConfig from "./config/mergeConfig";
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";
import { Storage } from "./services/Utils/Storage";
import Enums from "./enums/index";
import { LocationService } from "./services/Location";
import { LocalityService } from "./services/Localities";
import { LocalizationService } from "./services/Localization/service";
import { PGRService } from "./services/PGR";
import * as dateUtils from "./services/Utils/Date";
import { WorkflowService } from "./services/WorkFlow";
import { MdmsService } from "./services/MDMS";
import { UploadServices } from "./services/UploadServices";
import { GetServiceDefinitions } from "./services/ServiceDefinitions";
import { Complaint } from "./services/Complaint";
import { PincodeMap } from "./services/PincodeMap";

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
  setupLibraries("DateUtils", dateUtils);
  setupLibraries("workflowService", WorkflowService);
  setupLibraries("MDMSService", MdmsService);
  setupLibraries("UploadServices", UploadServices);
  setupLibraries("GetServiceDefinitions", GetServiceDefinitions);
  setupLibraries("Complaint", Complaint);
  setupLibraries("PincodeMap", PincodeMap);
  initI18n();
};

export { Enums };

export default initLibraries;
