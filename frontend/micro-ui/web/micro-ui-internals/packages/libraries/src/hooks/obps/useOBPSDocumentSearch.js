import { useQuery, useQueryClient } from "react-query";

const useOBPSDocumentSearch = ({ application }, config = {}, Code, index, isNOC=false) => {
  const client = useQueryClient();
  const tenantId = application?.tenantId || Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();
  let newDocs = [];
  if(isNOC){
    config?.value?.nocDocuments ? config?.value?.nocDocuments?.nocDocuments.length>0 && config?.value?.nocDocuments?.nocDocuments.filter((ob) => ob?.documentType?.includes(Code)).map((ob) => {
      newDocs.push(ob);
    }) : config?.value.length>0 && config?.value.filter((ob) => ob?.documentType?.includes(Code)).map((ob) => {
      newDocs.push(ob);
    });
  }
  else{
    config?.value?.documents ? config?.value?.documents?.documents.filter(doc => doc?.documentType === Code /* || doc?.documentType?.includes(Code.split(".")[1]) */).map((ob)=>{
    newDocs.push(ob);
  }) : config?.value.filter(doc => doc?.documentType === Code/* || doc?.documentType?.includes(Code.split(".")[1]) */).map((ob)=>{
    newDocs.push(ob);
  })
}
  const filesArray = newDocs.map((value) => value?.fileStoreId);
  const { isLoading, error, data } = useQuery([`obpsDocuments-1`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`obpsDocuments-1`, filesArray]) };
};

export default useOBPSDocumentSearch;
