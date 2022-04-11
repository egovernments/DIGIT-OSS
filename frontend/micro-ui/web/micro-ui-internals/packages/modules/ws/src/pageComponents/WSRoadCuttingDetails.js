import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getPattern } from "../utils";

// const newRoadCuttingDetails = (index = 0, data) => ({
//   key: `${index}`,
//   roadType: data?.roadType || { code: "", value: "", i18nKey: "" },
//   roadArea: data?.area || "",
// });

// const WSRoadCuttingDetails = ({ t, config, onSelect, formData, formState, setError, clearErrors }) => {
//   const [roadCuttingDetails, setRoadCuttingDetails] = React.useState((() => {
//     const roadDetails = formData[config?.key];

//     if (roadDetails && Object.keys(roadDetails).length) {
//       return roadDetails.map((e, idx) => ({ key: `${idx}`, roadType: e?.roadType, roadArea: e?.area }));
//     }

//     return [newRoadCuttingDetails()]
//   })());
//   const [isErrors, setIsErrors] = React.useState(false);
//   const [focusedField, setFocusedField] = React.useState('');
//   const [roadTypeOptions, setRoadTypeOptions] = React.useState([]);

//   const {
//     isWSServicesCalculationLoading,
//     data: wsServicesCalculationData
//   } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["RoadType"]);

//   const {
//     control,
//     formState: localFormState,
//     watch,
//     trigger,
//   } = useForm();

//   const formValues = watch();

//   React.useEffect(() => {
//     trigger();
//   }, [roadCuttingDetails])

//   React.useEffect(() => {
//     const roadTypeOptions = wsServicesCalculationData?.["ws-services-calculation"]?.RoadType
//       ?.map((type) => ({ ...type, i18nKey: type.code })) || [];
//     setRoadTypeOptions(roadTypeOptions);
//   }, [wsServicesCalculationData]);

//   React.useEffect(() => {
//     onSelect(config.key, roadCuttingDetails.map((e) => ({ roadType: e?.roadType, area: e?.roadArea })));
//   }, [roadCuttingDetails]);

//   const addRoadDetails = () => {
//     setRoadCuttingDetails([...roadCuttingDetails, newRoadCuttingDetails(roadCuttingDetails.length)]);
//   }

//   const removeRoadDetails = (index) => {
//     const newRoadCuttingDetails = [...roadCuttingDetails];
//     newRoadCuttingDetails.splice(index, 1);
//     setRoadCuttingDetails(newRoadCuttingDetails);
//   }

//   const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

//   return (
//     <React.Fragment>
//       {roadCuttingDetails?.map((detail, index) => (
//         <React.Fragment>
//           <LabelFieldPair>
//             <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
//             <div className="field">
//               <Controller
//                 control={control}
//                 name={`${detail?.key}.roadType`}
//                 defaultValue={detail?.roadType}
//                 render={(props) => (
//                   <Dropdown
//                     key={config.key}
//                     t={t}
//                     option={roadTypeOptions}
//                     selected={props.value}
//                     optionKey="i18nKey"
//                     rules={{
//                       required: t("REQUIRED_FIELD"),
//                     }}
//                     select={(value) => {
//                       props.onChange(value);
//                       setFocusedField(`${detail?.key}.roadType`);

//                       const details = roadCuttingDetails.map((e, idx) => {
//                         if (idx === index) {
//                           return {
//                             key: e.key,
//                             roadType: value,
//                             roadArea: e.roadArea,
//                           };
//                         }
//                         return e;
//                       });

//                       setRoadCuttingDetails(details);
//                     }}
//                   ></Dropdown>
//                 )}
//               ></Controller>
//             </div>
//           </LabelFieldPair>
//           {localFormState.touched?.[`${detail?.key}`]?.roadType && (
//             <CardLabelError style={errorStyle}> {t(localFormState.errors?.[`${detail?.key}`]?.roadType?.message)} </CardLabelError>
//           )}

//           <LabelFieldPair>
//             <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
//             <div className="field">
//               <Controller
//                 control={control}
//                 name={`${detail?.key}.roadArea`}
//                 defaultValue={detail?.roadArea}
//                 type="number"
//                 rules={{
//                   validate: (e) => e && getPattern("DecimalNumber").test(e) ? true : t(""),
//                   required: t("REQUIRED_FIELD"),
//                 }}
//                 render={(props) => (
//                   <TextInput
//                     key={config.key}
//                     value={props.value}
//                     type="number"
//                     autoFocus={focusedField === `${detail?.key}.roadArea`}
//                     onChange={(ev) => {
//                       props.onChange(ev.target.value);
//                       setFocusedField(`${detail?.key}.roadArea`);

//                       const details = roadCuttingDetails.map((e, idx) => {
//                         if (idx === index) {
//                           return {
//                             key: e.key,
//                             roadType: e.roadType,
//                             roadArea: ev.target.value
//                           };
//                         }
//                         return e;
//                       });

