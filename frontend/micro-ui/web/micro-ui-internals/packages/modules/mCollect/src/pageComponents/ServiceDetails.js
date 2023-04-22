import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber, DatePicker, Loader, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as func from "../pages/employee/Utils/Category";
import { sortDropdownNames } from "../pages/employee/Utils/Sortbyname";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { getUniqueItemsFromArray, commonTransform, stringReplaceAll,getPattern, convertEpochToDate } from "../utils";

const createConsumerDetails = (getCities) => ({
   city: getCities()[0] ? getCities()[0] : "",
  category: "",
  categoryType: "",
  fromDate: "",
  toDate: "",
  //key: Date.now(),
});

const ServiceDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  if(window.location.href.includes("modify-challan") && sessionStorage.getItem("mcollectEditObject"))
  {
    formData = JSON.parse(sessionStorage.getItem("mcollectEditObject"))
  }
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEdit = pathname.includes("/modify-challan/");
  const cities = Digit.Hooks.mcollect.usemcollectTenants();
  const getCities = () => cities?.filter((e) => e.code === Digit.ULBService.getCurrentTenantId()) || [];
  const [consumerDetails, setconsumerDetails] = useState(formData?.consomerDetails1 || [createConsumerDetails(getCities)]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [isErrors, setIsErrors] = useState(false);
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const data = Digit.Hooks.mcollect.useCommonMDMS(stateCode, "common-masters", ["HierarchyType"]);
  const type = data &&  data.data &&  data.data[`common-masters`] && data.data[`common-masters`]["HierarchyType"] && data.data[`common-masters`]["HierarchyType"][0];
  const [pincode, setPincode] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [TaxHeadMaster, setAPITaxHeadMaster] = useState([]);

  const {Categories : categoires , data: categoriesandTypes} = Digit.Hooks.mcollect.useMCollectCategory(tenantId,"[?(@.type=='Adhoc')]");


  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    getCities()[0]?.code,
    type && type.code.toLowerCase(),
    {
      enabled: !!getCities()[0],
    },
    t
  );

  const [localities, setLocalities] = useState(fetchedLocalities);
  const [pincodeNotValid, setPincodeNotValid] = useState(false);
  const [selectedCity, setSelectedCity] = useState(getCities()[0] ? getCities()[0] : "");

  const selectCity = async (city) => {
    return;
  };

  useEffect(() => {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);

  useEffect(() => {
    const data = consumerDetails.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [consumerDetails]);


  const commonProps = {
    focusIndex,
    allOwners: consumerDetails,
    setFocusIndex,
    formData,
    formState,
    t,
    setError,
    clearErrors,
    config,
    setconsumerDetails,
    setSelectedLocality,
    categoriesandTypes,
    localities,
    setPincode,
    getCities,
    selectedCity,
    categoires,
    setLocalities,
    setPincodeNotValid,
    isEdit,
    setIsErrors,
    isErrors,
    TaxHeadMaster,
    setSelectedCity,
    pincode,
    cities,
    fetchedLocalities,
    consumerDetails,
  };

  return (
    <React.Fragment>
      {consumerDetails.map((consumerdetail, index) => (
        <OwnerForm1 key={consumerdetail.key} index={index} consumerdetail={consumerdetail} {...commonProps} />
      ))}
    </React.Fragment>
  );
};

const OwnerForm1 = (_props) => {
  const {
    consumerdetail,
    index,
    focusIndex,
    allOwners,
    setFocusIndex,
    t,
    formData,
    setPincode,
    config,
    localities,
    setError,
    clearErrors,
    formState,
    setconsumerDetails,
    setSelectedLocality,
    getCities,
    selectedCity,
    categoires,
    TaxHeadMaster,
    setSelectedCity,
    setPincodeNotValid,
    categoriesandTypes,
    isEdit,
    consumerDetails,
    setIsErrors,
    isErrors,
    setLocalities,
    pincode,
    cities,
    fetchedLocalities,
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const isMobile = window.Digit.Utils.browser.isMobile();

  
  const selectedCategory = useWatch({control: control, name: "category", defaultValue:""});
  const categoiresType = Digit.Hooks.mcollect.useMCollectCategoryTypes(selectedCategory,categoriesandTypes);
  const selectedCategoryType = useWatch({control: control, name: "categoryType", defaultValue:""});
  const TaxHeadMasterFields = Digit.Hooks.mcollect.useMCollectTaxHeads(selectedCategoryType,categoriesandTypes);
  const selectedPincode = useWatch({control: control, name: "pincode", defaultValue:""});

  useEffect(() => {
    if(!isEdit)
    setValue("categoryType","");
  },[selectedCategory])

  useEffect(() => {
    if(!isEdit){
    setValue("mohalla","");
    }
  },[selectedPincode])

  useEffect(() => {
    if(isEdit)
    setValue("city",selectedCity);
  },[selectedCity]);

  // useEffect(() => {
  //   if(!isEdit)
  //   TaxHeadMasterFields && TaxHeadMasterFields.length>0 && TaxHeadMasterFields?.map((ob) => {
  //     consumerdetail[ob.code] = "";
  //   })
  // },[TaxHeadMasterFields])

  useEffect(() => {
    if(isEdit && TaxHeadMasterFields && !(formValue[`${formValue?.categoryType?.code?.split(".")[0]}`]))
    {
      let cdTax = JSON.parse(sessionStorage.getItem("InitialTaxFeilds"));
      TaxHeadMasterFields && TaxHeadMasterFields.length>0 && TaxHeadMasterFields?.map((ob) => {
        setValue(ob.code,cdTax[`${ob.code.split(".")[1]}`]);
      })
    }
  },[TaxHeadMasterFields])

  useEffect(() => {
    const city = cities ? cities.find((obj) => obj.pincode?.find((item) => item == pincode)) : [];
    if (city?.code) {
      setPincodeNotValid(false);
      setSelectedCity(city);
      consumerdetail["city"]=city;
      setSelectedLocality("");
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

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if(Object.entries(formValue).length>0){
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = consumerdetail[key]));
    if (!_.isEqual(formValue, part)) {
      Object.keys(formValue).map(data => {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      let ob =[{...formValue}];
      let mcollectFormValue = JSON.parse(sessionStorage.getItem("mcollectFormData"));
      mcollectFormValue = {...mcollectFormValue,...ob[0]}
      sessionStorage.setItem("mcollectFormData",JSON.stringify(mcollectFormValue));
      setconsumerDetails(ob);
      trigger();
    }
    }
  }, [formValue]);


  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    }
    else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <div  style={isMobile?{}:{marginTop:"-50px"}}>
      <div style={{ marginBottom: "16px" }}>
        <div>
        <CardSectionHeader>{t("SERVICEDETAILS")}</CardSectionHeader>
      <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_CITY_LABEL")} * `}</CardLabel>
            <Controller
              name="city"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={consumerdetail?.city}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  id="city"
                  freeze={true}
                  disable={true}
                  //errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                  // disable={financialYearOptions?.length === 1}
                  option={getCities()}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  //disable={isRenewal}
                  t={t}
                />
              )}
            />
        </LabelFieldPair>
        <LabelFieldPair>
            <CardLabel className={isMobile?"card-label-APK":"card-label-smaller"}>{`${t("UC_SERVICE_CATEGORY_LABEL")} * `}</CardLabel>
            <Controller
              name="category"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={consumerdetail?.category}
              control={control}
              render={(props) => (
                <Dropdown
                  isMandatory
                  className="form-field"
                  selected={props.value}
                  optionCardStyles={{maxHeight:"960%"}}
                  //errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                  // disable={financialYearOptions?.length === 1}
                  id="businessService"
                  option={sortDropdownNames(categoires, "code", t)}
                  //option={categoires}
                  select={props.onChange}
                  optionKey="i18nkey"
                  onBlur={props.onBlur}
                  disable={isEdit}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_SERVICE_TYPE_LABEL")} * `}</CardLabel>
            <Controller
              name="categoryType"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={consumerdetail?.categoryType}
              control={control}
              render={(props) => (
                <Dropdown
                  isMandatory
                  className="form-field"
                  selected={props.value}
                  //errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                  // disable={financialYearOptions?.length === 1}
                  id="businessService"
                  option={sortDropdownNames(categoiresType, "code", t)}
                  //option={categoires}
                  select={props.onChange}
                  optionKey="i18nkey"
                  onBlur={props.onBlur}
                  disable={isEdit}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_FROM_DATE_LABEL")} * `}</CardLabel>
            <div className="field">
              <Controller
                name="fromDate"
                rules={{ required: t("REQUIRED_FIELD") }}
                isMandatory={true}
                defaultValue={consumerdetail?.fromDate}
                control={control}
                render={(props) => (
                  <DatePicker
                    date={props.value}
                    // date={CommencementDate} 
                    name="fromDate"
                    onChange={props.onChange}
                    //disabled={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_TO_DATE_LABEL")} * `}</CardLabel>
            <div className="field">
              <Controller
                name="toDate"
                rules={{ required: t("REQUIRED_FIELD") }}
                isMandatory={true}
                defaultValue={consumerdetail?.toDate}
                control={control}
                render={(props) => (
                  <DatePicker
                    date={props.value}
                    // date={CommencementDate} 
                    name="toDate"
                    onChange={props.onChange}
                    //disabled={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          {TaxHeadMasterFields && TaxHeadMasterFields.length>0 && TaxHeadMasterFields.map((tax) => 
          <div>
          <LabelFieldPair>
            <CardLabel className={isMobile?"card-label-APK":"card-label-smaller"}>{`${t(stringReplaceAll(tax?.name,".","_"))} * `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={tax?.code}
                defaultValue={consumerdetail[tax?.code]}
                isMandatory={tax.isRequired}
                componentInFront={<div className="employee-card-input employee-card-input--front">₹</div>}
                rules={tax.isRequired?{ required: t("REQUIRED_FIELD")}:"" }
                render={(props) => (
                  <div style={{display:"flex"}}>
                  <div className="employee-card-input employee-card-input--front">₹</div>
                  <TextInput
                    value={props.value}
                    //className="employee-card-input employee-card-input--front"
                    componentInFront={<div className="employee-card-input employee-card-input--front">₹</div>}
                    autoFocus={focusIndex.index === consumerdetail?.key && focusIndex.type === "name"}
                    //errorStyle={(localFormState.touched.tradeName && errors?.tradeName?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: consumerdetail.key, type: tax?.code });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    //disable={isRenewal}
                  />
                  </div>
                )}
              />
            </div>
          </LabelFieldPair> 
          </div>)}
        </div>
    </div>
    </div>
  );
};

export default ServiceDetails;