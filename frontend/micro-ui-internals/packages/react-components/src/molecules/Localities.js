import React from "react";
import { Loader } from "../atoms/Loader";
import Dropdown from "../atoms/Dropdown";
import { useTranslation } from "react-i18next";

const Localities = ({ selectLocality, tenantId, boundaryType, keepNull, selected, optionCardStyles, style, disable, disableLoader }) => {
  // console.log("find localities here", tenantId)
  const { t } = useTranslation();

  const { data: tenantlocalties, isLoading } = Digit.Hooks.useBoundaryLocalities(tenantId, boundaryType, { enabled: !disable }, t);
  // console.log("find data here", tenantlocalties);
  if (isLoading && !disableLoader) {
    return <Loader />;
  }

  return (
    <Dropdown
      option={tenantlocalties}
      keepNull={keepNull === false ? false : true}
      selected={selected}
      select={selectLocality}
      optionCardStyles={optionCardStyles}
      optionKey="i18nkey"
      style={style}
      disable={!tenantlocalties?.length || disable}
    />
  );
  //  <h1>ABCD</h1>
};

export default Localities;
