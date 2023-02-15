import React from "react";
import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS"

//while registering it's name is WSuseSearch
const useSearch = ({tenantId, filters, config={}}) => useQuery(
    ["WS_WATER_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] )],
    () => WSService.WSWatersearch({tenantId, filters}),
    {
        ...config
    }
 )


export default useSearch
