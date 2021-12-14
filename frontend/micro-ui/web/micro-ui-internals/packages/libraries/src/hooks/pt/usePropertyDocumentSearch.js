import { useQuery, useQueryClient } from "react-query";

const usePropertyDocumentSearch = ({ property }, config = {}) => {
  const client = useQueryClient();
  const tenantId = property?.tenantId || Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();
  const propertyId = property?.propertyId;
  const filesArray = property?.documents?.map((value) => value?.fileStoreId);
  const { isLoading, error, data } = useQuery([`ptDocuments-${propertyId}`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`ptDocuments-${propertyId}`, filesArray]) };
};

export default usePropertyDocumentSearch;
