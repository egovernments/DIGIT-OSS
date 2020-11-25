const Urls = {
  MDMS: `/egov-mdms-service/v1/_search`,
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,
  localization: `/localization/messages/v1/_search`,
  location: {
    localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality`,
  },
  pgr_search: `/pgr-services/v2/request/_search`,
  pgr_update: `/pgr-services/v2/request/_update`,
  FileStore: "/filestore/v1/files",
  FileFetch: "/filestore/v1/files/url",
};

export default Urls;
