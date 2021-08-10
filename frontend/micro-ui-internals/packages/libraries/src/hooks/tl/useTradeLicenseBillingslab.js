import { useQuery, useQueryClient } from "react-query";


const useTradeLicenseBillingslab = ({ tenantId, filters, auth }, config = {}) => {
    const client = useQueryClient();
    const args = tenantId ? { tenantId, filters, auth } : { filters, auth };
    const { isLoading, error, data } = useQuery(["TLbillingSlabSerach", tenantId, filters], () => Digit.TLService.billingslab(args), config);
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["TLbillingSlabSerach", tenantId, filters]) };
};

export default useTradeLicenseBillingslab;
