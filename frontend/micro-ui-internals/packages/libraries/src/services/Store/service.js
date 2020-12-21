import { LocalizationService } from "../Localization/service";
import { MdmsService } from "../MDMS";
import { Storage } from "../Utils/Storage";

export const StoreService = {
  getInitData: () => {
    return Storage.get("initData");
  },
  digitInitData: async (stateCode) => {
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"].StateInfo[0];
    const initData = {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: "en_IN" }],
      stateInfo: { code: stateInfo.code, name: stateInfo.name, logoUrl: stateInfo.logoUrl },
      localizationModules: stateInfo.localizationModules,
      modules: MdmsRes && MdmsRes.tenant && MdmsRes.tenant.citymodule,
      tenants:
        MdmsRes &&
        MdmsRes.tenant &&
        MdmsRes.tenant.tenants.map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant })),
    };
    initData.selectedLanguage = initData.languages[0].value;
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
