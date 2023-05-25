import { TLService } from "../../services/elements/TL";
import { useMutation } from "react-query";

const useTradeLicenseAPI = (tenantId, type = true) => {
  if(type){
  return useMutation((data) => TLService.create(data, tenantId));
} else {
  return useMutation((data) => TLService.update(data, tenantId));
}
};

export default useTradeLicenseAPI;
