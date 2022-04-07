import { Card, Header, KeyNote, Loader, SubmitBar, Toast, ActionBar, Dropdown, Modal, FormComposer, DatePicker, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import * as func from "../../../utils"

const ConsumptionDetails = ({ view }) => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.tenantId || Digit.ULBService.getCurrentTenantId();
  let filters = func.getQueryStringParams(location.search);
  const {applicationNo} = Digit.Hooks.useQueryParams();
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
  const [currentMeterReading, setCurrentReading] = useState("");
  const [selectedConsumtion, setConsumption] = useState("");
  const [currentBillingPeriod, setBillingPeriod] = useState("");
  

  const { isLoading, isError, data: response } = Digit.Hooks.ws.useWSConsumptionSearch({ filters: filter1 }, { filters: filter1 });

  const { isLoading: meterStatusLoading, data: mdmsMeterStatus } = Digit.Hooks.ws.useGetMeterStatusList(tenantId);
  const { isLoading: billingPeriodLoading, data: mdmsBillingPeriod } = Digit.Hooks.ws.useGetBillingPeriodValidation(tenantId);

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
  const getBillingPeriodFromMdms = mdmsBillingPeriod?.MdmsRes?.["ws-services-masters"]?.billingPeriod.filter((e) => e.connectionType === "Metered");

  const popUp = () => {
    setOpenModal(true);
    setMeterDetails(response?.meterReadings[0]);
    setSelectMeterStatus({
      code: response?.meterReadings[0]?.meterStatus,
      i18nKey: `${Digit.Utils.locale.getTransformedLocale(response?.meterReadings[0]?.meterStatus)}`
    });
    setBillingPeriod(`${getDate(meterDetails?.currentReadingDate)} - ${getDate(convertDateToEpoch(Digit.Utils.date.getDate()))}`);
  };

  const closeModal = () => {
    setOpenModal(false);
  };
  const closeToast = () => {
    setShowToast(false);
    setError(null);
  };


  const onSubmit = async(data) => {
    let fromDate = parseInt(meterDetails?.currentReadingDate);
    let selectedDate = parseInt(convertDateToEpoch(data?.currentReadingDate));
    let toDate = parseInt(convertDateToEpoch(Digit.Utils.date.getDate()));
    if(!data?.currentReading || data?.currentReading == null || data?.currentReading === ""){
      setShowToast({ key: "error" });
      setError(t("ERR_CURRENT_READING_REQUIRED"));
      setTimeout(closeToast, 5000);
      return;
    }
    if(selectedDate < fromDate || selectedDate > toDate){
      setShowToast({ key: "error" });
      setError(t("ERR_CURRENT_READING_DATE_SHOULD_NOT_BE_LESS_THAN_FROM_DATE_AND_NOT_GREATER_THAN_TO_DATE"));
      setTimeout(closeToast, 5000);
      return;
    }
    let meterReadingsJS = {
      "billingPeriod" : `${getDate(meterDetails?.currentReadingDate)} - ${getDate(data?.currentReadingDate)}`,
      "connectionNo" : meterDetails?.connectionNo,
      "currentReading" : data?.currentReading,
      "currentReadingDate" : convertDateToEpoch(data?.currentReadingDate),
      "lastReading" : meterDetails?.currentReading,
      "lastReadingDate" : meterDetails?.currentReadingDate,
      "meterStatus" : selectMeterStatus?.code,
      "tenantId" : meterDetails?.tenantId, 
    };
    let meterReadingsPayload = {meterReadings : meterReadingsJS};

    if(meterReadingMutation){
      setIsEnableLoader(true);
      await meterReadingMutation(meterReadingsPayload, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setShowToast({ key: "error", message: error?.message ? error.message : error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: async (data, variables) => {
          setIsEnableLoader(false);
          setOpenModal(false);
          setShowToast({ key: "success", message: "WS_METER_READING_ADDED_SUCCESFULLY" });
          setTimeout(closeToast, 3000);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        },
      })
    }
  };
  let optionsList = 
    mdmsMeterStatus?.MdmsRes?.["ws-services-calculation"]?.MeterStatus.map((status) => ({
      code: status,
      i18nKey: `${Digit.Utils.locale.getTransformedLocale(status)}`,
    }));

  const onFormValueChange = (setValue, formData, formState) => {
    setCurrentReading(formData?.currentReading);
    setBillingPeriod(`${getDate(meterDetails?.currentReadingDate)} - ${getDate(formData?.currentReadingDate)}`);
    if(parseInt(currentMeterReading) < parseInt(details?.[0]?.lastReading)){
      setConsumption("0");
    }
    else{
      setConsumption(`${parseInt(currentMeterReading) - parseInt(details?.[0]?.currentReading)}`);
    }
}

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
              <KeyNote keyValue={t("WS_BILLING_PERIOD")} note={currentBillingPeriod} />
              // <tr >
              //   <td style={{fontWeight: 700}}>{t("WS_BILLING_PERIOD")}</td>
              //   <td style={{paddingLeft: "60px", textAlign: "end"}}>{details?.[0]?.billingPeriod}</td>
              // </tr>
            ),
          },
          {
            label:t("WS_METER_STATUS"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <Dropdown
                option={optionsList}
                autoComplete="off"
                optionKey="i18nKey"
                id="meterStatus"
                select={setSelectMeterStatus}
                selected={selectMeterStatus}
                t={t}
              />
            ),
          },
          {
            populators: (
              <KeyNote keyValue={t("WS_LAST_READING")} note={details?.[0]?.currentReading} />
            ),
          },
          {
            populators: (
              <KeyNote keyValue={t("WS_LAST_READING_DATE")} note={getDate(details?.[0]?.currentReadingDate)} />
            ),
          },
          {
            label: t("WS_CURRENT_READING"),
            isMandatory: true,
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
              customProps: {},
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => <DatePicker onChange={props.onChange} date={props.value} {...customProps} />,
            },
          },
          {
            label: t("WS_CONSUMPTION"),
            isMandatory: false,
            type: "number",
            populators: {
              name: "consumption",
              value: selectedConsumtion,
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

  if (isLoading) {
    return <Loader />;
  }
  let {meterReadings} = response || {};
  return (
    <React.Fragment>
    <div>
    <Header>{`${t("WS_VIEW_CONSUMPTION")}`}</Header>
    <div>
      {meterReadings?.length > 0 &&
        meterReadings.map((application, index) => (
          <div key={index}>
            <Card>
            <KeyNote keyValue={t("WS_MYCONNECTIONS_CONSUMER_NO")} note={application?.connectionNo} />
            <KeyNote keyValue={t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")} note={application?.billingPeriod} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL")} note={application?.meterStatus} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")} note={application?.lastReading} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")} note={Digit.DateUtils.ConvertEpochToDate(application?.lastReadingDate)} />
            <KeyNote keyValue={t("WS_SERV_DETAIL_CUR_METER_READ")} note={application?.currentReading} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL")} note={Digit.DateUtils.ConvertEpochToDate(application?.currentReadingDate)} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL")} note={application?.consumption || t("CS_NA")} />
            </Card> 
          </div>
        ))}
      {!meterReadings?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_CONSUMPTION_FOUND")}</p>}
    </div>
    {isLoading || meterStatusLoading || billingPeriodLoading ? null :
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
            onFormValueChange={onFormValueChange}
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
        {showToast && <Toast error={showToast?.key === "error" ? true : false} label={t(showToast?.message)} onClose={closeToast} />}
        
  </React.Fragment>
  );
};
export default ConsumptionDetails;