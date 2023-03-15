import React from "react";
import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS"

//while registering it's name is WSuseSearch
const useSewSearch = ({tenantId, filters, config={}}) => useQuery(
    ["WS_SEW_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] )],
    () => WSService.WSSewsearch({tenantId, filters}),
    {
        ...config
    }
 )


export default useSewSearch
