import React, { useEffect, useState } from "react";
import { FormStep, TextInput, LabelFieldPair, CardLabel, WrapUnMaskComponent } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import Timeline from "../components/TLTimelineInFSM";

const SelectStreet = ({ t, config, onSelect, userType, formData, formState, setError, clearErrors }) => {
  const onSkip = () => onSelect();

  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, getValues, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const checkLocation = window.location.href.includes("tl/new-application") || window.location.href.includes("tl/renew-application-details");
  const isRenewal = window.location.href.includes("edit-application") || window.location.href.includes("tl/renew-application-details");

  let inputs;
  if (window.location.href.includes("tl")) {
    inputs = config.inputs;
    config.inputs[0].disable = window.location.href.includes("edit-application");
    config.inputs[1].disable = window.location.href.includes("edit-application");
    inputs[0].validation = { minLength: 0, maxLength: 256 };
    inputs[1].validation = { minLength: 0, maxLength: 256 };
  } else {
    inputs = [
      {
        label: "PT_PROPERTY_ADDRESS_STREET_NAME",
        type: "text",
        name: "street",
        validation: {
          pattern: "[a-zA-Z0-9 ]{1,255}",
          // maxlength: 256,
          title: t("CORE_COMMON_STREET_INVALID"),
        },
      },
      {
        label: "PT_PROPERTY_ADDRESS_HOUSE_NO",
        type: "text",
        name: "doorNo",
        validation: {
          pattern: "[A-Za-z0-9#,/ -]{1,63}",
          // maxlength: 256,
          title: t("CORE_COMMON_DOOR_INVALID"),
        },
      },
    ];
  }

  const convertValidationToRules = ({ validation, name, messages }) => {
    if (validation) {
      let { pattern: valPattern, maxlength, minlength, required: valReq } = validation || {};
      let pattern = (value) => {
        if (valPattern) {
          if (valPattern instanceof RegExp) return valPattern.test(value) ? true : messages?.pattern || `${name.toUpperCase()}_PATTERN`;
          else if (typeof valPattern === "string")
            return new RegExp(valPattern)?.test(value) ? true : messages?.pattern || `${name.toUpperCase()}_PATTERN`;
        }
        return true;
      };
      let maxLength = (value) => (maxlength ? (value?.length <= maxlength ? true : messages?.maxlength || `${name.toUpperCase()}_MAXLENGTH`) : true);
      let minLength = (value) => (minlength ? (value?.length >= minlength ? true : messages?.minlength || `${name.toUpperCase()}_MINLENGTH`) : true);
      let required = (value) => (valReq ? (!!value ? true : messages?.required || `${name.toUpperCase()}_REQUIRED`) : true);

      return { pattern, required, minLength, maxLength };
    }
    return {};
  };

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (userType === "employee") {
      if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) setError(config.key, { type: errors });
      else if (!Object.keys(errors).length && formState.errors[config.key]) clearErrors(config.key);
    }
  }, [errors]);

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = formData[config.key]?.[key]));

    if (!_.isEqual(formValue, part)) {
      onSelect(config.key, { ...formData[config.key], ...formValue });
      trigger();
    }
  }, [formValue]);

  useEffect(() => {
    if(formData?.cpt?.details && window.location.href.includes("tl"))
    {
      inputs?.map((input) => {
        if(getValues(input.name) !== formData?.cpt?.details?.address?.[input.name])
        {
          setValue(input.name,(formData?.cpt?.details?.address?.[input.name] === null || formData?.cpt?.details?.address?.[input.name] === "" ? (formData?.address?.[input.name] ? formData?.address?.[input.name] : "") : formData?.cpt?.details?.address?.[input.name]))
        }
      })
    }
    
  },[formData?.cpt?.details])

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <div className="field">
            <Controller
              control={control}
              defaultValue={formData?.cpt?.details?.address?.[input.name] || formData?.address?.[input.name]}
              name={input.name}
              rules={{ validate: convertValidationToRules(input) }}
              render={(_props) => (
                <div style={{display:"flex",alignItems:"baseline",marginRight: "unset"}}>
                <TextInput
                  id={input.name}
                  key={input.name}
                  value={_props.value}
                  onChange={(e) => {
                    setFocusIndex({ index });
                    _props.onChange(e.target.value);
                  }}
                  onBlur={_props.onBlur}
                  // disable={isRenewal}
                  disable={formData?.cpt?.details?.address?.[input.name] ? true : false}
                  autoFocus={focusIndex?.index == index}
                  {...input?.validation}
                />
                <div style={{marginRight:"-50px",marginLeft:"10px"}}>
                    <WrapUnMaskComponent
                      unmaskField={(e) => {
                        _props.onChange(e);
                      }}
                      iseyevisible={(_props.value ? _props.value?.includes("*") :  formData?.cpt?.details?.address?.[input.name]?.includes("*")) ? true : false}
                      privacy={{
                          uuid: formData?.cpt?.details?.owners?.[0]?.uuid,
                          fieldName: [input.name],
                          model: "Property",
                          loadData: {
                              serviceName: "/property-services/property/_search",
                              requestBody: {},
                              requestParam: {
                                  tenantId: formData?.cpt?.details?.tenantId,
                                  propertyIds: formData?.cpt?.details?.propertyId,
                                },
                              jsonPath: `Properties[0].address.${input.name}`,
                              isArray: false,
                                    },
                                }}>
                      </WrapUnMaskComponent>
                      </div>
                    </div>
              )}
            />
          </div>
        </LabelFieldPair>
      );
    });
  }
  return (
    <React.Fragment>
      {window.location.href.includes("/tl") ? <Timeline currentStep={2} /> : <Timeline currentStep={1} flow="APPLY" />}
      <FormStep
        config={{ ...config, inputs }}
        _defaultValues={{ street: formData?.address.street, doorNo: formData?.address.doorNo }}
        onSelect={(data) => onSelect(config.key, data)}
        onSkip={onSkip}
        t={t}
      />
    </React.Fragment>
  );
};

export default SelectStreet;