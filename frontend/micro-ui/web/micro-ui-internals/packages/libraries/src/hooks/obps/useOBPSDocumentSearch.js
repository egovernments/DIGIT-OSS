import { useQuery, useQueryClient } from "react-query";

const useOBPSDocumentSearch = ({ application }, config = {}, Code, index) => {
  const client = useQueryClient();
  const tenantId = application?.tenantId || Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();
  let newDocs = [];
  if(Code === "NOC"){
    newDocs.push(config?.value?.nocDocuments?.nocDocuments[index]);
  }
  else{
  config?.value?.documents?.documents.filter(doc => doc.documentType.includes(Code)).map((ob)=>{
    newDocs.push(ob);
  })
}
  const filesArray = newDocs.map((value) => value?.fileStoreId);
  const { isLoading, error, data } = useQuery([`obpsDocuments-1`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`obpsDocuments-1`, filesArray]) };
};

export default useOBPSDocumentSearch;
