import { Dropdown, FormComposer, InfoBannerIcon, Loader, Localities, RadioButtons, Toast } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory ,Link } from "react-router-dom";

const description = {
  description: "PT_SEARCH_OR_DESC",
  descriptionStyles: {
    fontWeight: "300  ",
    color: "#505A5F",
    marginTop: "0px",
    textAlign: "center",
    marginBottom: "20px",
    maxWidth: "540px",
  },
};

const SearchProperty = ({ config: propsConfig, onSelect }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { action = 0 } = Digit.Hooks.useQueryParams();
  const [searchData, setSearchData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const allCities = Digit.Hooks.pt.useTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));
  const [cityCode, setCityCode] = useState();
  const [formValue, setFormValue] = useState();
  const [errorShown, seterrorShown] = useState(false);
  const { data: propertyData, isLoading: propertyDataLoading, error, isSuccess, billData } = Digit.Hooks.pt.usePropertySearchWithDue({
    tenantId: searchData?.city,
    filters: searchData?.filters,
    auth: true /*  to enable open search set false  */,
    configs: { enabled: Object.keys(searchData).length > 0, retry: false, retryOnMount: false, staleTime: Infinity },
  });

  const isMobile = window.Digit.Utils.browser.isMobile();

  useEffect(() => {
    if ( !(searchData?.filters?.mobileNumber && Object.keys(searchData?.filters)?.length == 1) && 
      propertyData?.Properties.length > 0 &&
      ptSearchConfig.maxResultValidation &&
      propertyData?.Properties.length > ptSearchConfig.maxPropertyResult &&
      !errorShown
    ) {
      setShowToast({ error: true, warning: true, label: "ERR_PLEASE_REFINED_UR_SEARCH" });
    }
  }, [propertyData]);

  useEffect(() => {
    showToast && showToast?.label !== "ERR_PLEASE_REFINED_UR_SEARCH" && setShowToast(null);
  }, [action, propertyDataLoading]);

  useLayoutEffect(() => {
    //Why do we need this? !!!!!
    const getActionBar = () => {
      let el = document.querySelector("div.action-bar-wrap");
      if (el) {
        el.style.position = "static";
        el.style.padding = "8px 0";
        el.style.boxShadow = "none";
        el.style.marginBottom = "16px";
        el.style.textAlign = "left";
      } else {
        setTimeout(() => {
          getActionBar();
        }, 100);
      }
    };
    getActionBar();
  }, []);

  const { data: ptSearchConfig, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "DIGIT-UI", "HelpText", {
    select: (data) => {
      return data?.["DIGIT-UI"]?.["HelpText"]?.[0]?.PT;
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
                  props?.setValue("city", {});
                  props?.setValue("locality", {});
                  props?.setValue("mobileNumber", "");
                  props?.setValue("propertyIds", "");
                  props?.setValue("doorNo", "");
                  props?.setValue("oldPropertyId", "");
                  props?.setValue("name", "");
                  history.replace(`${history.location.pathname}?action=${action == 0 ? 1 : 0}`);
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
                  Digit.LocalizationService.getLocale({
                    modules: [`rainmaker-${props?.value?.code}`],
                    locale: Digit.StoreData.getCurrentLanguage(),
                    tenantId: `${props?.value?.code}`,
                  });
                  if (d.code !== cityCode) props.setValue("locality", null);
                  props.onChange(d);
                }}
              />
            ),
          },
        },
        {
          label: t("PT_PROVIDE_ONE_MORE_PARAM"),
          isInsideBox: true,
          placementinbox: 0,
          isSectionText : true,
        },
        {
          label: mobileNumber.label,
          type: mobileNumber.type,
          populators: {
            defaultValue: "",
            name: mobileNumber.name,
            validation: mobileNumber?.validation,
          },
          ...description,
          isMandatory: false,
          isInsideBox: true,
          placementinbox: 1,
        },
        {
          label: property.label,
          labelChildren: (
            <div className="tooltip" style={{ paddingLeft: "10px", marginBottom: "-3px" }}>
              {"  "}
              <InfoBannerIcon fill="#0b0c0c" />
              <span className="tooltiptext" style={{ width: "150px", left: "230%", fontSize:"14px" }}>
                {t(property.description) + " " + ptSearchConfig?.propertyIdFormat}
              </span>
            </div>
          ),
          type: property.type,
          populators: {
            name: property.name,
            defaultValue: "",
            validation: property?.validation,
          },
          ...description,
          isMandatory: false,
          isInsideBox: true,
          placementinbox: 1,
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
          isInsideBox: true,
          placementinbox: 2,
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
                  props?.setValue("city", {});
                  props?.setValue("locality", {});
                  props?.setValue("mobileNumber", "");
                  props?.setValue("propertyIds", "");
                  props?.setValue("doorNo", "");
                  props?.setValue("oldPropertyId", "");
                  props?.setValue("name", "");
                  history.replace(`${history.location.pathname}?action=${action == 0 ? 1 : 0}`);
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
                  Digit.LocalizationService.getLocale({
                    modules: [`rainmaker-${props?.value?.code}`],
                    locale: Digit.StoreData.getCurrentLanguage(),
                    tenantId: `${props?.value?.code}`,
                  });
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
            defaultValue: "",
            rules: { required: true },
            customProps: {},
            component: (props, customProps) => (
              <Localities
                selectLocality={(d) => {
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
          label: t("PT_PROVIDE_ONE_MORE_PARAM"),
          isInsideBox: true,
          placementinbox: 0,
          isSectionText : true,
        },
        {
          label: doorNo.label,
          type: doorNo.type,
          populators: {
            defaultValue: "",
            name: doorNo.name,
            validation: doorNo?.validation,
          },
          isMandatory: false,
          isInsideBox: true,
          placementinbox: 1,
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
          isInsideBox: true,
          placementinbox: 2,
        },
      ],
    },
  ];

  const onPropertySearch = async (data) => {
    if (
      ptSearchConfig.maxResultValidation &&
      propertyData?.Properties.length > 0 &&
      propertyData?.Properties.length > ptSearchConfig.maxPropertyResult &&
      errorShown
    ) {
      seterrorShown(true);
      return;
    }
    if (!data?.city?.code) {
      setShowToast({ warning: true, label: "ERR_PT_FILL_VALID_FIELDS"});
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

    if (showToast?.label !== "ERR_PLEASE_REFINED_UR_SEARCH") setShowToast(null);
    if (data?.doorNo && data?.doorNo !== "" && data?.propertyIds !== "") {
      data["propertyIds"] = "";
    }

    let tempObject = Object.keys(data)
      .filter((k) => data[k])
      .reduce((acc, key) => ({ ...acc, [key]: typeof data[key] === "object" ? data[key].code : data[key] }), {});
    let city = tempObject.city;
    
    delete tempObject.addParam;
    delete tempObject.addParam1;
    delete tempObject.city;
    setSearchData({ city: city, filters: tempObject });
    return;
  };
  
  const onFormValueChange = (setValue, data, formState) => {
    if (data?.doorNo && data?.doorNo !== "" && data?.propertyIds !== "") {
      data["propertyIds"] = "";
    }
    const mobileNumberLength = data?.[mobileNumber.name]?.length;
    const oldPropId = data?.[oldProperty.name];
    const propId = data?.[property.name];
    const city = data?.city;
    const locality = data?.locality;

    if (city?.code !== cityCode) {
      setCityCode(city?.code);
    }

    if (!_.isEqual(data, formValue)) {
      setFormValue(data);
    }

    if (!locality || !city) {
      return;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  let validation = ptSearchConfig.maxResultValidation && !(searchData?.filters?.mobileNumber && Object.keys(searchData?.filters)?.length == 1)   ? propertyData?.Properties.length<ptSearchConfig.maxPropertyResult && (showToast == null || (showToast !== null && !showToast?.error)) : true;

  if (propertyData && !propertyDataLoading && !error && validation ) {
    let qs = {};
    qs = { ...searchData.filters, city: searchData.city };

    if ( !(searchData?.filters?.mobileNumber && Object.keys(searchData?.filters)?.length == 1) && 
      ptSearchConfig?.ptSearchCount &&
      searchData?.filters?.locality &&
      propertyDataLoading &&
      propertyDataLoading?.Properties?.length &&
      propertyDataLoading.Properties.length > ptSearchConfig.ptSearchCount
    ) {
      !showToast && setShowToast({ error: true, label: "PT_MODIFY_SEARCH_CRITERIA" });
    } else if (propsConfig.action === "MUTATION") {
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
  if (action == 1) {
    config[0].body = [...config[0].body1];
  }

  return (
    <div style={{ marginTop: "16px", marginBottom: "16px" ,backgroundColor:"white", maxWidth:"960px"}}>
      <FormComposer
        onSubmit={onPropertySearch}
        noBoxShadow
        inline
        config={config}
        label={propsConfig.texts.submitButtonLabel}
        heading={t(propsConfig.texts.header)}
        text={t(propsConfig.texts.text)}
        headingStyle={{ fontSize: "32px", marginBottom: "16px", fontFamily: "Roboto Condensed,sans-serif" }}
        onFormValueChange={onFormValueChange}
        cardStyle={{marginBottom:"0"}}
      ></FormComposer>
      <span className="link" style={{display:"flex", justifyContent: isMobile ? "center" : "left", paddingBottom:"16px", paddingLeft: "24px", marginTop: "-24px"}}>
        <Link to={"/digit-ui/citizen/pt/property/new-application"}>{t("CPT_REG_NEW_PROPERTY")}</Link>
      </span>
      {showToast && (
        <Toast
          error={showToast.error}
          isDleteBtn={true}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
            seterrorShown(false);
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
