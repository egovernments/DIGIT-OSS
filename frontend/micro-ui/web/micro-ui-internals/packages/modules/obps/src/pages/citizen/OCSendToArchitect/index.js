import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigOCBPA } from "../../../config/ocbuildingPermitConfig";
// import CheckPage from "../OCBuildingPermit/CheckPage";
// import OBPSAcknowledgement from "../OCBuildingPermit/OBPSAcknowledgement";

const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

const getBPAEditDetails = (data, APIScrutinyDetails,mdmsData,nocdata,t,OCData) => {

  const getBlocksforFlow = (unit) => {
    let arr=[];
    let subBlocks = [];
    let subOcc = {};
    unit && unit.map((un, index) => {
      arr = un?.usageCategory.split(",");
      subBlocks=[];
      arr && arr.map((ob, ind) => {
        subBlocks.push({
          code:ob,
          i18nKey:`BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".","_")}`,
          name:t(`BPA_SUBOCCUPANCYTYPE_${ob.replaceAll(".","_")}`),
        })
      })
      subOcc[`Block_${index+1}`]=subBlocks;
    });

    return subOcc;
    
  }

  //data.BlockIds=getBlockIds(data?.landInfo?.unit);
  data.address = data?.landInfo?.address;
  data.additionalDetails = {...data?.additionalDetails,
    applicationType: APIScrutinyDetails?.appliactionType,
    holdingNo: data?.additionalDetails?.holdingNo,
    landId: data?.landInfo?.id,
    serviceType: data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType,
    }   

  data.data = {
    applicantName: APIScrutinyDetails?.planDetail?.planInformation?.applicantName,
    applicationDate: APIScrutinyDetails?.applicationDate,
    applicationType: APIScrutinyDetails?.appliactionType,
    holdingNumber: data?.additionalDetails?.holdingNo,
    bpaData:OCData,
    occupancyType: APIScrutinyDetails?.planDetail?.planInformation?.occupancy,
    registrationDetails: data?.additionalDetails?.registrationDetails,
    riskType: Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks),
    serviceType:data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType,
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


  data.riskType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, APIScrutinyDetails?.planDetail?.plot?.area, APIScrutinyDetails?.planDetail?.blocks)
  data.subOccupancy = getBlocksforFlow(data?.landInfo?.unit);
  data.uiFlow = {
    flow:"OCBPA",
    applicationType:data?.additionalDetails?.applicationType || APIScrutinyDetails?.appliactionType,
    serviceType:data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType
  }


  return data;
}

const OCSendToArchitect = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { applicationNo: applicationNo, tenantId } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  let application = {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("OC_BUILDING_PERMIT_EDITFLOW", {});

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig } = Digit.Hooks.obps.SearchMdmsTypes.getFormConfig(stateId, []);

  let filter1 = {};
  //let applicationNumber = "PB-BP-2021-09-15-002776";

  //if (licenseNo) filter1.applicationNumber = licenseNo;
  if (tenantId) filter1.tenantId = tenantId;
  if(applicationNo) filter1.applicationNo=applicationNo;

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS("pb", "BPA", ["RiskTypeComputation"]);

  //const { isLoading, isError, error, data } = Digit.Hooks.tl.useTradeLicenseSearch({ filters: filter1 }, { filters: filter1 });
  const { data: bpaData, isLoading: isBpaSearchLoading } = Digit.Hooks.obps.useBPASearch(tenantId, {applicationNo:applicationNo});

  let scrutinyNumber = {edcrNumber:bpaData?.[0]?.edcrNumber};

  const { data: data1, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails("pb", scrutinyNumber, {
    enabled: bpaData?.[0]?.edcrNumber?true:false
  })

  let approvalNo = data1?.permitNumber;
  const { data: OCData, isLoading: isSearchLoading, refetch: refetchBPASearch } = Digit.Hooks.obps.useOCEdcrSearch(tenantId, {approvalNo: approvalNo}, {
    enabled: approvalNo && data1?.permitNumber ? true : false
  }, scrutinyNumber);

  let sourceRefId = applicationNo;

  const { data : nocdata, isLoading: isNocLoading, refetch:nocRefetch } = Digit.Hooks.obps.useNocDetails(tenantId, { sourceRefId: sourceRefId });

  const editApplication = window.location.href.includes("editApplication");
  const tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};

  useEffect(() => {
     application = bpaData ? bpaData[0]:{};
     if (data1 && OCData) {
      application = bpaData[0];
       if (editApplication) {
         application.isEditApplication = true;
       }
       sessionStorage.setItem("bpaInitialObject", JSON.stringify({ ...application }));
       let bpaEditDetails = getBPAEditDetails(application,data1,mdmsData,nocdata,t,OCData);
       setParams({ ...params, ...bpaEditDetails });
     }
  }, [bpaData,data1,mdmsData,nocdata,OCData]);


  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    redirectWithHistory(`${getPath(match.path, match.params)}/${nextStep}`);

  }

  const onSuccess = () => {
    //clearParams();
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

  newConfig = newConfig?.OCBuildingPermitConfig ? newConfig?.OCBuildingPermitConfig : newConfigOCBPA;
  // const state = tenantId.split(".")[0];
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

  const CheckPage = Digit?.ComponentRegistryService?.getComponent('OCBPACheckPage') ;
  const OBPSAcknowledgement = Digit?.ComponentRegistryService?.getComponent('OCBPAAcknowledgement');

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
        {data1 && OCData && <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />}
      </Route>
    </Switch>
  );
};

export default OCSendToArchitect;