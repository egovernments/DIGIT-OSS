import React, { Fragment, useCallback, useMemo, useReducer,useState } from "react";
import { Link } from "react-router-dom";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, DetailsCard, Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import SearchFormFields from "./SearchFields";
import CancelBillModal from "./CancelBillModal";

const MobileCancelBill = ({ Controller, register, control, t, reset, handleSubmit, tenantId, data, onSubmit,isLoading,resultOk }) => {
    const history = useHistory()
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

    const searchFormFieldsComponentProps = { Controller, register, control, t, reset };

    const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) => {
        const { closeMobilePopupModal } = props;
        switch (currentlyActiveMobileModal) {
            case "SearchFormComponent":
                return (
                    <SearchForm {...props}>
                        <MobilePopUpCloseButton />
                        <div className="MobilePopupHeadingWrapper">
                            <h2>{t("ABG_CANCEL_BILL")}:</h2>
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

    const [showModal, setShowModal] = useState(false)
    const handleCancelBillAction = (_data) => {
        setShowModal(false)
        const filters = {
            tenantId,
            consumerCodes: [currentBill?.consumerCode],
            businessService: currentBill?.businessService,
            statusToBeUpdated: "CANCELLED",
            additionalDetails: {
                reason: _data?.reason?.code,
                description: _data?.details || "",
                reasonMessage: t(_data?.reason?.message)
            }
        }
        //here do history.push to the response page and send filters there
        history.push("/digit-ui/employee/bills/response-cancelBill", { filters, currentBill });
        //call the cancel bill api from response page and show appropriate response
    }

    const [currentBill, setCurrentBill] = useState("")
    const handleCancelActionClick = (row) => {
        setShowModal(true)
        setCurrentBill(row)
    }

    const getActionItem = (row) => {
        return (
            <div>
                <span className="link">
                    <button onClick={() => { handleCancelActionClick(row) }}>
                        {t(`${"ABG_CANCEL_BILL"}`)}{" "}
                    </button>
                </span>
            </div>
        )
    };

    const handleBillLinkClick = (row) => {
        history.push(`/digit-ui/employee/bills/bill-details?connectionNumber=${row?.consumerCode}&tenantId=${tenantId}&service=${row?.businessService}`, row)
    }
    
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const getBillLink = (row) => {
        return (
            <div>
                <span className="link">
                    <button onClick={() => { handleBillLinkClick(row) }}>
                        {row?.["billNumber"] || "NA"}
                    </button>
                </span>
            </div>
        )
    }
    const propsMobileInboxCards = useMemo(() => {
        // if (data?.display) {
        //     return [];
        // }
        if(isLoading){
            return [];
        }
        return data?.map((row) => ({
            [t("ABG_BILL_NUMBER_LABEL")]: getBillLink(row) ,
            [t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]: row?.user?.name? t(`${row?.user?.name}`) : "NA",
            [t("ABG_COMMON_TABLE_COL_BILL_DATE")]: GetCell(convertEpochToDate(row?.billDate)),
            [t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]: GetCell(row?.totalAmount||"NA"),
            [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(row?.status || "NA"),
            [t("ABG_COMMON_TABLE_COL_ACTION")]: GetCell(getActionItem(row)),
        }));
    }, [data]);

    return (
        <React.Fragment>
            <div className="searchBox">
                <SearchAction
                    text={t("ABG_CANCEL_BILL")}
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
            {isLoading && <Loader/>}
            {!isLoading && resultOk && (
                <DetailsCard
                    {...{
                        handleSelect: (e)=>{},
                        handleDetailCardClick: (e)=> {},
                        data: propsMobileInboxCards,
                        serviceRequestIdKey: t("ABG_BILL_NUMBER_LABEL"),
                    }}
                />
            )}
            {showModal && <CancelBillModal
                t={t}
                //surveyTitle={surveyData.title}
                closeModal={() => setShowModal(false)}
                actionCancelLabel={"ABG_BACK"}
                actionCancelOnSubmit={() => setShowModal(false)}
                actionSaveLabel={"ABG_CANCEL_BILL"}
                actionSaveOnSubmit={handleCancelBillAction}
                onSubmit={handleCancelBillAction}
            >
            </CancelBillModal>}
        </React.Fragment>
    );
};

export default MobileCancelBill;
