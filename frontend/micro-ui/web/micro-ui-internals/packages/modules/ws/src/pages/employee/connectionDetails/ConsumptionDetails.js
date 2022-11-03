import {
  ActionBar, Card, DatePicker, Dropdown, FormComposer, Header, Loader, Modal, Row, StatusTable, SubmitBar,
  Toast
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as func from "../../../utils";

const ConsumptionDetails = ({ view }) => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.tenantId || Digit.ULBService.getCurrentTenantId();
  let filters = func.getQueryStringParams(location.search);
  const { applicationNo } = Digit.Hooks.useQueryParams();
  const serviceType = filters?.service;
  let filter1 = { tenantId: tenantId, connectionNos: applicationNo };
  const [openModal, setOpenModal] = useState(false);
  const [meterDetails, setMeterDetails] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const businessService = serviceType === "WATER" ? "WS" : "SW";
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const [selectMeterStatus, setSelectMeterStatus] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [currentMeterReading, setCurrentReading] = useState("");
  const [selectedConsumtion, setConsumption] = useState("");
  const [currentBillingPeriod, setBillingPeriod] = useState("");
  const [isAddMeterReadingButtonEnable, setisAddMeterReadingButtonEnable] = useState(false);
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
  const isUserAllowedToAddMeterReading = userRoles.filter((role) => role === "WS_CEMP" || role === "SW_CEMP").length > 0;

  const { isLoading, isError, data: response } = Digit.Hooks.ws.useWSConsumptionSearch({ filters: filter1 }, { filters: filter1 });

  const { isLoading: meterStatusLoading, data: mdmsMeterStatus } = Digit.Hooks.ws.useGetMeterStatusList(tenantId);
  const { isLoading: billingPeriodLoading, data: mdmsBillingPeriod } = Digit.Hooks.ws.useGetBillingPeriodValidation(tenantId);

  let connectionFilters = {
    connectionNumber: applicationNo
  };

  const { isLoading: isConnectionDetailsLoading, data: connectionDetailsData } = Digit.Hooks.ws.useOldValue({tenantId : tenantId, filters: { ...connectionFilters },businessService : businessService === "WS"? "WATER" : "SEWERAGE"})

  const {
    isLoading: updatingMeterConnectionLoading,
    isError: updateMeterConnectionError,
    data: updateMeterConnectionResponse,
    error: updateMeterError,
    mutate: meterReadingMutation,
  } = Digit.Hooks.ws.useMeterReadingCreateAPI(businessService);

  useEffect(() => {
    if (!isConnectionDetailsLoading) {
      let connectionDetails = businessService == "WS" ? connectionDetailsData?.WaterConnection : connectionDetailsData?.SewerageConnections;
      let connectionData = connectionDetails?.filter((ob) => ob?.applicationType?.includes("DISCONNECT"));
      if (connectionData?.length == 0) setisAddMeterReadingButtonEnable(true);
      connectionData?.map((data) => {
        if (data?.applicationStatus === "DISCONNECTION_EXECUTED" || data?.applicationStatus === "PENDING_FOR_DISCONNECTION_EXECUTION") setisAddMeterReadingButtonEnable(false);
        else setisAddMeterReadingButtonEnable(true);
      })
    }
  }, [connectionDetailsData])

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
      i18nKey: `WS_SERVICES_CALCULATION_METERSTATUS_${Digit.Utils.locale.getTransformedLocale(response?.meterReadings[0]?.meterStatus)}`,
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

  const onSubmit = async (data) => {
    let fromDate = parseInt(meterDetails?.currentReadingDate);
    let selectedDate = parseInt(convertDateToEpoch(data?.currentReadingDate));
    let toDate = parseInt(convertDateToEpoch(Digit.Utils.date.getDate()));
    if (selectMeterStatus?.code === "Working") {
      if (!data?.currentReading || data?.currentReading == null || data?.currentReading === "") {
        setShowToast({ key: "error", message: t("ERR_CURRENT_READING_REQUIRED") });
        setError(t("ERR_CURRENT_READING_REQUIRED"));
        setTimeout(closeToast, 5000);
        return;
      }
      if (selectedDate < fromDate || selectedDate > toDate) {
        setShowToast({ key: "error", message: t("ERR_CURRENT_READING_DATE_SHOULD_NOT_BE_LESS_THAN_FROM_DATE_AND_NOT_GREATER_THAN_TO_DATE") });
        setError(t("ERR_CURRENT_READING_DATE_SHOULD_NOT_BE_LESS_THAN_FROM_DATE_AND_NOT_GREATER_THAN_TO_DATE"));
        setTimeout(closeToast, 5000);
        return;
      }
      //check if the current reading is less than last reading
      if (data?.currentReading <= details?.[0]?.currentReading) {
        setShowToast({ key: "error", message: t("CURRENT_READING_ERROR") });
        setError(t("CURRENT_READING_ERROR"));
        setTimeout(closeToast, 5000);
        return;
      }
    } else {
      data.currentReading = parseInt(meterDetails?.currentReading) + parseInt(data?.consumption);
    }
    let meterReadingsJS = {
      billingPeriod: `${getDate(meterDetails?.currentReadingDate)} - ${getDate(data?.currentReadingDate)}`,
      connectionNo: meterDetails?.connectionNo,
      currentReading: data?.currentReading,
      currentReadingDate: convertDateToEpoch(data?.currentReadingDate),
      lastReading: meterDetails?.currentReading,
      lastReadingDate: meterDetails?.currentReadingDate,
      meterStatus: selectMeterStatus?.code,
      tenantId: meterDetails?.tenantId,
    };
    let meterReadingsPayload = { meterReadings: meterReadingsJS };

    if (meterReadingMutation) {
      setIsEnableLoader(true);
      await meterReadingMutation(meterReadingsPayload, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setOpenModal(false);
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
      });
    }
  };
  let optionsList = mdmsMeterStatus?.MdmsRes?.["ws-services-calculation"]?.MeterStatus.map((status) => ({
    code: status,
    i18nKey: `WS_SERVICES_CALCULATION_METERSTATUS_${Digit.Utils.locale.getTransformedLocale(status)}`,
  }));

  const onFormValueChange = (setValue, formData, formState) => {
    if (selectMeterStatus?.code === "Working") {
      setCurrentReading(formData?.currentReading);
      setBillingPeriod(`${getDate(meterDetails?.currentReadingDate)} - ${getDate(formData?.currentReadingDate)}`);
      if (parseInt(currentMeterReading) < parseInt(details?.[0]?.lastReading)) {
        formData.consumption = "0";
        setConsumption("0");
      } else {
        formData.consumption = `${parseInt(currentMeterReading) - parseInt(details?.[0]?.currentReading)}`;
        setConsumption(formData.consumption);
      }
    } else {
      setConsumption(formData.consumption);
    }
  };
  let tempObj = {};
  let tempObj1 = {};
  const getDate = (epochdate) => {
    return epochdate
      ? new Date(epochdate).getDate() + "/" + (new Date(epochdate).getMonth() + 1) + "/" + new Date(epochdate).getFullYear().toString()
      : "NA";
  };

  const details = response?.meterReadings;

  const config = {
    label: {
      heading: `WS_CONSUMPTION_BUTTON_METER_READING_LABEL`,
      submit: `CORE_COMMON_SAVE`,
      cancel: "CORE_CHANGE_TENANT_CANCEL",
    },
    form: [
      {
        body: [
          {
            populators: (
              <StatusTable>
                <Row
                  key={t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")}
                  label={`${t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")}`}
                  text={currentBillingPeriod}
                  className="border-none"
                />
              </StatusTable>
            ),
          },
          {
            label: `${t("WS_SERV_DETAIL_METER_STAT")}`,
            isMandatory: true,
            type: "dropdown",
            populators: (
              <Dropdown
                option={optionsList}
                autoComplete="off"
                optionKey="i18nKey"
                id="meterStatus"
                select={(e) => {
                  setSelectMeterStatus(e);
                  setConsumption("");
                }}
                selected={selectMeterStatus}
                t={t}
              />
            ),
          },
          {
            populators: (
              <StatusTable>
                <Row
                  key={t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")}
                  label={`${t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")}`}
                  text={details?.[0]?.currentReading}
                  className="border-none"
                />
              </StatusTable>
            ),
          },
          {
            populators: (
              <StatusTable>
                <Row
                  key={t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")}
                  label={`${t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")}`}
                  text={getDate(details?.[0]?.currentReadingDate)}
                  className="border-none"
                />
              </StatusTable>
            ),
          },
          {
            label: t("WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"),
            isMandatory: selectMeterStatus.code === "Working" ? true : false,
            disable: selectMeterStatus.code === "Working" ? false : true,
            type: "number",
            populators: {
              name: "currentReading",
              ...(tempObj = selectMeterStatus.code === "Working" ? {} : { value: "" }),
            },
          },
          {
            label: t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"),
            isMandatory: selectMeterStatus.code === "Working" ? true : false,
            disable: selectMeterStatus.code === "Working" ? false : true,
            type: "custom",
            populators: {
              name: "currentReadingDate",
              validation: {
                required: selectMeterStatus.code === "Working" ? true : false,
              },
              customProps: {},
              defaultValue: Digit.Utils.date.getDate(),
              component: (props, customProps) => (
                <DatePicker
                  onChange={props.onChange}
                  date={props.value}
                  {...customProps}
                  disabled={selectMeterStatus.code === "Working" ? false : true}
                />
              ),
            },
          },
          {
            label: t("WS_SERV_DETAIL_CONSUMP"),
            isMandatory: false,
            type: "number",
            disable: selectMeterStatus.code === "Working" ? true : false,
            populators: {
              ...(tempObj1 =
                selectMeterStatus.code === "Working"
                  ? {
                      name: "consumption",
                      value: selectedConsumtion,
                    }
                  : {
                      name: "consumption",
                    }),
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

  const consumption = (currentReading, lastReading) => {
    if (currentReading && lastReading) {
      return Number(currentReading - lastReading);
    } else return t("NA");
  };

  if (isLoading || isConnectionDetailsLoading) {
    return <Loader />;
  }
  let { meterReadings } = response || {};
  return (
    <React.Fragment>
      <div>
        <Header styles={{ marginLeft: "15px" }}>{`${t("WS_VIEW_CONSUMPTION")}`}</Header>
        <div>
          {meterReadings?.length > 0 &&
            meterReadings.map((application, index) => (
              <div key={index}>
                <Card>
                  <StatusTable>
                    <Row
                      key={t("WS_MYCONNECTIONS_CONSUMER_NO")}
                      label={`${t("WS_MYCONNECTIONS_CONSUMER_NO")}`}
                      text={application?.connectionNo || t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")}
                      label={`${t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")}`}
                      text={application?.billingPeriod || t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL")}
                      label={`${t("WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL")}`}
                      text={application?.meterStatus || t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")}
                      label={`${t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")}`}
                      text={application?.lastReading || t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")}
                      label={`${t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")}`}
                      text={application?.lastReadingDate ? Digit.DateUtils.ConvertEpochToDate(application?.lastReadingDate) : t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_SERV_DETAIL_CUR_METER_READ")}
                      label={`${t("WS_SERV_DETAIL_CUR_METER_READ")}`}
                      text={application?.currentReading || t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL")}
                      label={`${t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL")}`}
                      text={application?.currentReadingDate ? Digit.DateUtils.ConvertEpochToDate(application?.currentReadingDate) : t("NA")}
                      className="border-none"
                    />
                    <Row
                      key={t("WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL")}
                      label={`${t("WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL")}`}
                      text={consumption(application?.currentReading, application?.lastReading)}
                      className="border-none"
                    />
                  </StatusTable>
                </Card>
              </div>
            ))}
          {!meterReadings?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_CONSUMPTION_FOUND")}</p>}
        </div>
        {isLoading || meterStatusLoading || billingPeriodLoading || !isUserAllowedToAddMeterReading ? null : (
          <div>
            {isAddMeterReadingButtonEnable && <ActionBar>
            <SubmitBar label={t("WS_CONSUMPTION_BUTTON_METER_READING_LABEL")} onSubmit={popUp} />
          </ActionBar>}
          </div>
        )}
      </div>
      {openModal && (
        <Modal
          headerBarMain={<Heading label={t(config.label.heading)} />}
          headerBarEnd={<CloseBtn onClick={closeModal} />}
          actionCancelLabel={t(config.label.cancel)}
          actionCancelOnSubmit={closeModal}
          actionSaveLabel={t(config.label.submit)}
          actionSaveOnSubmit={() => {}}
          formId="modal-action"
          popupStyles={mobileView ? { width: "720px" } : {}}
          popupModuleMianStyles={mobileView ? { paddingLeft: "5px" } : {}}
        >
          {isEnableLoader ? (
            <Loader />
          ) : (
            <FormComposer
              config={config.form}
              onFormValueChange={onFormValueChange}
              cardStyle={{ marginLeft: "0px", marginRight: "0px", marginTop: "-25px" }}
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
      {showToast && (
        <Toast style={{ zIndex: "10000" }} error={showToast?.key === "error" ? true : false} label={t(showToast?.message)} onClose={closeToast} />
      )}
    </React.Fragment>
  );
};
export default ConsumptionDetails;
