import React from "react";
import { useQuery } from "react-query";
import { WorkflowService } from "../../services/elements/WorkFlow";

const useTLWorkflowData = ({tenantId, filters, config={}}) => {
    return useQuery(["WORKFLOW_BY_GET_ALL_APPLICATION", tenantId, ...Object.keys(filters)?.map( e => filters?.[e] )], () => WorkflowService.getAllApplication(tenantId, filters),
    {
        ...config
    });
};


export default useTLWorkflowData
