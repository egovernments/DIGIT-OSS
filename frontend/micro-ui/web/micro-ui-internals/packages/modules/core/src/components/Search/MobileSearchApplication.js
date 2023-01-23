import {
  BackButton, CloseSvg, DetailsCard, DownloadBtnCommon, Header, Loader, PopUp, SearchAction, SearchForm
} from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import SearchFormFields from "./SearchFields";
// import { convertEpochToDateDMY } from "../../utils";

const MobileSearchApplication = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, isLoading }) => {
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
  const [tabledata, settabledata] = useState([]);
  const DownloadBtn = (props) => {
    return (
      <div onClick={props.onClick}>
        <DownloadBtnCommon />
      </div>
    );
  };
  const handleExcelDownload = (tabData) => {
    if (tabData?.[0] !== undefined) {
      return Digit.Download.Excel(tabData?.[0], "AuditReport");
    }
  };
  useEffect(() => {
    if (data?.length > 0) {
      settabledata([
        data?.map((obj) => {
          let returnObject = {};
          returnObject[t("AUDIT_DATE_LABEL")] = convertEpochToDate(obj?.timestamp);
          returnObject[t("AUDIT_TIME_LABEL")] = convertEpochToTimeInHours(obj?.timestamp);
          returnObject[t("AUDIT_DATAVIEWED_LABEL")] = obj?.dataView[0] + "," + obj?.dataView[1];
          returnObject[t("AUDIT_DATAVIEWED_BY_LABEL")] = obj?.dataViewedBy;
          returnObject[t("AUDIT_ROLE_LABEL")] = obj?.roles.map((obj) => obj.name).join(",");
          return {
            ...returnObject,
          };
        }),
      ]);
    }
  }, [data]);
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
  const convertEpochToTimeInHours = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let hour = dateFromApi.getHours();
    let min = dateFromApi.getMinutes();
    let period = hour > 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour > 9 ? "" : "0") + hour;
    min = (min > 9 ? "" : "0") + min;
    return `${hour}:${min} ${period}`;
  };
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
              <h2>{t("PRIVACY_AUDIT_REPORT")}:</h2>
            </div>
            <SearchFormFields {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal, tenantId, t }} />
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
  let roles = [];
  data?.roles?.forEach((item) => {
    roles.push(item?.name);
  });
  const propsMobileInboxCards = useMemo(() => {
    if (data?.display) {
      return [];
    }
    if (data === "") {
      return [];
    }
    return data?.map((data) => ({
      [t("AUDIT_DATE_LABEL")]: convertEpochToDate(data.timestamp),
      [t("AUDIT_TIME_LABEL")]: convertEpochToTimeInHours(data.timestamp),
      [t("AUDIT_DATAVIEWED_LABEL")]: data.dataView[0] + "," + data.dataView[1],
      [t("AUDIT_DATAVIEWED_BY_LABEL")]: data.dataViewedBy,
      [t("AUDIT_ROLE_LABEL")]: data.roles
        .slice(0, 3)
        ?.map((e) => e.name)
        .join(","),
    }));
  }, [data]);

  return (
    <React.Fragment>
      <BackButton />
      <div className="sideContent" style={{ marginLeft: "70%", marginTop: "-12%" }}>
        <DownloadBtn className="mrlg cursorPointer" onClick={() => handleExcelDownload(tabledata)} />
      </div>
      <Header>{t("PRIVACY_AUDIT_REPORT")}:</Header>
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
      {isLoading && <Loader />}
      <DetailsCard
        {...{
          data: propsMobileInboxCards,
        }}
      />
    </React.Fragment>
  );
};

export default MobileSearchApplication;
