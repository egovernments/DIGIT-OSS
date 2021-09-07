import { useQuery, useQueryClient } from "react-query";

const useTLDocumentSearch = (data1 = {}, config = {}) => {
  const client = useQueryClient();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenant = tenantId.split(".")[0];
  //const propertyId = property?.propertyId;
  //const filesArray = property?.documents?.map((value) => value?.fileStoreId);
  let filesArray = [
    data1.value.owners.documents["OwnerPhotoProof"].fileStoreId,
    data1.value.owners.documents["ProofOfIdentity"].fileStoreId,
    data1.value.owners.documents["ProofOfOwnership"].fileStoreId,
  ];
  const { isLoading, error, data } = useQuery([`tlDocuments-${1}`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`tlDocuments-${1}`, filesArray]) };
};

export default useTLDocumentSearch;
