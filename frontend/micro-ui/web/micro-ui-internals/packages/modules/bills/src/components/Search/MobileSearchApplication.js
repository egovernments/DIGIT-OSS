import React, { Fragment, useCallback, useMemo, useReducer, useState, useEffect } from "react";
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
  Header,
  DownloadBtnCommon
} from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { getBillNumber } from "../../utils";
import SearchFormFields from "./SearchFields";
import { printRecieptMobile } from "../../utils";
// import { convertEpochToDateDMY } from "../../utils";

const MobileSearchApplication = ({ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit,isLoading}) => {

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
    const MobilePopUpCloseButton = () => (
      <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
        <CloseSvg />
      </div>
    );
    const searchFormFieldsComponentProps = { Controller, register, control, t, reset, previousPage };

    const MobileComponentDirectory = ({ currentlyActiveMobileModal, searchFormFieldsComponentProps, tenantId, ...props }) => {
      const { closeMobilePopupModal } = props;
      switch (currentlyActiveMobileModal) {
        case "SearchFormComponent":
          return (
            <SearchForm {...props}>
                           <MobilePopUpCloseButton />
              <div className="MobilePopupHeadingWrapper">
                <h2>{t("ABG_SEARCH_BILL_COMMON_HEADER")}:</h2>
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
    const [tabledata,settabledata ]=useState([]);
  const DownloadBtn = (props) => {
    return (
      <div onClick={props.onClick}>
        <DownloadBtnCommon />
      </div>
    );
  };
 const handleExcelDownload = (tabData) => {
  if(tabData?.[0] !== undefined){
    return Digit.Download.Excel(tabData?.[0] , "Bills");
  }
  }; 
  useEffect(() => {
    if ( data?.length >0){
      settabledata([
  
        data?.map((obj)=> {
          let returnObject={};
          returnObject[ t("ABG_COMMON_TABLE_COL_BILL_NO")]=obj?.billNumber;
          returnObject[t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]=obj?.payerName;
          returnObject[t("ABG_COMMON_TABLE_COL_BILL_DATE")]=convertEpochToDate(obj?.billDate);
          returnObject[t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]=obj?.totalAmount;
          returnObject[t("ABG_COMMON_TABLE_COL_STATUS")]=obj?.status;
          return {
            ...returnObject,
          }
        })
      ])
    }
  }, [data]);
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
                    {/* <button onClick={() => { handleBillLinkClick(row) }}>
                        {row?.["billNumber"] || "NA"}
                    </button> */}
                    {GetCell(getBillNumber(row?.businessService, row?.consumerCode, row?.billNumber))}
                </span>
            </div>
        )
    }
    const getActionItem = (original) => {
        if (original?.totalAmount > 0) {
          if (original?.status === "ACTIVE") {
            return (
              <div>
                <span className="link">
                  <Link
                    to={{
                     // pathname: `/digit-ui/citizen/payment/collect/${original?.["businessService"]}/${original?.["consumerCode"]}/tenantId=${original?.["tenantId"]}?workflow=mcollect`,
                     pathname: `/digit-ui/employee/payment/collect/${original?.["businessService"]}/${
                      original?.["consumerCode"]?.includes("WS") || original?.["consumerCode"]?.includes("SW")
                        ? encodeURIComponent(original?.["consumerCode"], "/", "+")
                        : original?.["consumerCode"]
                    }/tenantId=${original?.["tenantId"]}?workflow=${
                      original?.["consumerCode"]?.includes("WS") || original?.["consumerCode"]?.includes("SW") ? "WS" : "mcollect"
                    }`,
                    }}
                  >
                    {t(`${"ABG_COLLECT"}`)}
                  </Link>
                </span>
              </div>
            );
          } else if (original?.status === "CANCELLED" || original?.status === "EXPIRED") {
            return (
              <div>
                <span className="link">
                  <Link
                    to={{
                      pathname: `/digit-ui/employee/payment/collect/${original?.["businessService"]}/${
                        original?.["consumerCode"]?.includes("WS") || original?.["consumerCode"]?.includes("SW")
                          ? encodeURIComponent(original?.["consumerCode"], "/", "+")
                          : original?.["consumerCode"]
                      }/tenantId=${original?.["tenantId"]}?workflow=${
                        original?.["consumerCode"]?.includes("WS") || original?.["consumerCode"]?.includes("SW") ? "WS" : "mcollect"
                      }`,
                    }}
                  >
                    {t(`${"ABG_GENERATE_NEW_BILL"}`)}
                  </Link>
                </span>
              </div>
            );
          } else if (original?.status === "PAID") {
            return (
              <div>
                <span className="link">
                  <Link>
                    <a
                      href="javascript:void(0)"
                      style={{
                        color: "#FE7A51",
                        cursor: "pointer",
                      }}
                      onClick={(value) => {
                        printRecieptMobile(original?.["businessService"], original?.["consumerCode"]);
                      }}
                    >
                      {" "}
                      {t(`${"ABG_DOWNLOAD_RECEIPT"}`)}{" "}
                    </a>
                  </Link>
                </span>
              </div>
            );
          }
        } else {
          return GetCell(t(`${"CS_NA"}`));
        }
      };
      const propsMobileInboxCards = useMemo(
        () => {
          if (data?.display){
            return []
          }
          if(data === "")
          {
          return [];
          }
          return data?.map((row) => ({
            [t("ABG_COMMON_TABLE_COL_BILL_NO")]: getBillLink(row) ,
            [t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]: row?.user?.name? t(`${row?.user?.name}`) : "NA",
            [t("ABG_COMMON_TABLE_COL_BILL_DATE")]: GetCell(convertEpochToDate(row?.billDate)),
            [t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]: GetCell(row?.totalAmount||"NA"),
            [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(row?.status || "NA"),
            [t("ABG_COMMON_TABLE_COL_ACTION")]: GetCell(getActionItem(row)),
      }))
    },
    [data]
  );

  return (
    <React.Fragment>
      <div className="sideContent" style={{ marginLeft:"65%", marginTop:"-12%"}}>
                  <DownloadBtn className="mrlg cursorPointer"  onClick={() => handleExcelDownload(tabledata)}/>
      </div>
            <Header>{t("ABG_SEARCH_BILL_COMMON_HEADER")}:</Header>
      <div className="searchBox">
        <SearchAction
          text={t("ES_COMMON_SEARCH")}
          handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          {...{tenantId, t}} 
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
                <DetailsCard
                  {...{
                    data: propsMobileInboxCards,
                    serviceRequestIdKey: t("CR_COMMON_TABLE_COL_RECEIPT_NO"),
                  }}
                />
            </React.Fragment>
          )
        }
  
        export default MobileSearchApplication   
