import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigWS } from "../../../config/wsCreateConfig";
import { getCommencementDataFormat, stringReplaceAll } from "../../../utils/index";

const getPath = (path, params) => {
  params &&
    Object.keys(params).map((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
  return path;
};

const getEditDetails = (waterResult,sewerageresult,t) => {
    if(waterResult)
    {
    waterResult["ConnectionHolderDetails"] = waterResult?.connectionHolders ? {
      ...waterResult?.connectionHolders?.[0],
      address : waterResult?.connectionHolders?.[0]?.correspondenceAddress,
      documentId : "",
      documentType : "",
      filestoreId : null,
      gender : waterResult?.connectionHolders?.[0]?.gender ? {code :waterResult?.connectionHolders?.[0]?.gender, i18nKey:`COMMON_GENDER_${waterResult?.connectionHolders?.[0]?.gender}` } : null,
      guardian : waterResult?.connectionHolders?.[0]?.fatherOrHusbandName,
      isOwnerSame : waterResult?.connectionHolders?.length>0 ? false : true,
      mobileNumber : waterResult?.connectionHolders?.[0]?.mobileNumber,
      name : waterResult?.connectionHolders?.[0]?.name,
      relationship : waterResult?.connectionHolders?.[0]?.relationship ? {code:waterResult?.connectionHolders?.[0]?.relationship, i18nKey:`COMMON_MASTERS_OWNERTYPE_${waterResult?.connectionHolders?.[0]?.relationship}`}:null,
      specialCategoryType : waterResult?.connectionHolders?.[0]?.ownerType ? {code:waterResult?.connectionHolders?.[0]?.ownerType, i18nKey:`PROPERTYTAX_OWNERTYPE_${waterResult?.connectionHolders?.[0]?.ownerType}`} : ""
    } :
    {
      address : waterResult?.property?.owners?.[0]?.correspondenceAddress,
      documentId : "",
      documentType : "",
      filestoreId : null,
      gender : waterResult?.property?.owners?.[0]?.gender ? {code :waterResult?.property?.owners?.[0]?.gender, i18nKey:`COMMON_GENDER_${waterResult?.property?.owners?.[0]?.gender}` }:null,
      guardian : waterResult?.property?.owners?.[0]?.fatherOrHusbandName,
      isOwnerSame : waterResult?.connectionHolders ? false : true,
      mobileNumber : waterResult?.property?.owners?.[0]?.mobileNumber,
      name : waterResult?.property?.owners?.[0]?.name,
      relationship : waterResult?.property?.owners?.[0]?.relationship ? {code:waterResult?.property?.owners?.[0]?.relationship, i18nKey:`COMMON_MASTERS_OWNERTYPE_${waterResult?.property?.owners?.[0]?.relationship}`}:null,
      specialCategoryType : waterResult?.connectionHolders?.[0]?.ownerType? {code:waterResult?.connectionHolders?.[0]?.ownerType, i18nKey:`PROPERTYTAX_OWNERTYPE_${waterResult?.connectionHolders?.[0]?.ownerType}`} : ""
    }
    waterResult.WaterConnectionResult={WaterConnection:[{...waterResult}]}
    waterResult.cpt = {details:{...waterResult?.property}}
    waterResult.cptId = {id:waterResult?.propertyId}
    waterResult.documents = {documents : waterResult?.documents}
    waterResult.plumberPreference = { plumberPreference : {code:"ULB", i18nKey:"WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE"}}
    waterResult.serviceName = waterResult?.applicationType?.includes("WATER") ? {code:"WATER",i18nKey:"WS_WATER_CONNECTION_ONLY"} : {code:"SEWERAGE",i18nKey:"WS_SEWERAGE_CONNECTION_ONLY"}
    waterResult.waterConectionDetails = {
      proposedPipeSize : {code:waterResult?.proposedPipeSize, i18nKey:`${waterResult?.proposedPipeSize} ${t("WS_INCHES_LABEL")}`, size:waterResult?.proposedPipeSize},
      proposedTaps : waterResult?.proposedTaps,
    }
    }
    else if(sewerageresult)
    {
      sewerageresult.ConnectionHolderDetails = sewerageresult?.connectionHolders ? {
          ...sewerageresult?.connectionHolders?.[0],
          address : sewerageresult?.connectionHolders?.[0]?.correspondenceAddress,
          documentId : "",
          documentType : "",
          filestoreId : null,
          gender : sewerageresult?.connectionHolders?.[0]?.gender ? {code :sewerageresult?.connectionHolders?.[0]?.gender, i18nKey:`COMMON_GENDER_${sewerageresult?.connectionHolders?.[0]?.gender}` }:null,
          guardian : sewerageresult?.connectionHolders?.[0]?.fatherOrHusbandName,
          isOwnerSame : sewerageresult?.connectionHolders?.length>0 ? false : true,
          mobileNumber : sewerageresult?.connectionHolders?.[0]?.mobileNumber,
          name : sewerageresult?.connectionHolders?.[0]?.name,
          relationship : sewerageresult?.connectionHolders?.[0]?.relationship ? {code:sewerageresult?.connectionHolders?.[0]?.relationship, i18nKey:`COMMON_MASTERS_OWNERTYPE_${sewerageresult?.connectionHolders?.[0]?.relationship}`}:null,
          specialCategoryType :sewerageresult?.connectionHolders?.[0]?.ownerType ? {code:sewerageresult?.connectionHolders?.[0]?.ownerType, i18nKey:`PROPERTYTAX_OWNERTYPE_${sewerageresult?.connectionHolders?.[0]?.ownerType}`} : ""
        
      } :
    {
      address : sewerageresult?.property?.owners?.[0]?.correspondenceAddress,
      documentId : "",
      documentType : "",
      filestoreId : null,
      gender : sewerageresult?.property?.owners?.[0]?.gender ? {code :sewerageresult?.property?.owners?.[0]?.gender, i18nKey:`COMMON_GENDER_${sewerageresult?.property?.owners?.[0]?.gender}` } : null,
      guardian : sewerageresult?.property?.owners?.[0]?.fatherOrHusbandName,
      isOwnerSame : sewerageresult?.connectionHolders ? false : true,
      mobileNumber : sewerageresult?.property?.owners?.[0]?.mobileNumber,
      name : sewerageresult?.property?.owners?.[0]?.name,
      relationship : sewerageresult?.property?.owners?.[0]?.relationship ? {code:sewerageresult?.property?.owners?.[0]?.relationship, i18nKey:`COMMON_MASTERS_OWNERTYPE_${sewerageresult?.property?.owners?.[0]?.relationship}`} : null,
      specialCategoryType : sewerageresult?.connectionHolders?.[0]?.ownerType ? {code:sewerageresult?.connectionHolders?.[0]?.ownerType, i18nKey:`PROPERTYTAX_OWNERTYPE_${sewerageresult?.connectionHolders?.[0]?.ownerType}`} : ""
    }
    sewerageresult.SewerageConnectionResult={SewerageConnections:[{...sewerageresult}]}
    sewerageresult.cpt = {details:{...sewerageresult?.property}}
    sewerageresult.cptId = {id:sewerageresult?.propertyId}
    sewerageresult.documents = {documents : [...sewerageresult?.documents]}
    sewerageresult.plumberPreference = {plumberPreference:{ code:"ULB", i18nKey:"WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE"}}
    sewerageresult.serviceName = sewerageresult?.applicationType.includes("WATER") ? {code:"WATER",i18nKey:"WS_WATER_CONNECTION_ONLY"} : {code:"SEWERAGE",i18nKey:"WS_SEWERAGE_CONNECTION_ONLY"}
    sewerageresult.sewerageConnectionDetails = {
      proposedToilets: sewerageresult?.proposedToilets,
      proposedWaterClosets : sewerageresult?.proposedWaterClosets,
    }
    }

if(waterResult)
  return {...waterResult};
else
  return {...sewerageresult};
};

const EditApplication = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  let match = useRouteMatch();
  const { t } = useTranslation();
  let {  tenantId } = useParams();
  const { pathname, state } = useLocation();
  const history = useHistory();
  let applicationNumber = state?.id || sessionStorage.getItem("ApplicationNoState");
  let config = [];
  let waterapplication = {};
  let sewerageapplication = {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("WS_EDIT_APPLICATION", {});

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: configLoading } = Digit.Hooks.ws.useWSConfigMDMS.getFormConfig(stateId, {});

  let filter1 = {};

  if (applicationNumber) filter1.applicationNumber = applicationNumber;
  if (tenantId) filter1.tenantId = tenantId;

  //filter1 = {tenantId: tenantId, applicationNumber: applicationNobyData }
  const {data : Waterresult} =  Digit.Hooks.ws.useWaterSearch({ tenantId, filters:{...filter1,isInternalCall:true},BusinessService:"WS", t },{enabled:applicationNumber && applicationNumber.includes("WS") ? true : false});
  const {data : Sewarageresult} = Digit.Hooks.ws.useSewarageSearch({ tenantId, filters:{...filter1,isInternalCall:true},BusinessService:"SW",t },{enabled:applicationNumber && applicationNumber.includes("SW") ? true : false});
  let isModifyEdit = window.location.href.includes("/modify-connection/") || window.location.href.includes("/edit-application/")

  useEffect(() => {
    waterapplication = Waterresult;
    sewerageapplication = Sewarageresult;
    if (((Waterresult && waterapplication) || (Sewarageresult && sewerageapplication )) && (!(Object.keys(params).length>0) || ( waterapplication && params?.applicationNo !== waterapplication?.applicationNo || sewerageapplication && params?.applicationNo !== sewerageapplication?.applicationNo) )) {
        waterapplication = Waterresult;
        sewerageapplication = Sewarageresult;
      if (window.location.href.includes("edit-application")) {
        if(waterapplication)
        {
          waterapplication.isEditApplication = true;
          waterapplication.isModifyConnection = false;
        }
        if(sewerageapplication)
        {
          sewerageapplication.isEditApplication = true;
          sewerageapplication.isModifyConnection = false;
        }
      }
      else if(window.location.href.includes("modify-connection")){
        if(waterapplication)
        {
          waterapplication.isModifyConnection = true;
          waterapplication.isEditApplication = false;
        }
        if(sewerageapplication)
        {
          sewerageapplication.isModifyConnection = true;
          sewerageapplication.isEditApplication = false;
        }
      }
      sessionStorage.setItem("WaterInitialObject", JSON.stringify({ ...waterapplication }));
      sessionStorage.setItem("SewerageInitialObject", JSON.stringify({ ...sewerageapplication }));
      let EditDetails = getEditDetails(waterapplication,sewerageapplication,t);
      setParams({ ...params, ...EditDetails });
    }

    //const setCustomEditState = Digit?.ComponentRegistryService?.getComponent("TLCitizenEditFormDataLoad");
    //if (setCustomEditState) setCustomEditState({ data, setParams, params, licenseNo, tenantId });
    
  }, [Waterresult,Sewarageresult]);

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    let { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let routeObject = config.find((routeObj) => routeObj.route === currentPath && routeObj);
    if (typeof nextStep == "object" && nextStep != null) {
      if (
        nextStep[sessionStorage.getItem("KnowProperty")] &&
        (nextStep[sessionStorage.getItem("KnowProperty")] === "search-property" || nextStep[sessionStorage.getItem("KnowProperty")] === "create-property")
      ) {
        nextStep = `${nextStep[sessionStorage.getItem("KnowProperty")]}`;
      }
    }
    if (routeObject[sessionStorage.getItem("serviceName")]) nextStep = routeObject[sessionStorage.getItem("serviceName")];
    if( (params?.cptId?.id || params?.cpt?.details?.propertyId || (isModifyEdit && params?.cpt?.details?.propertyId ))  && nextStep === "know-your-property" )
    { 
      nextStep = "property-details";
    }
    if(nextStep === "docsrequired" && sessionStorage.getItem("changePropertySelected") === "yes")
    {
      nextStep = "property-details";
    }
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);
  }
  const onSuccess = () => {
    queryClient.invalidateQueries("WS_CREATE");
  };
  const createApplication = async () => {
    history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else if (key === "") setParams({ ...data });
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep);
  };
  const handleSkip = () => { };
  newConfig = newConfig?.WSCreateConfig ? newConfig?.WSCreateConfig : newConfigWS;
  newConfig?.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "property-details";
  if ((Waterresult && Object.keys(Waterresult).length>0 || !Sewarageresult) && Waterresult?.isLoading || Sewarageresult?.isLoading || configLoading) {
    return <Loader />;
  }
  const CheckPage = Digit?.ComponentRegistryService?.getComponent('WSCheckPage') ;
  const Acknowledgement = Digit?.ComponentRegistryService?.getComponent('WSAcknowledgement') ;
  //const CheckPage = Digit?.ComponentRegistryService?.getComponent('TLCheckPage') ;
  //const TLAcknowledgement = Digit?.ComponentRegistryService?.getComponent('TLAcknowledgement');
  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key, isSkipEnabled } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key, isSkipEnabled }}  onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} userType={"citizen"} />
          </Route>
        );
      })}
      <Route path={`${getPath(match.path, match.params)}/check`}>
        <CheckPage onSubmit={createApplication} value={params} />
      </Route>
      <Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <Acknowledgement data={params} onSuccess={onSuccess} clearParams={clearParams} />
      </Route>
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default EditApplication;
