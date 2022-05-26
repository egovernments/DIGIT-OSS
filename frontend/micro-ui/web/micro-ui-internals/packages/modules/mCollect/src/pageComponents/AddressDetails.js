import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber, DatePicker, Loader, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as func from "../pages/employee/Utils/Category";
import { sortDropdownNames } from "../pages/employee/Utils/Sortbyname";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, commonTransform, stringReplaceAll,getPattern, convertEpochToDate } from "../utils";

const createConsumerDetails = (getCities) => ({
  doorNo: "",
  building: "",
  streetName: "",
  pincode: "",
  mohalla: "",
  city: getCities()[0] ? getCities()[0] : "",
  // key: Date.now(),
});

const AddressDetails = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
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
    localities,
    setPincode,
    getCities,
    selectedCity,
    setLocalities,
    setPincodeNotValid,
    isEdit,
    setIsErrors,
    isErrors,
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
    setSelectedCity,
    setPincodeNotValid,
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

  const selectedPincode = useWatch({control: control, name: "pincode", defaultValue:""});

  useEffect(() => {
    if(!isEdit){
    setValue("mohalla","");
    }
  },[selectedPincode])

  useEffect(() => {
    if(isEdit)
    setValue("city",selectedCity);
  },[selectedCity]);


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
    <div style={isMobile?{}:{marginTop:"-50px"}}>
      <div style={{ marginBottom: "16px"}}>
        <div>
          <CardLabelError style={errorStyle}>{localFormState.touched.mobileNumber ? errors?.mobileNumber?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_DOOR_NO_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"doorNo"}
                defaultValue={consumerdetail?.doorNo}
                //rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[-@.\/#&+\w\s]*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    //autoFocus={focusIndex.index === consumerdetail?.key && focusIndex.type === "name"}
                    //errorStyle={(localFormState.touched.tradeName && errors?.tradeName?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: consumerdetail.key, type: "doorNo" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    disable={isEdit}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className={isMobile?"card-label-APK":"card-label-smaller"}>{`${t("UC_BLDG_NAME_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"building"}
                defaultValue={consumerdetail?.building}
                //rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[-@.\/#&+\w\s]*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    //autoFocus={focusIndex.index === consumerdetail?.key && focusIndex.type === "name"}
                    //errorStyle={(localFormState.touched.tradeName && errors?.tradeName?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: consumerdetail.key, type: "building" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    disable={isEdit}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_SRT_NAME_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"streetName"}
                defaultValue={consumerdetail?.streetName}
                //rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[-@.\/#&+\w\s]*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    //autoFocus={focusIndex.index === consumerdetail?.key && focusIndex.type === "name"}
                    //errorStyle={(localFormState.touched.tradeName && errors?.tradeName?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: consumerdetail.key, type: "streetName" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    disable={isEdit}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("UC_PINCODE_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"pincode"}
                defaultValue={consumerdetail?.pincode}
                rules={{ validate: { pattern: (val) => (/^[1-9][0-9]{5}$|^$/.test(val) ? true : t("UC_PINCODE_INVALID")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === consumerdetail?.key && focusIndex.type === "pincode"}
                    errorStyle={(localFormState.touched.pincode && errors?.pincode?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setPincode(e.target.value);
                      setFocusIndex({ index: consumerdetail.key, type: "pincode" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    disable={isEdit}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.pincode ? errors?.pincode?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel  style={{paddingTop:"10px"}} className="card-label-smaller">{`${t("UC_MOHALLA_LABEL")} * `}</CardLabel>
            <Controller
              name="mohalla"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={consumerdetail?.mohalla}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  isMandatory={true}
                  //errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                  // disable={financialYearOptions?.length === 1}
                  option={localities}
                  select={props.onChange}
                  optionKey="i18nkey"
                  onBlur={props.onBlur}
                  disable={isEdit}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>     
      </div>
      </div>
       <hr style={{ width: "100%", border: "1px solid #D6D5D4", marginTop: "50px", marginBottom: "40px" }} />
    </div>
  );
};
export default AddressDetails;