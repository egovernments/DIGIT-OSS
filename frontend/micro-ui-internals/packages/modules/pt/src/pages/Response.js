import React, { useEffect, useState } from "react";
import { Card, Banner, CardText, SubmitBar, Loader, LinkButton, Toast, ActionBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

const GetMessage = (type, action, isSuccess, isEmployee, t) => {
  return t(`${isEmployee ? "E" : "C"}S_PT_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}`);
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
      message={GetActionMessage(props.data?.Properties[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t)}
      applicationNumber={props.data?.Properties[0].acknowldgementNumber}
      info={GetLabel(props.data?.Properties[0].applicationStatus || props.action, props.isSuccess, props.isEmployee, props.t)}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { state } = props.location;

  const mutation = state.key === "UPDATE" ? Digit.Hooks.pt.usePropertyAPI(tenantId, false) : Digit.Hooks.pt.usePropertyAPI(tenantId);

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    };
    const onError = (error, variables) => {
      setShowToast({ key: "error" });
      setError(error?.response?.data?.Errors[0]?.message || null);
    };

    mutation.mutate(
      {
        Property: state?.Property,
      },
      {
        onError,
        onSuccess,
      }
    );
  }, []);

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />;
  }

  return (
    <div>
      <Card>
        <BannerPicker
          t={t}
          data={mutation?.data}
          action={state?.action}
          isSuccess={mutation?.isSuccess}
          isLoading={mutation?.isIdle || mutation?.isLoading}
          isEmployee={props.parentRoute.includes("employee")}
        />
        <CardText>{DisplayText(state.action, mutation.isSuccess, props.parentRoute.includes("employee"), t)}</CardText>
      </Card>
      {showToast && <Toast error={showToast.key === "error" ? true : false} label={error} onClose={closeToast} />}
      <ActionBar>
        <Link to={`${props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen"}`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </div>
  );
};

export default Response;
