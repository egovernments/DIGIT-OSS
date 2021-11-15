import React, { useState, useEffect, useLayoutEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Dropdown, Localities, RadioButtons, Toast } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const SearchProperty = ({ config: propsConfig, onSelect }) => {
  const { t } = useTranslation();

  const history = useHistory();
  const { action = 0 } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchData, setSearchData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const allCities = Digit.Hooks.pt.useTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));

  const [cityCode, setCityCode] = useState();
  const [formValue, setFormValue] = useState();
  const { data: da, isLoading: isl, error, isSuccess, billData } = Digit.Hooks.pt.usePropertySearchWithDue({
    tenantId: searchData?.city,
    filters: searchData?.filters,
    configs: { enabled: Object.keys(searchData).length > 0, retry: false, retryOnMount: false, staleTime: Infinity },
    // configs: { enabled: Object.keys(data).length > 0 ? true : false, retry: false, retryOnMount: false, staleTime: Infinity },
  });

  useEffect(() => {
    setShowToast(null);
  }, [action]);

  useLayoutEffect(() => {
    //Why do we need this? !!!!!
    const getActionBar = () => {
      let el = document.querySelector("div.action-bar-wrap");
      if (el) {
        el.style.position = "static";
        el.style.padding = "8px 0";
        el.style.boxShadow = "none";
        el.style.marginBottom = "16px";
      } else {
        setTimeout(() => {
          getActionBar();
        }, 100);
      }
    };
    getActionBar();
  }, []);

  // moduleCode, type, config = {}, payload = []
  const { data: propertyIdFormat, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "DIGIT-UI", "HelpText", {
    select: (data) => {
      return data?.["DIGIT-UI"]?.["HelpText"]?.[0]?.PT?.propertyIdFormat;
    },
  });

  const [mobileNumber, property, oldProperty, name, doorNo] = propsConfig.inputs;

  const config = [
    {
      body: [
        {
          type: "custom",
          populators: {
            name: "addParam",
            defaultValue: { code: 0, name: "PT_KNOW_PT_ID" },
            customProps: {
              t,
              isMandatory: true,
              optionsKey: "name",
              options: [
                { code: 0, name: "PT_KNOW_PT_ID" },
                { code: 1, name: "PT_KNOW_PT_DETAIL" },
              ],
            },
            component: (props, customProps) => (
              <RadioButtons
                {...customProps}
                selectedOption={props.value}
                onSelect={(d) => {
                  console.log(d, history);
                  props?.setValue("city", {});
                  props?.setValue("locality", {});
                  props?.setValue("mobileNumber", "");
                  props?.setValue("propertyIds", "");
                  props?.setValue("doorNo", "");
                  props?.setValue("oldPropertyId", "");
                  props?.setValue("name", "");
                  history.replace(`${history.location.pathname}?action=${action == 0 ? 1 : 0}`);
                  //  ?   if (d.code !== cityCode) props.setValue("locality", null);
                  // props.onChange(d);
                }}
              />
            ),
          },
        },
        {
          label: "PT_SELECT_CITY",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "city",
            defaultValue: null,
            rules: { required: true },
            customProps: { t, isMandatory: true, option: [...allCities], optionKey: "i18nKey" },
            component: (props, customProps) => (
              <Dropdown
                {...customProps}
                selected={props.value}
                select={(d) => {
                  if (d.code !== cityCode) props.setValue("locality", null);
                  props.onChange(d);
                }}
              />
            ),
          },
        },
        {
          label: mobileNumber.label,
          type: mobileNumber.type,
          populators: {
            defaultValue: "",
            name: mobileNumber.name,
            validation: mobileNumber?.validation,
          },
          isMandatory: false,
        },
        {
          label: property.label,
          description: t(property.description) + "\n" + propertyIdFormat,
          descriptionStyles: { whiteSpace: "pre", fontSize: "14px", fontWeight: "400", fontFamily: "Roboto" },
          type: property.type,
          populators: {
            name: property.name,
            defaultValue: "",
            validation: property?.validation,
          },
          isMandatory: false,
        },
        {
          label: oldProperty.label,
          type: oldProperty.type,
          populators: {
            name: oldProperty.name,
            defaultValue: "",
            validation: oldProperty?.validation,
          },
          isMandatory: false,
        },
      ],
      body1: [
        {
          type: "custom",
          populators: {
            name: "addParam1",
            defaultValue: { code: 1, name: "PT_KNOW_PT_DETAIL" },
            customProps: {
              t,
              isMandatory: true,
              optionsKey: "name",
              options: [
                { code: 0, name: "PT_KNOW_PT_ID" },
                { code: 1, name: "PT_KNOW_PT_DETAIL" },
              ],
            },
            component: (props, customProps) => (
              <RadioButtons
                {...customProps}
                selectedOption={props.value}
                onSelect={(d) => {
                  console.log(d, history);
                  console.log(props, customProps);
                  props?.setValue("city", {});
                  props?.setValue("locality", {});
                  props?.setValue("mobileNumber", "");
                  props?.setValue("propertyIds", "");
                  props?.setValue("doorNo", "");
                  props?.setValue("oldPropertyId", "");
                  props?.setValue("name", "");
                  history.replace(`${history.location.pathname}?action=${action == 0 ? 1 : 0}`);
                  //  ?   if (d.code !== cityCode) props.setValue("locality", null);
                  // props.onChange(d);
                }}
              />
            ),
          },
        },
        {
          label: "PT_SELECT_CITY",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "city",
            defaultValue: null,
            rules: { required: true },
            customProps: { t, isMandatory: true, option: [...allCities], optionKey: "i18nKey" },
            component: (props, customProps) => (
              <Dropdown
                {...customProps}
                selected={props.value}
                select={(d) => {
                  if (d.code !== cityCode) props.setValue("locality", null);
                  props.onChange(d);
                }}
              />
            ),
          },
        },
        {
          label: "PT_SELECT_LOCALITY",
          type: "custom",
          isMandatory: true,
          populators: {
            name: "locality",
            // defaultValue: formValue?.locality,
            defaultValue: "",
            rules: { required: true },
            customProps: {},
            component: (props, customProps) => (
              <Localities
                selectLocality={(d) => {
                  // console.log(d, "locality changed");
                  props.onChange(d);
                }}
                tenantId={cityCode}
                boundaryType="revenue"
                keepNull={false}
                optionCardStyles={{ height: "600px", overflow: "auto", zIndex: "10" }}
                selected={formValue?.locality}
                disable={!cityCode}
                disableLoader={true}
              />
            ),
          },
        },
        {
          label: doorNo.label,
          type: doorNo.type,
          populators: {
            defaultValue: "",
            name: doorNo.name,
            validation: doorNo?.validation,
            // validation: { pattern: /^[6-9]{1}[0-9]{9}$ / },
          },
          isMandatory: false,
        },
        {
          label: name.label,
          type: name.type,
          populators: {
            defaultValue: "",
            name: name.name,
            validation: name?.validation,
          },
          isMandatory: false,
        },
      ],
    },
  ];

  const onPropertySearch = async (data) => {
    // setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
    // console.log(data,"sasa");
    // setCanSubmit(true);
    if (!data?.city?.code) {
      setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
      return;
    }
    if (action == 0) {
      if (!(data?.mobileNumber || data?.propertyIds || data?.oldPropertyId)) {
        setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
        return;
      }
      if (data?.mobileNumber && !data.mobileNumber?.match(mobileNumber?.validation?.pattern?.value)) {
        setShowToast({ warning: true, label: mobileNumber?.validation?.pattern?.message });
        return;
      }
      if (data?.propertyIds && !data.propertyIds?.match(property?.validation?.pattern?.value)) {
        setShowToast({ warning: true, label: property?.validation?.pattern?.message });
        return;
      }
      if (data?.oldPropertyId && !data.oldPropertyId?.match(oldProperty?.validation?.pattern?.value)) {
        setShowToast({ warning: true, label: oldProperty?.validation?.pattern?.message });
        return;
      }
    } else {
      if (!data?.locality?.code) {
        setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
        return;
      }
      if (!(data?.doorNo || data?.name)) {
        setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS" });
        return;
      }

      if (data?.name && !data.name?.match(name?.validation?.pattern?.value)) {
        setShowToast({ warning: true, label: name?.validation?.pattern?.message });
        return;
      }
      if (data?.doorNo && !data.doorNo?.match(doorNo?.validation?.pattern?.value)) {
        setShowToast({ warning: true, label: doorNo?.validation?.pattern?.message });
        return;
      }
    }

    console.log("form1 valid", data);
    setShowToast(null);

    let tempObject = Object.keys(data)
      .filter((k) => data[k])
      .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {});
    let city = tempObject.city;
    delete tempObject.addParam;
    delete tempObject.addParam1;
    delete tempObject.city;
    setSearchData({ city: city, filters: tempObject });

    return;
    // return;
    // if (!data.mobileNumber && !data.propertyId && !data.oldPropertyId) {
    //   alert(t("PT_ERROR_NEED_ONE_PARAM"));
    // } else if (propsConfig.action === "MUTATION") {
    //   const qs = {};
    //   const { propertyId, oldPropertyId, mobileNumber } = data;
    //   if (propertyId) qs.propertyIds = propertyId;
    //   if (oldPropertyId) qs.oldPropertyIds = oldPropertyId;
    //   if (mobileNumber) qs.mobileNumber = mobileNumber;
    //   onSelect(propsConfig.key, data, null, null, null, {
    //     queryParams: { ...qs, locality: data.locality?.code, city: cityCode },
    //   });
    // } else {
    //   history.push(
    //     `/digit-ui/citizen/pt/property/search-results?mobileNumber=${data?.mobileNumber ? data?.mobileNumber : ``}&propertyIds=${
    //       data?.propertyId ? data.propertyId : ``
    //     }&oldPropertyIds=${data?.oldPropertyId ? data?.oldPropertyId : ``}&locality=${formValue.locality?.code}&city=${cityCode}`
    //   );
    // }
  };
  const onFormValueChange = (setValue, data, formState) => {
    const mobileNumberLength = data?.[mobileNumber.name]?.length;
    const oldPropId = data?.[oldProperty.name];
    const propId = data?.[property.name];
    const city = data?.city;
    const locality = data?.locality;
    if (city?.code !== cityCode) {
      setCityCode(city?.code);
    }

    if (!_.isEqual(data, formValue)) {
      // if (data?.city.code !== formValue?.city?.code) setValue("locality", null);
      setFormValue(data);
    }

    if (!locality || !city) {
      // setCanSubmit(false);
      return;
    }

    // if (mobileNumberLength > 0 && mobileNumberLength < 10) setCanSubmit(false);
    // else if (!propId && !oldPropId && !mobileNumberLength) setCanSubmit(false);
    // else setCanSubmit(true);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (da && !isl && !error) {
    let qs = {};
    qs = { ...searchData.filters, city: searchData.city };

    if (propsConfig.action === "MUTATION") {
      onSelect(propsConfig.key, qs, null, null, null, {
        queryParams: { ...qs },
      });
    } else {
      history.push(
        `/digit-ui/citizen/pt/property/search-results?${Object.keys(qs)
          .map((key) => `${key}=${qs[key]}`)
          .join("&")}`
      );
    }
  }
  if (error) {
    !showToast && setShowToast({ error: true, label: error?.response?.data?.Errors?.[0]?.code || error });
  }
  console.log(da, isl);
  if (action == 1) {
    console.log(config);
    config[0].body = [...config[0].body1];
  }

  return (
    <div style={{ marginTop: "16px", marginBottom: "16px" }}>
      <FormComposer
        onSubmit={onPropertySearch}
        noBoxShadow
        inline
        config={config}
        label={propsConfig.texts.submitButtonLabel}
        heading={t(propsConfig.texts.header)}
        text={t(propsConfig.texts.text)}
        headingStyle={{ fontSize: "32px", marginBottom: "16px", fontFamily: "Roboto Condensed,sans-serif" }}
        // headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
        // isDisabled={!canSubmit}
        onFormValueChange={onFormValueChange}
      ></FormComposer>
      {showToast && (
        <Toast
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  );
};

SearchProperty.propTypes = {
  loginParams: PropTypes.any,
};

SearchProperty.defaultProps = {
  loginParams: null,
};

export default SearchProperty;
