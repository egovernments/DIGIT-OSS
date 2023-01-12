import React, { Fragment, useCallback, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, DetailsCard, Loader, Toast } from "@egovernments/digit-ui-react-components";

import SearchFormFields from "./SearchFields";

const MobileSearchWater = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }) => {
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

  const searchFormFieldsComponentProps = { Controller, register, control, t, reset, previousPage };

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
            <SearchFormFields {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal, tenantId, t }} />
          </SearchForm>
        );
      default:
        return <span></span>;
    }
  };

  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };

  const CurrentMobileModalComponent = useCallback(
    ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) =>
      MobileComponentDirectory({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }),
    [currentlyActiveMobileModal]
  );

  const getActionItems = (status, data) => {
    switch (status) {
      case "Active":
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/employee/payment/collect/${data?.["service"] == "WATER" ? "WS" : "SW"}/${encodeURIComponent(
                    data?.["connectionNo"]
                  )}/${data?.["tenantId"]}?tenantId=${data?.["tenantId"]}&ISWSCON`,
                }}
              >
                {t(`${"WS_COMMON_COLLECT_LABEL"}`)}{" "}
              </Link>
            </span>
          </div>
        );
    }
  };
  const GetStatusLinkCell = (value) => {

    //let service = "WATER";
    return (
      <div>
        <span className="link">
          <Link
            to={`/digit-ui/employee/ws/connection-details?applicationNumber=${value?.connectionNo}&tenantId=${
              value?.tenantId
            }&service=${value?.service}&connectionType=${value?.connectionType}&due=${value?.due || 0}`}
          >
            {value?.connectionNo || "NA"}
          </Link>
        </span>
      </div>
    );
  };

  const propsMobileInboxCards = useMemo(() => {
    if (data?.display) {
      return [];
    }
    return data?.map((data) => ({
      [t("WS_MYCONNECTIONS_CONSUMER_NO")]: GetStatusLinkCell(data) || t(`${"WS_NA"}`),
      [t("WS_COMMON_TABLE_COL_SERVICE_LABEL")]: t(`WS_${data?.service}`),
      [t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL")]: data?.owner || t(`${"WS_NA"}`),
      [t("WS_COMMON_TABLE_COL_STATUS_LABEL")]: t(`WS_${data?.status?.toUpperCase()}`),
      [t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")]: data?.due || t(`${"WS_NA"}`),
      [t("WS_COMMON_TABLE_COL_ADDRESS")]: data?.address || t(`${"WS_NA"}`),
      [t("WS_COMMON_TABLE_COL_DUE_DATE_LABEL")]: data?.status?.toUpperCase() === "INACTIVE" ? t(`${"WS_NA"}`) : data?.dueDate ? convertEpochToDate(data?.dueDate) : t(`${"WS_NA"}`),
      [t("WS_COMMON_TABLE_COL_ACTION_LABEL")]: data?.due ? getActionItems(data?.status, data) : t(`${"WS_NA"}`),
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
            serviceRequestIdKey: t("WS_COMMON_TABLE_COL_APP_NO"),
          }}
        />
      )}
    </React.Fragment>
  );
};

export default MobileSearchWater;
