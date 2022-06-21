import { useQuery, useQueryClient } from "react-query";
import BillingService from "../../services/elements/Bill";

const useCancelBill = ({ filters }) => {
    const client = useQueryClient();
    const { isLoading, error, data } = useQuery(["CANCEL_BILL", filters], async () => await BillingService.cancel_bill(filters), {
        enabled: filters?.businessService ? true : false,
    });
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["CANCEL_BILL", filters]) };
};

export default useCancelBill;
