import React, {useState, useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card, MobileNumber, Loader, CardText, Header } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import MobileSearchApplication from "./MobileSearchApplication";

const PTSearchApplication = ({ t, onSubmit, data, count, setShowToast, searchParams, onFilterChange, defaultSearchParams, statuses, ...props }) => {
    const isMobile = window.Digit.Utils.browser.isMobile();
    const [_searchParams, setSearchParams] = useState(() => searchParams);
    const [service, setService] = useState([]);
    const [ulbLists, setulbLists] = useState([]);
  
    const clearAll = () => {
      setService([]);
      onFilterChange([]);
    };
  
    useEffect(() => {
      if (service) {
        setSearchParams({ ...service });
      }
    }, [service]);
  
    const tenantId = Digit.SessionStorage.get("User")?.info?.tenantId;
  
    const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
  
    const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);
  
    const getUlbLists = generateServiceType?.tenant?.tenants?.filter((element) => element.code === tenantId);
    let serviceTypeList = [];
    if (filterServiceType) {
      serviceTypeList = filterServiceType.map((element) => {
        return {
          name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
          url: element.billGineiURL,
          businesService: element.code,
        };
      });
    }
    useEffect(() => {
      if (getUlbLists) {
        setulbLists(getUlbLists[0]);
      }
    }, []);
  
    const userUlbs = [];
    if (isLoading) {
      return <Loader />;
    }
  
    const { register, control, handleSubmit, setValue, getValues, reset, formState, watch } = useForm({
        defaultValues: {
            offset: 0,
            limit: !isMobile && 10,
            sortBy: "commencementDate",
            sortOrder: "DESC"
        }
    })
    const FormData=watch()
    useEffect(() => {
      if (FormData) {
        setSearchParams({ ...FormData });
      }
    }, [FormData]);
    console.log(FormData,"test1")
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
    },[register])
    //need to get from workflow

    const getaddress = (address) => {
        let newaddr = `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
            address?.landmark ? `${address?.landmark}, ` : ""
          }${t(address?.locality.code)}, ${t(address?.city)},${t(address?.pincode) ? `${address.pincode}` : " "}`
        return newaddr;
    }
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
            Header: t("PT_SEARCHPROPERTY_TABEL_PID"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.propertyId || ""),
        },
        {
            Header: t("PT_APPLICATION_NO_LABEL"),
            accessor: "acknowldgementNumber",
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <div>
                  <span className="link">
                    <Link to={`/digit-ui/employee/pt/applicationsearch/application-details/${row.original["propertyId"]}`}>
                      {row.original["acknowldgementNumber"]}
                    </Link>
                  </span>
                </div>
              );
            },
          },
          {
            Header: t("PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.creationReason || ""),
          },
          {
            Header: t("PT_COMMON_TABLE_COL_OWNER_NAME"),
            accessor: (row) => GetCell(row.owners.map( o => o.name ). join(",") || ""),
            disableSortBy: true,
          },
          {
            Header: t("ES_SEARCH_PROPERTY_STATUS"),
            accessor: (row) =>GetCell(t( row?.status &&`WF_PT_${row.status}`|| "NA") ),
            disableSortBy: true,
          },
          {
            Header: t("PT_ADDRESS_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(getaddress(row.address) || ""),
          },
      ]), [] )

    const onSort = useCallback((args) => {
        if (args.length === 0) return
        setValue("sortBy", args.id)
        setValue("sortOrder", args.desc ? "DESC" : "ASC")
    }, [])

    function onPageSizeChange(e){
        setValue("limit",Number(e.target.value))
        handleSubmit(onSubmit)()
    }

    function nextPage () {
        setValue("offset", getValues("offset") + getValues("limit"))
        handleSubmit(onSubmit)()
    }
    function previousPage () {
        setValue("offset", getValues("offset") - getValues("limit") )
        handleSubmit(onSubmit)()
    }
    let validation={}
    const onSubmitInput = (data) => {
      if (!searchParams.businesService) {
        setShowToast({ key: true, label: "ABG_SEARCH_SELECT_AT_LEAST_SERVICE_TOAST_MESSAGE" });
        return;
      }
  
      if (true) {
        if (!data.mobileNumber) {
          delete data.mobileNumber;
        }
        data.delete = [];
        searchFields.forEach((field) => {
          if (!data[field.name]) data.delete.push(field.name);
        });
        onSearch(data);
        if (type === "mobile") {
          onClose();
        }
      }
    };
  

    return <React.Fragment>
                {isMobile ?
                <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, formState, setShowToast }}/>
                 :
                <div>
                <Header>{t("ABG_SEARCH_BILL_COMMON_HEADER")}</Header>
                < Card className={"card-search-heading"}>
                    <span style={{color:"#505A5F"}}>{t("Provide at least one parameter to search for an application")}</span>
                </Card>
                <SearchForm className="ws-custom-wrapper" onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchField>
                <div style={{width:"180px"}}>
              <div className="filter-label">{t("ABG_SERVICE_CATEGORY_LABEL")}</div>
              <Dropdown name="serviceCategory" t={t} option={serviceTypeList} value={service} selected={service} select={setService} optionKey={"name"} />
            </div>
            </SearchField>
                <SearchField>
                    <label>{t("ABG_BILL_NUMBER_LABEL")}</label>
                    <TextInput name="billNumber" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("ABG_PT_CONSUMER_CODE_LABEL")}</label>
                    <TextInput name="consumerCode" inputRef={register({})} />
                </SearchField>
                <SearchField>
                <label>{t("ABG_MOBILE_NO_LABEL")}</label>
                <MobileNumber
                    name="mobileNumber"
                    inputRef={register({
                    minLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    maxLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    pattern: {
                    value: /[6789][0-9]{9}/,
                    //type: "tel",
                    message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                })}
                type="number"
                componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
                //maxlength={10}
                />
                 <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                </SearchField>
                <div className="submit" style={{marginTop:"0px", marginRight:"15px"}}>
                    <SubmitBar onSubmit={() => onSubmit(_searchParams)} label={t("ES_COMMON_SEARCH")}
                    
                     />
                    <p 
                     onClick={() => {
                        reset({ 
                          consumerCode: "", 
                            billNumber:"",
                            mobileNumber:"",
                           serviceCategory:"",
                            offset: 0,
                            limit: 10,
                            sortBy: "commencementDate",
                            sortOrder: "DESC"
                        });
                        setShowToast(null);
                        previousPage();
                    }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </div>
            </SearchForm>
            
            {!isLoading && data?.display ? <Card style={{ marginTop: 20 }}>
                {
                t(data.display)
                    .split("\\n")
                    .map((text, index) => (
                    <p key={index} style={{ textAlign: "center" }}>
                        {text}
                    </p>
                    ))
                }
            </Card>
            :(!isLoading && data !== ""? <Table
                t={t}
                data={data}
                totalRecords={count}
                columns={columns}
                getCellProps={(cellInfo) => {
                return {
                    style: {
                    minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                    padding: "20px 18px",
                    fontSize: "16px"
                  },
                };
                }}
                onPageSizeChange={onPageSizeChange}
                currentPage={getValues("offset")/getValues("limit")}
                onNextPage={nextPage}
                onPrevPage={previousPage}
                pageSizeLimit={getValues("limit")}
                onSort={onSort}
                disableSort={false}
                sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
            />: data !== "" || isLoading && <Loader/>)}
            </div>}
        </React.Fragment>
}

export default PTSearchApplication