import React, { Fragment,useState,useEffect,useMemo,useCallback,useRef } from 'react'
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


const ReportSearchApplication = ({onSubmit,isLoading,data,tableData,isTableDataLoading,Count,searchData,reportName}) => {
    const {t} = useTranslation()
    const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
        defaultValues:{
            ...searchData
        }
    }
    )

    useEffect(()=>{
        if (formState.isSubmitSuccessful) {
            let resetObj = {}
            data?.reportDetails?.searchParams?.map(el => resetObj[el?.name] = "")
            reset({ ...resetObj, ...searchData, isSubmitSuccessful: false,})
        }
    },[formState])
    

    const searchFormFieldsComponentProps = { formState, Controller, register, control, t,reset,data };

    const rowData = tableData?.reportData;
    rowData?.map((row,index) =>{
        row?.unshift(index+1)
    })

    const rowHeaders = tableData?.reportHeader
    rowHeaders?.unshift({
        label:"#"
    })

    const headersXLS = rowHeaders?.map(header=>t(header.label))
    const rowDataXLS = rowData && JSON.parse(JSON.stringify(rowData))//deep copy
    rowDataXLS?.unshift(headersXLS)

    const columns = useMemo(() => {
        const colArray = rowHeaders?.map((header, index) => {
            return {
                Header: t(header.label),
                disableSortBy: true,
                accessor: ( row ) => <span className="cell-text">{row[index]?row[index]:"-"}</span>
            }
        })
        return colArray
    },[rowHeaders])
    const [isDisplayDownloadMenu,setIsDisplayDownloadMenu] = useState(false)
    const downloadOptions = [
        {
            label:"pdf",
            onClick: () => Digit.Download.PDF(tableRef, reportName)
        },
        {
            label:"xls",
            onClick: () => Digit.Download.Excel(rowDataXLS,reportName)
            
        }
    ]
    const tableRef = useRef()
    return (
        <React.Fragment>
            <Header>{reportName}</Header>
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
                data={rowData}
                columns={columns}
                getCellProps={(cellInfo) => {
                    return {
                        style: {
                            padding: "20px 18px",
                            fontSize: "16px",
                            // overflowWrap:"break-work",
                            // whiteSpace: 'pre-wrap',
                            wordBreak:"break-all"
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
                />}
                /> ):<Loader/>}
        </React.Fragment>
    )
}

export default ReportSearchApplication