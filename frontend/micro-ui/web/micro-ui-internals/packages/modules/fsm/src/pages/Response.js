import React, { useEffect } from "react";
import { Card, Banner, CardText, SubmitBar, Loader, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import getPDFData from "../getPDFData";
import { getVehicleType } from "../utils";

const GetMessage = (type, action, isSuccess, isEmployee, t, paymentPreference) => {
  return t(
    `${isEmployee ? "E" : "C"}S_FSM_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}${
      paymentPreference === "POST_PAY" ? "_POST_PAY" : ""
    }`
  );
};

const GetActionMessage = (action, isSuccess, isEmployee, t) => {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

const GetLabel = (action, isSuccess, isEmployee, t) => {
  return GetMessage("LABEL", action, isSuccess, isEmployee, t);
};

const DisplayText = (action, isSuccess, isEmployee, t, paymentPreference) => {
  return GetMessage("DISPLAY", action, isSuccess, isEmployee, t, paymentPreference);
};

const BannerPicker = (props) => {
  let actionMessage = props.data?.fsm?.[0].applicationStatus;
  if (props.data?.fsm?.[0].applicationStatus === "ASSIGN_DSO") {
    actionMessage = props.action === "SUBMIT" ? props.action : props.data?.fsm?.[0].applicationStatus;
  }
  let labelMessage = GetLabel(props.data?.fsm?.[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t);
  if (props.errorInfo && props.errorInfo !== null && props.errorInfo !== "" && typeof props.errorInfo === "string") {
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const paymentAccess = Digit.UserService.hasAccess("FSM_COLLECTOR");

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { state } = props.location;

  const mutation = state.key === "update" ? Digit.Hooks.fsm.useApplicationActions(tenantId) : Digit.Hooks.fsm.useDesludging(tenantId);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

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

  const handleDownloadPdf = () => {
    const { fsm } = mutation.data || successData;
    const [applicationDetails, ...rest] = fsm;
    const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);

    const data = getPDFData({ ...applicationDetails, slum, pdfVehicleType }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
      setMutationHappened(true);
      // window.history.replaceState({}, "FSM_CREATE_RESPONSE")
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

  if (mutation.isLoading || (mutation.isIdle && !mutationHappened)) {
    return <Loader />;
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
      <CardText>{DisplayText(state.action, isSuccess, props.parentRoute.includes("employee"), t, state?.fsm?.paymentPreference)}</CardText>
      {isSuccess && (
        <LinkButton
          label={
            <div className="response-download-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </span>
              <span className="download-button">{t("CS_COMMON_DOWNLOAD")}</span>
            </div>
          }
          style={{ width: "100px" }}
          onClick={handleDownloadPdf}
        />
      )}
      <Link to={`${props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen"}`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
      {props.parentRoute.includes("employee") &&
        (state?.applicationData?.applicationNo || (isSuccess && Data?.fsm?.[0].applicationNo)) &&
        paymentAccess &&
        isSuccess ? (
        <div className="secondary-action">
          <Link to={`/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/${state?.applicationData?.applicationNo || Data?.fsm?.[0].applicationNo}`}>
            <SubmitBar label={t("ES_COMMON_PAY")} />
          </Link>
        </div>
      ) : null}
    </Card>
  );
};

export default Response;
