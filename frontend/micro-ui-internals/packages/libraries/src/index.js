import i18next from "i18next";
import mergeConfig from "./config/mergeConfig";
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";
import { Storage } from "./services/atoms/Utils/Storage";
import Enums from "./enums/index";
import { LocationService } from "./services/molecules/Location";
import { LocalityService } from "./services/elements/Localities";
import { LocalizationService } from "./services/molecules/Localization/service";
import { LoginService } from "./services/Login";
import { PGRService } from "./services/molecules/PGR";
import { FSMService } from "./services/elements/FSM";
import * as dateUtils from "./services/atoms/Utils/Date";
import { WorkflowService } from "./services/molecules/WorkFlow";
import { MdmsService } from "./services/molecules/MDMS";
import { UploadServices } from "./services/atoms/UploadServices";
import { GetServiceDefinitions } from "./services/elements/ServiceDefinitions";
import { Complaint } from "./services/elements/Complaint";
import { UserService } from "./services/molecules/User";
import { ULBService } from "./services/molecules/Ulb";
import { FileDesludging } from "./services/molecules/FSM/FileDesludging";

import Contexts from "./contexts";
import Hooks from "./hooks";
import Utils from "./utils";

const setupLibraries = (Library, props) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library] = { ...window.Digit[Library], ...props };
};

const initLibraries = () => {
  setupLibraries("SessionStorage", Storage);
  setupLibraries("UserService", UserService);
  setupLibraries("ULBService", ULBService);

  setupLibraries("Config", { mergeConfig });
  setupLibraries("Services", { useStore });
  setupLibraries("Enums", Enums);
  setupLibraries("LocationService", LocationService);
  setupLibraries("LocalityService", LocalityService);
  setupLibraries("LoginService", LoginService);
  setupLibraries("LocalizationService", LocalizationService);
  setupLibraries("PGRService", PGRService);
  setupLibraries("FSMService", FSMService);
  setupLibraries("DateUtils", dateUtils);
  setupLibraries("WorkflowService", WorkflowService);
  setupLibraries("MDMSService", MdmsService);
  setupLibraries("UploadServices", UploadServices);
  setupLibraries("GetServiceDefinitions", GetServiceDefinitions);
  setupLibraries("Complaint", Complaint);
  setupLibraries("FileDesludging", FileDesludging);

  setupLibraries("Contexts", Contexts);
  setupLibraries("Hooks", Hooks);
  setupLibraries("Customizations", {});
  setupLibraries("Utils", Utils);

  initI18n();
  window.i18next = i18next;
};

export { initLibraries, Enums, Hooks };
