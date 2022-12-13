import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, Header, Loader } from "@egovernments/digit-ui-react-components";
import { newConfig as newConfigMcollect } from "../../../config/config";
import { useHistory, useRouteMatch } from "react-router-dom";
import { stringReplaceAll } from "../../../utils";
//import { convertDateToEpoch } from "../../../utils";

const getformDataforEdit = (ChallanData,fetchBillData) => {
  let defaultval = {
    ConsumerName: ChallanData[0].citizen.name,
    mobileNumber: ChallanData[0].citizen.mobileNumber,
    doorNo: ChallanData[0].address.doorNo,
    building: ChallanData[0].address.buildingName,
    streetName: ChallanData[0].address.street,
    pincode: ChallanData[0].address.pincode || "143001",
    mohalla: {...ChallanData[0].address.locality, i18nkey:`${stringReplaceAll(ChallanData[0].tenantId,".","_").toUpperCase()}_ADMIN_${ChallanData[0]?.address?.locality?.code}`},
    category: {code:ChallanData[0].businessService, i18nkey:`BILLINGSERVICE_BUSINESSSERVICE_${ChallanData[0]?.businessService.split(".")[0].toUpperCase()}`},
    categoryType: {code:ChallanData[0].businessService, i18nkey:`BILLINGSERVICE_BUSINESSSERVICE_${stringReplaceAll(ChallanData[0].businessService,".","_").toUpperCase()}`},
    fromDate : ChallanData[0]
        ? new Date(ChallanData[0].taxPeriodFrom).getFullYear().toString() +
          "-" +
          `${(new Date(ChallanData[0].taxPeriodFrom).getMonth() + 1) < 10?"0":""}${(new Date(ChallanData[0].taxPeriodFrom).getMonth() + 1)}` +
          "-" +
          `${(new Date(ChallanData[0].taxPeriodFrom).getDate() < 10?"0":"")}${new Date(ChallanData[0].taxPeriodFrom).getDate()}`
        : null,
    toDate : ChallanData[0]
        ? new Date(ChallanData[0].taxPeriodTo).getFullYear().toString() +
          "-" +
          `${(new Date(ChallanData[0].taxPeriodTo).getMonth() + 1) < 10?"0":""}${(new Date(ChallanData[0].taxPeriodTo).getMonth() + 1)}` +
          "-" +
          `${(new Date(ChallanData[0].taxPeriodTo).getDate() < 10?"0":"")}${new Date(ChallanData[0].taxPeriodTo).getDate()}`
        : null
  };
  defaultval[`${ChallanData[0]?.businessService.split(".")[0]}`] = {};
  if (fetchBillData.Bill[0].billDetails[0].billAccountDetails.length > 0) {
    fetchBillData.Bill[0].billDetails[0].billAccountDetails.map(
      (ele) => ((defaultval[`${ChallanData[0]?.businessService.split(".")[0]}`])[`${ele.taxHeadCode.split(".")[1]}`] = `${ele.amount}`)
    );
  }
  sessionStorage.setItem("InitialTaxFeilds",JSON.stringify(defaultval[`${ChallanData[0]?.businessService.split(".")[0]}`]));
  return defaultval;

}


