import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../../config/config";
import { useHistory } from "react-router-dom";
import { convertDateToEpoch } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";


const NewApplication = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();
  // delete
  const [_formData, setFormData,_clear] = Digit.Hooks.useSessionStorage("store-data",null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});

  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);


  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const onFormValueChange = (setValue, formData, formState) => {
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  const onSubmit = (data) => {

    let accessories = [];
    if (data?.accessories?.length > 0) {
      data?.accessories.map(data => {
        if (data?.accessoryCategory?.code) {
          accessories.push({
            accessoryCategory: data?.accessoryCategory?.code || null,
            uom: data?.accessoryCategory?.uom || null,
            count: Number(data?.count) || null,
            uomValue: Number(data?.uomValue) || null
          });
        } 
      });
    };

    let tradeUnits = [];
    if (data?.tradeUnits?.length > 0) {
      data?.tradeUnits.map(data => {
        tradeUnits.push({
          tradeType: data?.tradeSubType?.code || null,
          uom: data?.tradeSubType?.uom || null,
          uomValue: Number(data?.uomValue) || null
        });
      });
    };

    let address = {};
    if (data?.address) {
      address.city = data?.address?.city?.code || null;
      address.locality = { code: data?.address?.locality?.code || null };
      if (data?.address?.doorNo) address.doorNo = data?.address?.doorNo || null;
      if (data?.address?.street) address.street = data?.address?.street || null;
      if (data?.address?.pincode) address.pincode = data?.address?.pincode;
    }

    let owners = [];
    if (data?.owners?.length > 0) {
      data?.owners.map(data => {
        let obj = {};
        if (data?.dob) obj.dob = convertDateToEpoch(data?.dob);
        if (data?.fatherOrHusbandName) obj.fatherOrHusbandName = data?.fatherOrHusbandName;
        if (data?.gender?.code) obj.gender = data?.gender?.code;
        if (data?.mobileNumber) obj.mobileNumber = Number(data?.mobileNumber);
        if (data?.name) obj.name = data?.name;
        if (data?.permanentAddress) obj.permanentAddress = data?.permanentAddress;
        if (data?.relationship) obj.relationship = data?.relationship?.code;
        if (data?.emailId) obj.emailId = data?.emailId;
        if (data?.ownerType?.code) obj.ownerType = data?.ownerType?.code;
        owners.push(obj);
      })
    };

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
        channel:"COUNTER",
        additionalDetail: {}
      }
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
    if (subOwnerShipCategory) formData.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
   
    // setFormData(formData)

    Digit.TLService.create({ Licenses: [formData] }, tenantId)
      .then((result, err) => {
        if (result?.Licenses?.length > 0) {
          let licenses = result?.Licenses?.[0];
          licenses.tradeLicenseDetail.applicationDocuments = applicationDocuments;
          licenses.wfDocuments = [];
          licenses.action = "APPLY";
          Digit.TLService.update({ Licenses: [licenses] }, tenantId).then((response) => {
            if (response?.Licenses?.length > 0) {
              history.replace(
                `/digit-ui/employee/tl/response`,
                { data: response?.Licenses }
              );
            }
          }).catch((e) => {
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
  newConfig.map(conf => {
    if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT" && conf.head) {
      configs.push(conf);
    }
  });


  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS"
    } else if(head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER"
    } else {
      return head
    }
  }

  return (
    <div style={{marginLeft:"30px"}}>
      <FormComposer
        heading={t("ES_TITLE_NEW_TRADE_LICESE_APPLICATION")}
        isDisabled={!canSubmit}
        label={t("ES_COMMON_APPLICATION_SUBMIT")}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => {
              return !a.hideInEmployee
            }),
            head: checkHead(config.head)
          };
        })}
        fieldStyle={{ marginRight: 0 }}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        onFormValueChange={onFormValueChange}
        breaklineStyle={{ border: "0px" }}
      />
      {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} onClose={closeToast} />}
    </div>

  );
};

export default NewApplication;
