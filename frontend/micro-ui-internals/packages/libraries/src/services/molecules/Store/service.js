import { LocalizationService } from "../Localization/service";
import { MdmsService } from "../MDMS";
import { Storage } from "../../atoms/Utils/Storage";

export const StoreService = {
  getInitData: () => {
    return Storage.get("initData");
  },
  digitInitData: async (stateCode, enabledModules) => {
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"].StateInfo[0];
    const initData = {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: "en_IN" }],
      stateInfo: { code: stateInfo.code, name: stateInfo.name, logoUrl: stateInfo.logoUrl },
      localizationModules: stateInfo.localizationModules,
      modules: MdmsRes?.tenant?.citymodule.filter((module) => enabledModules.includes(module.code)),
    };
    initData.selectedLanguage = initData.languages[0].value;

    // TODO: remove the FSM temp data once added in mdms master
    initData.modules.push({
      module: "FSM",
      code: "FSM",
      tenants: [{ code: "pb.amritsar" }],
    });

    const moduleTenants = initData.modules
      .map((module) => module.tenants)
      .flat()
      .reduce((unique, ele) => (unique.find((item) => item.code === ele.code) ? unique : [...unique, ele]), []);
    initData.tenants = MdmsRes?.tenant?.tenants
      .filter((item) => !!moduleTenants.find((mt) => mt.code === item.code))
      .map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant }));

    await LocalizationService.getLocale({
      modules: [
        `rainmaker-${stateCode.toLowerCase()}`,
        ...initData.localizationModules.map((module) => module.value),
        ...initData.tenants.map((tenant) => `rainmaker-${tenant.code.toLowerCase()}`),
      ],
      locale: initData.selectedLanguage,
      tenantId: stateCode,
    });

    Storage.set("initData", initData);

    return initData;
  },
  defaultData: async (stateCode, cityCode, moduleCode, language) => {
    const LocalePromise = LocalizationService.getLocale({
      modules: [`rainmaker-${moduleCode.toLowerCase()}`, `rainmaker-${cityCode.toLowerCase()}`],
      locale: language,
      tenantId: stateCode,
    });
    await LocalePromise;
    return {};
  },
};
