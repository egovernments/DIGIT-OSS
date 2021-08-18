import { MdmsService } from "../services/elements/MDMS";
import { useQuery } from "react-query";

const useMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const usePaymentGateway = () => {
    return useQuery("PAYMENT_GATEWAY", () => MdmsService.getPaymentGateway(tenantId, moduleCode, type), {
      select: (data) => {
        return data?.[moduleCode]?.[type].filter((e) => e.active).map(({ gateway }) => gateway);
      },
      ...config,
    });
  };

  const useReceiptKey = () => {
    return useQuery("RECEIPT_KEY", () => MdmsService.getReceiptKey(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "PaymentGateway":
      return usePaymentGateway();
    case "ReceiptKey":
      return useReceiptKey();
  }
};

export default useMDMS;
