import { CardLabel, Dropdown, LabelFieldPair, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const WSRoadCuttingDetails = ({ t, config, onSelect, formData }) => {
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState(formData[config?.key]||{
    type: { code: "", value: "", i18nKey: "" },
    area:"",
  });
  const [focusedField, setFocusedField] = React.useState('');
  const [roadTypeOptions, setRoadTypeOptions] = React.useState([]);

  const { 
    isWSServicesCalculationLoading, 
    data: wsServicesCalculationData
   } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["RoadType"]);
 
  const { 
    control, 
    formState, 
    watch, 
    setError, 
    clearErrors, 
    trigger, 
  } = useForm();

  const formValues = watch();

  React.useEffect(()=>{
    trigger();
  },[])

  React.useEffect(() => {
    onSelect(config.key, roadCuttingDetails);
  }, [roadCuttingDetails]);

  React.useEffect(()=>{
    const roadTypeOptions = wsServicesCalculationData?.["ws-services-calculation"]?.RoadType
                        ?.map((type)=>({...type, i18nKey: type.code})) || [];
    setRoadTypeOptions(roadTypeOptions);
  }, [wsServicesCalculationData]);

  React.useEffect(()=>{
    const part = {};

    Object.keys(formValues).forEach((key)=>part[key] = formValues[key]);

    if(!_.isEqual(part, roadCuttingDetails)){
      setRoadCuttingDetails(part);
      trigger();
    }
  },[formValues]);


  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="type"
            defaultValue={roadCuttingDetails.type}
            rules={{
              validate: (e)=>e && e.length ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <Dropdown
                key={config.key}
                t={t}
                option={roadTypeOptions}
                selected={props.value}
                optionKey="i18nKey"
                select={(value) => {
                  props.onChange(value);
                }}
              ></Dropdown>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.type && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.type?.message)} </CardLabelError> 
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="area"
            defaultValue={roadCuttingDetails.area}
            rules={{
              validate: (e)=>e && getPattern("DecimalNumber").test(e) ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <TextInput
              key={config.key}
              value={props.value}
              onChange={(ev) => {
                props.onChange(ev.target.value);
                setFocusedField("area");
              }}
              ></TextInput>
            )}
            ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.area && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.area?.message)} </CardLabelError> 
      )}

      <Link to={`/digit-ui/employee/commonpt/search?redirectToUrl=${""}`}>
        <LinkButton label={t("WS_ADD_ROAD_TYPE")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
    </React.Fragment>
  );
}

export default WSRoadCuttingDetails;
