const ADMIN_CODE = ({ tenantId, hierarchyType }) => tenantId.replace(".", "_").toUpperCase() + "_" + hierarchyType.code;

const getLocalities = (tenantBoundry) => {
  const adminCode = ADMIN_CODE(tenantBoundry);
  return tenantBoundry.boundary.map((boundaryObj) => ({
    ...boundaryObj,
    i18nkey: adminCode + "_" + boundaryObj.code,
  }));
};

export const LocalityService = {
  get: (tenantBoundry) => getLocalities(tenantBoundry),
};
