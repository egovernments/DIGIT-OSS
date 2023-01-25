import React, { Fragment, useEffect, useCallback, useMemo, useState } from "react";
import { SearchForm, Table, Card, Loader, Header, DownloadBtnCommon, DownloadIcon,MultiLink,Toast } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import SearchFields from "./SearchFields";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { join } from "lodash";
//import MobileCancelBill from "../CancelBill/MobileCancelBill";
import MobileGroupBill from "../GroupBill/MobileGroupBill";
import { getBillNumber } from "../../utils";
const GroupBills = ({ tenantId, onSubmit, data, count, isLoading, resultOk,serviceType,locality }) => {
    
    const history = useHistory()
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

    const { t } = useTranslation();
    const { data: tenantlocalties, isLoadingLocalities } = Digit.Hooks.useBoundaryLocalities(tenantId, 'revenue',{}, t);
    const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            searchType: "CONNECTION",
        },
    });


    const handleBillLinkClick = (row) => {
        history.push(`/digit-ui/employee/bills/bill-details?connectionNumber=${row?.consumerCode}&tenantId=${tenantId}&service=${row?.businessService}&from=ABG_CANCEL_BILL`, row)
    }

    const getBillLink = (row) => {
        return (
            <div>
                <span className="link">
                    <button onClick={() => { handleBillLinkClick(row?.original) }}>
                        {row?.original["billNumber"] || "NA"}
                    </button>
                </span>
            </div>
        )
    }

    const isMobile = window.Digit.Utils.browser.isMobile();

    if (isMobile) {
        return <MobileGroupBill {...{ Controller, register, control, t, reset, handleSubmit, tenantId, data, onSubmit,isLoading,resultOk,serviceType,locality,tenantlocalties }} />;
    }
    const DownloadBtn = (props) => {
        return (
            <div onClick={props.onClick}>
                <DownloadBtnCommon />
            </div>
        );
    };

     const printBill = async (businessService, consumerCode) => {
        await Digit.Utils.downloadBill(consumerCode, businessService, "consolidatedreceipt");
    };

    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo(
        () => [
            {
                Header: t("ABG_BILL_NUMBER_LABEL"),
                disableSortBy: true,
                accessor: "billNumber",
                Cell: ({ row }) => {
                    //here just download this particular bill
                    return (<div>
                    <span className="link">
                        {GetCell(getBillNumber(row.original?.businessService, row.original?.consumerCode, row.original?.billNumber))}
                    </span>
                    </div>)
                    }
            },
            {
                Header: serviceType === "WS" || serviceType === "SW" ? t("PDF_STATIC_LABEL_CONSOLIDATED_BILL_CONSUMER_ID") : t("PROPERTY_ID"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(row.original?.consumerCode || "NA");
                },
            },
            {
                Header: serviceType === "WS" || serviceType === "SW" ? t("ABG_COMMON_TABLE_COL_CONSUMER_NAME") : t("OWNER_NAME"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(row.original?.user?.name || "NA");
                },
            },

            {
                Header: t("ABG_COMMON_TABLE_COL_BILL_DATE"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(convertEpochToDate(row?.original?.billDate));
                },
            },
            {
                Header: t("ABG_COMMON_TABLE_COL_STATUS"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(row?.original?.status || "NA");
                },
            },
        ],
        [serviceType]
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

    const [currentBill, setCurrentBill] = useState("");

    const downloadAll = (data) => {
        data.map((fs) => {
          window.open(fs.url);
        });
    };

    const handleCancelActionClick = (row) => {
        setShowModal(true)
        setCurrentBill(row)
    }
    const getActionItem = (row) => {
        return (
            <div>
                <span className="link">
                    <button onClick={() => { handleCancelActionClick(row?.original) }}>
                        {t(`${"ABG_CANCEL_BILL"}`)}{" "}
                    </button>
                </span>
            </div>
        )
    };
    const { isLoadinggen, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
    const keys = generateServiceType?.["common-masters"]?.uiCommonPay
    const downloadBills = async () => {
        const keyv1 = keys.filter((key) => key.code === serviceType);
        const bills = await Digit.PaymentService.generatePdf(tenantId, { Bill: data }, keyv1[0].billKey);
        const res = await Digit.UploadServices.Filefetch(bills?.filestoreIds, tenantId);
        // removed for UM-5036
        // window.open(res.data[bills.filestoreIds[0]]);
        
        //logic for downloading all bills anyway(if api is giving multiple filestoreids)
        const fsObj = res.data.fileStoreIds;
        downloadAll(fsObj)
    };
    const handleMergeAndDownload = (e) => {
        if (serviceType == "PT") {
            startWSBillDownloadJob(true, "pt-bill")
        } else {
            downloadBills();
        }
        
    };
    const [showToast, setShowToast] = useState(null)
    const startWSBillDownloadJob = async (isConsolidated, key = "ws-bill") => {
        const result = await Digit.WSService.wnsGroupBill({ key: key ? key : "ws-bill", tenantId, locality: locality?.code, isConsolidated, bussinessService: serviceType });
        setShowToast({
            label: `${t("GRP_JOB_INITIATED_STATUS")} ${result?.jobId}`
        })
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


    return (
        <>
            <div className="custom-group-merge-container employee-application-details">
                 <Header styles={{ fontSize: "32px" }}>
                    {t("ABG_COMMON_HEADER")}
                </Header>
                {data && data?.length >= 0 && (
                    <MultiLink
                        className="multilinkWrapper employee-mulitlink-main-div"
                        onHeadClick={() => setShowOptions(!showOptions)}
                        displayOptions={showOptions}
                        options={dowloadOptions}
                        downloadBtnClassName={"employee-download-btn-className"}
                        optionsClassName={"employee-options-btn-className"}
                        label={t("BILLS_MERGE_AND_DOWNLOAD")}
                    />
                )}
            </div>
            {/* < Card className={"card-search-heading"}>
                <span style={{ color: "#505A5F" }}>{t("WS_INFO_VALIDATION")}</span>
            </Card> */}
            <SearchForm className="ws-custom-wrapper" onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchFields {...{ register, control, reset, tenantId, t, formState,tenantlocalties }} />
            </SearchForm>
            {isLoading && <Loader />}
            {data && data?.length == 0 ?  (
    <Card style={{ backgroundColor: "white", textAlign:"center" }}>
    {t("ES_COMMON_NO_DATA")}
  </Card>):(
            isLoading===false && data  &&
                <div style={{ backgroundColor: "white" }}>
                    <div className="sideContent" style={{ float: "left", padding:"20px 10px", fontSize:"24px", fontWeight:"700", fontFamily:"Roboto"}}>
                        {t("ABG_SEARCH_RESULTS_HEADER")}
                    </div>
                    {/* <div className="sideContent" style={{ float: "right", padding: "10px 30px" }}>
                        <span className="table-search-wrapper">
                            <DownloadBtn className="mrlg cursorPointer" onClick={() => handleExcelDownload(tabledata)} />
                        </span>
                    </div> */}
                    <Table
                        t={t}
                        data={data}
                        totalRecords={count}
                        columns={columns}
                        getCellProps={(cellInfo) => {
                            return {
                                style: {
                                    minWidth: cellInfo.column.Header === t("ABG_BILL_NUMBER_LABEL") ? "240px" : "",
                                    padding: "20px 18px",
                                    fontSize: "16px",
                                },
                            };
                        }}
                        manualPagination={false}
                    />
                </div>)}
            {showToast && <Toast label={showToast?.label} onClose={() => setShowToast(null)} />}
        </>
    )

}

export default GroupBills