const NewChallan = ({ChallanData}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { url } = useRouteMatch();
  let isEdit = false;
  if (url.includes("modify-challan")) {
    isEdit = true;
  }
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();
  // delete
  const [_formData, setFormData, _clear] = Digit.Hooks.useSessionStorage("store-data", null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});
  const [defaultUpdatedValue, setdefaultUpdatedValue] = useState(false)
  const isMobile = window.Digit.Utils.browser.isMobile();



  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);

  const stateId = Digit.ULBService.getStateId();
  let { data: newConfig, isLoading } = Digit.Hooks.mcollect.useMcollectFormConfig.getFormConfig(stateId, {});
  let lastModTime = ChallanData ? ChallanData[0].auditDetails.lastModifiedTime : null;
  const { data: fetchBillData } = ChallanData
    ? Digit.Hooks.useFetchBillsForBuissnessService(
        {
          businessService: ChallanData[0].businessService,
          consumerCode: ChallanData[0].challanNo,
        },
        { lastModTime }
      )
    : {};

  useEffect(() => {
    if(isEdit && fetchBillData)
    {
      let formdata = getformDataforEdit(ChallanData, fetchBillData);
      setdefaultUpdatedValue(true)
      sessionStorage.setItem("mcollectEditObject", JSON.stringify({consomerDetails1:[{...formdata}]}))
    }
  },[isEdit,fetchBillData])

  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  window.onunload = function () {
    sessionStorage.removeItem("mcollectFormData");
  }
  const onFormValueChange = (setValue, formData, formState) => {
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  const onSubmit = (data) => {
    let mcollectFormValue = JSON.parse(sessionStorage.getItem("mcollectFormData"));
    data = mcollectFormValue? mcollectFormValue : data?.consomerDetails1?.[0];
    let TaxHeadMasterKeys= data[`${data?.category?.code?.split(".")[0]}`] ? Object.keys(data[`${data?.category?.code?.split(".")[0]}`]) : [];
    let TaxHeadMasterValues = data[`${data?.category?.code?.split(".")[0]}`] ? Object.values(data[`${data?.category?.code?.split(".")[0]}`]) : [];
    let Challan = {};
    if(!isEdit){
      let temp = data?.category?.code;
      Challan = {
        citizen: {
          name: data.ConsumerName,
          mobileNumber: data.mobileNumber,
        },
        //businessService: selectedCategoryType ? temp + "." + humanized(selectedCategoryType.code, temp) : "",
        businessService:data?.categoryType?.code,
        consumerType: data?.category?.code?.split(".")[0],
        description: data?.comments,
        taxPeriodFrom: Date.parse(data?.fromDate),
        taxPeriodTo: Date.parse(data?.toDate),
        tenantId: tenantId,
        address: {
          buildingName: data.building,
          doorNo: data.doorNo,
          street: data.streetName,
          locality: { code: data?.mohalla?.code },
          pincode: data.pincode,
        },
        amount: TaxHeadMasterKeys.map((ele,index) => {
          return {
            taxHeadCode: `${data?.category?.code?.split(".")[0]}.${ele}`,
            amount: TaxHeadMasterValues[index] ? parseInt(TaxHeadMasterValues[index]) : 0,
          };
        }),
      };
    } else {
      Challan = {
        accountId: ChallanData[0].accountId,
        citizen: ChallanData[0].citizen,
        applicationStatus: ChallanData[0].applicationStatus,
        auditDetails: ChallanData[0].auditDetails,
        id: ChallanData[0].id,
        businessService: ChallanData[0].businessService,
        challanNo: ChallanData[0].challanNo,
        consumerType: data?.category?.code,
        description: data.comments,
        taxPeriodFrom: Date.parse(data.fromDate),
        taxPeriodTo: Date.parse(data.toDate),
        tenantId: tenantId,
        address: ChallanData[0].address,
          amount: TaxHeadMasterKeys.map((ele,index) => {
          return {
            taxHeadCode: `${data?.category?.code?.split(".")[0]}.${ele}`,
            amount: TaxHeadMasterValues[index] ? parseInt(TaxHeadMasterValues[index]) : 0,
          };
        }),
      };
    }

    if (isEdit) {
      Digit.MCollectService.update({ Challan: Challan }, tenantId)
        .then((result, err) => {
          if (result.challans && result.challans.length > 0) {
            const challan = result.challans[0];
            sessionStorage.removeItem('mcollectEditObject');
            let LastModifiedTime = Digit.SessionStorage.set("isMcollectAppChanged", challan.auditDetails.lastModifiedTime);
            Digit.MCollectService.generateBill(challan.challanNo, tenantId, challan.businessService, "challan").then((response) => {
              if (response.Bill && response.Bill.length > 0) {
                history.push(
                  `/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=${tenantId}&billNumber=${
                    response.Bill[0].billNumber
                  }&serviceCategory=${response.Bill[0].businessService}&challanNumber=${response.Bill[0].consumerCode}&isEdit=${true}`,
                  { from: url }
                );
              }
            });
          }
        })
        .catch((e) => setShowToast({ key: "error", label: e?.response?.data?.Errors[0].message }));
    } else {
      Digit.MCollectService.create({ Challan: Challan }, tenantId)
        .then((result, err) => {
          if (result.challans && result.challans.length > 0) {
            const challan = result.challans[0];
            sessionStorage.removeItem("mcollectFormData");
            Digit.MCollectService.generateBill(challan.challanNo, tenantId, challan.businessService, "challan").then((response) => {
              if (response.Bill && response.Bill.length > 0) {
                history.push(
                  `/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=${tenantId}&billNumber=${response.Bill[0].billNumber}&serviceCategory=${response.Bill[0].businessService}&challanNumber=${response.Bill[0].consumerCode}`,
                  { from: url }
                );
              }
            });
          }
        })
        .catch((e) => {setShowToast({ key: "error", label: e?.response?.data?.Errors[0].message })});
    }
  };
  let configs = newConfig || [];
  //let configs = [];
  //let newConfig;
  newConfig=newConfig?newConfig:newConfigMcollect;
  newConfig?.map((conf) => {
    if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT" && conf.head) {
      configs.push(conf);
    }
  });
  configs=newConfig;
  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS";
    } else if (head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER";
    } else {
      return head;
    }
  }

  return (
    <div>
      <div style={isMobile?{}:{ marginLeft: "15px" }}>
        <Header>{isEdit ? t("UC_UPDATE_CHALLAN"):t("UC_COMMON_HEADER")}</Header>
      </div>
      {isEdit && !(JSON.parse(sessionStorage.getItem("mcollectEditObject"))) && !defaultUpdatedValue ? <Loader />
       :<FormComposer
        heading={t("")}
        //isDisabled={!canSubmit}
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
        defaultValues={defaultValues}
        onFormValueChange={onFormValueChange}
        breaklineStyle={{ border: "0px" }}
      />}
      {showToast && <Toast error={showToast?.key === "error" ? true : false} label={showToast?.label} onClose={closeToast} />}
    </div>
  );
};

export default NewChallan;