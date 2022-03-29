import { Loader, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

const SearchWater = ({ path }) => {
  const [isBothCallsFinished, setIsBothCallFinished] = useState(true);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});
  const [setLoading, setLoadingState] = useState(false);
  const SWater = Digit.ComponentRegistryService.getComponent("WSSearchWaterConnection");
  const [businessServ, setBusinessServ] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const serviceConfig = {
    WATER: "WATER",
    SEWERAGE: "SEWERAGE",
  };

  const onSubmit = useCallback((_data) => {
    if (Object.keys(_data).filter((k) => _data[k] && typeof _data[k] !== "object").length > 4) {
      setPayload(
        Object.keys(_data)
          .filter((k) => _data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof _data[key] === "object" ? _data[key].code : _data[key] }), {})
      );
      setShowToast(null);
    } else {
      setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  });

  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };

  let result = Digit.Hooks.ws.useSearchWS({ tenantId, filters: payload, config, bussinessService: businessServ, t });

  result = result?.map((item) => {
    if (item?.connectionNo?.includes("WS")) {
      item.service = serviceConfig.WATER;
    } else if (item?.connectionNo?.includes("SW")) {
      item.service = serviceConfig.SEWERAGE;
    }
    return item;
  });

  return (
    <Fragment>
      <SWater
        t={t}
        tenantId={tenantId}
        onSubmit={onSubmit}
        data={result ? result : { display: "ES_COMMON_NO_DATA" }}
        count={result?.TotalCount}
        resultOk={isBothCallsFinished}
      />

      {showToast && (
        <Toast
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </Fragment>
  );
};

export default SearchWater;
