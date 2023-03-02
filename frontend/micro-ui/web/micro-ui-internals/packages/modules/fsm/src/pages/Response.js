import React, { useEffect, useState } from "react";
import { Card, Banner, CardText, SubmitBar, Loader, LinkButton, Toast, ActionBar, Menu } from "@egovernments/digit-ui-react-components";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import getPDFData from "../getPDFData";
import { getVehicleType } from "../utils";

const GetMessage = (type, action, isSuccess, isEmployee, t, data) => {
  const zeroPricing = data?.additionalDetails?.tripAmount === 0 || data?.additionalDetails?.tripAmount === null || false;
  const advanceZero = data?.advanceAmount === 0 || false;
  return t(
    `${isEmployee ? "E" : "C"}S_FSM_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}${
      advanceZero ? "_POST_PAY" : zeroPricing ? "_ZERO_PAY" : ""
    }`
  );
};

const GetActionMessage = (action, isSuccess, isEmployee, t) => {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

const GetLabel = (action, isSuccess, isEmployee, t) => {
  return GetMessage("LABEL", action, isSuccess, isEmployee, t);
};

const DisplayText = (action, isSuccess, isEmployee, t, data) => {
  return GetMessage("DISPLAY", action, isSuccess, isEmployee, t, data);
};

const BannerPicker = (props) => {
  let actionMessage = props?.action ? props.action : "CREATE";
  let labelMessage = GetLabel(props.data?.fsm?.[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t);

  if (props.errorInfo && props.errorInfo !== null && props.errorInfo !== "" && typeof props.errorInfo === "string" && props.action !== "SCHEDULE") {
    labelMessage = props.errorInfo;
  }
  return (
    <Banner
      message={GetActionMessage(actionMessage || props.action, props.isSuccess, props.isEmployee, props.t)}
      applicationNumber={props.data?.fsm?.[0].applicationNo}
      info={labelMessage}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const paymentAccess = Digit.UserService.hasAccess("FSM_COLLECTOR");
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  const isCitizen = Digit.UserService.hasAccess("CITIZEN") || window.location.pathname.includes("citizen") || false;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { state } = props.location;

  const mutation = state.key === "update" ? Digit.Hooks.fsm.useApplicationActions(tenantId) : Digit.Hooks.fsm.useDesludging(tenantId);

  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || error?.message || "ERROR");
    setMutationHappened(true);
  };
  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);
  const localityCode = mutation?.data?.fsm?.[0].address?.locality?.code;
  const slumCode = mutation?.data?.fsm?.[0].address?.slumName;
  const slum = Digit.Hooks.fsm.useSlum(mutation?.data?.fsm?.[0]?.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false,
  });
  const { data: vehicleMenu } = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleType", { staleTime: Infinity });
  const Data = mutation?.data || successData;
  const vehicle = vehicleMenu?.find((vehicle) => Data?.fsm?.[0]?.vehicleType === vehicle?.code);
  const pdfVehicleType = getVehicleType(vehicle, t);
  let getApplicationNo = Data.fsm?.[0].applicationNo;

  const { data: paymentsHistory } = Digit.Hooks.fsm.usePaymentHistory(tenantId, getApplicationNo);

  const handleDownloadPdf = () => {
    const { fsm } = mutation.data || successData;
    const [applicationDetails, ...rest] = fsm;
    const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);

    const data = getPDFData({ ...applicationDetails, slum, pdfVehicleType }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  const downloadPaymentReceipt = async () => {
    const receiptFile = { filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId] };

    if (!receiptFile?.fileStoreIds?.[0]) {
      const newResponse = await Digit.PaymentService.generatePdf(stateId, { Payments: [paymentsHistory.Payments[0]] }, "fsm-receipt");
      const fileStore = await Digit.PaymentService.printReciept(stateId, { fileStoreIds: newResponse.filestoreIds[0] });
      window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
      setShowOptions(false);
    } else {
      const fileStore = await Digit.PaymentService.printReciept(stateId, { fileStoreIds: receiptFile.filestoreIds[0] });
      window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
      setShowOptions(false);
    }
  };

  const handleResponse = () => {
    if (Data?.fsm?.[0].paymentPreference === "POST_PAY") {
      setShowToast({ key: "error", action: `ES_FSM_PAYMENT_BEFORE_SCHEDULE_FAILURE` });
      setTimeout(() => {
        closeToast();
      }, 5000);
    } else {
      history.push(`/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/${state?.applicationData?.applicationNo || Data?.fsm?.[0].applicationNo}`);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
      setMutationHappened(true);
      window.history.replaceState({}, "FSM_CREATE_RESPONSE");
    };
    if (!mutationHappened && !errorInfo) {
      if (state.key === "update") {
        mutation.mutate(
          {
            fsm: state.applicationData,
            workflow: {
              action: state.action,
              ...state.actionData,
            },
          },
          {
            onError,
            onSuccess,
          }
        );
      } else {
        mutation.mutate(state, {
          onError,
          onSuccess,
        });
      }
    }
  }, []);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const handleGeneratePdf = () => {
    if (Data?.fsm?.[0].applicationStatus === "COMPLETED" && Data?.fsm?.[0].advanceAmount !== null) {
      return downloadPaymentReceipt;
    }
    return handleDownloadPdf;
  };

  const generatePdfLabel = () => {
    if (Data?.fsm?.[0].applicationStatus === "COMPLETED" && Data?.fsm?.[0].advanceAmount !== null) {
      return t("CS_COMMON_PAYMENT_RECEIPT");
    }
    return t("CS_COMMON_DOWNLOAD");
  };

  useEffect(() => {
    switch (selectedAction) {
      case "GO_TO_HOME":
        return isCitizen ? history.push("/digit-ui/citizen") : history.push("/digit-ui/employee");
      case "ASSIGN_TO_DSO":
        return history.push(`/digit-ui/employee/fsm/application-details/${getApplicationNo}`);
      case "PAY":
        return handleResponse();
    }
  }, [selectedAction]);

  if (mutation.isLoading || (mutation.isIdle && !mutationHappened)) {
    return <Loader />;
  }
  let ACTIONS = ["GO_TO_HOME"];
  if (Data?.fsm?.[0].applicationStatus === "PENDING_APPL_FEE_PAYMENT" && paymentAccess) {
    ACTIONS = [...ACTIONS, "PAY"];
  } else if (Data?.fsm?.[0].applicationStatus === "ASSING_DSO" && FSM_EDITOR) {
    ACTIONS = [...ACTIONS, "ASSIGN_TO_DSO"];
  }

  const isSuccess = !successData ? mutation?.isSuccess : true;
  return (
    <Card>
      <BannerPicker
        t={t}
        data={Data}
        action={state.action}
        isSuccess={isSuccess}
        isLoading={(mutation.isIdle && !mutationHappened) || mutation?.isLoading}
        isEmployee={props.parentRoute.includes("employee")}
        errorInfo={errorInfo}
      />
      <CardText>{DisplayText(state.action, isSuccess, props.parentRoute.includes("employee"), t, Data?.fsm?.[0])}</CardText>
      {isSuccess && (
        <LinkButton
          label={
            <div className="response-download-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </span>
              <span className="download-button">{generatePdfLabel()} </span>
            </div>
          }
          style={{ width: "100px" }}
          onClick={handleGeneratePdf()}
        />
      )}
      <ActionBar>
        {displayMenu ? <Menu localeKeyPrefix={"ES_COMMON"} options={ACTIONS} t={t} onSelect={onActionSelect} /> : null}
        {ACTIONS.length === 1 ? (
          <SubmitBar label={t(`ES_COMMON_${ACTIONS[0]}`)} onSubmit={() => onActionSelect(ACTIONS[0])} />
        ) : (
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        )}
      </ActionBar>

      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? showToast.action : `ES_FSM_PAYMENT_BEFORE_SCHEDULE_FAILURE`)}
          onClose={closeToast}
        />
      )}
    </Card>
  );
};

export default Response;
