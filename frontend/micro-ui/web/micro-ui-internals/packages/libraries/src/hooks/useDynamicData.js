import { useQuery } from "react-query";
import { TLService } from "./../services/elements/TL";
import { MCollectService } from "./../services/elements/MCollect";
import { PGRService } from "../services/elements/PGR";

const useDynamicData = ({moduleCode ,tenantId, filters, t }) => {

    const useTLDynamicData = () => {
        const { isLoading, error, data, isSuccess } =  useQuery(['TL_OPEN_SEARCH', tenantId, filters], async () => await TLService.TLOpensearch({ tenantId, filters }), 
        {select: (data) => {
            const tlData = {
                "dynamicDataOne": data?.applicationsIssued === 0 || data?.applicationsIssued === null ? null : data?.applicationsIssued + " " + t("APPLICATION_ISSUED_IN_LAST_12_MONTHS"),
                "dynamicDataTwo": data?.applicationsRenewed === 0 || data?.applicationsRenewed === null ? null : data?.applicationsRenewed + " " + t("APPLICATION_RENEWED_IN_LAST_12_MONTHS"),
                "staticData": data?.applicationValidity === 0 || data?.applicationValidity === null ? null : t("TL_VALIDITY_IS") + " " + data?.applicationValidity + " " + (data?.applicationValidity === 1 ? t("COMMON_YEAR") : t("COMMON_YEARS"))
            }
            return tlData;
        }});
        return { isLoading, error, data, isSuccess };
    }

    const useMCOLLECTDynamicData = () => {
        const { isLoading, error, data, isSuccess } =  useQuery(['MCOLLECT_OPEN_SEARCH', tenantId, filters], async () => await MCollectService.MCollectOpenSearch({ tenantId, filters }), 
        {select: (data) => {
            const mCollectData = {
                "dynamicDataOne": data?.countOfServices === 0 || data?.countOfServices === null ? null : data?.countOfServices + " "+ t("SERVICE_CATEGORIES_OF_CHALLANS_PROCESSED_IN") + " " + t(tenantId),
                "dynamicDataTwo": data?.totalAmountCollected === 0 || data?.totalAmountCollected === null ? null : `₹ ${data?.totalAmountCollected}` + t("COLLECTED_IN_FORM_OF_CHALLANS_IN_LAST_12_MONTHS"),
                "staticData": data?.challanValidity === 0 || data?.challanValidity === null ? null : t("VALIDITY_OF_CHALLAN_IS") + " " + data?.challanValidity + " " + (data?.challanValidity === 1 ? t("COMMON_DAY") : t("COMMON_DAYS")) + " " + t("FROM_ISSUED_DATE")
            }
            return mCollectData;
        }});
        return { isLoading, error, data, isSuccess };
    }

    const usePGRDynamicData = () => {
        const { isLoading, error, data, isSuccess } =  useQuery(['PGR_OPEN_SEARCH', tenantId, filters], async () => await PGRService.PGROpensearch({ tenantId, filters }), 
        {select: (data) => {
            const pgrData = {
                "dynamicDataOne": data?.complaintsResolved === 0 || data?.complaintsResolved === null ? null : data?.complaintsResolved + " " + t("COMPLAINTS_RESOLVED_IN_LAST_30_DAYS"),
                "dynamicDataTwo": data?.averageResolutionTime === 0 || data?.averageResolutionTime === null ? null : data?.averageResolutionTime + " " + (data?.averageResolutionTime === 1 ? t("COMMON_DAY") : t("COMMON_DAYS")) + " " + t("IS_AVG_COMPLAINT_RESOLUTION_TIME"),
                "staticData": data?.complaintTypes === 0 || data?.complaintTypes === null ? null : data?.complaintTypes + " " + t("CATEGORIES_OF_COMPLAINT_TYPES_CAN_BE_SUBMITTED_ON_GRIEVANCE_PORTAL")
            }
            return pgrData;
        }});
        return { isLoading, error, data, isSuccess };
    }

    switch(moduleCode){
        case 'TL':
            return useTLDynamicData();
        case 'MCOLLECT':
            return useMCOLLECTDynamicData();
        case 'PGR':
            return usePGRDynamicData();
        default:
            return {isLoading: false, error: false, data: null, isSuccess: false};
    }
    
  };

export default useDynamicData;