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
  filter_data: `https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd`,
  FileStore: "/filestore/v1/files",

  FileFetch: "/filestore/v1/files/url",
  PGR_Create: `/pgr-services/v2/request/_create`,

  EmployeeSearch: "/egov-hrms/employees/_search",
};

export default Urls;
