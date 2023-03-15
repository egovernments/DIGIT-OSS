import { useQuery, useQueryClient } from "react-query";

const useWSDocumentSearch = ({ application }, config = {}, Code, index) => {
  const client = useQueryClient();
  const tenantId = application?.tenantId || Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();
  const propertyId = application?.propertyId;
  let newDocs = [];
  config?.value?.documents ? config?.value?.documents?.documents.filter(doc => doc?.documentType === Code /* || doc?.documentType?.includes(Code.split(".")[1]) */).map((ob)=>{
    newDocs.push(ob);
  }) : config?.value.filter(doc => doc?.documentType === Code/* || doc?.documentType?.includes(Code.split(".")[1]) */).map((ob)=>{
    newDocs.push(ob);
  })
  const filesArray = newDocs.map((value) => value?.fileStoreId);
  const { isLoading, error, data } = useQuery([`ptDocuments-${propertyId}`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`ptDocuments-${propertyId}`, filesArray]) };
};

export default useWSDocumentSearch;
