import { useQuery, useQueryClient } from "react-query";
import _ from "lodash";
import { WSService } from "../../services/elements/WS";
import { PTService } from "../../services/elements/PT";

const getDate = (epochdate) => {
  return ( epochdate ?
  new Date(epochdate).getDate() + "/" + (new Date(epochdate).getMonth() + 1) + "/" + new Date(epochdate).getFullYear().toString() : "NA")
  }

const getBillingPeriod = (fromPeriod, toPeriod) => {
  let from = new Date(fromPeriod).getFullYear().toString();
  let to = new Date(toPeriod).getFullYear().toString();
  return fromPeriod && toPeriod ? "FY " + from + "-" + to : "NA";
}
  
const getAddress = (address, t) => {
    return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
      address?.landmark ? `${address?.landmark}, ` : ""
    }${ address?.locality?.code ?  t(`TENANTS_MOHALLA_${address?.locality?.code}`) : ""}${ address?.city?.code ?  `, ${t(address?.city?.code)}` : ""}${address?.pincode ? `, ${address.pincode}` : " "}`
} 
  
const combineResponse = (SewerageConnections, properties, billData, t) => {
    if(SewerageConnections && properties)
    return SewerageConnections.map((app) => ({
      ConsumerNumber : app ? app?.connectionNo : "",
      ConsumerName : app ? (app?.connectionHolders ? app?.connectionHolders.map((owner) => owner?.name).join(",") : properties.filter((prop) => prop.propertyId === app?.propertyId)[0]?.owners?.map((ow) => ow.name).join(",")) : "",
      Address: getAddress((properties.filter((prop) => prop.propertyId === app?.propertyId)?.[0])?.address, t),
      AmountDue : billData ? (billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.totalAmount ? billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.totalAmount : "0")  : "0",
      DueDate : billData ? getDate(billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.billDetails?.[0]?.expiryDate) : "NA",
      BillingPeriod : billData ?  getBillingPeriod(billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.billDetails?.[0]?.fromPeriod , billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.billDetails?.[0]?.toPeriod) : "NA",
      ServiceName: billData ?  (billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0]?.businessService) : "NA",
      privacy: {
        Address : {
          uuid: properties.filter((prop) => prop.propertyId === app?.propertyId)[0]?.owners?.[0]?.uuid, 
          fieldName: ["doorNo" , "street" , "landmark"], 
          model: "Property",showValue: true,
          loadData: {
            serviceName: "/property-services/property/_search",
            requestBody: {},
            requestParam: { tenantId : app?.tenantId, propertyIds : app?.propertyId },
            jsonPath: "Properties[0].address.street",
            isArray: false,
            d: (res) => {
              let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
              return resultString;
            }
          },
        }
      }
      }))
    else
    return []
}

const useMyBillsSewarageSearch = ({tenantId, filters = {}, BusinessService="WS", t }, config = {}) => {
  const client = useQueryClient();
  const { isLoading, error, data, isSuccess } = useQuery(['WS_SEARCH', tenantId, filters, BusinessService, config], async () => await WSService.search({tenantId, filters: { ...filters }, businessService:BusinessService})
  , config)
    let propertyids = "";
    let consumercodes = "";
    data?.SewerageConnections?.forEach( item => {
      propertyids=propertyids+item?.propertyId+(",");
      consumercodes=consumercodes+item?.connectionNo+",";
  })
    let propertyfilter = { propertyIds : propertyids.substring(0, propertyids.length-1),}
    if(propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;
    config={...config, enabled:propertyids!==""?true:false}
  const { isLoading : isPropertyLoading, error : isPropertyError, data: propertyData , isSuccess : isPropertySuccess } = useQuery(['WSP_SEARCH', tenantId, propertyfilter,BusinessService,config], async () => await PTService.search({ tenantId: null , filters:propertyfilter, auth:filters?.locality?false:true })
  , config)
  const { isLoading : isBillLoading, error : isBillError, data: bill , isSuccess : isBillSuccess } = useQuery(['BILL_SEARCH', tenantId, consumercodes,BusinessService, config ], async () => await Digit.PaymentService.fetchBill(tenantId, {
    businessService: BusinessService,
    consumerCode: consumercodes.substring(0, consumercodes.length-1),
  })
  , config)

  const response = {
    isLoading, 
    error,
    data,
    isSuccess,
    revalidate: () => client.invalidateQueries(["WS_SEARCH", tenantId, filters, BusinessService]),
  } ;

  const properties =  {
    isPropertyLoading, 
    isPropertyError,
    propertyData,
    isPropertySuccess,
    revalidate: () => client.invalidateQueries(["WSP_SEARCH", tenantId, propertyfilter,BusinessService]),
  } ;

  const billData = {
    isBillLoading, 
    isBillError,
    bill,
    isBillSuccess,
    revalidate: () => client.invalidateQueries(["BILL_SEARCH", tenantId, consumercodes,BusinessService]),
  } ;

  return (response?.isLoading || properties?.isPropertyLoading || billData?.isBillLoading) ? undefined : (billData?.bill?.Bill?.length === 0 || billData?.bill?.Bill === undefined ? [] : combineResponse(response?.data?.SewerageConnections,properties?.propertyData?.Properties,billData?.bill?.Bill, t));


}

export default useMyBillsSewarageSearch;