import { StoreService } from "./Store/service";

const StoreData = {
  getInitData: () => StoreService.getInitData(),
  getCurrentLanguage: () => Digit.SessionStorage.get("locale") || `en_IN`,
};

export default StoreData;
