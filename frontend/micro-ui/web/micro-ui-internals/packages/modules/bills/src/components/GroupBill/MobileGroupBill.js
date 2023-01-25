import React, { Fragment, useCallback, useMemo, useReducer,useState } from "react";
import { Link } from "react-router-dom";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, DetailsCard, Loader, Toast, MultiLink } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import SearchFormFields from "./SearchFields";
import { getBillNumber } from "../../utils";

const MobileGroupBill = ({ Controller, register, control, t, reset, handleSubmit, tenantId, data, onSubmit,isLoading,resultOk,serviceType,locality,tenantlocalties }) => {
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

    const searchFormFieldsComponentProps = { Controller, register, control, t, reset,tenantlocalties };

    const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) => {
        const { closeMobilePopupModal } = props;
        switch (currentlyActiveMobileModal) {
            case "SearchFormComponent":
                return (
                    <SearchForm {...props}>
                        <MobilePopUpCloseButton />
                        <div className="MobilePopupHeadingWrapper">
                            <h2>{t("ABG_GROUP_BILL")}:</h2>
                        </div>
                        <SearchFormFields {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal, tenantId, t,tenantlocalties }} />
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

    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const getBillLink = (row) => {
        return (
            <div>
                <span className="link">
                {GetCell(getBillNumber(row?.businessService, row?.consumerCode, row?.billNumber))}
                </span>
            </div>
        )
    }
    const propsMobileInboxCards = useMemo(() => {
      
        if(isLoading){
            return [];
        }
        return data?.map((row) => ({
            [t("ABG_BILL_NUMBER_LABEL")]: getBillLink(row) ,
            [serviceType === "WS" || serviceType === "SW" ? t("PDF_STATIC_LABEL_CONSOLIDATED_BILL_CONSUMER_ID") : t("PROPERTY_ID")]: row?.consumerCode? t(`${row?.consumerCode}`) : "NA",
            [serviceType === "WS" || serviceType === "SW" ? t("ABG_COMMON_TABLE_COL_CONSUMER_NAME") : t("OWNER_NAME")]: row?.user?.name? t(`${row?.user?.name}`) : "NA",
            [t("ABG_COMMON_TABLE_COL_BILL_DATE")]: GetCell(convertEpochToDate(row?.billDate) || t("CS_NA")),
            [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(row?.status || "NA"),
        }));
    }, [data]);

    const [showToast, setShowToast] = useState(null)
    const startWSBillDownloadJob = async (isConsolidated, key = "ws-bill") => {
        const result = await Digit.WSService.wnsGroupBill({ key: key ? key : "ws-bill", tenantId, locality: locality?.code, isConsolidated, bussinessService: serviceType });
        setShowToast({
            label: `${t("GRP_JOB_INITIATED_STATUS")} ${result?.jobId}`
        })
    };

    const handleMergeAndDownload = (e) => {
        if (serviceType == "PT") {
            startWSBillDownloadJob(true, "pt-bill")
        } else {
            downloadBills();
        }
        
    };

    const [showOptions, setShowOptions] = useState(false)
    const dowloadOptions = serviceType === "WS" ? [
        {
            order: 1,
            label: t("ABG_WATER_BILLS"),
            onClick: () => startWSBillDownloadJob(false),
        },
        {
            order: 2,
            label: t("ABG_WATER_SEWERAGE_BILLS"),
            onClick: () => startWSBillDownloadJob(true),
        }

    ] : serviceType === "SW" ? [
        {
            order: 1,
            label: t("ABG_SEWERAGE_BILLS"),
            onClick: () => startWSBillDownloadJob(false),
        },
        {
            order: 2,
            label: t("ABG_WATER_SEWERAGE_BILLS"),
            onClick: () => startWSBillDownloadJob(true),
        }
    ] : [
        {
            order: 1,
            label: t("BILLS_MERGE_AND_DOWNLOAD"),
            onClick: ()=> {handleMergeAndDownload()}
        }
    ];

    const NoActionRequiredFunction = (data) => {
    }  

    return (
        <React.Fragment>
            <div>
            {data && data?.length >= 0 && (
                    <MultiLink
                        className="multilinkWrapper"
                        onHeadClick={() => setShowOptions(!showOptions)}
                        displayOptions={showOptions}
                        options={dowloadOptions}
                        label={t("BILLS_MERGE_AND_DOWNLOAD")}
                    />
                )}
            </div>
            <div className="searchBox">
                <SearchAction
                    text={t("ABG_GROUP_BILL")}
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
                        handleSelect: (e) => {},
                        handleDetailCardClick: (e) => {},
                        data: propsMobileInboxCards,
                        serviceRequestIdKey: t("ABG_BILL_NUMBER_LABEL"),
                    }}
                />
            )}
            {showToast && <Toast label={showToast?.label} onClose={() => setShowToast(null)} />}
        </React.Fragment>
    );
};

export default MobileGroupBill;