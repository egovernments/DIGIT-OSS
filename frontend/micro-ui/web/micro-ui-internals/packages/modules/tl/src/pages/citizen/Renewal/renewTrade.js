import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig as newConfigTL } from "../../../config/config";
import { getCommencementDataFormat, stringReplaceAll } from "../../../utils/index";


const getPath = (path, params) => {
  params &&
    Object.keys(params).map((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
  return path;
};

const getTradeEditDetails = (data,t) => {
  const gettradeaccessories = (tradeacceserioies, t) => {
    let acc = [];
    tradeacceserioies &&
      tradeacceserioies.map((ob) => {
        acc.push({
          accessory: { code: `${ob.accessoryCategory}`, i18nKey: t(`TRADELICENSE_ACCESSORIESCATEGORY_${ob.accessoryCategory.replaceAll("-", "_")}`) },
          accessorycount: ob.count,
          unit: `${ob.uom}`,
          uom: `${ob.uomValue}`,
          id: ob.id,
        });
      });
    return acc;
  };

  const gettradeunits = (tradeunits) => {
    let units = [];
    tradeunits &&
      tradeunits.map((ob) => {
        units.push({
          tradecategory: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, code: `${ob.tradeType.split(".")[0]}` },
          tradesubtype: { i18nKey: `TL_${ob.tradeType}`, code: `${ob.tradeType}` },
          tradetype: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[1]}`, code: `${ob.tradeType.split(".")[1]}` },
          unit: ob.uom,
          uom: ob.uomValue,
          id: ob.id,
        });
      });
    return units;
  };

  const gettradedocuments = (docs) => {
    let documents = [];
    docs &&
      docs.map((ob) => {
        if (ob.documentType.includes("OWNERPHOTO")) {
          documents["OwnerPhotoProof"] = ob;
        } else if (ob.documentType.includes("OWNERIDPROOF")) {
          documents["ProofOfIdentity"] = ob;
        } else if (ob.documentType.includes("OWNERSHIPPROOF")) {
          documents["ProofOfOwnership"] = ob;
        }
      });
    return documents;
  };

  const gettradeowners = (owner) => {
    let ownerarray = [];
    owner &&
      owner.map((ob) => {
        ownerarray.push({
          gender: {
            code: `${ob.gender}`,
            name: ob.gender ? `${!ob?.gender?.includes("FEMALE") ? "Male" : "Female"}` : "",
            value: ob.gender ? `${!ob?.gender?.includes("FEMALE") ? "Male" : "Female"}`:"",
            i18nKey: ob.gender ? `TL_GENDER_${ob.gender}` : "",
          },
          isprimaryowner: false,
          name: ob.name,
          mobilenumber: ob.mobileNumber,
          permanentAddress: ob.permanentAddress,
          fatherOrHusbandName : ob?.fatherOrHusbandName,
          relationship : { code: ob?.relationship , i18nKey:ob.relationship?`COMMON_RELATION_${ob.relationship}`:"CS_NA"},
          id: ob.id,
        });
      });
    return ownerarray;
  };

  const getInsitutionaltradeowners = (owner,institution) => {
    let ownerarray = [];
    owner &&
      owner.map((ob) => {
        ownerarray.push({
          name: institution.name,
          mobilenumber: ob.mobileNumber,
          permanentAddress: ob.permanentAddress,
          altContactNumber:institution.contactNo,
          designation:institution.designation,
          institutionName:institution.instituionName,
          tenantId: data.tenantId,
          emailId:ob.emailId,
          subOwnerShipCategory : {
            code: `${data?.tradeLicenseDetail?.subOwnerShipCategory}`,
            i18nKey: `COMMON_MASTERS_OWNERSHIPCATEGORY_${stringReplaceAll(data?.tradeLicenseDetail?.subOwnerShipCategory,".","_")}`,
          },
          id: ob.id,
          uuid : ob.uuid,
        });
      });
    return ownerarray;
  };

  data.TradeDetails = {
    BuildingType: {
      code: `${data?.tradeLicenseDetail?.structureType}`,
      i18nKey: `COMMON_MASTERS_STRUCTURETYPE_${data.tradeLicenseDetail?.structureType.replaceAll(".", "_")}`,
    },
    CommencementDate: getCommencementDataFormat(data?.commencementDate),
    StructureType: {
      code: `${data.tradeLicenseDetail?.structureType.split(".")[0]}`,
      i18nKey: `${data.tradeLicenseDetail?.structureType.includes("IMMOVABLE") ? "TL_COMMON_YES" : "TL_COMMON_NO"}`,
    },
    TradeName: data?.tradeName,
    accessories: gettradeaccessories(data?.tradeLicenseDetail?.accessories,t),
    isAccessories:
      gettradeaccessories(data?.tradeLicenseDetail?.accessories,t).length > 0
        ? { code: `ACCESSORY`, i18nKey: "TL_COMMON_YES" }
        : { code: `NONACCESSORY`, i18nKey: "TL_COMMON_NO" },
    units: gettradeunits(data?.tradeLicenseDetail?.tradeUnits),
  };
  data.address = {};
  if (data?.tradeLicenseDetail?.address?.geoLocation?.latitude && data?.tradeLicenseDetail?.address?.geoLocation?.longitude) {
    data.address.geoLocation = {
      latitude: data?.tradeLicenseDetail?.address?.geoLocation?.latitude,
      longitude: data?.tradeLicenseDetail?.address?.geoLocation?.longitude,
    };
  } else {
    data.address.geoLocation = {};
  }
  data.address.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
  data.address.street = data?.tradeLicenseDetail?.address?.street;
  data.address.landmark = data?.tradeLicenseDetail?.address?.landmark;
  data.address.pincode = data?.tradeLicenseDetail?.address?.pincode;
  data.address.city = { code: data?.tradeLicenseDetail?.address?.tenantId, i18nKey:`TENANT_TENANTS_${stringReplaceAll(data?.tradeLicenseDetail?.address?.tenantId,".","_").toUpperCase()}` };
  data.address.locality = data?.tradeLicenseDetail?.address?.locality;
  data.address.locality.i18nkey = data?.tenantId.replace(".", "_").toUpperCase() + "_" + "REVENUE" + "_" + data?.address?.locality?.code;
  data.address.locality.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
  data.address.locality.landmark = data?.tradeLicenseDetail?.address?.landmark;
  data.owners = {
    documents: gettradedocuments(data?.tradeLicenseDetail?.applicationDocuments),
    owners: data?.tradeLicenseDetail?.institution?.id ? getInsitutionaltradeowners(data?.tradeLicenseDetail?.owners,data?.tradeLicenseDetail?.institution) :  gettradeowners(data?.tradeLicenseDetail?.owners),
    permanentAddress: data?.tradeLicenseDetail?.owners[0].permanentAddress,
    isCorrespondenceAddress: false,
  };
  data.ownershipCategory = {
    code: `${data?.tradeLicenseDetail?.subOwnerShipCategory}`,
    i18nKey: `PT_OWNERSHIP_${data?.tradeLicenseDetail?.subOwnerShipCategory.split(".")[1]}`,
    value: `${data?.tradeLicenseDetail?.subOwnerShipCategory}`,
  };
  return data;
};

const RenewTrade = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { id: licenseNo, tenantId } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  let application = {};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("TL_RENEW_TRADE", {});
  let filter1 = {};
  if (licenseNo) filter1.licenseNumbers = licenseNo;
  if (tenantId) filter1.tenantId = tenantId;
  const { isLoading, isError, error, data } = Digit.Hooks.tl.useTradeLicenseSearch({ filters: filter1 }, { filters: filter1 });

  const editProperty = window.location.href.includes("edit");
  const tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};
  let isReneworEditTrade = window.location.href.includes("/renew-trade/") || window.location.href.includes("/edit-application/")
  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading: configLoading } = Digit.Hooks.tl.useMDMS.getFormConfig(stateId, {});

  useEffect(() => {
    application = data?.Licenses && data.Licenses[0] && data.Licenses[0];
    if (data && application) {
      application = data?.Licenses[0];
      if (editProperty) {
        application.isEditProperty = true;
      }
      sessionStorage.setItem("tradeInitialObject", JSON.stringify({ ...application }));
      let tradeEditDetails = getTradeEditDetails(application,t);
      setParams({ ...params, ...tradeEditDetails });
    }
  }, [data]);

  const goNext = (skipStep, index, isAddMultiple, key, isPTCreateSkip) => {
    let currentPath = pathname.split("/").pop(),
      lastchar = currentPath.charAt(currentPath.length - 1),
      isMultiple = false,
      nextPage;
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);
    let { isCreateEnabled : enableCreate = true } = config.find((routeObj) => routeObj.route === currentPath);
    if (typeof nextStep == "object" && nextStep != null) {
      if((params?.cptId?.id || params?.cpt?.details?.propertyId || (isReneworEditTrade && params?.tradeLicenseDetail?.additionalDetail?.propertyId))  && (nextStep[sessionStorage.getItem("isAccessories")] && nextStep[sessionStorage.getItem("isAccessories")] === "know-your-property")  )
      {
        nextStep = "property-details";
      }
      if (
        nextStep[sessionStorage.getItem("isAccessories")] &&
        (nextStep[sessionStorage.getItem("isAccessories")] === "accessories-details" ||
          nextStep[sessionStorage.getItem("isAccessories")] === "map" ||
          nextStep[sessionStorage.getItem("isAccessories")] === "owner-ship-details" || 
          nextStep[sessionStorage.getItem("isAccessories")] === "know-your-property")
      ) {
        if((isReneworEditTrade && !(params?.tradeLicenseDetail?.additionalDetail?.propertyId)  ) )
        nextStep = `map`
        else
        nextStep = `${nextStep[sessionStorage.getItem("isAccessories")]}`;
      } else if (
        nextStep[sessionStorage.getItem("StructureType")] &&
        (nextStep[sessionStorage.getItem("StructureType")] === "Building-type" ||
          nextStep[sessionStorage.getItem("StructureType")] === "vehicle-type")
      ) {
        nextStep = `${nextStep[sessionStorage.getItem("StructureType")]}`;
      } else if (
        nextStep[sessionStorage.getItem("KnowProperty")] &&
        (nextStep[sessionStorage.getItem("KnowProperty")] === "search-property" ||
          nextStep[sessionStorage.getItem("KnowProperty")] === "create-property")
      ) {
        if(nextStep[sessionStorage.getItem("KnowProperty")] === "create-property" && !enableCreate)
          {
            nextStep = `map`;
          }
          else{
         nextStep = `${nextStep[sessionStorage.getItem("KnowProperty")]}`;
          }
      }
    }
    if( (params?.cptId?.id || params?.cpt?.details?.propertyId || (isReneworEditTrade && params?.tradeLicenseDetail?.additionalDetail?.propertyId ))  && nextStep === "know-your-property" )
    { 
      nextStep = "property-details";
    }
    let redirectWithHistory = history.push;
    if (skipStep) {
      redirectWithHistory = history.replace;
    }
    if (isAddMultiple) {
      nextStep = key;
    }
    if (nextStep === null) {
      return redirectWithHistory(`${getPath(match.path, match.params)}/check`);
    }
    if(isPTCreateSkip && nextStep === "acknowledge-create-property")
    {
      nextStep = "map";
    }
    nextPage = `${getPath(match.path, match.params)}/${nextStep}`;
    redirectWithHistory(nextPage);
  };
  const createProperty = async () => {
    history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };
  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    if(key === "isSkip" && data === true)
    {
      goNext(skipStep, index, isAddMultiple, key, true);
    }
    else
    {
    goNext(skipStep, index, isAddMultiple, key);
    }
  }
  const handleSkip = () => {};
  const handleMultiple = () => {};
  const onSuccess = () => {
    queryClient.invalidateQueries("TL_RENEW_TRADE");
  };
  newConfig=newConfig?newConfig:newConfigTL;
  newConfig?.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "check";
  if (isLoading || configLoading) {
    return <Loader />;
  }
  const CheckPage = Digit?.ComponentRegistryService?.getComponent('TLCheckPage') ;
  const TLAcknowledgement = Digit?.ComponentRegistryService?.getComponent('TLAcknowledgement');
  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key, isSkipEnabled } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key, isSkipEnabled }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} />
          </Route>
        );
      })}
      <Route path={`${getPath(match.path, match.params)}/check`}>
        <CheckPage onSubmit={createProperty} value={params} />
      </Route>
      <Route path={`${getPath(match.path, match.params)}/acknowledgement`}>
        <TLAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${getPath(match.path, match.params)}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default RenewTrade;
