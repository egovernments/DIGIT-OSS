import React, { Fragment, useCallback, useMemo, useReducer } from "react";
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
import SearchFormFields from "./SearchFields";

const MobileSearchApplication = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, formState, setShowToast}) => {

  function activateModal(state, action) {
    switch (action.type) {
      case "set":
        return action.payload;
      case "remove":
        return false;
      default:
        break;    }
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

  const searchFormFieldsComponentProps = { Controller, register, control, t, reset, previousPage, formState, setShowToast };

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

  const propsMobileInboxCards = useMemo(
    () => {
      if (data?.display){
        return []
      }
      if(data === "")
      {
      return [];
      }
      return data?.map((data) => ({
        [t("PT_SEARCHPROPERTY_TABEL_PID")]: data?.propertyId,
        [t("PT_APPLICATION_NO_LABEL")]: data?.acknowldgementNumber || "-",
        [t("PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE")]: data?.creationReason || "",
        [t("PT_COMMON_TABLE_COL_OWNER_NAME")]: data?.owners?.map( o => o.name ). join(",") || "" ,
        [t("ES_SEARCH_PROPERTY_STATUS")]: t( data?.status &&`WF_PT_${data?.status}`|| "NA") || "",
        [t("PT_ADDRESS_LABEL")]: `${data?.address?.doorNo ? `${data?.address?.doorNo}, ` : ""} ${data?.address?.street ? `${data?.address?.street}, ` : ""}${
            data?.address?.landmark ? `${data?.address?.landmark}, ` : ""
          }${t(data?.address?.locality.code)}, ${t(data?.address?.city.code)} ${t(data?.address?.pincode) ? `${data?.address.pincode}` : " "}` || "NA",
      }))
    },
    [data]
  );

  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction
          text={t("ES_COMMON_SEARCH")}
          handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          {...{tenantId, t}} 
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
            linkPrefix: `/digit-ui/employee/pt/applicationsearch/application-details/`,
            serviceRequestIdKey: t("PT_SEARCHPROPERTY_TABEL_PID"),
          }}
        />
      )}
    </React.Fragment>
  )
}

export default MobileSearchApplication