import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS";
import { PTService } from "../../services/elements/PT";

const getDate = (epochdate) => {
  return ( epochdate ?
  new Date(epochdate).getDate() + "/" + (new Date(epochdate).getMonth() + 1) + "/" + new Date(epochdate).getFullYear().toString() : "NA")
  }
  
const getAddress = (address, t) => {
    return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
      address?.landmark ? `${address?.landmark}, ` : ""
    }${t(address?.locality.code)}, ${t(address?.city.code)},${t(address?.pincode) ? `${address.pincode}` : " "}`
} 
  
const combineResponse = (WaterConnections, properties, billData, t) => {
    if(WaterConnections && properties)
    return WaterConnections.map((app) => ({
      ConsumerNumber : app?.connectionNo,
      ConsumerName : app?.connectionHolders ? app?.connectionHolders.map((owner) => owner?.name).join(",") : properties.filter((prop) => prop.propertyId === app?.propertyId)[0]?.owners?.map((ow) => ow.name).join(","),
      Address: getAddress((properties.filter((prop) => prop.propertyId === app?.propertyId)[0]).address, t),
      AmountDue : billData ? (billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0].billDetails?.[0]?.amount ? billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0].billDetails?.[0]?.amount : "NA")  : "NA",
      DueDate : billData ? getDate(billData?.filter((bill) => bill?.consumerCode === app?.connectionNo)[0].billDetails?.[0]?.expiryDate) : "NA",
      }))
    else
    return undefined
}

const useSewarageSearch = ({tenantId, filters = {}, BusinessService="WS", t}, config = {}) => {
  const response = useQuery(['WS_SEARCH', tenantId, filters, BusinessService], async () => await WSService.search({tenantId, filters: { ...filters }, businessService:BusinessService})
  , config)
    let propertyids = "";
    let consumercodes = "";
    response?.data?.SewerageConnections?.forEach( item => {
      propertyids=propertyids+item?.propertyId+(",");
      consumercodes=consumercodes+item?.connectionNo+",";
  })
    let propertyfilter = { propertyIds : propertyids.substring(0, propertyids.length-1),}
    if(propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;
    config={enabled:propertyids!==""?true:false}
  const properties = useQuery(['WSP_SEARCH', tenantId, propertyfilter,BusinessService], async () => await PTService.search({ tenantId, filters:propertyfilter, auth:filters?.locality?false:true })
  , config)
  const billData = useQuery(['BILL_SEARCH', tenantId, consumercodes,BusinessService ], async () => await Digit.PaymentService.fetchBill(tenantId, {
    businessService: BusinessService,
    consumerCode: consumercodes.substring(0, propertyids.length-2),
  })
  , config)
  return combineResponse(response?.data?.SewerageConnections,properties?.data?.Properties,billData?.data?.Bill, t);


}

export default useSewarageSearch;