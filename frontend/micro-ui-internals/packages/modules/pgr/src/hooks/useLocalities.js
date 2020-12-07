import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const useLocalities = ({ city }) => {
  const { t } = useTranslation();
  let locality = [];
  const [localityList, setLocalityList] = useState(null);
  const [localities, setLocalities] = useState(null);
  const code = useSelector((state) => state.common.stateInfo.code);
  useEffect(async () => {
    let tenantId = `${code}.${city}`;
    let response = await Digit.LocationService.getLocalities({ tenantId: tenantId });
    let __localityList = [];
    if (response && response.TenantBoundary.length > 0) {
      __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
    }
    setLocalityList(__localityList);
  }, [city]);

  useEffect(() => {
    if (localityList) {
      const __localities = localityList;
      __localities.forEach((element) => {
        locality.push(t(element.code));
      });
      setLocalities(locality);
    }
  }, [localityList]);

  return localities;
};

export default useLocalities;
