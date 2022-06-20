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
// import { convertEpochToDateDMY } from "../../utils";

const MobileSearchApplication = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, setShowToast}) => {

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

  const searchFormFieldsComponentProps = { Controller, register, control, t, reset, previousPage , setShowToast};

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
        [t("ABG_COMMON_TABLE_COL_BILL_NO")]: GetCell(original?.billNumber),
        [t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]: GetCell(original?.payerName),
        [t("ABG_COMMON_TABLE_COL_BILL_EXP_DATE")]: GetDateCell(original?.billDate),
        [t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]: GetCell(original?.totalAmount),
        [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(original?.status),
        [t("ABG_COMMON_TABLE_COL_ACTION")]: GetActioncell(original),
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
    </React.Fragment>
  )
}

export default MobileSearchApplication