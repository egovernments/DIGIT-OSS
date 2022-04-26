import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useReceiptsMDMS = (tenantId, type, config = {}) => {
  const useReceiptsBusinessServices = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_SERVICES", tenantId], () => MdmsService.getReceiptKey(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.uiCommonPay && Array.isArray(data[`common-masters`].uiCommonPay)) {
      data[`common-masters`].uiCommonPay = data[`common-masters`].uiCommonPay.filter((unit) => unit.cancelReceipt) || [];
      data.dropdownData = [...data[`common-masters`].uiCommonPay.map(config => {
        return {
          code: config.code,
          name: `BILLINGSERVICE_BUSINESSSERVICE_${config.code}`
        }
      })] || []
    }
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_SERVICES", tenantId]) };
  };

  const useCancelReceiptReason = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_CANCEL_REASON", tenantId], () => MdmsService.getCancelReceiptReason(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.CancelReceiptReason && Array.isArray(data[`common-masters`].CancelReceiptReason)) {
      data[`common-masters`].CancelReceiptReason = data[`common-masters`].CancelReceiptReason.filter((unit) => unit.active) || [];
      data.dropdownData = [...data[`common-masters`].CancelReceiptReason.map(config => {
        return {
          code: config.code,
          name: `CR_REASON_${config.code}`
        }
      })] || []
    }
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_CANCEL_REASON", tenantId]) };
  };
  const useCancelReceiptStatus = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_CANCEL_STATUS", tenantId], () => MdmsService.getReceiptStatus(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.ReceiptStatus && Array.isArray(data[`common-masters`].ReceiptStatus)) {
      data[`common-masters`].ReceiptStatus = data[`common-masters`].ReceiptStatus.filter((unit) => unit.active) || [];
      data.dropdownData = [...data[`common-masters`].ReceiptStatus.map(config => {
        return {
          code: config.code,
          name: `RC_${config.code}`
        }
      })] || []
    }
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_CANCEL_STATUS", tenantId]) };
  };
  const useCancelReceiptReasonAndStatus = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_CANCEL_REASON_STATUS", tenantId], () => MdmsService.getCancelReceiptReasonAndStatus(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.uiCommonPay && Array.isArray(data[`common-masters`].uiCommonPay)) {
      data[`common-masters`].uiCommonPay = data[`common-masters`].uiCommonPay.filter((unit) => unit.cancelReceipt) || [];
      data.dropdownData = [...data[`common-masters`].uiCommonPay.map(config => {
        return {
          code: config.code,
          name: `BILLINGSERVICE_BUSINESSSERVICE_${config.code}`
        }
      })] || []
      if (data[`common-masters`]?.ReceiptStatus && Array.isArray(data[`common-masters`].ReceiptStatus)) {
        data[`common-masters`].ReceiptStatus = data[`common-masters`].ReceiptStatus.filter((unit) => unit.active) || [];
        data.dropdownDataStatus = [...data[`common-masters`].ReceiptStatus.map(config => {
          return {
            code: config.code,
            name: `RC_${config.code}`
          }
        })] || []
      }

    }
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_CANCEL_REASON_STATUS", tenantId]) };
  };

  switch (type) {
    case "ReceiptsBusinessServices":
      return useReceiptsBusinessServices();
    case "CancelReceiptReason":
      return useCancelReceiptReason();
    case "CancelReceiptStatus":
      return useCancelReceiptStatus();
    case "CancelReceiptReasonAndStatus":
      return useCancelReceiptReasonAndStatus();
    default:
      return null;
  }
};
export default useReceiptsMDMS;
