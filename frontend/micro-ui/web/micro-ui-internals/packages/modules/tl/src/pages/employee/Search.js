import React, { useEffect, useState } from "react";
import {
  TextInput,
  Label,
  SubmitBar,
  LinkLabel,
  ActionBar,
  CloseSvg,
  DatePicker,
  CardLabelError,
  SearchForm,
  SearchField,
  Dropdown,
} from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Search = ({ path }) => {
  const { variant } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [payload, setPayload] = useState({});

  const Search = Digit.ComponentRegistryService.getComponent(variant === "license" ? "SearchLicense" : "SearchApplication");

  function onSubmit(_data) {
    Digit.SessionStorage.set("SEARCH_APPLICATION_DETAIL", {
      applicationNumber: _data?.applicationNumber,
      licenseNumbers: _data?.licenseNumbers,
      applicationType: _data?.applicationType,
      tradeName: _data?.tradeName,
      fromDate: _data?.fromDate,
      toDate: _data?.toDate,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      status: _data.status,
    });
    var fromDate = new Date(_data?.fromDate);
    fromDate?.setSeconds(fromDate?.getSeconds() - 19800);
    var toDate = new Date(_data?.toDate);
    toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800);
    const data = {
      ..._data,
      ...(_data.toDate ? { toDate: toDate?.getTime() } : {}),
      ...(_data.fromDate ? { fromDate: fromDate?.getTime() } : {}),
    };

    setPayload(
      Object.keys(data)
        .filter((k) => data[k])
        .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
    );
  }
  useEffect(() => {
    const storedPayload = Digit.SessionStorage.get("SEARCH_APPLICATION_DETAIL") || {};
    if (storedPayload) {
      var fromDate = new Date(storedPayload?.fromDate);
      fromDate?.setSeconds(fromDate?.getSeconds() - 19800);
      var toDate = new Date(storedPayload?.toDate);
      toDate?.setSeconds(toDate?.getSeconds() + 86399 - 19800);
      const data = {
        ...storedPayload,
        ...(storedPayload.toDate ? { toDate: toDate?.getTime() } : {}),
        ...(storedPayload.fromDate ? { fromDate: fromDate?.getTime() } : {}),
      };

      setPayload(
        Object.keys(data)
          .filter((k) => data[k])
          .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {})
      );
    }
  }, []);
  const config = {
    enabled: !!(payload && Object.keys(payload).length > 0),
  };

  const { data: { Licenses: searchReult, Count: count } = {}, isLoading, isSuccess } = Digit.Hooks.tl.useSearch({
    tenantId,
    filters: payload,
    config,
  });

  const workFlowConfig = {
    enabled: (payload && Object.keys(payload).length > 0 && !isLoading && isSuccess),
  };

  const { data: { ProcessInstances: assigneeResults } = {} , isLoading: isWorkflowLoading, isSuccess: isWorkflowSuccess } = Digit.Hooks.tl.useTLWorkflowData({
    tenantId,
    filters: { businessIds: searchReult?.map((license) => license?.applicationNumber).join(",")},
    config: { ...workFlowConfig }
  });

  return (
    <Search
      t={t}
      tenantId={tenantId}
      onSubmit={onSubmit}
      data={!isLoading && isSuccess && !isWorkflowLoading && isWorkflowSuccess ? (searchReult?.length > 0
         ? searchReult.map((obj) => ({
        ...obj,
        CurrentOwners: assigneeResults?.length > 0 ? assigneeResults.filter((elem) => elem.businessId === obj.applicationNumber).map((item) => ({
          currentOwner: item.assignes !== null && item.assignes[0].name !== null ?  item.assignes[0].name : "NA"
        }))
        : {
            currentOwner: "NA"
          }
      })) : { display: "ES_COMMON_NO_DATA" }) : ""}
      count={count}
    />
  );
};

export default Search;
