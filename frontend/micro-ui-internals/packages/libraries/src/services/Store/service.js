import { LocalizationService } from "../Localization/service";
import { MdmsService } from "../MDMS";
import { GetCitiesWithi18nKeys } from "../Utils/Request";
import { WorkflowService } from "../WorkFlow";

export const StoreService = {
  digitInitData: async (stateCode) => {
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"].StateInfo[0];
    const initData = {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: "en_IN" }],
      stateInfo: { code: stateInfo.code, name: stateInfo.name, logoUrl: stateInfo.logoUrl },
      localizationModules: stateInfo.localizationModules,
      modules: MdmsRes?.tenant?.citymodule,
      tenants: MdmsRes?.tenant?.tenants.map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant })),
    };
    initData.selectedLanguage = initData.languages[0].value;
    await LocalizationService.getLocale({
      modules: [`rainmaker-${stateCode.toLowerCase()}`, ...initData.localizationModules.map((module) => module.value)],
      locale: initData.selectedLanguage,
      tenantId: stateCode,
    });

    return initData;
  },
  defaultData: async (stateCode, cityCode, moduleCode, language) => {
    // const WorkFlowPromise = WorkflowService.init(stateCode, moduleCode);
    const LocalePromise = LocalizationService.getLocale({
      modules: [`rainmaker-${moduleCode.toLowerCase()}`, `rainmaker-${cityCode.toLowerCase()}`],
      locale: language,
      tenantId: stateCode,
    });
    // const { BusinessServices } = await WorkFlowPromise;
    await LocalePromise;
    return {};
  },
};
