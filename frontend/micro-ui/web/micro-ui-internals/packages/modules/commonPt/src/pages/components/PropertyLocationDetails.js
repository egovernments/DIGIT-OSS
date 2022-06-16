import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, Localities, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const PropertyLocationDetails = ({ t, config, onSelect, userType, formData, formState, ownerIndex, setError, clearErrors }) => {
  let validation = {};
  let allCities = Digit.Hooks.pt.useTenants() ? Digit.Hooks.pt.useTenants() : Digit.Hooks.tl.useTenants();
  // if called from tl module get tenants from tl usetenants
  const userInfo = Digit.UserService.getUser()?.info;
  userType = userInfo?.type == "EMPLOYEE" ? "employee" : "citizen";
  const cityId = userInfo?.tenantId;
  const cityName = 'TENANT_TENANTS_' + userInfo?.tenantId.replace('.', '_').toUpperCase();
  const cityObj = userType === 'employee' ? { code: cityId, name: t(cityName), i18nKey: cityName } : null;

  const [locationDetails, setLocationDetails] = React.useState({
    ...formData?.locationDet,
    cityCode: cityObj,
    locality: formData?.locality,
    houseDoorNo: formData?.houseDoorNo,
    buildingColonyName: formData?.buildingColonyName,
    landmarkName: formData?.landmarkName
  });
  const [isErrors, setIsErrors] = React.useState(false);

  const { control, formState: { errors, touched }, trigger, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, getValues } = useForm();
  const formValue = watch();

  React.useEffect(() => {
    let hasErrors = false;
    const part = {};

    Object.keys(locationDetails).forEach((key) => {
      part[key] = formValue?.[key];
    });

    if (!_.isEqual(part, locationDetails)) {
      Object.keys(locationDetails).forEach((key) => {
        if (locationDetails[key]) {
          hasErrors = false;
          clearLocalErrors(key);
        } else {
          hasErrors = true;
        }
      });
    }

    if (hasErrors) {
      setError(config?.key, { type: errors })
    } else {
      clearErrors(config?.key);
    }

    trigger();
    setIsErrors(hasErrors);
    onSelect(config?.key, locationDetails);
  }, [locationDetails]);

  React.useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <div>
      <LabelFieldPair>
        <CardLabel>{`${t('PT_PROP_CITY')}*`}</CardLabel>
        <Controller
          name=""
          defaultValue={ locationDetails?.cityCode }
          control={ control }
          rules={{
            required: t("REQUIRED_FIELD")
          }}
          render={({value, onBlur, onChange}) => (
            <Dropdown
              className="form-field"
              selected={value}
              disable={userType === "employee"}
              option={allCities.sort((a,b) => (a.name > b.name)? 1 : (b.name>a.name)? -1 : 0)}
              select={(value)=>{
                onChange(value);
                setLocationDetails({...locationDetails, cityCode: value})
              }}
              optionKey="code"
              onBlur={onBlur}
              t={t}
            />
          )} />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.cityCode ? errors?.cityCode?.message : ""}</CardLabelError>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_PROP_LOCALITY")}*`}</CardLabel>
        <div className="form-field">
          <Controller
            name="locality"
            defaultValue={ locationDetails?.locality}
            control={ control }
            rules={{required: t("REQUIRED_FIELD")}}
            render={({value, onBlur, onChange}) => (
              <Localities
                selectLocality={(value)=>{
                  onChange(value);
                  setLocationDetails({...locationDetails, locality: value});
                }}
                tenantId={locationDetails?.cityCode?.code}
                boundaryType="revenue"
                keepNull={false}
                optionCardStyles={{ height: "600px", overflow: "auto", zIndex: "10" }}
                selected={value}
                disable={!locationDetails?.cityCode?.code}
                disableLoader={true}
                onBlur={onBlur}
              />
            )} />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.locality ? errors?.locality?.message : ""}</CardLabelError>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_HOUSE_DOOR_NO")}*`}</CardLabel>
        <div className="form-field">
          <Controller
            name="houseDoorNo"
            defaultValue={locationDetails?.houseDoorNo}
            control={ control}
            rules={{
              required: t("REQUIRED_FIELD"),
              validate: (value)=> /^([a-zA-Z0-9 !@#$%^&*()_+\-={};':\\\\|,.<>/?]){1,64}$/i.test(value) ? true: t("PT_HOUSE_DOOR_NO_ERROR_MESSAGE"),
            }}
            render={({value, onBlur, onChange}) => (
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="houseDoorNo"
                value={value}
                onChange={(ev)=>{
                  onChange(ev.target.value);
                  setLocationDetails({...locationDetails, houseDoorNo: ev.target.value})
                }}
                onBlur={onBlur}
                {...(validation = { pattern: "^([a-zA-Z0-9 !@#$%^&*()_+\-={};':\\\\|,.<>/?]){1,64}$", title: t("PT_HOUSE_DOOR_NO_ERROR_MESSAGE") })}
              />
            )} />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.houseDoorNo ? errors?.houseDoorNo?.message : ""}</CardLabelError>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_PROPERTY_ADDRESS_STREET_NAME")}*`}</CardLabel>
        <div className="form-field">
          <Controller
            name="buildingColonyName"
            defaultValue={ locationDetails?.buildingColonyName}
            control={control }
            rules={{
              required: t("REQUIRED_FIELD"),
            }}
            render={({value, onChange, onBlur}) => (
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="buildingColonyName"
                value={value}
                onChange={(ev)=>{
                  onChange(ev.target.value);
                  setLocationDetails({...locationDetails, buildingColonyName: ev.target.value})
                }}
                onBlur={onBlur}
              />
            )} />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.buildingColonyName ? errors?.buildingColonyName?.message : ""}</CardLabelError>

      <LabelFieldPair>
        <CardLabel>{`${t("PT_LANDMARK_NAME")}`}</CardLabel>
        <div className="form-field">
          <Controller
            name="landmarkName"
            defaultValue={locationDetails?.landmarkName}
            control={ control}
            rules={{
            }}
            render={({value, onChange, onBlur}) => (
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="landmarkName"
                value={value}
                onChange={(ev)=>{
                  onChange(ev.target.value);
                  setLocationDetails({...locationDetails, landmarkName: ev.target.value})
                }}
                onBlur={onBlur}
              />
            )} />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{touched?.landmarkName ? errors?.landmarkName?.message : ""}</CardLabelError>
    </div>
  );
};

export default PropertyLocationDetails;
