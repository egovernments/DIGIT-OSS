const ADMIN_CODE = ({ tenantId, hierarchyType }) => tenantId.replace(".", "_").toUpperCase() + "_" + hierarchyType.code;

const getLocalities = (tenantBoundry) => {
  console.log("tenantBoundry.boundary:", tenantBoundry.boundary);
  const adminCode = ADMIN_CODE(tenantBoundry);
  console.log("adminCode:", adminCode);
  return tenantBoundry.boundary.map((boundaryObj) => ({
    ...boundaryObj,
    i18nkey: adminCode + "_" + boundaryObj.code,
  }));
};

export const LocalityService = {
  get: (tenantBoundry) => getLocalities(tenantBoundry),
};
