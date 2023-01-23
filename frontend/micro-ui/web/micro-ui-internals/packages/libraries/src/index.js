import i18next from "i18next";
import Enums from "./enums/index";
import mergeConfig from "./config/mergeConfig";
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";

import { Storage, PersistantStorage } from "./services/atoms/Utils/Storage";
import { UploadServices } from "./services/atoms/UploadServices";
import JsDictionary from "./services/atoms/JsDictionary";

import { LocationService } from "./services/elements/Location";
import { LocalityService } from "./services/elements/Localities";
import { LocalizationService } from "./services/elements/Localization/service";
import { LoginService } from "./services/elements/Login";
import { PGRService } from "./services/elements/PGR";
import { PaymentService } from "./services/elements/Payment";
import * as dateUtils from "./services/atoms/Utils/Date";
import Download from "./services/atoms/Download";
import { WorkflowService } from "./services/elements/WorkFlow";
import { MdmsService } from "./services/elements/MDMS";
import { Complaint } from "./services/elements/Complaint";
import { UserService } from "./services/elements/User";
import HrmsService from "./services/elements/HRMS";
import { InboxGeneral } from "./services/elements/InboxService";
import EventsServices from "./services/elements/Events";


import ShareFiles from "./services/molecules/ShareFiles";
import { GetServiceDefinitions } from "./services/molecules/ServiceDefinitions";
import { ULBService } from "./services/molecules/Ulb";
import { ComponentRegistryService } from "./services/elements/ComponentRegistry";
import StoreData from "./services/molecules/StoreData";

import Contexts from "./contexts";
import Hooks from "./hooks";
import Utils from "./utils";
import { subFormRegistry } from "./subFormRegistry";
import AccessControlService from "./services/elements/Access";

const setupLibraries = (Library, props) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library] = { ...window.Digit[Library], ...props };
};

const initLibraries = () => {
  setupLibraries("SessionStorage", Storage);
  setupLibraries("PersistantStorage", PersistantStorage);
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
  setupLibraries("HRMSService", HrmsService);
  setupLibraries("PaymentService", PaymentService);
  setupLibraries("DateUtils", dateUtils);
  setupLibraries("WorkflowService", WorkflowService);
  setupLibraries("MDMSService", MdmsService);
  setupLibraries("UploadServices", UploadServices);
  setupLibraries("JsDictionary", JsDictionary);
  setupLibraries("GetServiceDefinitions", GetServiceDefinitions);
  setupLibraries("Complaint", Complaint);
  setupLibraries("ComponentRegistryService", ComponentRegistryService);
  setupLibraries("StoreData", StoreData);
  setupLibraries("EventsServices", EventsServices);

  setupLibraries("InboxGeneral", InboxGeneral);
  setupLibraries("ShareFiles", ShareFiles);
  setupLibraries("Contexts", Contexts);
  setupLibraries("Hooks", Hooks);
  setupLibraries("Customizations", {});
  setupLibraries("Utils", Utils);
  setupLibraries("Download", Download);

  setupLibraries("AccessControlService", AccessControlService);

  return new Promise((resolve) => {
    initI18n(resolve);
  });
};

export { initLibraries, Enums, Hooks, subFormRegistry };
