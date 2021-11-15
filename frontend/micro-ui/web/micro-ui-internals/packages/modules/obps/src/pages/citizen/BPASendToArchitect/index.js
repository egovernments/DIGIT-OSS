import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/buildingPermitConfig";
//import { getCommencementDataFormat } from "../../../utils/index";
import CheckPage from "../NewBuildingPermit/CheckPage";
import OBPSAcknowledgement from "../NewBuildingPermit/OBPSAcknowledgement";
//import TLAcknowledgement from "../Create/TLAcknowledgement";
const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

const getBPAEditDetails = (data, APIScrutinyDetails,mdmsData,nocdata,t) => {

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

  data.BlockIds=getBlockIds(data?.landInfo?.unit);
  data.address = data?.landInfo?.address;
  data.data = {
    applicantName: APIScrutinyDetails?.planDetail?.planInformation?.applicantName,
    applicationDate: APIScrutinyDetails?.applicationDate,
    applicationType: APIScrutinyDetails?.appliactionType,
    holdingNumber: data?.additionalDetails?.holdingNo,
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
  nocdata.map((a,index) => {
    a.documents.map((b,index) => {
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
    flow:data?.businessService.split(".")[0],
    applicationType:data?.additionalDetails?.applicationType || APIScrutinyDetails?.appliactionType,
    serviceType:data?.additionalDetails?.serviceType || APIScrutinyDetails?.applicationSubType
  }

  // const gettradeaccessories = (tradeacceserioies) => {
  //   let acc = [];
  //   tradeacceserioies && tradeacceserioies.map((ob) => {
  //     acc.push({
  //       accessory: { code: `${ob.accessoryCategory}`, i18nKey: `TRADELICENSE_ACCESSORIESCATEGORY_${ob.accessoryCategory.replaceAll("-", "_")}` },
  //       accessorycount: ob.count,
  //       unit: `${ob.uom}`,
  //       uom: `${ob.uomValue}`,
  //       id: ob.id,
  //     })
  //   })
  //   return acc;
  // }

  // const gettradeunits = (tradeunits) => {
  //   let units = [];
  //   tradeunits && tradeunits.map((ob) => {
  //     units.push({
  //       tradecategory: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, code: `${ob.tradeType.split(".")[0]}` },
  //       tradesubtype: { i18nKey: `TL_${ob.tradeType}`, code: `${ob.tradeType}` },
  //       tradetype: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[1]}`, code: `${ob.tradeType.split(".")[1]}` },
  //       unit: ob.uom,
  //       uom: ob.uomValue,
  //       id : ob.id,
  //     });
  //   })
  //   return units;
  // };

  // const gettradedocuments = (docs) => {
  //   let documents = [];
  //   docs && docs.map((ob) => {
  //     if (ob.documentType.includes("OWNERPHOTO")) {
  //       documents["OwnerPhotoProof"] = ob;
  //     }
  //     else if (ob.documentType.includes("OWNERIDPROOF")) {
  //       documents["ProofOfIdentity"] = ob;
  //     }
  //     else if (ob.documentType.includes("OWNERSHIPPROOF")) {
  //       documents["ProofOfOwnership"] = ob;
  //     }
  //   })
  //   return documents;
  // }

  // const gettradeowners = (owner) => {
  //   let ownerarray = [];
  //   owner && owner.map((ob) => {
  //     ownerarray.push({
  //       gender: { code: `${ob.gender}`, name: `${!ob?.gender.includes("FEMALE") ? "Male" : "Female"}`, value: `${!ob?.gender.includes("FEMALE") ? "Male" : "Female"}`, i18nKey:`TL_GENDER_${ob.gender}` },
  //       isprimaryowner: false,
  //       name: ob.name,
  //       mobilenumber: ob.mobileNumber,
  //       permanentAddress: ob.permanentAddress,
  //       id: ob.id,
  //     })
  //   })
  //   // ownerarray["permanentAddress"]=owner.permanentAddress;
  //   return ownerarray;
  // }
  // data.TradeDetails = {
  //   BuildingType: { code: `${data?.tradeLicenseDetail?.structureType}`, i18nKey: `COMMON_MASTERS_STRUCTURETYPE_${data.tradeLicenseDetail?.structureType.replaceAll(".", "_")}` },
  //   //CommencementDate: getCommencementDataFormat(data?.commencementDate),
  //   StructureType: { code: `${data.tradeLicenseDetail?.structureType.split(".")[0]}`, i18nKey: `${data.tradeLicenseDetail?.structureType.includes("IMMOVABLE") ? "TL_COMMON_YES" : "TL_COMMON_NO"}` },
  //   TradeName: data?.tradeName,
  //   accessories: gettradeaccessories(data?.tradeLicenseDetail?.accessories),
  //   isAccessories: gettradeaccessories(data?.tradeLicenseDetail?.accessories).length > 0 ? { code: `ACCESSORY`, i18nKey: "TL_COMMON_YES" } : { code: `NONACCESSORY`, i18nKey: "TL_COMMON_NO" },
  //   units: gettradeunits(data?.tradeLicenseDetail?.tradeUnits),
  // }
  // data.address = {};
  // if (data?.tradeLicenseDetail?.address?.geoLocation?.latitude && data?.tradeLicenseDetail?.address?.geoLocation?.longitude) {
  //   data.address.geoLocation = {
  //     latitude: data?.tradeLicenseDetail?.address?.geoLocation?.latitude,
  //     longitude: data?.tradeLicenseDetail?.address?.geoLocation?.longitude,
  //   };
  // } else {
  //   data.address.geoLocation = {};
  // }
  // data.address.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
  // data.address.street = data?.tradeLicenseDetail?.address?.street;
  // data.address.landmark = data?.tradeLicenseDetail?.address?.landmark;
  // data.address.pincode = data?.tradeLicenseDetail?.address?.pincode;
  // data.address.city = { code: data?.tradeLicenseDetail?.address?.tenantId };
  // data.address.locality = data?.tradeLicenseDetail?.address?.locality;
  // data.address.locality.i18nkey = data?.tenantId.replace(".", "_").toUpperCase() + "_" + "REVENUE" + "_" + data?.address?.locality?.code;
  // data.address.locality.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
  // data.address.locality.landmark = data?.tradeLicenseDetail?.address?.landmark;
  // data.owners = {
  //   documents: gettradedocuments(data?.tradeLicenseDetail?.applicationDocuments),
  //   owners: gettradeowners(data?.tradeLicenseDetail?.owners),
  //   permanentAddress: data?.tradeLicenseDetail?.owners[0].permanentAddress,
  //   isCorrespondenceAddress: false,
  // }
  // data.ownershipCategory = { code: `${data?.tradeLicenseDetail?.subOwnerShipCategory}`, i18nKey: `PT_OWNERSHIP_${data?.tradeLicenseDetail?.subOwnerShipCategory.split(".")[1]}`, value: `${data?.tradeLicenseDetail?.subOwnerShipCategory}` };
  return data;
}

const BPASendToArchitect = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { applicationNo: applicationNo, tenantId } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  let application = {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BUILDING_PERMIT_EDITFLOW", {});

  let filter1 = {};
  //let applicationNumber = "PB-BP-2021-09-16-002778";

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

  let sourceRefId = applicationNo;

  const { data : nocdata, isLoading: isNocLoading, refetch:nocRefetch } = Digit.Hooks.obps.useNocDetails(tenantId, { sourceRefId: sourceRefId });

  const editApplication = window.location.href.includes("editApplication");
  //const tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};

  useEffect(() => {
     application = bpaData ? bpaData[0]:{};
     if (/* bpaData && application && data1 && mdmsData && nocdata */data1) {
      application = bpaData[0];
       if (editApplication) {
         application.isEditApplication = true;
       }
       sessionStorage.setItem("bpaInitialObject", JSON.stringify({ ...application }));
       let bpaEditDetails = getBPAEditDetails(application,data1,mdmsData,nocdata,t);
       setParams({ ...params, ...bpaEditDetails });
     }
  }, [bpaData,data1,mdmsData,nocdata]);


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