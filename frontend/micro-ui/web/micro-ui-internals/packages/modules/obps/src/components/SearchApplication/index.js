import React, { Fragment, useCallback, useMemo, useEffect, useState, useReducer } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CloseSvg,
  SearchForm,
  Table,
  Card,
  SearchAction,
  PopUp,
  DetailsCard,
  Loader,
  Toast,
} from "@egovernments/digit-ui-react-components";
import { convertEpochToDateDMY } from "../../utils";
import SearchFormFieldsComponent from "./SearchFormFieldsComponent";
import useSearchApplicationTableConfig from "./useTableConfig";

const OBPSSearchApplication = ({ tenantId, t, onSubmit, data, error, searchData, isLoading, Count }) => {
  const [showToast, setShowToast] = useState(null);

  const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
    defaultValues: {
      applicationNo: "",
      mobileNumber: "",
      fromDate: "",
      toDate: "",
      status: "",
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      applicationType: {
        code: "BUILDING_PLAN_SCRUTINY",
        i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
      },
      serviceType: {
        applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
        code: "NEW_CONSTRUCTION",
        i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
      },
      ...searchData,
    },
  });
  console.log("adsdsdsd");

  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
  }, [register]);

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...searchData, isSubmitSuccessful: false });
    }
  }, [formState]);
  const columns = useSearchApplicationTableConfig({ t });

  const [currPage, setCurrPage] = useState(getValues("offset") / getValues("limit"));

  useEffect(() => {
    if (error !== "") {
      setShowToast({ key: true, label: error });
    }
  }, [error]);

  const fetchLastPage = () => {
    setValue("offset", Count && Math.ceil(Count / 10) * 10 - getValues("limit"));
    handleSubmit(onSubmit)();
  };

  const fetchFirstPage = () => {
    setValue("offset", 0);
    handleSubmit(onSubmit)();
  };

  const onSort = useCallback((args) => {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }

  useEffect(() => {
    setCurrPage(getValues("offset") / getValues("limit"));
  }, [getValues("offset"), getValues("limit")]);

  const isMobile = window.Digit.Utils.browser.isMobile();

  const searchFormFieldsComponentProps = { formState, Controller, register, control, t, reset, previousPage };

  const getRedirectionLink = (bService) => {
    let redirectBS = bService === "BPAREG" ? "search/application/stakeholder" : "search/application/bpa";
    return redirectBS;
  };
  const propsMobileInboxCards = useMemo(
    () =>
      data?.map((data) => ({
        [t("BPA_APPLICATION_NUMBER_LABEL")]: data.applicationNo,
        [t("BPA_COMMON_TABLE_COL_APP_DATE_LABEL")]: convertEpochToDateDMY(data.auditDetails?.createdTime) || "",
        [t("BPA_SEARCH_APPLICATION_TYPE_LABEL")]: data.additionalDetails?.applicationType
          ? t(`WF_BPA_${data.additionalDetails?.applicationType}`)
          : "-",
        [t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")]: data.additionalDetails?.serviceType ? t(data.additionalDetails?.serviceType) : "-",
        [t("BPA_CURRENT_OWNER_HEAD")]: data.landInfo?.owners.map((o) => o.name).join(",") || "",
        [t("BPA_STATUS_LABEL")]: data.state ? t(`WF_BPA_${data.state}`) : "NA",
      })),
    [data]
  );

  if (isMobile) {
    function activateModal(state, action) {
      switch (action.type) {
        case "set":
          return action.payload;
        case "remove":
          return false;
        default:
          console.warn("no such action defined");
      }
    }

    const [currentlyActiveMobileModal, setActiveMobileModal] = useReducer(activateModal, false);

    const closeMobilePopupModal = () => {
      setActiveMobileModal({ type: "remove" });
    };

    const MobilePopUpCloseButton = () => (
      <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
        <CloseSvg />
      </div>
    );

    const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }) => {
      const { closeMobilePopupModal } = props;
      switch (currentlyActiveMobileModal) {
        case "SearchFormComponent":
          return (
            <SearchForm {...props}>
              <MobilePopUpCloseButton />
              <div className="MobilePopupHeadingWrapper">
                <h2>{t("ES_COMMON_SEARCH")}:</h2>
              </div>
              <SearchFormFieldsComponent {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal }} />
              {/* <SearchField className="submit">
                        <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                        <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                    </SearchField> */}
            </SearchForm>
          );
        default:
          return <span></span>;
      }
    };

    const CurrentMobileModalComponent = useCallback(
      ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }) =>
        MobileComponentDirectory({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }),
      [currentlyActiveMobileModal]
    );

    if (isLoading) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        <div className="searchBox">
          <SearchAction
            text={t("ES_COMMON_SEARCH")}
            handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          />
          {/* {isInboxLoading ? <Loader /> : <FilterAction text={t("ES_COMMON_FILTER")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"FilterFormComponent"})}/>} */}
          {/* <SortAction text={t("ES_COMMON_SORT")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"SortComponent"})}/> */}
        </div>
        {currentlyActiveMobileModal ? (
          <PopUp>
            <CurrentMobileModalComponent
              onSubmit={(data) => {
                setActiveMobileModal({ type: "remove" });
                onSubmit(data);
              }}
              handleSubmit={handleSubmit}
              id="search-form"
              className="rm-mb form-field-flex-one inboxPopupMobileWrapper"
              {...{ searchFormFieldsComponentProps, currentlyActiveMobileModal, closeMobilePopupModal }}
            />
          </PopUp>
        ) : null}
        {data?.[0]?.display ? (
          <Card style={{ marginTop: 20 }}>
            {t(data?.[0]?.display)
              .split("\\n")
              .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                  {text}
                </p>
              ))}
          </Card>
        ) : (
          <DetailsCard
            {...{
              data: propsMobileInboxCards,
              isTwoDynamicPrefix: true,
              linkPrefix: `/digit-ui/employee/obps/`,
              getRedirectionLink: getRedirectionLink,
              serviceRequestIdKey: "applicationNo",
            }}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFormFieldsComponent {...searchFormFieldsComponentProps} />
      </SearchForm>
      {!isLoading && data?.[0]?.display ? (
        <Card style={{ marginTop: 20 }}>
          {t(data?.[0]?.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : !showToast ? (
        !isLoading ? (
          <Table
            t={t}
            data={data}
            columns={columns}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                  padding: "20px 18px",
                  fontSize: "16px",
                },
              };
            }}
            onPageSizeChange={onPageSizeChange}
            //currentPage={getValues("offset")/getValues("limit")}
            currentPage={currPage}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            totalRecords={Count}
            disableSort={false}
            onLastPage={fetchLastPage}
            onFirstPage={fetchFirstPage}
            sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
          />
        ) : (
          <Loader />
        )
      ) : (
        ""
      )}
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default OBPSSearchApplication;
