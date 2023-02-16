import { FormComposer, Header, Toast } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig as newConfigTL } from "../../../config/config";
import { convertDateToEpoch } from "../../../utils";

const NewApplication = () => {
  let tenantId = Digit.ULBService.getCurrentTenantId() || Digit.ULBService.getCitizenCurrentTenant();
  const tenants = Digit.Hooks.tl.useTenants();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const history = useHistory();
  // delete
  const [propertyId, setPropertyId] = useState(new URLSearchParams(useLocation().search).get("propertyId"));
  const isEmpNewApplication = window.location.href.includes("/employee/tl/new-application");
  const isEmpRenewLicense = window.location.href.includes("/employee/tl/renew-application-details") || window.location.href.includes("/employee/tl/edit-application-details"); 

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("PT_CREATE_EMP_TRADE_NEW_FORM", {});
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});
  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);
  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading } = Digit.Hooks.tl.useMDMS.getFormConfig(stateId, {});
  const { data: propertyDetails } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: propertyId }, tenantId: tenantId },
    { filters: { propertyIds: propertyId }, tenantId: tenantId, enabled: propertyId ? true : false }
  );

  useEffect(() => {
    !propertyId && setPropertyId(sessionFormData?.cpt?.details?.propertyId);
  }, [sessionFormData?.cpt]);
  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  useEffect(() => {
    if(sessionStorage.getItem("isCreateEnabledEmployee") === "true")
    {
      sessionStorage.removeItem("isCreateEnabledEmployee");
      history.replace("/employee");
    }
    else
    sessionStorage.removeItem("isCreateEnabledEmployee");

  })

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  function checkforownerPresent(formData){
    if(formData?.owners){
      formData?.owners?.map((ob) => {
        if(!ob?.name || !ob.mobileNumber || !ob?.fatherOrHusbandName || !ob?.relationship?.code || ob?.gender?.code)
        {
          return true;
        }
      })
      return false;
    }
  }

  const onFormValueChange = (setValue, formData, formState) => {
    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }
    if(checkforownerPresent(formData))
    {
      setSubmitValve(false);
    }
    else if (
      Object.keys(formState.errors).length > 0 &&
      Object.keys(formState.errors).length == 1 &&
      formState.errors["owners"] &&
      Object.entries(formState.errors["owners"].type).filter((ob) => ob?.[1].type === "required").length == 0
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(!Object.keys(formState.errors).length);
    }
  };
  const onSubmit = (data) => {
    let isSameAsPropertyOwner = sessionStorage.getItem("isSameAsPropertyOwner"); 
    if(data?.cpt?.id){
      if (!data?.cpt?.details || !propertyDetails) {
          setShowToast({ key: "error" });
          setError(t("ERR_INVALID_PROPERTY_ID"));
          return;
        }
    }
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item.toString() === data?.address?.pincode));
    if(!foundValue && data?.address?.pincode)
    {
      setShowToast({ key: "error" });
      setError(t("TL_COMMON_PINCODE_NOT_SERVICABLE"));
      return;
    }
    // if (!data?.cpt?.details || !propertyDetails) {
    //   setShowToast({ key: "error" });
    //   setError(t("TL_PROPERTY_ID_REQUIRED"));
    //   return;
    // }
    // if (propertyId == null) {
    //   setShowToast({ key: "error" });
    //   setError(t("TL_PROPERTY_ID_REQUIRED"));
    //   return;
    // }

    let accessories = [];
    if (data?.accessories?.length > 0) {
      data?.accessories.map((data) => {
        if (data?.accessoryCategory?.code) {
          accessories.push({
            accessoryCategory: data?.accessoryCategory?.code || null,
            uom: data?.accessoryCategory?.uom || null,
            count: Number(data?.count) || null,
            uomValue: Number(data?.uomValue) || null,
          });
        }
      });
    }

    let tradeUnits = [];
    if (data?.tradeUnits?.length > 0) {
      data?.tradeUnits.map((data) => {
        tradeUnits.push({
          tradeType: data?.tradeSubType?.code || null,
          uom: data?.tradeSubType?.uom || null,
          uomValue: Number(data?.uomValue) || null,
        });
      });
    }

    let address = {};
    if (data?.cpt?.details?.address) {
      address.city = data?.cpt?.details?.address?.city || null;
      address.locality = { code: data?.cpt?.details?.address?.locality?.code || null };
      if (data?.cpt?.details?.address?.doorNo || data?.address?.doorNo) address.doorNo = data?.cpt?.details?.address?.doorNo || data?.address?.doorNo || null;
      if (data?.cpt?.details?.address?.street || data?.address?.street) address.street = data?.cpt?.details?.address?.street || data?.address?.street || null;
      if (data?.cpt?.details?.address?.pincode) address.pincode = data?.cpt?.details?.address?.pincode;
    } else if (data?.address) {
      address.city = data?.address?.city?.code || null;
      address.locality = { code: data?.address?.locality?.code || null };
      if (data?.address?.doorNo) address.doorNo = data?.address?.doorNo || null;
      if (data?.address?.street) address.street = data?.address?.street || null;
      if (data?.address?.pincode) address.pincode = data?.address?.pincode;
    }

    let owners = [];
    if (data?.owners?.length > 0) {
      data?.owners.map((data) => {
        let obj = {};
        obj.dob = data?.dob ? convertDateToEpoch(data?.dob) : null;
        if (data?.fatherOrHusbandName) obj.fatherOrHusbandName = data?.fatherOrHusbandName;
        if (data?.gender?.code) obj.gender = data?.gender?.code;
        if (data?.mobileNumber) obj.mobileNumber = Number(data?.mobileNumber);
        if (data?.name) obj.name = !data?.ownershipCategory?.code.includes("INSTITUTIONAL") ? data?.name : "";
        if (data?.permanentAddress) obj.permanentAddress = data?.permanentAddress;
        obj.permanentAddress = obj.permanentAddress ? obj.permanentAddress : null;
        if (data?.relationship) obj.relationship = data?.relationship?.code;
        if (data?.emailId) obj.emailId = data?.emailId;
        if (data?.ownerType?.code) obj.ownerType = data?.ownerType?.code;
        owners.push(obj);
      });
    }

    let applicationDocuments = data?.documents?.documents || [];
    let commencementDate = convertDateToEpoch(data?.tradedetils?.["0"]?.commencementDate);
    let financialYear = data?.tradedetils?.["0"]?.financialYear?.code;
    let gstNo = data?.tradedetils?.["0"]?.gstNo || "";
    let noOfEmployees = Number(data?.tradedetils?.["0"]?.noOfEmployees) || "";
    let operationalArea = Number(data?.tradedetils?.["0"]?.operationalArea) || "";
    let structureType = data?.tradedetils?.["0"]?.structureSubType?.code || "";
    let tradeName = data?.tradedetils?.["0"]?.tradeName || "";
    let subOwnerShipCategory = data?.ownershipCategory?.code || "";
    let licenseType = data?.tradedetils?.["0"]?.licenseType?.code || "PERMANENT";

    let formData = {
      action: "INITIATE",
      applicationType: "NEW",
      workflowCode: "NewTL",
      commencementDate,
      financialYear,
      licenseType,
      tenantId,
      tradeName,
      wfDocuments: [],
      tradeLicenseDetail: {
        channel: "COUNTER",
        additionalDetail: {},
        // institution: {}
      },
    };

    if (gstNo) formData.tradeLicenseDetail.additionalDetail.gstNo = gstNo;
    if (noOfEmployees) formData.tradeLicenseDetail.noOfEmployees = noOfEmployees;
    if (operationalArea) formData.tradeLicenseDetail.operationalArea = operationalArea;
    if (accessories?.length > 0) formData.tradeLicenseDetail.accessories = accessories;
    if (tradeUnits?.length > 0) formData.tradeLicenseDetail.tradeUnits = tradeUnits;
    if (owners?.length > 0) formData.tradeLicenseDetail.owners = owners;
    // if (applicationDocuments?.length > 0) formData.tradeLicenseDetail.applicationDocuments = applicationDocuments;
    if (address) formData.tradeLicenseDetail.address = address;
    if (structureType) formData.tradeLicenseDetail.structureType = structureType;
    if (data?.ownershipCategory?.code.includes("INDIVIDUAL")) formData.tradeLicenseDetail.subOwnerShipCategory = data?.ownershipCategory?.code;
    if (subOwnerShipCategory) formData.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
    if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
      formData.tradeLicenseDetail = { ...formData.tradeLicenseDetail, institution: {} };
    if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
      formData.tradeLicenseDetail.institution["designation"] = data?.owners?.[0]?.designation;
    if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
      formData.tradeLicenseDetail.institution["instituionName"] = data?.owners?.[0]?.instituionName;
    if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
      formData.tradeLicenseDetail.institution["name"] = data?.owners?.[0]?.name;
    if (data?.owners?.length && subOwnerShipCategory.includes("INSTITUTIONAL"))
      formData.tradeLicenseDetail.institution["contactNo"] = data?.owners?.[0]?.altContactNumber;
    if (data?.cpt) 
    {
      formData.tradeLicenseDetail.additionalDetail.propertyId = data?.cpt?.details?.propertyId,
      formData.tradeLicenseDetail.additionalDetail.isSameAsPropertyOwner = isSameAsPropertyOwner
    };

    // setFormData(formData)
    /* use customiseCreateFormData hook to make some chnages to the licence object */
    formData = Digit?.Customizations?.TL?.customiseCreateFormData ? Digit?.Customizations?.TL?.customiseCreateFormData(data, formData) : formData;
    Digit.TLService.create({ Licenses: [formData] }, tenantId)
      .then((result, err) => {
        if (result?.Licenses?.length > 0) {
          let licenses = result?.Licenses?.[0];
          licenses.tradeLicenseDetail.applicationDocuments = applicationDocuments;
          licenses.wfDocuments = [];
          licenses.action = "APPLY";
          Digit.TLService.update({ Licenses: [licenses] }, tenantId)
            .then((response) => {
              if (response?.Licenses?.length > 0) {
                // setTimeout(() => window.location.reload());
                sessionStorage.setItem("isCreateEnabledEmployee","true");
                history.replace(`/digit-ui/employee/tl/response`, { data: response?.Licenses });
                clearSessionFormData();
              }
            })
            .catch((e) => {
              setShowToast({ key: "error" });
              setError(e?.response?.data?.Errors[0]?.message || null);
            });
        }
      })
      .catch((e) => {
        setShowToast({ key: "error" });
        setError(e?.response?.data?.Errors[0]?.message || null);
      });

    // history.replace("/digit-ui/employee/tl/response", { Licenses: [formData], documents: applicationDocuments });
    // history.push("/digit-ui/employee/pt/response", { Property: formData });
    // history.push("/digit-ui/employee/pt/response", { Property: _formData });
  };
  // let configs = newConfig;
  let configs = [];
  newConfig = newConfig ? newConfig : newConfigTL;
  newConfig?.map((conf) => {
    if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT" && conf.head) {
      configs.push(conf);
    }
  });

  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS";
    } else if (head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER";
    } else if (head === "TL_NEW_APPLICATION_PROPERTY" && (sessionFormData?.tradedetils?.[0]?.structureType?.code === "MOVABLE" && (isEmpNewApplication || isEmpRenewLicense))) {
      return "";
    }
     else {
      return head;
    }
  }

  return (
    <div>
      <div style={{ marginLeft: "15px" }}>
        <Header>{t("ES_TITLE_NEW_TRADE_LICESE_APPLICATION")}</Header>
      </div>
      <FormComposer
        heading={t("")}
        isDisabled={!canSubmit}
        label={t("ES_COMMON_APPLICATION_SUBMIT")}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => {
              return !a.hideInEmployee;
            }),
            head: checkHead(config.head),
          };
        })}
        fieldStyle={{ marginRight: 0 }}
        onSubmit={onSubmit}
        defaultValues={/* defaultValues */ sessionFormData}
        onFormValueChange={onFormValueChange}
        breaklineStyle={{ border: "0px" }}
      />
      {showToast && <Toast isDleteBtn={true} error={showToast?.key === "error" ? true : false} label={error} onClose={closeToast} />}
    </div>
  );
};

export default NewApplication;
