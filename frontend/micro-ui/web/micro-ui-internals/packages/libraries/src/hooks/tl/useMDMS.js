import React from "react"
import { useQuery } from "react-query"
import { MdmsService } from "../../services/elements/MDMS"

const useMDMS = {
    applicationTypes : (tenantId) => useQuery([tenantId, "TL_MDMS_APPLICATION_STATUS"], () => MdmsService.getDataByCriteria(tenantId, {
        details: {
                tenantId: tenantId,
                moduleDetails: [
                    {
                        moduleName: "TradeLicense",
                        masterDetails: [
                            {
                                name: "ApplicationType"
                            }
                        ]
                    }
                ]
        }
    }, "TL"), {
        select: (data) => data.TradeLicense.ApplicationType.map(type => ({code: type.code.split(".")[1], i18nKey: `TL_APPLICATIONTYPE.${type.code.split(".")[1]}` }))
    } ) 
}

export default useMDMS