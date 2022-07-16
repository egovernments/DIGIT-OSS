import { useQuery } from "react-query";

const useDisconnectionWorkflow = ({ tenantId }) => {

  const { isLoading, error, isError, data } = useQuery(
    ["disconnectWorkFlowDetails", tenantId],
    () => Digit.WorkflowService.init(tenantId, "DisconnectWSConnection"),
    {select: (data) => {
        return{
            slaDays: data?.BusinessServices[0]?.businessServiceSla / (1000 * 60 * 60 * 24)
        } 
    }} );


  return { isLoading, error, isError, data };
};

export default useDisconnectionWorkflow;
