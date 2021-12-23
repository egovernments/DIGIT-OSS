import { useQuery } from "react-query";
import { PaymentService } from "../../services/elements/Payment";

const usePaymentHistory = (tenantId, id, config = {}) => {
  return useQuery(["PAYMENT_HISTORY", id], () => PaymentService.getReciept(tenantId, "FSM.TRIP_CHARGES", { consumerCodes: id }), { ...config });
};

export default usePaymentHistory;
