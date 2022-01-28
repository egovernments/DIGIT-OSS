import React, { Fragment, useCallback, useMemo, useEffect, useState, useReducer } from "react";
import { useForm, FormProvider } from "react-hook-form";
import SearchFormFieldsComponent from "./SearchFormFieldsComponent";
import useSearchApplicationTableConfig from "./useTableConfig";
import SearchApplicationMobileView from "./SearchAtom/mobile";
import SearchApplicationDesktopView from "./SearchAtom/desktop";

const SearchApplication = ({ tenantId, t, onSubmit, data, error, isLoading, Count }) => {
  const [showToast, setShowToast] = useState(null);

  const methods = useForm({
    defaultValues: {
      // applicationNo: "",
      // mobileNumber: "",
      // fromDate: "",
      // toDate: "",
      // status: "",
      // offset: 0,
      // limit: 10,
      // sortBy: "commencementDate",
      // sortOrder: "DESC",
      // applicationType: {
      //   code: "BUILDING_PLAN_SCRUTINY",
      //   i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
      // },
      // serviceType: {
      //   applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
      //   code: "NEW_CONSTRUCTION",
      //   i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
      // },
    },
  });

  useEffect(() => {
    methods.register("offset", 0);
    methods.register("limit", 10);
    methods.register("sortBy", "commencementDate");
    methods.register("sortOrder", "DESC");
  }, [methods.register]);

  const columns = useSearchApplicationTableConfig();

  const isMobile = window.Digit.Utils.browser.isMobile();

  // const searchFormFieldsComponentProps = { t, previousPage };

  const getRedirectionLink = (bService) => {
    let redirectBS = bService === "BPAREG" ? "search/application/stakeholder" : "search/application/bpa";
    return redirectBS;
  };
  const propsMobileInboxCards = useMemo(
    () =>
      data?.map((data) => ({
        [t("NOC_APPLICATION_NUMBER_LABEL")]: data.applicationNo,
        [t("NOC_COMMON_TABLE_COL_APP_DATE_LABEL")]: Digit.DateUtils.ConvertEpochToDate(data.auditDetails?.createdTime) || "",
        [t("NOC_COMMON_TABLE_COL_APP_SOURCE_MODULE")]: data.additionalDetails?.serviceType ? t(`MODULE_data?.source`) : "-",
        [t("NOC_SOURCE_APPLICATION_NUMBER_LABEL")]: data?.sourceRefId || "-",
        [t("NOC_CURRENT_OWNER_HEAD")]: data.owners?.[0] || "-",
        [t("NOC_STATUS_LABEL")]: data.applicationStatus ? t(`WF_BPA_${data.applicationStatus}`) : "NA",
      })),
    [data]
  );

  if (isMobile) return <FormProvider {...methods}><SearchApplicationMobileView {...{SearchFormFieldsComponent, propsMobileInboxCards}} /></FormProvider>

  return <FormProvider {...methods}><SearchApplicationDesktopView {...{onSubmit, columns, SearchFormFieldsComponent, data, error, isLoading, Count}} /></FormProvider>
};

export default SearchApplication;
