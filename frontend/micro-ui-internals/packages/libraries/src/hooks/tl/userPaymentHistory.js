import { useQuery } from "react-query";
import { PaymentService } from "../../services/elements/Payment";

const useTLPaymentHistory = (tenantId, id, config = {}) => {
  return useQuery(["PAYMENT_HISTORY", id], () => PaymentService.getReciept(tenantId, "", { consumerCodes: id }), { ...config });
};

export default useTLPaymentHistory;
