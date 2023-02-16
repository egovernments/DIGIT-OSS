import React, { Fragment, useEffect, useCallback, useMemo,useState } from "react";
import { SearchForm, Table, Card, Loader, Header, DownloadBtnCommon, DownloadIcon } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import SearchFields from "./SearchFields";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CancelBillModal from "./CancelBillModal";
import { useHistory } from "react-router-dom";
import { join } from "lodash";
import MobileCancelBill from "./MobileCancelBill";

const CancelBills = ({ tenantId, onSubmit, data, count,isLoading,resultOk }) => {
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
    const { register, control, handleSubmit, setValue, getValues, reset,formState } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            searchType: "CONNECTION",
        },
    });

    
    const handleBillLinkClick = (row) => {
        history.push(`/digit-ui/employee/bills/bill-details?connectionNumber=${row?.consumerCode}&tenantId=${tenantId}&service=${row?.businessService}&from=ABG_CANCEL_BILL`,row)
    }

    const getBillLink = (row) => {
        return (
            <div>
                <span className="link">
                    <button onClick={() => { handleBillLinkClick(row?.original) }}>
                        { row?.original["billNumber"] || "NA" }
                    </button>
                </span>
            </div>
        )
    }

    const isMobile = window.Digit.Utils.browser.isMobile();

    if (isMobile) {
        return <MobileCancelBill {...{ Controller, register, control, t, reset, handleSubmit, tenantId, data, onSubmit,isLoading,resultOk }} />;
    }
    const DownloadBtn = (props) => {
        return (
            <div onClick={props.onClick}>
                <DownloadBtnCommon />
            </div>
        );
    };

    const handleExcelDownload = (tabData) => {
        if (tabData?.[0] !== undefined) {
            return Digit.Download.Excel(tabData?.[0], "Bills");
        }
    }; 
    const [tabledata, settabledata] = useState([]);
    useEffect(() => {
        if (data !== "") {
            settabledata([

                data?.map((obj) => {
                    let returnObject = {};
                    returnObject[t("ABG_COMMON_TABLE_COL_BILL_NO")] = obj?.billNumber;
                    returnObject[t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")] = obj?.payerName;
                    returnObject[t("ABG_COMMON_TABLE_COL_BILL_DATE")] = convertEpochToDate(obj?.billDate);
                    returnObject[t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")] = obj?.totalAmount;
                    returnObject[t("ABG_COMMON_TABLE_COL_STATUS")] = obj?.status;
                    return {
                        ...returnObject,
                    }
                })
            ])
        }
    }, [data]);
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo(
        () => [
            {
                Header: t("ABG_BILL_NUMBER_LABEL"),
                disableSortBy: true,
                accessor: "billNumber",
                Cell: ({ row }) => {
                    return getBillLink(row)
                },
            },
            {
                Header: t("ABG_COMMON_TABLE_COL_CONSUMER_NAME"),
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
                Header: t("ABG_COMMON_TABLE_COL_BILL_AMOUNT"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(row?.original?.totalAmount || "NA");
                },
            },
            {
                Header: t("ABG_COMMON_TABLE_COL_STATUS"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(row?.original?.status || "NA");
                },
            },
            {
                Header: t("ABG_COMMON_TABLE_COL_ACTION"),
                disableSortBy: true,
                Cell: ({ row }) => {
                    return GetCell(getActionItem(row));
                },
            },
        ],
        []
    );
    
    const [showModal,setShowModal] = useState(false)
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
        history.push("/digit-ui/employee/bills/response-cancelBill", {filters,currentBill});
        //call the cancel bill api from response page and show appropriate response
    }

    const [currentBill,setCurrentBill] = useState("")
    const handleCancelActionClick = (row) => {
        setShowModal(true)
        setCurrentBill(row)
    }
    const getActionItem = (row) => {
        return (
            <div>
                <span className="link">
                        <button onClick={()=>{handleCancelActionClick(row?.original)}}>
                        {t(`${"ABG_CANCEL_BILL"}`)}{" "}
                        </button>
                </span>
            </div>
        )
    };

    return (
        <>
            <Header styles={{ fontSize: "32px" }}>
                {t("ABG_CANCEL_BILL")}
            </Header>
            < Card className={"card-search-heading"}>
                <span style={{ color: "#505A5F" }}>{t("WS_INFO_VALIDATION")}</span>
            </Card>
            <SearchForm className="ws-custom-wrapper" onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchFields {...{ register, control, reset, tenantId, t,formState }} />
            </SearchForm>
            {isLoading && <Loader/>}
            {data && data?.length == 0 ?  (
                <Card style={{ backgroundColor: "white", textAlign:"center" }}>
                {t("ES_COMMON_NO_DATA")}
            </Card>):
            (isLoading===false && resultOk && 
                <div style={{ backgroundColor: "white" }}>
                    <div className="sideContent" style={{ float: "left", padding:"20px 10px", fontSize:"24px", fontWeight:"700", fontFamily:"Roboto"}}>
                    {t("ABG_SEARCH_RESULTS_HEADER")}
                    </div>
                    <div className="sideContent" style={{ float: "right", padding: "10px 30px" }}>
                        <span className="table-search-wrapper">
                            <DownloadBtn className="mrlg cursorPointer" onClick={() => handleExcelDownload(tabledata)} />
                        </span>
                    </div>
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
                </div> )}
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
            </CancelBillModal> }
        </>
    )

}

export default CancelBills