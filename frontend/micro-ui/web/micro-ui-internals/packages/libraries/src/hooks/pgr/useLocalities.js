import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useLocalities = ({ city }) => {
  const { t } = useTranslation();
  let locality = [];
  const [localityList, setLocalityList] = useState(null);
  const [localities, setLocalities] = useState(null);
  useEffect(() => {
    (async () => {
      let tenantId = Digit.ULBService.getCurrentTenantId();
      let response = await Digit.LocationService.getLocalities(tenantId);
      let __localityList = [];
      if (response && response.TenantBoundary.length > 0) {
        __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      }
      setLocalityList(__localityList);
    })();
  }, [city]);

  useEffect(() => {
    if (localityList) {
      const __localities = localityList;
      __localities.forEach((element) => {
        locality.push({ name: t(element.code), code: element.code });
      });
      setLocalities(locality);
    }
  }, [localityList]);

  return localities;
};

export default useLocalities;
