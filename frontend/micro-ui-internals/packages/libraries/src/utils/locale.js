export const getLocalityCode = (locality, tenantId) => {
  return locality.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_ADMIN_${locality}`;
};
