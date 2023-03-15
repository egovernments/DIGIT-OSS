import { useQuery, useQueryClient } from "react-query";
import BillingService from "../../services/elements/Bill";

const useBillSearch = ({ filters, config = {} }) => {
  const client = useQueryClient();
  const tenantId = Digit.SessionStorage.get("User")?.info?.tenantId;

  filters.locality = filters.locality?.map((element) => {
    return element.code;
  });
  filters.url = filters.url?.replace("egov-searcher", "");

  const args = tenantId ? { tenantId, filters } : { filters };

  const { isLoading, error, data } = useQuery(["BILL_INBOX", tenantId, filters], async () => await BillingService.search_bill(args), {
    ...config,
    enabled: filters?.businesService ? true : false,
  });
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["BILL_INBOX", tenantId, filters]) };
};

export default useBillSearch;
