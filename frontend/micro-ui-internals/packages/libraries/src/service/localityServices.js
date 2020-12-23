import { LocalizationService } from "../services/Localization/service";

class LocalityService {
  ADMIN_CODE = ({ tenantId, hierarchyType }) => {
    console.log("object", tenantId);
    return tenantId.replace(".", "_").toUpperCase() + "_" + hierarchyType.code;
  };

  getI18nKeys = (localitiesWithLocalizationKeys) => {
    return localitiesWithLocalizationKeys.map((locality) => ({
      code: locality.code,
      message: locality.name,
    }));
  };

  getLocalities = (tenantBoundry) => {
    console.log("tenantBoundry:", tenantBoundry);
    const adminCode = this.ADMIN_CODE(tenantBoundry);
    const localitiesWithLocalizationKeys = tenantBoundry.boundary.map((boundaryObj) => ({
      ...boundaryObj,
      code: adminCode + "_" + boundaryObj.code,
    }));
    let I18nKeyMessage = this.getI18nKeys(localitiesWithLocalizationKeys);
    LocalizationService.updateResources("en_IN", I18nKeyMessage);
    return localitiesWithLocalizationKeys;
  };

  get = (tenantBoundry) => this.getLocalities(tenantBoundry);
}

export const localityService = new LocalityService();
