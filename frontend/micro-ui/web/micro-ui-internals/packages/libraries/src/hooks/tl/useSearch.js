import React from "react";
import { useQuery } from "react-query";
import { TLService } from "../../services/elements/TL"

const useSearch = ({tenantId, filters, config={}}) => useQuery(
    ["TL_SEARCH", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] )],
    () => TLService.TLsearch({tenantId, filters}),
    {
        // select: (data) => data.Licenses,
        ...config
    }
 )


export default useSearch
