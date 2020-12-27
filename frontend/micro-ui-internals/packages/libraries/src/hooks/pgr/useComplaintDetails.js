import { useQuery, useQueryClient } from "react-query";

// TODO: move to service
const getThumbnails = async (ids, tenantId) => {
  const res = await Digit.UploadServices.Filefetch(ids, tenantId);
  if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
    return res.data.fileStoreIds.map((o) => o.url.split(",")[3]);
  } else {
    return null;
  }
};

const getDetailsRow = ({ id, service }) => ({
  CS_COMPLAINT_DETAILS_COMPLAINT_NO: id,
  CS_COMPLAINT_DETAILS_APPLICATION_STATUS: `CS_COMMON_${service.applicationStatus}`,
  CS_ADDCOMPLAINT_COMPLAINT_TYPE: `SERVICEDEFS.${service.serviceCode.toUpperCase()}`,
  CS_COMPLAINT_FILED_DATE: Digit.DateUtils.ConvertTimestampToDate(service.auditDetails.createdTime),
  ES_CREATECOMPLAINT_ADDRESS: [
    service.address.landmark,
    service.address.locality.code.includes("_")
      ? service.address.locality.code.toUpperCase()
      : `PB_${service.address.city.toUpperCase()}_ADMIN_${service.address.locality.code}`,
    service.address.city,
  ],
});

const isEmptyOrNull = (obj) => obj === undefined || obj === null || Object.keys(obj).length === 0;

const transformDetails = ({ id, service, workflow, thumbnails }) => {
  const { Customizations, SessionStorage } = window.Digit;
  const role = (SessionStorage.get("user_type") || "CITIZEN").toUpperCase();
  const customDetails = Customizations?.PGR?.getComplaintDetailsTableRows
    ? Customizations.PGR.getComplaintDetailsTableRows({ id, service, role })
    : {};
  return {
    details: !isEmptyOrNull(customDetails) ? customDetails : getDetailsRow({ id, service }),
    thumbnails: thumbnails,
    workflow: workflow,
    service,
    audit: {
      citizen: service.citizen,
      details: service.auditDetails,
      source: service.source,
      rating: service.rating,
      serviceCode: service.serviceCode,
    },
    service: service,
  };
};

const fetchComplaintDetails = async (tenantId, id) => {
  var serviceDefs = await Digit.MDMSService.getServiceDefs(tenantId, "PGR");
  const { service, workflow } = (await Digit.PGRService.search(tenantId, { serviceRequestId: id })).ServiceWrappers[0] || {};
  Digit.SessionStorage.set("complaintDetails", { service, workflow });
  if (service && workflow && serviceDefs) {
    const ids = workflow.verificationDocuments
      ? workflow.verificationDocuments.filter((doc) => doc.documentType === "PHOTO").map((photo) => photo.fileStoreId || photo.id)
      : null;
    const thumbnails = ids ? await getThumbnails(ids, tenantId) : null;
    const details = transformDetails({ id, service, workflow, thumbnails });
    return details;
  } else {
    console.log("error fetching complaint details or service defs");
    return {};
  }
};

const useComplaintDetails = ({ tenantId, id }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(["complaintDetails", tenantId, id], () => fetchComplaintDetails(tenantId, id));
  return { isLoading, error, complaintDetails: data, revalidate: () => queryClient.invalidateQueries(["complaintDetails", tenantId, id]) };
};

export default useComplaintDetails;
