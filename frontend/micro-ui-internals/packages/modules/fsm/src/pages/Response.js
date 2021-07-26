import React, { useEffect } from "react";
import { Card, Banner, CardText, SubmitBar, Loader, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import getPDFData from "../getPDFData";
import { getVehicleType } from "../utils";

const GetMessage = (type, action, isSuccess, isEmployee, t) => {
  //   if (isSuccess) {
  //     switch (action) {
  //       case "REOPEN":
  //         return t(`CS_COMMON_COMPLAINT_REOPENED`);
  //       case "RATE":
  //         return t("CS_COMMON_THANK_YOU");
  //       case "PENDING_APPL_FEE_PAYMENT":
  //         return t("CS_FILE_DESLUDGING_APPLICATION_SUCCESS");
  //       case "SUBMIT_FEEDBACK":
  //       case "COMPLETED":
  //         return t("CS_APPLICATION_FEEDBACK_SUCCESSFUL");
  //       default:
  //         return t(`CS_COMMON_THANK_YOU`);
  //     }
  //   }

  //   switch (action) {
  //     case "REOPEN":
  //       return t(`CS_COMMON_COMPLAINT_REOPENED_FAILED`);
  //     case "RATE":
  //       return t("CS_COMMON_ERROR");
  //     case "PENDING_APPL_FEE_PAYMENT":
  //       return t("CS_FILE_DESLUDGING_APPLICATION_FAILED");
  //     case "SUBMIT_FEEDBACK":
  //       return t("CS_APPLICATION_FEEDBACK_FAILED");
  //     default:
  //       return t(`CS_COMMON_SOMETHING_WENT_WRONG`);
  //   }
  return t(`${isEmployee ? "E" : "C"}S_FSM_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}`);
};

const GetActionMessage = (action, isSuccess, isEmployee, t) => {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

const GetLabel = (action, isSuccess, isEmployee, t) => {
  return GetMessage("LABEL", action, isSuccess, isEmployee, t);
};

const DisplayText = (action, isSuccess, isEmployee, t) => {
  return GetMessage("DISPLAY", action, isSuccess, isEmployee, t);
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props.data?.fsm[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t)}
      applicationNumber={props.data?.fsm[0].applicationNo}
      info={GetLabel(props.data?.fsm[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t)}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const paymentAccess = Digit.UserService.hasAccess("FSM_COLLECTOR");
  // console.log("find payment Roles here", paymentAccess)

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { state } = props.location;

  const mutation = state.key === "update" ? Digit.Hooks.fsm.useApplicationActions(tenantId) : Digit.Hooks.fsm.useDesludging(tenantId);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};

  const localityCode = mutation?.data?.fsm[0].address?.locality?.code;
  const slumCode = mutation?.data?.fsm[0].address?.slumName;
  // console.log("find mutation here", mutation);
  // debugger
  const slum = Digit.Hooks.fsm.useSlum(mutation?.data?.fsm[0]?.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false,
  });
  const { data: vehicleMenu } = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleType", { staleTime: Infinity });
  const vehicle = vehicleMenu?.find((vehicle) => mutation?.data?.fsm[0]?.vehicleType === vehicle?.code);
  const pdfVehicleType = getVehicleType(vehicle, t);

  const handleDownloadPdf = () => {
    const { fsm } = mutation.data;
    const [applicationDetails, ...rest] = fsm;
    const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);

    const data = getPDFData({ ...applicationDetails, slum, pdfVehicleType }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    };
    if (state.key === "update") {
      // console.log("find state here", state.applicationData, state.action)
      mutation.mutate(
        {
          fsm: state.applicationData,
          workflow: {
            action: state.action,
            ...state.actionData,
          },
        },
        {
          onSuccess,
        }
      );
    } else {
      // console.log("find state here", state);
      mutation.mutate(state, {
        onSuccess,
      });
    }
  }, []);

  const displayText = (action) => {
    // console.log("find new application action here", action)
    // console.log("find mutation error here", mutation)
    if (mutation.isSuccess) {
      switch (action) {
        case "SUBMIT_FEEDBACK":
          return t("CS_SUBMIT_FEEDBACK_RESPONSE");
        case "SUBMIT":
          return t("CS_SUBMIT_APPLICATION_RESPONSE");
        case undefined:
          return t("CS_FILE_PROPERTY_RESPONSE");
        default:
          return t("CS_COMMON_THANK_YOU");
      }
    } else if (mutation.isError) {
      switch (action) {
        default:
          return mutation?.error?.message;
      }
    }
  };
  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />;
  }

  return (
    <Card>
      <BannerPicker
        t={t}
        data={mutation.data}
        action={state.action}
        isSuccess={mutation.isSuccess}
        isLoading={mutation.isIdle || mutation.isLoading}
        isEmployee={props.parentRoute.includes("employee")}
      />
      <CardText>{DisplayText(state.action, mutation.isSuccess, props.parentRoute.includes("employee"), t)}</CardText>
      {mutation.isSuccess && (
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
      (state?.applicationData?.applicationNo || (mutation.isSuccess && mutation.data.fsm[0].applicationNo)) &&
      paymentAccess &&
      mutation.isSuccess ? (
        <div className="secondary-action">
          <Link
            to={`/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/${state?.applicationData?.applicationNo || mutation.data.fsm[0].applicationNo}`}
          >
            <SubmitBar label={t("ES_COMMON_PAY")} />
          </Link>
        </div>
      ) : null}
    </Card>
  );
};

export default Response;
