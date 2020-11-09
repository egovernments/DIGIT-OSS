import { LocalizationService } from "../Localization/service";
import { MdmsService } from "../MDMS";
import { GetCitiesWithi18nKeys } from "../utils";

export const StoreService = {
  defaultData: async (stateCode, cityCode, moduleCode) => {
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"].StateInfo[0];
    let cities = GetCitiesWithi18nKeys(MdmsRes, moduleCode);

    const defaultData = {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: "en_IN" }],
      stateInfo: { code: stateInfo.code, name: stateInfo.name, logoUrl: stateInfo.logoUrl },
      cities,
      cityCode,
    };

    defaultData.locales = await LocalizationService.getLocale({
      modules: [
        "rainmaker-common",
        `rainmaker-${moduleCode.toLowerCase()}`,
        `rainmaker-${stateCode.toLowerCase()}`,
        `rainmaker-${cityCode.toLowerCase()}`,
      ],
      locale: defaultData.languages[0].value,
      tenantId: stateCode,
    });
    return defaultData;
  },
};
