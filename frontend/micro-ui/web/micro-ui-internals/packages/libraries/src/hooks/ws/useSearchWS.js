import React,{useState} from "react";
import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS"
import { PTService } from "../../services/elements/PT";


const getAddress = (address, t) => {
  return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${t(address?.locality.code)}, ${t(address?.city.code)},${t(address?.pincode) ? `${address.pincode}` : " "}`
} 


const combineResponse = (WaterConnections,SewerageConnections, Properties, t) => {
    const data = WaterConnections?.concat(SewerageConnections)
    data?.map(row=> {
        Properties?.map(property => {
            if(row?.propertyId === property?.propertyId){
               row['owner'] = property?.owners[0]?.name
               row['address'] = getAddress(property?.address,t)
        }
        })
    })
    return data;
}


const useSearchWS = ({tenantId, filters, config={},bussinessService,t}) => {
    
    let responseSW=""
    let responseWS=""
    if(bussinessService==="WS"){
        responseWS =  useQuery(
        ["WS_WATER_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] ),bussinessService],
        async () => await WSService.WSWatersearch({tenantId, filters}),
        {
        ...config
        }
        )
    }
    //business service -> WS,SW,WSSW
    else if(bussinessService==="SW"){
        responseSW =  useQuery(
        ["WS_SEW_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] ),bussinessService],
        async () => await WSService.WSSewsearch({tenantId, filters}),
        {
        ...config
        }
        )
    }

    else {
        responseWS =  useQuery(
        ["WS_WATER_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] ),bussinessService],
        async () => await WSService.WSWatersearch({tenantId, filters}),
        {
        ...config
        }
        )

        responseSW =  useQuery(
        ["WS_SEW_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] ),bussinessService],
        async () => await WSService.WSSewsearch({tenantId, filters}),
        {
        ...config
        }
        )
    }

    let propertyids=""
    responseWS?.data?.WaterConnection?.forEach( item => {
        propertyids=propertyids+item?.propertyId+(",");  
    })

    responseSW?.data?.SewerageConnections?.forEach( item => {
        propertyids=propertyids+item?.propertyId+(",");
    })
    
     let propertyfilter = { propertyIds : propertyids.substring(0, propertyids.length-1),}
    
    
    const properties = useQuery(['WSP_SEARCH', tenantId, propertyfilter,bussinessService], async () => await PTService.search({ tenantId: tenantId , filters:propertyfilter, auth:true })
    , {
        ...config,
        enabled:!!(propertyids!=="")
    })

    //combining the result from all three api calls in combineResponse
    return (responseWS?.isLoading || responseSW?.isLoading || properties?.isLoading) ? undefined : combineResponse(responseWS?.data?.WaterConnection,responseSW?.data?.SewerageConnections,properties?.data?.Properties, t);

}


export default useSearchWS
