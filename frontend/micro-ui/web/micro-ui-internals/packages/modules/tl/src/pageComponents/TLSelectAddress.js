import { CardLabel, Dropdown, FormStep, LabelFieldPair, RadioOrSelect, RadioButtons, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import Timeline from "../components/TLTimeline";

const TLSelectAddress = ({ t, config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const allCities = Digit.Hooks.tl.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();
  //let isEditProperty = formData?.isEditProperty || false;
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");
  //if (formData?.isUpdateProperty) isEditProperty = true;
  const { pincode, city } = formData?.address || "";
  const cities =
    userType === "employee"
      ? allCities.filter((city) => city.code === tenantId)
      : pincode
      ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
      : allCities;

  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city || null);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  const [localities, setLocalities] = useState();

  const [selectedLocality, setSelectedLocality] = useState();

  const [isErrors, setIsErrors] = useState(false);

  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (formData?.address) {
      let flag = true;;
        Object.keys(formData?.address).map(dta => {
          if (dta != "key" || formData?.address[dta] != undefined || formData?.address[dta] != "" || formData?.address[dta] != null) {

          } else {
            if (flag) setSelectedCity(cities[0]);
            flag = false;
          }
        });
    }

  }, [formData?.tradeUnits?.[0]?.tradeCategory?.code]);

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }

      // if (userType === "employee") {
      //   onSelect(config.key, { ...formData[config.key], city: selectedCity });
      // }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, { ...formData[config.key], locality: filteredLocalityList[0] });
        }
      }
    }
  }, [selectedCity, formData?.address?.pincode, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    if (formData?.address?.locality) {
      formData.address["locality"] = locality;
    }
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  function onSubmit() {
    onSelect(config.key, { city: selectedCity, locality: selectedLocality });
  }

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    let keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = formData[config.key]?.[key]));

    if (userType === "employee") {
      if (!_.isEqual(formValue, part)) {
        Object.keys(formValue).map(data => {
          if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
            setIsErrors(true);
          }
        });
        onSelect(config.key, { ...formData[config.key], ...formValue });
        trigger();
      }
    } else {
      if (!_.isEqual(formValue, part)) onSelect(config.key, { ...formData[config.key], ...formValue });
    }
    for (let key in formValue) {
      if (!formValue[key] && !localFormState.errors[key]) {
        setLocalError(key, { type: `${key.toUpperCase()}_REQUIRED`, message: `${key.toUpperCase()}_REQUIRED` });
      } else if (formValue[key] && localFormState.errors[key]) {
        clearLocalErrors([key]);
      }
    }
  }, [formValue]);

  useEffect(() => {
    if (userType === "employee") {
      if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
        setError(config.key, { type: errors });
      }
      else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
        clearErrors(config.key);
      }
    }
  }, [errors]);

  let checkingLocationForRenew = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) checkingLocationForRenew = true;
  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("MYCITY_CODE_LABEL")} * `}</CardLabel>
          <Controller
            name={"city"}
            defaultValue={cities?.length === 1 ? cities[0] : selectedCity}
            control={control}
            rules={{required: t("REQUIRED_FIELD")}}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                disable={true}
                option={cities}
                select={props.onChange}
                optionKey="code"
                onBlur={props.onBlur}
                t={t}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.city ? errors?.city?.message : ""}</CardLabelError>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("TL_LOCALIZATION_LOCALITY")} * `}</CardLabel>
          <Controller
            name="locality"
            defaultValue={checkingLocationForRenew ? formData?.address?.locality : null}
            control={control}
            rules={{required: t("REQUIRED_FIELD")}}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                option={localities}
                select={props.onChange}
                onBlur={props.onBlur}
                optionKey="i18nkey"
                t={t}
                disable={checkingLocationForRenew ? true : false}
                errorStyle={(localFormState.touched.locality && errors?.locality?.message) ? true : false}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.locality ? errors?.locality?.message : ""}</CardLabelError>
      </div>
    );
  }
  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={2}/> : null}
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <CardLabel>{`${t("MYCITY_CODE_LABEL")}*`}</CardLabel>
      <span className={"form-pt-dropdown-only"}>
        <RadioOrSelect
          options={cities.sort((a, b) => a.name.localeCompare(b.name))}
          selectedOption={selectedCity}
          optionKey="i18nKey"
          onSelect={selectCity}
          t={t}
          isDependent={true}
          labelKey=""
          disabled={isEdit}
        />
      </span>
      {selectedCity && localities && <CardLabel>{`${t("TL_LOCALIZATION_LOCALITY")} `}</CardLabel>}
      {selectedCity && localities && (
        <span className={"form-pt-dropdown-only"}>
          <RadioOrSelect
            dropdownStyle={{ paddingBottom: "20px" }}
            isMandatory={config.isMandatory}
            options={localities.sort((a, b) => a.name.localeCompare(b.name))}
            selectedOption={selectedLocality}
            optionKey="i18nkey"
            onSelect={selectLocality}
            t={t}
            optionCardStyles={{maxHeight:"210px",overflow:"scroll"}}
            //isDependent={true}
            labelKey=""
            disabled={isEdit}
          />
        </span>
      )}
    </FormStep>
    </React.Fragment>
  );
};

export default TLSelectAddress;
