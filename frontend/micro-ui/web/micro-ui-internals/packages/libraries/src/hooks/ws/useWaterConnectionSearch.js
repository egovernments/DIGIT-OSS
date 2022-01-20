import { useQuery } from "react-query";
import { PTService } from "../../services/elements/PT";
import { WSService } from "../../services/elements/WS";

const combineResponse = (WaterConnections, properties, billData, workflow, t) => {
    if (WaterConnections && properties)
        return WaterConnections.map((app) => ({
            ...app,
            properties: properties,
            billData: billData,
            ProcessInstances: workflow
        }))
    else
        return undefined
}

const useWaterConnectionSearch = ({ tenantId, filters = {}, BusinessService = "WS", t }, config = {}) => {
    let propertyids = "";
    let consumercodes = "";
    let businessIds = "";
    const response = useQuery(['WS_SEARCH', tenantId, filters, BusinessService], async () => await WSService.search({ tenantId, filters: { ...filters }, businessService: BusinessService })
        , config)
    response?.data?.WaterConnection?.forEach(item => {
        propertyids = propertyids + item?.propertyId + (",");
        consumercodes = consumercodes + item?.applicationNo + ",";
    })
    let propertyfilter = { propertyIds: propertyids.substring(0, propertyids.length - 1), }
    if (propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;
    config = { enabled: propertyids !== "" ? true : false }
    const properties = useQuery(['WSP_SEARCH', tenantId, propertyfilter, BusinessService], async () => await PTService.search({ tenantId, filters: propertyfilter, auth: filters?.locality ? false : true })
        , config)
    const billData = useQuery(['BILL_SEARCH', tenantId, consumercodes, BusinessService], async () => await Digit.PaymentService.searchBill(tenantId, {
        consumerCode: consumercodes,
        Service: 'WS.ONE_TIME_FEE'
    })
        , config)
    if (filters?.applicationNumber)
        businessIds = filters?.applicationNumber;

    const workflowDetails = useQuery(['WS_WORKFLOW', tenantId, businessIds, BusinessService], async () => await Digit.WorkflowService.getByBusinessId(tenantId, businessIds)
        , config)
    return combineResponse(response?.data?.WaterConnection, properties?.data?.Properties, billData?.data?.Bill, workflowDetails?.data?.ProcessInstances, t);
};
export default useWaterConnectionSearch;