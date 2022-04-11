import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { getPattern } from "../utils";

const newRoadCuttingDetails = (index = 0, data) => ({
  key: `${index}`,
  roadType: data?.roadType || { code: "", value: "", i18nKey: "" },
  roadArea: data?.roadArea || "",
});

const WSRoadCuttingDetails = ({ t, config, onSelect, formData, formState, setError, clearErrors }) => {
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState((() => {
    const roadDetails = formData[config?.key];

    if (roadDetails && Object.keys(roadDetails).length) {
      return roadDetails.map((e, idx) => ({ key: `${idx}`, roadType: e?.roadType, roadArea: "" }));
    }

    return [newRoadCuttingDetails()]
  })());
  const [isErrors, setIsErrors] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState('');
  const [roadTypeOptions, setRoadTypeOptions] = React.useState([]);

  const {
    isWSServicesCalculationLoading,
    data: wsServicesCalculationData
  } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["RoadType"]);

  const {
    control,
    formState: localFormState,
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
    onSelect(config.key, roadCuttingDetails.map((e) => ({ roadType: e?.roadType, roadArea: e?.roadArea })));
  }, [roadCuttingDetails]);

  const addRoadDetails = () => {
    setRoadCuttingDetails([...roadCuttingDetails, newRoadCuttingDetails(roadCuttingDetails.length)]);
  }

  const removeRoadDetails = (index) => {
    const newRoadCuttingDetails = [...roadCuttingDetails];
    newRoadCuttingDetails.splice(index, 1);
    setRoadCuttingDetails(newRoadCuttingDetails);
  }

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      {roadCuttingDetails?.map((detail, index) => (
        <React.Fragment>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={`${detail?.key}.roadType`}
                defaultValue={detail?.roadType}
                render={(props) => (
                  <Dropdown
                    key={config.key}
                    t={t}
                    option={roadTypeOptions}
                    selected={props.value}
                    optionKey="i18nKey"
                    select={(value) => {
                      props.onChange(value);
                      setFocusedField(`${detail?.key}.roadType`);

                      const details = roadCuttingDetails.map((e, idx) => {
                        if (idx === index) {
                          return {
                            key: e.key,
                            roadType: value,
                            roadArea: e.roadArea,
                          };
                        }
                        return e;
                      });

                      setRoadCuttingDetails(details);
                    }}
                  ></Dropdown>
                )}
              ></Controller>
            </div>
          </LabelFieldPair>
          {localFormState.touched?.[`${detail?.key}`]?.roadType && (
            <CardLabelError style={errorStyle}> {t(localFormState.errors?.[`${detail?.key}`]?.roadType?.message)} </CardLabelError>
          )}

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={`${detail?.key}.roadArea`}
                defaultValue={detail?.roadArea}
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
                    autoFocus={focusedField === `${detail?.key}.roadArea`}
                    onChange={(ev) => {
                      props.onChange(ev.target.value);
                      setFocusedField(`${detail?.key}.roadArea`);

                      const details = roadCuttingDetails.map((e, idx) => {
                        if (idx === index) {
                          return {
                            key: e.key,
                            roadType: e.roadType,
                            roadArea: ev.target.value
                          };
                        }
                        return e;
                      });

                      setRoadCuttingDetails(details);
                    }}
                  ></TextInput>
                )}
              ></Controller>
            </div>
          </LabelFieldPair>
          {localFormState.touched?.[`${detail?.key}`]?.roadArea && (
            <CardLabelError style={errorStyle}> {t(localFormState.errors?.[`${detail?.key}`]?.roadArea?.message)} </CardLabelError>
          )}
        </React.Fragment>
      ))}

      <button style={{ color: "#f47738", display: "inline-block" }} onClick={addRoadDetails}>{t("WS_ADD_ROAD_TYPE")}</button>
    </React.Fragment>
  );
}

export default WSRoadCuttingDetails;
