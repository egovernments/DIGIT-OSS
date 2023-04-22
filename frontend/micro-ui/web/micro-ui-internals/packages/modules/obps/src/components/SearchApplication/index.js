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
  Header
} from "@egovernments/digit-ui-react-components";
import { convertEpochToDateDMY } from "../../utils";
import SearchFormFieldsComponent from "./SearchFormFieldsComponent";
import useSearchApplicationTableConfig from "./useTableConfig";

const OBPSSearchApplication = ({ tenantId, t, onSubmit, data, error, searchData, isLoading, Count, setparamerror }) => {
  const [showToast, setShowToast] = useState(null);
  // const currentUserPhoneNumber = Digit.UserService.getUser()?.info?.mobileNumber;
  // const userInformation = Digit.UserService.getUser()?.info;

  const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
  const userInfo = userInfos ? JSON.parse(userInfos) : {};
  const userInformation = userInfo?.value?.info;
  const currentUserPhoneNumber = userInfo?.value?.info?.mobileNumber;

  const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
    defaultValues: {
      applicationNo: "",
      mobileNumber: window.location.href.includes("/search/obps-application") ? currentUserPhoneNumber : "",
      // mobileNumber: "",
      fromDate: "",
      toDate: "",
      status: "",
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      applicationType: userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length <= 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length > 0 ? {
        code: "BUILDING_PLAN_SCRUTINY",
        i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
      } : userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length <= 0 ? {
        code: "BPA_STAKEHOLDER_REGISTRATION",
        i18nKey: "WF_BPA_BPA_STAKEHOLDER_REGISTRATION",
      } : {
        code: "BUILDING_PLAN_SCRUTINY",
        i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
      },
      serviceType: userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length <= 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length > 0 ? {
        applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
        code: "NEW_CONSTRUCTION",
        i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
      } : userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("CITIZEN"))).length <= 0 ? /* {
        code: "BPA_STAKEHOLDER_REGISTRATION",
        applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
        roles: ["BPAREG_APPROVER","BPAREG_DOC_VERIFIER"],
        i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION"
      } */ "": {
        applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
        code: "NEW_CONSTRUCTION",
        i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
      },
      ...searchData,
    },
  });

  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
  }, [register]);

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      //reset({ ...searchData, isSubmitSuccessful: false });
      reset({
        applicationNo: "",
        // mobileNumber: "",
       mobileNumber: window.location.href.includes("/search/obps-application") ? Digit.UserService.getUser()?.info?.mobileNumber : "",
        fromDate: "",
        toDate: "",
        status: "",
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC",
        applicationType: userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length <= 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("citizen"))).length > 0 ? {
          code: "BUILDING_PLAN_SCRUTINY",
          i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
        } : userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("citizen"))).length <= 0 ? {
          code: "BPA_STAKEHOLDER_REGISTRATION",
          i18nKey: "WF_BPA_BPA_STAKEHOLDER_REGISTRATION",
        } : {
          code: "BUILDING_PLAN_SCRUTINY",
          i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
        },
        serviceType: userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length <= 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("citizen"))).length > 0 ? {
          applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
          code: "NEW_CONSTRUCTION",
          i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
        } : userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_") || ob.code.includes("citizen"))).length <= 0 ? /* {
          code: "BPA_STAKEHOLDER_REGISTRATION",
          applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
          roles: ["BPAREG_APPROVER","BPAREG_DOC_VERIFIER"],
          i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION"
        } */ "" : {
          applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
          code: "NEW_CONSTRUCTION",
          i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
        },
        ...searchData,
        isSubmitSuccessful: false,
      })
    }
  }, [formState]);
  const columns = useSearchApplicationTableConfig({ t });

  const [currPage, setCurrPage] = useState(getValues("offset") / getValues("limit"));

  useEffect(() => {
    if (error !== "") {
      setparamerror("")
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
    if(!(getValues("offset") == undefined || getValues("limit") == undefined))
    setCurrPage(getValues("offset") / getValues("limit"));
  }, [getValues("offset"), getValues("limit")]);

  const isMobile = window.Digit.Utils.browser.isMobile();

  const searchFormFieldsComponentProps = { formState, Controller, register, control, t, reset, previousPage };

  const getRedirectionLink = (bService) => {
    const businessService = data?.[0]?.businessService == "BPAREG" ?  "BPAREG" : bService;
    let redirectBS = businessService === "BPAREG" ? "search/application/stakeholder" : "search/application/bpa";
    if (window.location.href.includes("/citizen")) {
      redirectBS = businessService === "BPAREG"?"stakeholder":"bpa";
    }
    return redirectBS;
  };
  const propsMobileInboxCards = useMemo(
    () =>
      data?.map((data) => {
        return {
          [t("BPA_APPLICATION_NUMBER_LABEL")]: data.applicationNo || data.applicationNumber,
          [t("BPA_COMMON_TABLE_COL_APP_DATE_LABEL")]: convertEpochToDateDMY(data.auditDetails?.createdTime) || "",
          [t("BPA_SEARCH_APPLICATION_TYPE_LABEL")]: data?.additionalDetails?.applicationType ? t(`WF_BPA_${data?.additionalDetails?.applicationType}`) : data?.businessService ? t(`BPA_APPLICATIONTYPE_${data?.businessService}`) : t("CS_NA"),
          [t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")]: t(data.additionalDetails?.serviceType || t(`TRADELICENSE_TRADETYPE_${data?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split(".")[0]}`) || t("CS_NA")),
          [t("BPA_CURRENT_OWNER_HEAD")]: data?.assignee || t("CS_NA"),//data.landInfo?.owners.map((o) => o.name).join(",") || "-",
          [t("BPA_STATUS_LABEL")]: t(data?.state&&`WF_BPA_${data.state}` || data?.state&&`WF_BPA_${data.status}`|| t("CS_NA"))
        }
      }),
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
          break;
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
            <>
            <SearchForm {...props}>
              <MobilePopUpCloseButton />
              <div className="MobilePopupHeadingWrapper">
                <h2>{t("ES_COMMON_SEARCH_APPLICATION")}:</h2>
              </div>
                {
                  window.location.href.includes("citizen/obps/search/application") &&
                  <div style={{ background: "#ffffff", padding: "20px 0px", color: "#00000099" }}>
                    <label>{t("BPA_SEARCH_CREATED_BY_STAKEHOLDER_LABEL")}</label>
                  </div>
                }
              <SearchFormFieldsComponent {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal }} />
              {/* <SearchField className="submit">
                        <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                        <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                    </SearchField> */}
            </SearchForm>
            </>
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
            text={t("ES_COMMON_SEARCH_APPLICATION")}
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
              linkPrefix: window.location.href.includes("/citizen") ? `/digit-ui/citizen/obps/` : `/digit-ui/employee/obps/`,
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
      <Header>{t("ES_COMMON_SEARCH_APPLICATION")}</Header>
      {
        window.location.href.includes("citizen/obps/search/application") && 
        <div style={{background: "#ffffff", paddingLeft: "25px", paddingTop: "10px", color: "#00000099"}}>
          <label>{t("BPA_SEARCH_CREATED_BY_STAKEHOLDER_LABEL")}</label>
        </div>
      }
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
          warning={showToast.label == "BPA_ADD_MORE_PARAM_STAKEHOLDER" ? true : false}
          error={showToast.label == "BPA_ADD_MORE_PARAM_STAKEHOLDER" ? false : showToast.key}
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
