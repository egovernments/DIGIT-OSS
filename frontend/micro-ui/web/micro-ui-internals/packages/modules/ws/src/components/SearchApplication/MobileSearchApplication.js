import React, { Fragment, useCallback, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, DetailsCard, Loader, Toast } from "@egovernments/digit-ui-react-components";
import SearchFormFields from "./SearchFields";

const MobileSearchApplication = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, businessService }) => {
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

  const searchFormFieldsComponentProps = { Controller, register, control, t, reset, previousPage, businessService };
  const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) => {
    const { closeMobilePopupModal } = props;
    switch (currentlyActiveMobileModal) {
      case "SearchFormComponent":
        return (
          <SearchForm {...props}>
            <MobilePopUpCloseButton />
            <div className="MobilePopupHeadingWrapper">
              <h2>{t("ES_COMMON_SEARCH")}:</h2>
            </div>
            <SearchFormFields {...searchFormFieldsComponentProps } {...{ closeMobilePopupModal, tenantId, t }} />
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
    ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) =>
      MobileComponentDirectory({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }),
    [currentlyActiveMobileModal]
  );
  const replaceUnderscore = (str) => {
    str = str.replace(/_/g, " ");
    return str;
  };

  const propsMobileInboxCards = useMemo(() => {
    if (data?.display) {
      return [];
    }

    const getWaterSewerageData = (data) => {
      if (
        data?.applicationType == "NEW_WATER_CONNECTION" || 
        data?.applicationType == "MODIFY_WATER_CONNECTION" ||
        data?.applicationType == "DISCONNECT_WATER_CONNECTION"
      ) {
        return "WATER"
      } else if (
        data?.applicationType == "NEW_SEWERAGE_CONNECTION" ||
        data?.applicationType == "MODIFY_SEWERAGE_CONNECTION" || 
        data?.applicationType == "DISCONNECT_SEWERAGE_CONNECTION"
      ) {
        return "SEWERAGE"
      }
    }

    const getFlowUrls = (applicationType) => {
      let application = "application";
      if (applicationType?.toUpperCase()?.includes("DISCONNECT")) {
        application = "disconnection"
      } else if (applicationType?.toUpperCase()?.includes("MODIFY")) {
        application = "modify"
      }
      return application;
    }

    return data?.map((data) => ({
      [t("WS_MYCONNECTIONS_CONSUMER_NO")]: /*data?.connectionNo || "NA",*/data?.connectionNo ? (
        <div>
          <span className="link">
            <Link
              to={`/digit-ui/employee/ws/connection-details?applicationNumber=${data?.connectionNo}&tenantId=${tenantId}&service=${
                getWaterSewerageData(data)
              }`}
            >
              {data?.connectionNo}
            </Link>
          </span>
        </div>
      ) : t("CS_NA"),
      //[t("WS_ACK_COMMON_APP_NO_LABEL")]: data?.applicationNo || "-",
      [t("WS_ACK_COMMON_APP_NO_LABEL")]: (
        <div>
          <span className="link">
            <Link
              to={`/digit-ui/employee/ws/${getFlowUrls(data?.applicationType)}-details?applicationNumber=${data?.applicationNo}&tenantId=${tenantId}&service=${
                getWaterSewerageData(data)
              }`}
            >
              {data?.applicationNo}
            </Link>
          </span>
        </div>
      ),
      [t("WS_APPLICATION_TYPE_LABEL")]: data?.applicationType ? replaceUnderscore(data.applicationType) : "-",
      [t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL")]: data?.ownerNames || "-",
      [t("WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL")]: t(data?.applicationStatus || "NA"),
      [t("WS_COMMON_TABLE_COL_ADDRESS")]: data?.address || "-",
      // [t("TL_LOCALIZATION_TRADE_OWNER_NAME")]: data?.tradeLicenseDetail?.owners?.map( o => o.name ). join(",") || "" ,
    }));
  }, [data]);

  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction
          text={t("ES_COMMON_SEARCH")}
          handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          {...{ tenantId, t }}
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
            {...{ searchFormFieldsComponentProps, currentlyActiveMobileModal, closeMobilePopupModal, tenantId }}
          />
        </PopUp>
      ) : null}
      {data?.display ? (
        <Card style={{ marginTop: 20 }}>
          {t(data?.display)
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
            //linkPrefix: `/digit-ui/employee/ws/application-details/`,
            serviceRequestIdKey: t("WS_COMMON_TABLE_COL_APP_NO"),
          }}
        />
      )}
    </React.Fragment>
  );
};

export default MobileSearchApplication;
