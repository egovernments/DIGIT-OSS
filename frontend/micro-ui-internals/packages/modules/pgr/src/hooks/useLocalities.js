import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLocalities } from "../redux/actions";

const useLocalities = ({ city }) => {
  const [localityList, setLocalityList] = useState(null);
  const [localities, setLocalities] = useState(null);
  console.log("uselocalities", city);
  useEffect(async () => {
    let response = await Digit.LocationService.getLocalities({ tenantId: city });
    let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
    console.log("__localityList", __localityList);
    setLocalityList(__localityList);
  }, [city]);

  useEffect(() => {
    if (localityList) {
      const __localities = localityList;
      console.log("uselocalities++++++++++++", __localities);
      setLocalities(__localities);
    }
  }, [localityList]);

  return localities;
};

export default useLocalities;
