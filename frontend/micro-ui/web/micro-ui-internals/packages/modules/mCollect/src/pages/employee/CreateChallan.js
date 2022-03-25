import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DatePicker, Toast } from "@egovernments/digit-ui-react-components";
import * as func from "./Utils/Category";
import { FormComposer } from "../../components/FormComposer";
import { sortDropdownNames } from "./Utils/Sortbyname";
import { stringReplaceAll } from "../../utils/index";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";

const CreateChallen = ({ ChallanData }) => {
  const childRef = useRef();
  const history = useHistory();
  const { url } = useRouteMatch();
  let defaultval;
  let isEdit = false;
  if (url.includes("modify-challan")) {
    isEdit = true;
  }

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

  const cities = Digit.Hooks.mcollect.usemcollectTenants();
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const data = Digit.Hooks.mcollect.useCommonMDMS(stateCode, "common-masters", ["HierarchyType"]);
  const type = data &&  data.data &&  data.data[`common-masters`] && data.data[`common-masters`]["HierarchyType"] && data.data[`common-masters`]["HierarchyType"][0];
  const getCities = () => cities?.filter((e) => e.code === Digit.ULBService.getCurrentTenantId()) || [];
  const { t } = useTranslation();
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    getCities()[0]?.code,
    type && type.code,
    {
      enabled: !!getCities()[0],
    },
    t
  );


  const getPattern = (type) => {
    switch (type) {
      case "name":
        return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
      case "mobileNumber":
        return /^[6789][0-9]{9}$/i;
      case "doorNo":
          return /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i;
      case "buildingName":
      case "street":
          return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
      case "pincode":
          return /^[1-9][0-9]{5}$/i;
      default:
        return /^(0|[1-9][0-9]*)$/i; 
    }
  }


  const handlePincode = (event) => {
    const { value } = event.target;
    setPincode(value);
    if (!value) {
      setPincodeNotValid(false);
    }
    handleData(event);
  };

  const isPincodeValid = () => !pincodeNotValid;

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  function setcategories(category) {
    setcategoriesType(null);
    setSelectedcategories(category);
  }

  function ChangesetToDate(value) {
    if (new Date(fromDate) < new Date(value)) {
      setToDate(value);
    }
  }
  function setcategoriesType(categoryType) {
    setselectedCategoryType(categoryType);
  }

  function humanized(str, key) {
    if (Array.isArray(str)) {
      str = str[0];
    }
    str = str.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
    str = str.replace(key + "_", "");
    var frags = str.split("_");
    for (let i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].toLowerCase().slice(1);
    }
    return frags.join("_");
  }

  function humanize(str) {
    var frags = str.split("_");
    for (let i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join("_");
  }
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setSubmitValve] = useState(true);
  const [localities, setLocalities] = useState(fetchedLocalities);
  const [categoires, setAPIcategories] = useState([]);
  const [categoiresType, setAPIcategoriesType] = useState([]);
  const [selectedCategory, setSelectedcategories] = useState(null);
  const [selectedCategoryType, setselectedCategoryType] = useState(null);
  const [TaxHeadMaster, setAPITaxHeadMaster] = useState([]);
  const [TaxHeadMasterFields, setTaxHeadMasterFields] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pincodeNotValid, setPincodeNotValid] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const [pincode, setPincode] = useState("");
  const [selectedCity, setSelectedCity] = useState(getCities()[0] ? getCities()[0] : null);
  const selectCity = async (city) => {
    return;
  };
  const [canSubmits, setSubmitsValve] = useState(true);
  const [totalFormData, setTotalFormData] = useState({});

  const { register, handleSubmit, setError, formState: { errors }, clearErrors } = useForm();


  if (isEdit == true && fetchBillData && ChallanData[0] && JSON.parse(sessionStorage.getItem("isHookRecall"))) {
    defaultval = {
      name: ChallanData[0].citizen.name,
      mobileNumber: ChallanData[0].citizen.mobileNumber,
      doorNo: ChallanData[0].address.doorNo,
      buildingName: ChallanData[0].address.buildingName,
      street: ChallanData[0].address.street,
      pincode: ChallanData[0].address.pincode,
      ADVT_HOARDINGS_CGST: "10",
      comments: ChallanData[0].description,
    };
    if (fetchBillData.Bill[0].billDetails[0].billAccountDetails.length > 0) {
      fetchBillData.Bill[0].billDetails[0].billAccountDetails.map(
        (ele) => (defaultval[`${ele.taxHeadCode.replaceAll(".", "_")}`] = `${ele.amount}`)
      );
    }
  }

  useEffect(() => {
    if (isEdit && ChallanData[0] && fetchBillData) {
      let setlocalit =
        localities &&
        localities.filter((el) => {
          return el["code"] == ChallanData[0].address.locality.code;
        });
      localities && setSelectedLocality(setlocalit[0]);
      let setcategory = categoires.filter((el) => {
        return el["code"] == `BILLINGSERVICE_BUSINESSSERVICE_${ChallanData[0].businessService.split(".")[0]}`;
      });
      setSelectedcategories(setcategory[0]);
      let setcategorytype = categoiresType.filter((el) => {
        return el["code"] == `BILLINGSERVICE_BUSINESSSERVICE_${ChallanData[0].businessService.replaceAll(".", "_").toUpperCase()}`;
      });
      setselectedCategoryType(setcategorytype[0]);
    }
  }, [fetchBillData, ChallanData, categoires]);

  useEffect(() => {
    if (isEdit && ChallanData[0] && fetchBillData) {
      let setcategorytype = categoiresType.filter((el) => {
        return el["code"] == `BILLINGSERVICE_BUSINESSSERVICE_${ChallanData[0].businessService.replaceAll(".", "_").toUpperCase()}`;
      });
      setselectedCategoryType(setcategorytype[0]);
    }
  }, [categoiresType]);

  useEffect(() => {
    if (isEdit && ChallanData[0] && fetchBillData && !fromDate && !toDate) {
      let fromdate = ChallanData[0]
        ? new Date(ChallanData[0].taxPeriodFrom).getFullYear().toString() +
          "-" +
          (new Date(ChallanData[0].taxPeriodFrom).getMonth() + 1) +
          "-" +
          new Date(ChallanData[0].taxPeriodFrom).getDate()
        : null;
      ChallanData[0] && setFromDate(fromdate);
      let todate = ChallanData[0]
        ? new Date(ChallanData[0].taxPeriodTo).getFullYear().toString() +
          "-" +
          (new Date(ChallanData[0].taxPeriodTo).getMonth() + 1) +
          "-" +
          new Date(ChallanData[0].taxPeriodTo).getDate()
        : null;
      ChallanData[0] && setToDate(todate);
    }
  });

  useEffect(() => {
    setAPIcategoriesType(
      selectedCategory?.child
        ? selectedCategory.child.map((ele) => {
            if (!ele.code.includes("BILLINGSERVICE_BUSINESSSERVICE_")) {
              ele.code = "BILLINGSERVICE_BUSINESSSERVICE_" + ele.code.split(".").join("_").toUpperCase();
            }
            return ele;
          })
        : []
    );
  }, [selectedCategory]);

  useEffect(() => {
    let selectedCatBusinesService = selectedCategoryType?stringReplaceAll(selectedCategoryType?.businessService.split(".")[1]," ","_"):"";
    setTaxHeadMasterFields(
      TaxHeadMaster.filter((ele) => {
        let temp = selectedCategory.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
        return (
          selectedCategoryType &&
          selectedCategoryType.code.split(temp + "_")[1] &&
          (ele.service == temp + "." + humanize(selectedCategoryType.code.split(temp + "_")[1].toLowerCase()) ||
          ele.service == temp + "." + selectedCatBusinesService)
        );
      })
    );
  }, [selectedCategoryType]);

  useEffect(() => {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);

  useEffect(() => {
    Digit.MDMSService.getPaymentRules(tenantId, "[?(@.type=='Adhoc')]").then((value) => {
      setAPIcategories(
        func.setServiceCategory(value.MdmsRes.BillingService.BusinessService).map((ele) => {
          ele.code = "BILLINGSERVICE_BUSINESSSERVICE_" +stringReplaceAll(ele.code.toUpperCase()," ","_");
          return ele;
        })
      );
      setAPITaxHeadMaster(value.MdmsRes.BillingService.TaxHeadMaster);
    });
  }, [tenantId]);

  useEffect(() => {
    // if((ChallanData?.length > 0 && isEdit) || isEdit) {
      const configDetails = setconfig();
      const isMandatoryArray = [];
      let flag = true;
      configDetails?.map(data => {
        data?.body?.map(details => {
          if(details.isMandatory && details.type == "text") isMandatoryArray.push(details.name);
        })
      });
      if(isEdit && !Object.keys(errors).length) {
        setSubmitsValve(false)
      } else if (!isEdit) {
        isMandatoryArray?.map(data => {
          if(flag && totalFormData[data] && totalFormData[data] != "" && selectedCategory && selectedCategoryType && fromDate != "" && toDate != "" && selectedLocality != null && !Object.keys(errors).length) { setSubmitsValve(false); }
          else { setSubmitsValve(true); flag = false;}
        })
      } else {
        setSubmitsValve(true)
      }
    // }
  }, [totalFormData, selectedCategory, selectedCategoryType, selectedLocality, fromDate, toDate]);


  useEffect(() => {
    if (selectedCategory && selectedCategoryType && fromDate != "" && toDate != "" && selectedLocality != null) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  }, [selectedCategory, selectedCategoryType, selectedLocality, fromDate, toDate]);

  useEffect(() => {
    const city = cities ? cities.find((obj) => obj.pincode?.find((item) => item == pincode)) : [];
    if (city?.code) {
      setPincodeNotValid(false);
      setSelectedCity(city);
      setSelectedLocality(null);
      const __localityList = fetchedLocalities;
      const __filteredLocalities = __localityList.filter((city) => city["pincode"] == pincode);
      setLocalities(__filteredLocalities);
    } else if (pincode === "" || pincode === null) {
      setPincodeNotValid(false);
      setLocalities(fetchedLocalities);
    } else {
      setPincodeNotValid(true);
    }
  }, [pincode]);

  const handleData = (event) => {
    sessionStorage.setItem("isHookRecall", false);
    // if((ChallanData?.length > 0 && isEdit) || isEdit) {
      const { value, name } = event.target;
      setTotalFormData({ ...totalFormData, [event.target.name]: event.target.value });
      if (!value || getPattern(name).test(value)) {
        clearErrors(name, {
              type: "manual",
              message: "Dont Forget Your Username Should Be Cool!",
            });
      } else {
        setError(name, {
          type: "manual12",
          message: "Dont Forget Your Username Should Be Cool!",
        });
      }
    // }
  }

  const onSubmit = (data) => {
    TaxHeadMasterFields.map((ele) => {
      return { taxHeadCode: ele.code, amount: data[ele.code.split(".").join("_")] };
    });
    let Challan = {};
    if (!isEdit) {
      let temp = selectedCategory.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
      Challan = {
        citizen: {
          name: data.name,
          mobileNumber: data.mobileNumber,
        },
        //businessService: selectedCategoryType ? temp + "." + humanized(selectedCategoryType.code, temp) : "",
        businessService:selectedCategoryType?(temp + "." + stringReplaceAll(selectedCategoryType?.businessService.split(".")[1]," ","_")) : "",
        consumerType: temp,
        description: data.comments,
        taxPeriodFrom: Date.parse(fromDate),
        taxPeriodTo: Date.parse(toDate),
        tenantId: tenantId,
        address: {
          buildingName: data.buildingName,
          doorNo: data.doorNo,
          street: data.street,
          locality: { code: selectedLocality.code },
        },
        amount: TaxHeadMasterFields.map((ele) => {
          return {
            taxHeadCode: ele.code,
            amount: data[ele.code.split(".").join("_")] ? data[ele.code.split(".").join("_")] : 0,
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
        consumerType: selectedCategory?.code,
        description: data.comments,
        taxPeriodFrom: Date.parse(fromDate),
        taxPeriodTo: Date.parse(toDate),
        tenantId: tenantId,
        address: ChallanData[0].address,
        amount: TaxHeadMasterFields.map((ele) => {
          return {
            taxHeadCode: ele.code,
            amount: data[ele.code.split(".").join("_")] ? data[ele.code.split(".").join("_")] : 0,
          };
        }),
      };
    }

    if (isEdit) {
      Digit.MCollectService.update({ Challan: Challan }, tenantId)
        .then((result, err) => {
          if (result.challans && result.challans.length > 0) {
            const challan = result.challans[0];
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
        .catch((e) => setShowToast({ key: true, label: e?.response?.data?.Errors[0].message }));
    } else {
      Digit.MCollectService.create({ Challan: Challan }, tenantId)
        .then((result, err) => {
          if (result.challans && result.challans.length > 0) {
            const challan = result.challans[0];
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
        .catch((e) => setShowToast({ key: true, label: e?.response?.data?.Errors[0].message }));
    }
  };
  function setconfig() {
    const config = [
      {
        head: t("CONSUMERDETAILS"),
        body: [
          {
            label: t("UC_CONS_NAME_LABEL"),
            isMandatory: true,
            type: "text",
            name: "name",
            populators: {
              name: "name",
              disable: isEdit,
              validation: {
                required: true,
                pattern: /^[A-Za-z]/,
              },
              onChange: handleData,
              error: t("CS_ADDCOMPLAINT_NAME_ERROR"),
            },
          },
          {
            label: t("UC_MOBILE_NUMBER"),
            isMandatory: true,
            type: "text",
            name: "mobileNumber",
            populators: {
              name: "mobileNumber",
              disable: isEdit,
              validation: {
                required: true,
                pattern: /^[6-9]\d{9}$/,
              },
              onChange: handleData,
              componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
              error: t("CORE_COMMON_MOBILE_ERROR"),
            },
          },
          {
            label: t("UC_DOOR_NO_LABEL"),
            type: "text",
            name: "doorNo",
            populators: {
              name: "doorNo",
              disable: isEdit,
              error: t("UC_COMMON_FIELD_ERROR"),
              onChange: handleData
            },
          },
          {
            label: t("UC_BLDG_NAME_LABEL"),
            type: "text",
            name: "buildingName",
            populators: {
              name: "buildingName",
              disable: isEdit,
            },
            error: t("UC_COMMON_FIELD_ERROR"),
            onChange: handleData
          },
          {
            label: t("UC_SRT_NAME_LABEL"),
            type: "text",
            name: "street",
            populators: {
              name: "street",
              disable: isEdit,
            },
            error: t("UC_COMMON_FIELD_ERROR"),
            onChange: handleData
          },
          {
            label: t("UC_PINCODE_LABEL"),
            type: "text",
            name: "pincode",
            populators: {
              name: "pincode",
              disable: isEdit,
              validation: { pattern: /^[1-9][0-9]{5}$/, validate: isPincodeValid },
              error: t("UC_PINCODE_INVALID"),
              onChange: handlePincode,
            },
          },
          {
            label: t("UC_MOHALLA_LABEL"),
            type: "dropdown",
            isMandatory: true,
            name: "Mohalla",
            dependency: localities ? true : false,
            populators: (
              <Dropdown
                isMandatory
                selected={selectedLocality}
                disable={isEdit}
                optionKey="i18nkey"
                id="locality"
                option={localities}
                select={selectLocality}
                t={t}
              />
            ),
          },
        ],
      },
      {
        head: t("SERVICEDETAILS"),
        body: [
          {
            label: t("UC_CITY_LABEL"),
            isMandatory: true,
            type: "dropdown",
            name: "city",
            populators: (
              <Dropdown
                isMandatory
                selected={selectedCity}
                freeze={true}
                disable={true}
                option={getCities()}
                id="city"
                select={selectCity}
                optionKey="i18nKey"
                t={t}
              />
            ),
          },
          {
            label: t("UC_SERVICE_CATEGORY_LABEL"),
            type: "dropdown",
            isMandatory: true,
            name: "category",
            populators: (
              <Dropdown
                isMandatory
                selected={selectedCategory}
                optionKey="code"
                disable={isEdit}
                id="businessService"
                option={sortDropdownNames(categoires, "code", t)}
                select={setcategories}
                t={t}
              />
            ),
          },
          {
            label: t("UC_SERVICE_TYPE_LABEL"),
            type: "dropdown",
            isMandatory: true,
            name: "categoryType",
            dependency: selectedCategory ? true : false,
            populators: (
              <Dropdown
                isMandatory
                selected={selectedCategoryType}
                disable={isEdit}
                optionKey="code"
                id="businessService"
                option={sortDropdownNames(categoiresType, "code", t)}
                select={setcategoriesType}
                t={t}
              />
            ),
          },
          {
            label: t("UC_FROM_DATE_LABEL"),
            type: "date",
            name: "fromDate",
            isMandatory: true,
            populators: <DatePicker date={fromDate ? fromDate : ""} onChange={setFromDate} />,
          },
          {
            label: t("UC_TO_DATE_LABEL"),
            type: "date",
            name: "toDate",
            disable: fromDate == "" ? true : false,
            isMandatory: true,
            dependency: fromDate ? true : false,
            populators: <DatePicker date={toDate ? toDate : ""} min={fromDate} onChange={ChangesetToDate} /* defaultValue="2021-05-30" */ />,
          },
          // {
          //   label: t("UC_COMMENT_LABEL"),
          //   isMandatory: false,
          //   type: "textarea",
          //   populators: {
          //     name: "comments",
          //     validation: {
          //       required: false,
          //     },
          //   },
          // },
        ],
      },
    ];
    if (TaxHeadMasterFields.length > 0 && config.length > 0) {
      const tempConfig = config;
      if ((config[1].head == "Service Details") | (config[1].head == t("SERVICEDETAILS"))) {
        const temp = TaxHeadMasterFields.map((ele, index) => ({
          label: t(ele.name.split(".").join("_")),
          isMandatory: ele.isRequired,
          type: "text",
          name: ele.code.split(".").join("_"),
          populators: {
            name: ele.code.split(".").join("_"),
            validation: { required: ele.isRequired, pattern: /^(0|[1-9][0-9]*)$/ },
            error: t("UC_COMMON_FIELD_ERROR"),
            componentInFront: <div className="employee-card-input employee-card-input--front">₹</div>,
            onChange: handleData,
          },
        }));
        if (temp.length > 0) {
          tempConfig[1].body = [...tempConfig[1].body, ...temp];
        }
      }
      return tempConfig;
    } else {
      return config;
    }
  }

  return (
    <div>
      <FormComposer
        ref={childRef}
        heading={isEdit ? t("UC_UPDATE_CHALLAN") : t("UC_COMMON_HEADER")}
        config={setconfig()}
        onSubmit={onSubmit}
        setFormData={defaultval}
        isDisabled={canSubmits}
        label={isEdit ? t("UC_UPDATE_CHALLAN") : t("UC_ECHALLAN")}
        errors={errors}
      />
      {showToast && <Toast error={showToast.key} label={t(showToast.label)} onClose={() => setShowToast(null)} />}
    </div>
  );
};
export default CreateChallen;
