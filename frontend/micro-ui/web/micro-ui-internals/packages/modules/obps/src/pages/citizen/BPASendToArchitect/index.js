import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigBPA } from "../../../config/buildingPermitConfig";
const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

const getBPAEditDetails = async (data, APIScrutinyDetails,mdmsData,nocdata,t) => {

  const getBlockIds = (unit) => {
    let blocks = {};
    unit && unit.map((ob, index) => {
      blocks[`Block_${index+1}`]=ob.id;
    });
    return blocks;
  }

  const getBlocksforFlow = (unit) => {
    let arr=[];
    let subBlocks = [];
    let subOcc = {};
    unit && unit.map((un, index) => {
      arr = un?.usageCategory ? un?.usageCategory?.split(",") : [];
      subBlocks=[];
      arr && arr.map((ob, ind) => {
        subBlocks.push({
          code:ob,
          i18nKey:`BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".","_")}`,
          name:t(`BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".","_")}`),
        })
      })
      if(subBlocks) subOcc[`Block_${index+1}`]=subBlocks;
    });

    return subOcc;
    
  }

  data.BlockIds=getBlockIds(data?.landInfo?.unit);
  data.address = data?.landInfo?.address;
  data.address.city = { code:data?.landInfo?.address?.city, name:data?.landInfo?.address?.city?.split(".")[1]}
  data.address.locality = {...data?.landInfo?.address?.locality, "i18nkey":data?.landInfo?.address?.locality?.name}
  data.data = {
    applicantName: APIScrutinyDetails?.planDetail?.planInformation?.applicantName,
    applicationDate: data?.auditDetails?.createdTime,
    applicationType: APIScrutinyDetails?.appliactionType,
    holdingNumber: data?.additionalDetails?.holdingNo,
    occupancyType: APIScrutinyDetails?.planDetail?.planInformation?.occupancy,
    registrationDetails: data?.additionalDetails?.registrationDetails,
    riskType: Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks),
    serviceType:data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType,
    scrutinyNumber:{edcrNumber:data?.edcrNumber}
  }

  data["PrevStateDocuments"] = data?.documents;
  data.documents = {
    documents:[]
  }


  let nocDocs = [];
  nocdata && nocdata.map((a,index) => {
    a.documents && a.documents.map((b,index) => {
      nocDocs.push(b);
    })
  })

  data["PrevStateNocDocuments"]=nocDocs;

  data.nocDocuments = {
    NocDetails:nocdata,
    nocDocuments:[],
  }
  data?.landInfo.owners.map((owner,ind) => {
    owner.gender = {
      active:true,
      code:owner.gender,
      i18nKey:`COMMON_GENDER_${owner.gender}`,
    }
  })

  data.owners ={
    owners:data?.landInfo?.owners,
    ownershipCategory:{
      active:true,
      code:data?.landInfo?.ownershipCategory,
      i18nKey:`COMMON_MASTERS_OWNERSHIPCATEGORY_${data?.landInfo?.ownershipCategory.replaceAll(".","_")}`,
    }
  }

  data.riskType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks)
  data.subOccupancy = getBlocksforFlow(data?.landInfo?.unit);
  data.uiFlow = {
    flow:data?.businessService?.split(".")?.[0],
    applicationType:data?.additionalDetails?.applicationType || APIScrutinyDetails?.appliactionType,
    serviceType:data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType
  }
  sessionStorage.setItem("BPA_IS_ALREADY_WENT_OFF_DETAILS", JSON.stringify(true));
  return data;
}

const BPASendToArchitect = ({ parentRoute }) => {
  sessionStorage.setItem("BPA_SUBMIT_APP", JSON.stringify("BPA_SUBMIT_APP"));
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { applicationNo: applicationNo, tenantId } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  let application = {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BUILDING_PERMIT_EDITFLOW", {});

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(stateId, []);

  let filter1 = {};

  if (tenantId) filter1.tenantId = tenantId;
  if(applicationNo) filter1.applicationNo=applicationNo;

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(Digit.ULBService.getStateId(), "BPA", ["RiskTypeComputation"]);

  const { data: bpaData, isLoading: isBpaSearchLoading } = Digit.Hooks.obps.useBPASearch(tenantId, {applicationNo:applicationNo});

  let scrutinyNumber = {edcrNumber:bpaData?.[0]?.edcrNumber};

  const { data: data1, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(Digit.ULBService.getStateId(), scrutinyNumber, {
    enabled: scrutinyNumber["edcrNumber"]?true:false
  })

  let sourceRefId = applicationNo;

  const { data : nocdata, isLoading: isNocLoading, refetch:nocRefetch } = Digit.Hooks.obps.useNocDetails(tenantId, { sourceRefId: sourceRefId });

  const editApplication = window.location.href.includes("editApplication");

  useEffect(async () => {
    let isAlready = sessionStorage.getItem("BPA_IS_ALREADY_WENT_OFF_DETAILS");
    isAlready = isAlready ? JSON.parse(isAlready) : true;
    if (!isAlready && !isNocLoading && !isBpaSearchLoading && !isLoading) {
      application = bpaData ? bpaData[0]:{};
      if (data1 && nocdata) {
       application = bpaData[0];
        if (editApplication) {
          application.isEditApplication = true;
        }
        sessionStorage.setItem("bpaInitialObject", JSON.stringify({ ...application }));
        let bpaEditDetails = await getBPAEditDetails(application,data1,mdmsData,nocdata,t);
        setParams({ ...params, ...bpaEditDetails });
      }
    }
  }, [bpaData,data1,mdmsData,nocdata]);


  const goNext = (skipStep) => {
    const currentPath = pathname?.split("/")?.pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);

  }

  const onSuccess = () => {
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };
  const createApplication = async () => {
    history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };

  const handleSelect = (key, data, skipStep, isFromCreateApi) => {
    if (isFromCreateApi) setParams(data);
    else setParams({ ...params, ...{ [key]: { ...params[key], ...data }}});
    goNext(skipStep);
  };
  const handleSkip = () => {};
  
  newConfig = newConfig?.BuildingPermitConfig ? newConfig?.BuildingPermitConfig : newConfigBPA;
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "check";

  useEffect(() => {
    if(sessionStorage.getItem("isPermitApplication") && sessionStorage.getItem("isPermitApplication") == "true") {
      clearParams();
      sessionStorage.setItem("isPermitApplication", false);
    }
  }, []);

  const CheckPage = Digit?.ComponentRegistryService?.getComponent('BPACheckPage') ;
  const OBPSAcknowledgement = Digit?.ComponentRegistryService?.getComponent('BPAAcknowledgement');

  if (isNocLoading || isBpaSearchLoading || isLoading) {
    return <Loader />
  }

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} />
          </Route>
        );
      })}
      <Route path={`${getPath(match.path, match.params)}/check`}>
        <CheckPage onSubmit={createApplication} value={params} />
      </Route>
      <Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <OBPSAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        {data1 && <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />}
      </Route>
    </Switch>
  );
};

export default BPASendToArchitect;