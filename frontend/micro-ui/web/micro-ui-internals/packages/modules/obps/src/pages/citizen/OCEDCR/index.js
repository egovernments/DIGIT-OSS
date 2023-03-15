import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigOCEDCR } from "../../../config/ocEdcrConfig";
import { uuidv4, convertDateToEpoch } from "../../../utils";
// import EDCRAcknowledgement from "./EDCRAcknowledgement";

const CreateOCEDCR = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("OC_EDCR_CREATE", {});
  const [isShowToast, setIsShowToast] = useState(null);
  const [isSubmitBtnDisable, setIsSubmitBtnDisable] = useState(false);
  Digit.SessionStorage.set("EDCR_BACK", "IS_EDCR_BACK");

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(stateId, []);

  function createOCEdcr(key, uploadData, skipStep, isFromCreateApi) {
    setIsSubmitBtnDisable(true);
    const data = params;
    const loggedInuserInfo = Digit.UserService.getUser();
    const userInfo = { id: loggedInuserInfo?.info?.uuid, tenantId: loggedInuserInfo?.info?.tenantId };
    let edcrRequest = {
      transactionNumber: "",
      edcrNumber: "",
      planFile: null,
      tenantId: "",
      RequestInfo: {
        apiId: "",
        ver: "",
        ts: "",
        action: "",
        did: "",
        authToken: "",
        key: "",
        msgId: "",
        correlationId: "",
        userInfo: userInfo
      }
    };

    const transactionNumber = uuidv4();
    const edcrNumber = data?.ScrutinyDetails?.edcrNumber;
    const tenantId = data?.ScrutinyDetails?.tenantId;
    const applicantName = data?.ScrutinyDetails?.applicantName;
    const appliactionType = "BUILDING_OC_PLAN_SCRUTINY";
    const applicationSubType = "NEW_CONSTRUCTION";
    const permitDate = convertDateToEpoch(data?.ScrutinyDetails?.ocPermitdate);
    const permitNumber = data?.ScrutinyDetails?.ocPermitNumber;
    const comparisonEdcrNumber = data?.ScrutinyDetails?.edcrNumber;
    const file = uploadData?.file;

    edcrRequest = { ...edcrRequest, transactionNumber };
    edcrRequest = { ...edcrRequest, edcrNumber };
    edcrRequest = { ...edcrRequest, tenantId };
    edcrRequest = { ...edcrRequest, applicantName };
    edcrRequest = { ...edcrRequest, appliactionType };
    edcrRequest = { ...edcrRequest, applicationSubType };
    edcrRequest = { ...edcrRequest, permitDate };
    edcrRequest = { ...edcrRequest, permitNumber };
    edcrRequest = { ...edcrRequest, comparisonEdcrNumber };

    let bodyFormData = new FormData();
    bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
    bodyFormData.append("planFile", file);

    Digit.EDCRService.create({ data: bodyFormData }, tenantId)
      .then((result, err) => {
        setIsSubmitBtnDisable(false);
        if (result?.data?.edcrDetail) {
          setParams(result?.data?.edcrDetail);
          history.replace(
            `/digit-ui/citizen/obps/edcrscrutiny/oc-apply/acknowledgement`,
            { data: result?.data?.edcrDetail }
          );
        }
      })
      .catch((e) => {
        setParams({data: e?.response?.data?.errorCode ? e?.response?.data?.errorCode : "BPA_INTERNAL_SERVER_ERROR", type: "ERROR"});
        setIsSubmitBtnDisable(false);
        setIsShowToast({ key: true, label: e?.response?.data?.errorCode ? e?.response?.data?.errorCode : "BPA_INTERNAL_SERVER_ERROR" })
      });
  }

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${path}/check`);
    }
    redirectWithHistory(`${path}/${nextStep}`);
  }

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) createOCEdcr(key, data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    if (!skipStep) goNext(skipStep);
  };

  const handleSkip = () => { };
  const handleMultiple = () => { };

  const onSuccess = () => {
    sessionStorage.removeItem("CurrentFinancialYear");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };
  newConfig = newConfig?.OCEdcrConfig ? newConfig?.OCEdcrConfig : newConfigOCEDCR;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "docs-required";

  const EDCRAcknowledgement = Digit?.ComponentRegistryService?.getComponent('OCEDCRAcknowledgement');

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} isShowToast={isShowToast} isSubmitBtnDisable={isSubmitBtnDisable} setIsShowToast={setIsShowToast}/>
          </Route>
        );
      })}
      <Route path={`${match.path}/acknowledgement`}>
        <EDCRAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default CreateOCEDCR;