//                       setRoadCuttingDetails(details);
//                     }}
//                   ></TextInput>
//                 )}
//               ></Controller>
//             </div>
//           </LabelFieldPair>
//           {localFormState.touched?.[`${detail?.key}`]?.roadArea && (
//             <CardLabelError style={errorStyle}> {t(localFormState.errors?.[`${detail?.key}`]?.roadArea?.message)} </CardLabelError>
//           )}
//         </React.Fragment>
//       ))}

//       <button style={{ color: "#f47738", display: "inline-block" }} onClick={addRoadDetails}>{t("WS_ADD_ROAD_TYPE")}</button>
//     </React.Fragment>
//   );
// }

// export default WSRoadCuttingDetails;

const createRoadCuttingDetails = () => ({
  roadType: { code: "", value: "", i18nKey: "" },
  area: ""
});

const RoadCuttingDetails = ({
  key,
  details,
  roadTypes,
  index,
  roadCuttingDetails,
  setRoadCuttingDetails,
  control,
  localFormState,
  errors
}) => {
  const { t } = useTranslation();

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}*:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name={`roadType_${index}`}
            defaultValue={details?.roadType}
            render={(props) => (
              <Dropdown
                key={key}
                t={t}
                option={roadTypes}
                selected={props.value}
                optionKey="i18nKey"
                rules={{
                  required: t("REQUIRED_FIELD"),
                }}
                select={(value) => {
                  props.onChange(value);

                  const details = roadCuttingDetails.map((e, idx) => {
                    if (idx === index) {
                      return {
                        roadType: value,
                        area: e.area,
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
      {localFormState.touched?.[`roadType_${index}`] && (
        <CardLabelError style={errorStyle}> {t(errors?.[`roadType_${index}`]?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name={`area_${index}`}
            defaultValue={details?.area}
            type="number"
            rules={{
              validate: (e) => e && getPattern("DecimalNumber").test(e) ? true : t(""),
              required: t("REQUIRED_FIELD"),
            }}
            render={(props) => (
              <TextInput
                key={key}
                value={props.value}
                type="number"
                onChange={(ev) => {
                  props.onChange(ev.target.value);

                  const details = roadCuttingDetails.map((e, idx) => {
                    if (idx === index) {
                      return {
                        roadType: e.roadType,
                        area: ev.target.value
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
      {localFormState.touched?.[`area_${index}`] && (
        <CardLabelError style={errorStyle}> {t(errors?.[`area_${index}`]?.message)} </CardLabelError>
      )}
    </React.Fragment >
  )
}

const WSRoadCuttingDetails = ({ config, onSelect, formData, formState, setError, clearErrors }) => {
  const { t } = useTranslation();
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState(
    formData?.[config?.key] || [createRoadCuttingDetails()]
  );
  const [roadTypeOptions, setRoadTypeOptions] = React.useState([]);
  const [isErrors, setIsErrors] = React.useState(false);
  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const key = config?.key;

  const addRoadDetails = () => {
    setRoadCuttingDetails([...roadCuttingDetails, createRoadCuttingDetails(roadCuttingDetails.length)]);
  }

  const removeRoadDetails = (index) => {
    const newRoadCuttingDetails = [...roadCuttingDetails];
    newRoadCuttingDetails.splice(index, 1);
    setRoadCuttingDetails(newRoadCuttingDetails);
  }

  const {
    isWSServicesCalculationLoading,
    data: wsServicesCalculationData
  } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["RoadType"]);

  React.useEffect(() => {
    const roadTypeOptions = wsServicesCalculationData?.["ws-services-calculation"]
      ?.RoadType?.map((type) => ({ ...type, i18nKey: `${type.code}` })) || [];

    setRoadTypeOptions(roadTypeOptions);
  }, [wsServicesCalculationData]);

  React.useEffect(() => {
    onSelect(config?.key, [...roadCuttingDetails]);
  }, [roadCuttingDetails]);

  React.useEffect(() => {
    trigger();
  }, []);

  // React.useEffect(() => {
  //   let containsErrors = false;

  //   roadCuttingDetails.forEach((details) => {
  //     if (!details?.roadType || !details?.area) {
  //       containsErrors = true;
  //     }
  //   });

  //   if(containsErrors){
  //     clearErrors(key)
  //   }

  //   trigger();
  // }, [formValue]);

  React.useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[key]?.type || {}, errors)) {
      setError(key, { type: errors });
    } else if (!Object.keys(errors).length && formState.errors[key] && isErrors) {
      clearErrors(key);
    }
  }, [errors]);


  return (
    <React.Fragment>
      {
        roadCuttingDetails?.map((details, index) => (
          <RoadCuttingDetails
            key={key + "_" + index}
            index={index}
            details={details}
            roadTypes={roadTypeOptions}
            roadCuttingDetails={roadCuttingDetails}
            setRoadCuttingDetails={setRoadCuttingDetails}
            formState={formState}
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            localFormState={localFormState}
            errors={errors}
          ></RoadCuttingDetails>
        ))
      }
      <button style={{ color: "#f47738", display: "inline-block" }} onClick={addRoadDetails}>{t("WS_ADD_ROAD_TYPE")}</button>
    </React.Fragment>
  );
}


export default WSRoadCuttingDetails;