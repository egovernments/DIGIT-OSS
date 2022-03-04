import React, { Fragment, useCallback, useMemo, useEffect, useState, useReducer } from "react";
import { useFormContext } from "react-hook-form";
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
import { useTranslation } from "react-i18next";

const SearchApplicationMobileView = ({ SearchFormFieldsComponent, propsMobileInboxCards, isLoading, data, getRedirectionLink, onSubmit }) => {
    const { t } = useTranslation();
    const { handleSubmit, setValue, getValues } = useFormContext();

    // const {} = useFormContext()

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

    const MobileComponentDirectory = ({ currentlyActiveMobileModal, ...props }) => {
        const { closeMobilePopupModal } = props;
        switch (currentlyActiveMobileModal) {
        case "SearchFormComponent":
            return (
            <SearchForm {...props}>
                <MobilePopUpCloseButton />
                <div className="MobilePopupHeadingWrapper">
                <h2>{t("ACTION_TEST_SEARCH_NOC_APPLICATION")}:</h2>
                </div>
                <SearchFormFieldsComponent onSubmit={onSubmit} handleSubmit={handleSubmit} isMobileView={true} {...{ closeMobilePopupModal }} />
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
        ({ currentlyActiveMobileModal, ...props }) =>
        MobileComponentDirectory({ currentlyActiveMobileModal, ...props }),
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
                {...{ currentlyActiveMobileModal, closeMobilePopupModal }}
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
                isTwoDynamicPrefix: false,
                linkPrefix: `/digit-ui/employee/noc/search/application-overview/`,
                serviceRequestIdKey: t("NOC_APP_NO_LABEL"),
            }}
            />
        )}
        </React.Fragment>
    );
}

export default SearchApplicationMobileView