import { LocalizationService } from "../molecules/Localization/service";

const ADMIN_CODE = ({ tenantId, hierarchyType }) => {
  console.log("object", tenantId);
  return tenantId.replace(".", "_").toUpperCase() + "_" + hierarchyType.code;
};

const getI18nKeys = (localitiesWithLocalizationKeys) => {
  return localitiesWithLocalizationKeys.map((locality) => ({
    code: locality.code,
    message: locality.name,
  }));
};

const getLocalities = (tenantBoundry) => {
  console.log("tenantBoundry:", tenantBoundry);
  const adminCode = ADMIN_CODE(tenantBoundry);
  const localitiesWithLocalizationKeys = tenantBoundry.boundary.map((boundaryObj) => ({
    ...boundaryObj,
    code: adminCode + "_" + boundaryObj.code,
  }));
  let I18nKeyMessage = getI18nKeys(localitiesWithLocalizationKeys);
  LocalizationService.updateResources("en_IN", I18nKeyMessage);
  return localitiesWithLocalizationKeys;
};

export const LocalityService = {
  get: (tenantBoundry) => getLocalities(tenantBoundry),
};
