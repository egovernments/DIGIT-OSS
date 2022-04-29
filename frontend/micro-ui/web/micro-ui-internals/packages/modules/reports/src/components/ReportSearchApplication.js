import React, { Fragment, useState, useEffect, useMemo, useCallback, useRef, useReducer } from 'react'
import SearchFormFieldsComponent from './SearchFormFieldsComponent'
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from 'react-i18next';
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
    MultiLink,
    Header
} from "@egovernments/digit-ui-react-components";


const ReportSearchApplication = ({ onSubmit, isLoading, data, tableData, isTableDataLoading, Count, searchData, reportName }) => {
    const { t } = useTranslation()
    const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
        defaultValues: {
            ...searchData
        }
    }
    )

    //this resets the form after every search
    // useEffect(() => {
    //     if (formState.isSubmitSuccessful) {
    //         let resetObj = {}
    //         data?.reportDetails?.searchParams?.map(el => el.type === "multivaluelist" ? resetObj[el?.name] = [] : resetObj[el?.name] = "")
    //         reset({ ...resetObj, isSubmitSuccessful: false, })
    //     }
    // }, [formState])


    const searchFormFieldsComponentProps = { formState, Controller, register, control, t, reset, data };
    const rowData = tableData?.reportData;
    if(rowData?.[0]?.[0]!=1){
        rowData?.map((row, index) => {
            row?.unshift(index + 1)
        })
    }
    

    const rowHeaders = tableData?.reportHeader
    
    
    if(rowHeaders?.[0]?.label!=="#"){
        rowHeaders?.unshift({
            label: "#"
        }) 
    }
    
    const rowHeadersCopy = rowHeaders && JSON.parse(JSON.stringify(rowHeaders))//deep copy
    
    const headersXLS = rowHeadersCopy?.map(header => t(header.label))
    let rowDataXLS = rowData && JSON.parse(JSON.stringify(rowData))//deep copy
    rowDataXLS?.unshift(headersXLS)
    //rowDataXLS = rowDataXLS?.map(row => row.splice(1))
    const getCellValue = (row, header, index) => {

        if (header.type === "stringarray") {
            const rowVal = row?.[index]?.split(',')
            let finalRowVal;
            if (header.localisationRequired) {
                finalRowVal = rowVal.map(role => t(`${header.localisationPrefix}${role}`))
                return finalRowVal.toString().replaceAll(",", " ")
            } else {
                finalRowVal = rowVal.map(role => role)
                return finalRowVal.toString().replaceAll(",", " ")
            }
        }
        const rowVal = header?.localisationRequired ? t(`${header?.localisationPrefix}${row[index]}`) : row?.[index]
        return rowVal ? rowVal : "-"
    }

    const columns = useMemo(() => {
        const colArray = rowHeaders?.map((header, index) => {
            return {
                Header: t(header.label),
                disableSortBy: true,
                accessor: (row) => <span className="cell-text">{getCellValue(row, header, index)}</span>
            }
        })
        return colArray
    }, [rowHeaders])
    const [isDisplayDownloadMenu, setIsDisplayDownloadMenu] = useState(false)
    const downloadOptions = [
        {
            label: "pdf",
            onClick: () => Digit.Download.PDF(tableRef, reportName)
        },
        {
            label: "xls",
            onClick: () => {
              return  Digit.Download.Excel(rowDataXLS, reportName)
            }

        }
    ]
    const tableRef = useRef()

    const isMobile = window.Digit.Utils.browser.isMobile();

    const propsMobileInboxCards = useMemo(
        () =>
            !rowData?.length > 0 ? [] : rowData?.map((data) => {
                //map over columns and display the data in this format
                //[t(columnheader)]:data to display
                //here finalObj is each row
                const finalObj = {}
                columns?.map((col, index) => {
                    finalObj[[t(`${col?.Header}`)]] = getCellValue(data, rowHeaders[index], index)
                })
                return finalObj;
            }),
        [rowData, isTableDataLoading]
    );

    if (isMobile) {

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

        const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }) => {
            const { closeMobilePopupModal } = props;
            switch (currentlyActiveMobileModal) {
                case "SearchFormComponent":
                    return (
                        <SearchForm {...props}>
                            <MobilePopUpCloseButton />
                            <div className="MobilePopupHeadingWrapper">
                                <h2>{t("ES_COMMON_SEARCH")}:</h2>
                            </div>
                            <SearchFormFieldsComponent {...searchFormFieldsComponentProps} {...{ closeMobilePopupModal }} />
                        </SearchForm>
                    );
                default:
                    return <span></span>;
            }
        };

        const CurrentMobileModalComponent = useCallback(
            ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }) =>
                MobileComponentDirectory({ currentlyActiveMobileModal, searchFormFieldsComponentProps, ...props }),
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
                            {...{ searchFormFieldsComponentProps, currentlyActiveMobileModal, closeMobilePopupModal }}
                        />
                    </PopUp>
                ) : null}
                {!isTableDataLoading && tableData?.display ? (
                    <Card style={{ marginTop: 20 }}>
                        {
                            t(tableData?.display)
                                .split("\\n")
                                .map((text, index) => (
                                    <p key={index} style={{ textAlign: "center" }}>
                                        {text}
                                    </p>
                                ))
                        }
                    </Card>
                ) : !isTableDataLoading ? (
                    <DetailsCard
                        {...{
                            data: propsMobileInboxCards,
                            isTwoDynamicPrefix: true,
                        }}
                    />
                ) : <Loader />}
            </React.Fragment>
        );

    }

    return (
        <React.Fragment>
            {/* <Header>{reportName}</Header> */}
            <Header>{data?.reportDetails?.reportName}</Header>
            {isLoading ? <Loader /> :
                <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
                    <SearchFormFieldsComponent {...searchFormFieldsComponentProps} />
                </SearchForm>}

            {!isTableDataLoading && tableData?.display ? (
                <Card style={{ marginTop: 20 }}>
                    {
                        t(tableData?.display)
                            .split("\\n")
                            .map((text, index) => (
                                <p key={index} style={{ textAlign: "center" }}>
                                    {text}
                                </p>
                            ))
                    }
                </Card>
            ) : !isTableDataLoading ? (<Table
                tableRef={tableRef}
                t={t}
                className={"table reports-table "}
                data={rowData}
                columns={columns}
                getCellProps={(cellInfo) => {
                    
                    return {
                        style: {
                            padding: "20px 18px",
                            fontSize: "16px",
                            // overflowWrap:"break-work",
                            //whiteSpace: 'pre-wrap',
                            wordBreak: cellInfo?.column?.Header === t("reports.hrms.role") ? "break-all" : null,
                            minWidth: cellInfo?.column?.Header === "#" ? "100px" : null,
                            width: cellInfo?.column?.Header === "#" ? "100px" : null
                            //whiteSpace:"break-space"
                        },
                    };
                }}
                manualPagination={false}
                totalRecords={Count}
                tableTopComponent={<MultiLink
                    className="multilinkWrapper"
                    // optionsStyle={{ "position": "relative" }}
                    // style={{"position":"relative"}}
                    onHeadClick={() => setIsDisplayDownloadMenu(!isDisplayDownloadMenu)}
                    displayOptions={isDisplayDownloadMenu}
                    options={downloadOptions}
                    downloadBtnClassName={"reports-download-btn"}
                    downloadOptionsClassName={"reports-options-download"}
                    reportStyles={{"position":"relative"}}
                />}
                isReportTable={true}
            />) : <Loader />}
        </React.Fragment>
    )
}

export default ReportSearchApplication