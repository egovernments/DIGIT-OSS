import React, { useState, useEffect, useLayoutEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Dropdown, Localities } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const SearchProperty = ({ config: propsConfig, onSelect }) => {
  const { t } = useTranslation();

  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setCanSubmit] = useState(false);

  const allCities = Digit.Hooks.pt.useTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));

  const [cityCode, setCityCode] = useState();
  const [formValue, setFormValue] = useState();

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
  const { data: propertyIdFormat, isLoading } = Digit.Hooks.pt.useMDMS(tenantId.split(".")[0], "DIGIT-UI", "HelpText", {
    select: (data) => {
      return data?.["DIGIT-UI"]?.["HelpText"]?.[0]?.PT?.propertyIdFormat;
    },
  });

  const onPropertySearch = async (data) => {
    if (!data.mobileNumber && !data.propertyId && !data.oldPropertyId) {
      alert(t("PT_ERROR_NEED_ONE_PARAM"));
    } else if (propsConfig.action === "MUTATION") {
      const qs = {};
      const { propertyId, oldPropertyId, mobileNumber } = data;
      if (propertyId) qs.propertyIds = propertyId;
      if (oldPropertyId) qs.oldPropertyIds = oldPropertyId;
      if (mobileNumber) qs.mobileNumber = mobileNumber;
      onSelect(propsConfig.key, data, null, null, null, {
        queryParams: { ...qs, locality: data.locality?.code, city: cityCode },
      });
    } else {
      history.push(
        `/digit-ui/citizen/pt/property/search-results?mobileNumber=${data?.mobileNumber ? data?.mobileNumber : ``}&propertyIds=${
          data?.propertyId ? data.propertyId : ``
        }&oldPropertyIds=${data?.oldPropertyId ? data?.oldPropertyId : ``}&locality=${formValue.locality?.code}&city=${cityCode}`
      );
    }
  };

  const [mobileNumber, property, oldProperty] = propsConfig.inputs;

  const config = [
    {
      body: [
        {
          label: "PT_SELECT_CITY",
          isMandatory: true,
          type: "custom",
          populators: {
            name: "city",
            defaultValue: null,
            rules: { required: true },
            customProps: { t, isMendatory: true, option: [...allCities], optionKey: "i18nKey" },
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
            defaultValue: formValue?.locality,
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
          label: mobileNumber.label,
          type: mobileNumber.type,
          populators: {
            name: mobileNumber.name,
            validation: { pattern: /^[6-9]{1}[0-9]{9}$ / },
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
          },
          isMandatory: false,
        },
        {
          label: oldProperty.label,
          type: oldProperty.type,
          populators: {
            name: oldProperty.name,
          },
          isMandatory: false,
        },
      ],
    },
  ];

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
      setCanSubmit(false);
      return;
    }

    if (mobileNumberLength > 0 && mobileNumberLength < 10) setCanSubmit(false);
    else if (!propId && !oldPropId && !mobileNumberLength) setCanSubmit(false);
    else setCanSubmit(true);
  };

  if (isLoading) {
    return <Loader />;
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
        isDisabled={!canSubmit}
        onFormValueChange={onFormValueChange}
      ></FormComposer>
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
