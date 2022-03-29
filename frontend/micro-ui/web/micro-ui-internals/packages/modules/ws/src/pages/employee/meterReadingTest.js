import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ActionBar, SubmitBar, KeyNote, Dropdown, Header, Modal, FormComposer, Loader, DatePicker, Toast } from "@egovernments/digit-ui-react-components";
import * as func from "../../utils"

const AddMeterReading = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { connectionNumber, service, connectionType  } = useParams();
  let filters = func.getQueryStringParams(location.search);
  const applicationNo = filters?.applicationNumber;
  const serviceType = filters?.service;
  let filter1 = { tenantId: tenantId, connectionNos:applicationNo };
  const [openModal, setOpenModal] = useState(false);
  const [meterDetails, setMeterDetails] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const businessService = serviceType === "WATER" ? "WS" : "SW"
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const [selectMeterStatus, setSelectMeterStatus] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
    
  const { isLoading, isError, data: response } =  Digit.Hooks.ws.useMeterReadingSearch({tenantId, filters: {...filter1}, BusinessService: businessService , t}) ;

  const {
    isLoading: updatingMeterConnectionLoading,
    isError: updateMeterConnectionError,
    data: updateMeterConnectionResponse,
    error: updateMeterError,
    mutate: meterReadingMutation,
  } = Digit.Hooks.ws.useMeterReadingCreateAPI(businessService);


  const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
    //example input format : "2018-10-02"
    try {
      const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
      DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
      if (dayStartOrEnd === "dayend") {
        DateObj.setHours(DateObj.getHours() + 24);
        DateObj.setSeconds(DateObj.getSeconds() - 1);
      }
      return DateObj.getTime();
    } catch (e) {
      return dateString;
    }
  };

  const popUp = () => {
    setOpenModal(true);
    setMeterDetails(response?.meterReadings[0]);
    setSelectMeterStatus(response?.meterReadings[0]?.meterStatus);
  };

  const closeModal = () => {
    setOpenModal(false);
  };
  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  const onSubmit = async(data) => {

    if(!data?.currentReading || data?.currentReading == null || data?.currentReading === ""){
      setShowToast({ key: "error" });
      setError("WS_CURRENT_READING_REQUIRED");
      return;
    }
    let meterReadingsJS = {
      "billingPeriod" : `${getDate(meterDetails?.currentReadingDate)} - ${getDate(data?.currentReadingDate)}`,
      "connectionNo" : meterDetails?.connectionNo,
      "currentReading" : data?.currentReading,
      "currentReadingDate" : convertDateToEpoch(data?.currentReadingDate),
      "lastReading" : meterDetails?.lastReading,
      "lastReadingDate" : meterDetails?.lastReadingDate,
      "meterStatus" : selectMeterStatus,
      "tenantId" : meterDetails?.tenantId, 
    };
    let meterReadingsPayload = {meterReadings : meterReadingsJS};

    if(meterReadingMutation){
      setIsEnableLoader(true);
      await meterReadingMutation(meterReadingsPayload, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setShowToast({ key: "error", message: error?.message ? error.message : error });
          setTimeout(closeToastOfError, 5000);
        },
        onSuccess: async (data, variables) => {
          setIsEnableLoader(false);
          console.log("Data Meter: " + JSON.stringify(data?.meterReadings));
        },
      })
    }
  };
  const optionsList = [
    "Working",
    "Break Down",
    "Locked",
    "No Meter",
    "Reset",
    "Replacement",
  ];
  const getDate = (epochdate) => {
    return ( epochdate ?
    new Date(epochdate).getDate() + "/" + (new Date(epochdate).getMonth() + 1) + "/" + new Date(epochdate).getFullYear().toString() : "NA")
    }

  const details = response?.meterReadings;

  const config = {
    label: {
      heading: `ADD_METER_READING`,
      submit: `COMMON_SAVE`,
      cancel: "CORE_LOGOUTPOPUP_CANCEL",
    },
    form: [
      {
        body: [
          {
            populators: (
              <KeyNote keyValue={t("WS_BILLING_PERIOD")} note={details?.[0]?.billingPeriod} />
              // <tr >
              //   <td style={{fontWeight: 700}}>{t("WS_BILLING_PERIOD")}</td>
              //   <td style={{paddingLeft: "60px", textAlign: "end"}}>{details?.[0]?.billingPeriod}</td>
              // </tr>
            ),
          },
          {
            label:t("WS_METER_STATUS"),
            // isMandatory: !action.isTerminateState,
            type: "dropdown",
            populators: (
              <Dropdown
                option={optionsList}
                autoComplete="off"
                // optionKey="name"
                id="meterStatus"
                select={setSelectMeterStatus}
                selected={selectMeterStatus}
              />
            ),
          },
          {
            populators: (
              <KeyNote keyValue={t("WS_LAST_READING")} note={details?.[0]?.lastReading} />
            ),
          },
          {
            populators: (
              <KeyNote keyValue={t("WS_LAST_READING_DATE")} note={getDate(details?.[0]?.lastReadingDate)} />
            ),
          },
          {
            label: t("WS_CURRENT_READING"),
            isMandatory: false,
            type: "number",
            populators: {
              name: "currentReading",
            },
          },
          {
            label: t("WS_CURRENT_READING_DATE"),
            isMandatory: true,
            type: "custom",
            populators: {
              name: "currentReadingDate",
              validation: {
                required: true,
              },
              customProps: { min: Digit.Utils.date.getDate() },
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
            },
          },
          {
            label: t("WS_CONSUMPTION"),
            isMandatory: false,
            type: "text",
            populators: {
              name: "consumption",
              // validation: {
              //   required: true,
              // },
            },
          },
        ],
      },
    ],
  };
  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };
  
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
  
  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };

  return (
    <Fragment>
    <div>
      <div>
        <Header>{t("Meter_Reading")}</Header>
        <div>
        </div>
        {isLoading ? null :
        <ActionBar>
        <SubmitBar label={t("ADD_METER_READING")} onSubmit={popUp} />
        </ActionBar> }
      </div>
      {openModal && (
          <Modal
          headerBarMain={<Heading label={t(config.label.heading)} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelLabel={t(config.label.cancel)}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t(config.label.submit)}
          actionSaveOnSubmit={() => { }}
          formId="modal-action"
          popupStyles={mobileView?{width:"720px"}:{}}
          style={!mobileView?{minHeight: "45px", height: "auto", width:"107px",paddingLeft:"0px",paddingRight:"0px"}:{minHeight: "45px", height: "auto",width:"44%"}}
          popupModuleMianStyles={mobileView?{paddingLeft:"5px"}: {}}
        >
          {isEnableLoader ? (
            <Loader />
          ) : (
            <FormComposer
            config={config.form}
            cardStyle={{marginLeft:"0px",marginRight:"0px", marginTop:"-25px"}}
            className="BPAemployeeCard"
            noBoxShadow
            inline
            childrenAtTheBottom
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            formId="modal-action"
            />
          )}
        </Modal>
        )}
        {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} onClose={closeToast} />}
    </div>
    </Fragment>
  );
};

export default AddMeterReading;
