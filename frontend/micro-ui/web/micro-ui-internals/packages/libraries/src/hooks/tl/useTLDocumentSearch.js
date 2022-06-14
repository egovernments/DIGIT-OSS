import { useQuery, useQueryClient } from "react-query";

const useTLDocumentSearch = (data1 = {}, config = {}) => {
  const client = useQueryClient();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();
  //const propertyId = property?.propertyId;
  //const filesArray = property?.documents?.map((value) => value?.fileStoreId);
  let filesArray = window.location.href.includes("/tl/tradelicence/application/") ?  data1?.value?.tradeLicenseDetail?.applicationDocuments.map(ob => ob?.fileStoreId) : [];
  if(data1?.value?.workflowDocs) filesArray = data1?.value?.workflowDocs?.map(ob => ob?.fileStoreId)
  if (data1?.value?.owners?.documents["OwnerPhotoProof"]?.fileStoreId) filesArray.push(data1.value.owners.documents["OwnerPhotoProof"].fileStoreId);
  if (data1?.value?.owners?.documents["ProofOfIdentity"]?.fileStoreId) filesArray.push(data1.value.owners.documents["ProofOfIdentity"].fileStoreId);
  if (data1?.value?.owners?.documents["ProofOfOwnership"]?.fileStoreId) filesArray.push(data1.value.owners.documents["ProofOfOwnership"].fileStoreId);
  // let filesArray = [
  //   data1.value.owners.documents["OwnerPhotoProof"].fileStoreId,
  //   data1.value.owners.documents["ProofOfIdentity"].fileStoreId,
  //   data1.value.owners.documents["ProofOfOwnership"].fileStoreId,
  // ];
  const { isLoading, error, data } = useQuery([`tlDocuments-${1}`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`tlDocuments-${1}`, filesArray]) };
};

export default useTLDocumentSearch;
