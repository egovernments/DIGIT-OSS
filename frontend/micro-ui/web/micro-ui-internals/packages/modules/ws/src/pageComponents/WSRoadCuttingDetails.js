import { CardLabel, Dropdown, LabelFieldPair, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getPattern } from "../utils";

const WSRoadCuttingDetails = ({ t, config, onSelect, formData,formState,setError,clearErrors}) => {
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState(formData[config?.key] || {
    roadType: { code: "", value: "", i18nKey: "" },
    roadArea: "",
  });
  const [isErrors, setIsErrors] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState('');
  const [roadTypeOptions, setRoadTypeOptions] = React.useState([]);

  const {
    isWSServicesCalculationLoading,
    data: wsServicesCalculationData
  } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["RoadType"]);

  const {
    control,
    formState : localFormState,
    watch,
    trigger,
  } = useForm();

  const formValues = watch();

  React.useEffect(() => {
    trigger();
  }, [])

  React.useEffect(() => {
    const roadTypeOptions = wsServicesCalculationData?.["ws-services-calculation"]?.RoadType
      ?.map((type) => ({ ...type, i18nKey: type.code })) || [];
    setRoadTypeOptions(roadTypeOptions);
  }, [wsServicesCalculationData]);

  React.useEffect(() => {
    const part = {};

    Object.keys(formValues).forEach((key) => part[key] = formValues[key]);

    if (!_.isEqual(part, roadCuttingDetails)) {
      let isErrorsFound = true;

      Object.keys(formValues).map(data => {
        if (!formValues[data] && isErrorsFound) {
          isErrorsFound = false
          setIsErrors(false);
        }
      });

      if (isErrorsFound) setIsErrors(true);
      setRoadCuttingDetails(part);
      trigger();
    }
  }, [formValues]);

  React.useEffect(() => {
    let isClear = true;

    Object.keys(roadCuttingDetails).map(key => {
      if (!roadCuttingDetails[key] && isClear) isClear = false
    })

    if (isClear && Object.keys(roadCuttingDetails).length) {
      clearErrors("RoadCuttingDetails");
    }

    if (roadCuttingDetails.roadType) clearErrors(config.key, { type: "roadType" })
    if (roadCuttingDetails.roadArea) clearErrors(config.key, { type: "roadArea" })

    trigger();
  }, [roadCuttingDetails]);

  React.useEffect(() => {
    if (Object.keys(localFormState?.errors).length && !_.isEqual(formState?.errors[config.key]?.type || {}, localFormState.errors)) {
      setError(config.key, { type: localFormState.errors });
    }
    else if (!Object.keys(localFormState?.errors).length && formState?.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [localFormState?.errors]);

  React.useEffect(() => {
    onSelect(config.key, roadCuttingDetails);
  }, [roadCuttingDetails]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="roadType"
            defaultValue={roadCuttingDetails.roadType}
            // rules={{
            //   validate: (e) => e && e.length ? true : t(""),
            //   required: t("REQUIRED_FIELD"),
            // }}
            render={(props) => (
              <Dropdown
                key={config.key}
                t={t}
                option={roadTypeOptions}
                selected={props.value}
                optionKey="i18nKey"
                select={(value) => {
                  props.onChange(value);
                  setFocusedField("roadType");
                }}
              ></Dropdown>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      {localFormState.touched?.roadType && (
        <CardLabelError style={errorStyle}> {t(localFormState.errors?.roadType?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="roadArea"
            defaultValue={roadCuttingDetails.roadArea}
            type="number"
            rules={{
              validate: (e) => e && getPattern("DecimalNumber").test(e) ? true : t(""),
              required: t("REQUIRED_FIELD"),
            }}
            render={(props) => (
              <TextInput
                key={config.key}
                value={props.value}
                type="number"
                autoFocus={focusedField === "roadArea"}
                onChange={(ev) => {
                  props.onChange(ev.target.value);
                  setFocusedField("roadArea");
                }}
              ></TextInput>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      {localFormState.touched?.roadArea && (
        <CardLabelError style={errorStyle}> {t(localFormState.errors?.roadArea?.message)} </CardLabelError>
      )}

      <Link to={`/digit-ui/employee/commonpt/search?redirectToUrl=${""}`}>
        <LinkButton label={t("WS_ADD_ROAD_TYPE")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
    </React.Fragment>
  );
}

export default WSRoadCuttingDetails;