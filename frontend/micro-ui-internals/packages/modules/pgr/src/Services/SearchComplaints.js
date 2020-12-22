import { CoreService } from "@egovernments/digit-ui-libraries/src/service/coreService";
import { useQuery } from "react-query";

class SearchComplaints extends CoreService {
  constructor() {
    super("PGR");
    this.getUserType = () => window.Digit?.SessionStorage.get("userType");
    this.getTenantId = () =>
      this.getUserType() ? window.Digit?.SessionStorage.get("Citizen.tenantId") : window.Digit?.SessionStorage.get("Employee.tenantId");
  }

  useComplaintsList = (filters = {}) => {
    const { isLoading, error, data } = useQuery(["complaintsList", filters], () => this._module.search(this.getTenantId(), filters));
    return { isLoading, error, data };
  };

  useComplaintsListByMobile = (mobileNumber) => {
    return this.useComplaintsList({ mobileNumber });
  };
}

const SearchComplaintObject = new SearchComplaints();

export const searchComplaints = () => SearchComplaintObject;
