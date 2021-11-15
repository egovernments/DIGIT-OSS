import { useQuery } from "react-query";
import { OBPSService } from "../../services/elements/OBPS";

const useOCEdcrSearch = (tenantId, filters, config = {}, ocEdcrNumber) => {
  return useQuery([tenantId, filters], async () => {
    if (config?.enabled) {
      const userInfo = Digit.UserService.getUser();
      const bpaApprovalResponse = await OBPSService.BPASearch(tenantId, { ...filters });
      const edcrNumber = bpaApprovalResponse?.BPA?.[0]?.edcrNumber;
      tenantId = bpaApprovalResponse?.BPA?.[0]?.tenantId;
      const edcrDetails = await OBPSService.scrutinyDetails(tenantId, { edcrNumber: edcrNumber });
      const filter = { edcrNumber: ocEdcrNumber?.edcrNumber };
      const bpaResponse = await OBPSService.BPASearch(tenantId, { ...filter });
      const comparisionRep = {
        ocdcrNumber: ocEdcrNumber?.edcrNumber,
        edcrNumber: bpaApprovalResponse?.BPA?.[0]?.edcrNumber
      }
      const comparisionReport = await OBPSService.comparisionReport(tenantId, { ...comparisionRep })
      return {
        bpaApprovalResponse: bpaApprovalResponse?.BPA,
        edcrDetails: edcrDetails?.edcrDetail,
        bpaResponse: bpaResponse?.BPA,
        comparisionReport: comparisionReport?.comparisonDetail
      }
    }
  }, config)
}

export default useOCEdcrSearch;
