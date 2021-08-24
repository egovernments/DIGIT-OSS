import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/ocEdcrConfig";
import { uuidv4 } from "../../../utils";
import EDCRAcknowledgement from "./EDCRAcknowledgement";

const CreateOCEDCR = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("EDCR_CREATE", {});
  const [isShowToast, setIsShowToast] = useState(null);

  // function handleSelect(key, data, skipStep, index) {
  //   const loggedInuserInfo = Digit.UserService.getUser();
  //   const userInfo = { id: loggedInuserInfo?.info?.uuid, tenantId: loggedInuserInfo?.info?.tenantId };
  //   let edcrRequest = {
  //     transactionNumber: "",
  //     edcrNumber: "",
  //     planFile: null,
  //     tenantId: "",
  //     RequestInfo: {
  //       apiId: "",
  //       ver: "",
  //       ts: "",
  //       action: "",
  //       did: "",
  //       authToken: "",
  //       key: "",
  //       msgId: "",
  //       correlationId: "",
  //       userInfo: userInfo
  //     }
  //   };

  //   const applicantName = data?.applicantName;
  //   const file = data?.file;
  //   const tenantId = data?.tenantId?.code;
  //   const transactionNumber = uuidv4();
  //   const appliactionType = "BUILDING_PLAN_SCRUTINY";
  //   const applicationSubType = "NEW_CONSTRUCTION";

  //   edcrRequest = { ...edcrRequest, tenantId };
  //   edcrRequest = { ...edcrRequest, transactionNumber };
  //   edcrRequest = { ...edcrRequest, applicantName };
  //   edcrRequest = { ...edcrRequest, appliactionType };
  //   edcrRequest = { ...edcrRequest, applicationSubType };

  //   let bodyFormData = new FormData();
  //   bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
  //   bodyFormData.append("planFile", file);

  //   Digit.EDCRService.create({ data: bodyFormData }, tenantId)
  //     .then((result, err) => {
  //       if (result?.data?.edcrDetail) {
  //         setParams(result?.data?.edcrDetail);
  //         history.replace(
  //           `/digit-ui/citizen/obps/edcrscrutiny/apply/acknowledgement`, ///${result?.data?.edcrDetail?.[0]?.edcrNumber}
  //           { data: result?.data?.edcrDetail }
  //         );
  //       }
  //     })
  //     .catch((e) => {
  //       setIsShowToast({ key: true, label: e?.response?.data?.errorCode })
  //     });

  // }

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
    debugger;
    if (isFromCreateApi) setParams(data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data }}});
    if(!skipStep) goNext(skipStep);
  };

  const handleSkip = () => { };
  const handleMultiple = () => { };

  const onSuccess = () => {
    sessionStorage.removeItem("CurrentFinancialYear");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.forEach(data => {
    if(data?.component == "OCeDCRScrutiny" && params?.ScrutinyDetails?.edcrNumber) {
      data.texts.submitBarLabel = "CS_COMMON_NEXT";
    } else if(data?.component == "OCeDCRScrutiny" && !params?.ScrutinyDetails?.edcrNumber) {
      data.texts.submitBarLabel = "";
    }
  })
  config.indexRoute = "home";

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} isShowToast={isShowToast} />
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
