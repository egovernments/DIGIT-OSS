import { Header } from "@egovernments/digit-ui-react-components";
import React, { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Search = ({path}) => {
  const { variant } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});

  const SearchComponent = memo(Digit.ComponentRegistryService.getComponent("PropertySearchForm"));
  const SearchResultComponent = memo(Digit.ComponentRegistryService.getComponent("PropertySearchResults"));

  const onSubmit = useCallback((_data) => {
      console.log(_data,"submit");
    setPayload(
      Object.keys(_data)
        .filter((k) => _data[k])
        .reduce((acc, key) => ({ ...acc, [key]: typeof _data[key] === "object" ? _data[key].code : _data[key] }), {})
    );
  });
  console.log(payload,"payload rendered");
  return (
    <React.Fragment>
      <Header>{t("SEARCH_PROPERTY")}</Header>
      <SearchComponent t={t} tenantId={tenantId} onSubmit={onSubmit} />
      {Object.keys(payload).length > 0 && <SearchResultComponent t={t} tenantId={tenantId} payload={payload} />}
    </React.Fragment>
  );
}

export default Search