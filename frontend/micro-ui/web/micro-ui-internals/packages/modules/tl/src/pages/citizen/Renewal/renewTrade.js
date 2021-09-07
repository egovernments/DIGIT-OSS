import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/config";
import { getCommencementDataFormat } from "../../../utils/index";
import CheckPage from "../Create/CheckPage";
import TLAcknowledgement from "../Create/TLAcknowledgement";
const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

const getTradeEditDetails = (data) => {
  const gettradeaccessories = (tradeacceserioies) => {
    let acc = [];
    tradeacceserioies && tradeacceserioies.map((ob) => {
      acc.push({
        accessory: { code: `${ob.accessoryCategory}`, i18nKey: `TRADELICENSE_ACCESSORIESCATEGORY_${ob.accessoryCategory.replaceAll("-", "_")}` },
        accessorycount: ob.count,
        unit: `${ob.uom}`,
        uom: `${ob.uomValue}`,
        id : ob.id,
      })
    })
    return acc;
  }

  const gettradeunits = (tradeunits) => {
    let units = [];
    tradeunits && tradeunits.map((ob) => {
      units.push({
        tradecategory: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, code: `${ob.tradeType.split(".")[0]}` },
        tradesubtype: { i18nKey: `TL_${ob.tradeType}`, code: `${ob.tradeType}` },
        tradetype: { i18nKey: `TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[1]}`, code: `${ob.tradeType.split(".")[1]}` },
        unit: ob.uom,
        uom: ob.uomValue,
        id : ob.id,
      });
    })
    return units;
  };

  const gettradedocuments = (docs) => {
    let documents = [];
    docs && docs.map((ob) => {
      if (ob.documentType.includes("OWNERPHOTO")) {
        documents["OwnerPhotoProof"] = ob;
      }
      else if (ob.documentType.includes("OWNERIDPROOF")) {
        documents["ProofOfIdentity"] = ob;
      }
      else if (ob.documentType.includes("OWNERSHIPPROOF")) {
        documents["ProofOfOwnership"] = ob;
      }
    })
    return documents;
  }

  const gettradeowners = (owner) => {
    let ownerarray = [];
    owner && owner.map((ob) => {
      ownerarray.push({
        gender: { code: `${ob.gender}`, name: `${!ob?.gender.includes("FEMALE") ? "Male" : "Female"}`, value: `${!ob?.gender.includes("FEMALE") ? "Male" : "Female"}`, i18nKey:`TL_GENDER_${ob.gender}` },
        isprimaryowner: false,
        name: ob.name,
        mobilenumber: ob.mobileNumber,
        permanentAddress: ob.permanentAddress,
        id: ob.id,
      })
    })
    return ownerarray;
  }
  data.TradeDetails = {
    BuildingType: { code: `${data?.tradeLicenseDetail?.structureType}`, i18nKey: `COMMON_MASTERS_STRUCTURETYPE_${data.tradeLicenseDetail?.structureType.replaceAll(".", "_")}` },
    CommencementDate: getCommencementDataFormat(data?.commencementDate),
    StructureType: { code: `${data.tradeLicenseDetail?.structureType.split(".")[0]}`, i18nKey: `${data.tradeLicenseDetail?.structureType.includes("IMMOVABLE") ? "TL_COMMON_YES" : "TL_COMMON_NO"}` },
    TradeName: data?.tradeName,
    accessories: gettradeaccessories(data?.tradeLicenseDetail?.accessories),
    isAccessories: gettradeaccessories(data?.tradeLicenseDetail?.accessories).length > 0 ? { code: `ACCESSORY`, i18nKey: "TL_COMMON_YES" } : { code: `NONACCESSORY`, i18nKey: "TL_COMMON_NO" },
    units: gettradeunits(data?.tradeLicenseDetail?.tradeUnits),
  }
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
  data.address.city = { code: data?.tradeLicenseDetail?.address?.tenantId };
  data.address.locality = data?.tradeLicenseDetail?.address?.locality;
  data.address.locality.i18nkey = data?.tenantId.replace(".", "_").toUpperCase() + "_" + "REVENUE" + "_" + data?.address?.locality?.code;
  data.address.locality.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
  data.address.locality.landmark = data?.tradeLicenseDetail?.address?.landmark;
  data.owners = {
    documents: gettradedocuments(data?.tradeLicenseDetail?.applicationDocuments),
    owners: gettradeowners(data?.tradeLicenseDetail?.owners),
    permanentAddress: data?.tradeLicenseDetail?.owners[0].permanentAddress,
    isCorrespondenceAddress: false,
  }
  data.ownershipCategory = { code: `${data?.tradeLicenseDetail?.subOwnerShipCategory}`, i18nKey: `PT_OWNERSHIP_${data?.tradeLicenseDetail?.subOwnerShipCategory.split(".")[1]}`, value: `${data?.tradeLicenseDetail?.subOwnerShipCategory}` };
  return data;
}

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

  useEffect(() => {
    application = data?.Licenses && data.Licenses[0] && data.Licenses[0];
    if (data && application) {
      application = data?.Licenses[0];
      if (editProperty) {
        application.isEditProperty = true;
      }
      sessionStorage.setItem("tradeInitialObject", JSON.stringify({ ...application }));
      let tradeEditDetails = getTradeEditDetails(application);
      setParams({ ...params, ...tradeEditDetails });
    }
  }, [data]);

  const goNext = (skipStep, index, isAddMultiple, key) => {
    let currentPath = pathname.split("/").pop(),
      lastchar = currentPath.charAt(currentPath.length - 1),
      isMultiple = false,
      nextPage;
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);
    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")]) {
        nextStep = `${nextStep[sessionStorage.getItem("isAccessories")]}`;
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = `${nextStep[sessionStorage.getItem("StructureType")]}`;
      }
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
    nextPage = `${getPath(match.path, match.params)}/${nextStep}`;
    redirectWithHistory(nextPage);
  };
  const createProperty = async () => {
    history.push(`${getPath(match.path, match.params)}/acknowledgement`);
  };
  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep, index, isAddMultiple, key);
  }
  const handleSkip = () => { };
  const handleMultiple = () => { };
  const onSuccess = () => {
    queryClient.invalidateQueries("TL_RENEW_TRADE");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "check";
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${getPath(match.path, match.params)}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} />
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