import { CardLabel, Dropdown, LabelFieldPair, Loader, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { stringReplaceAll, getPattern } from "../utils";
import cloneDeep from "lodash/cloneDeep";
import * as func from "../utils";
import { useForm, Controller, useWatch } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


const createConnectionDetails = (service) => (service === "WATER" ? {
  connectionType: "",
  noOfTaps: "",
  waterSource: "",
  pipeSize: "",
  waterSubSource: "",
  sourceSubData: ""
} : {
  noOfWaterClosets: "",
  noOfToilets: ""
});

const ConnectionType = ({ key, t, connectionDetails, localFormState, errors, control, getValues, connectionType, errorStyle, setConnectionDetails }) => {
  const [connectionTypeList, setConnectionTypeList] = useState([]);

  React.useEffect(() => {
    setConnectionTypeList(
      connectionType?.map(data => ({
        ...data,
        i18nKey: `WS_CONNECTIONTYPE_${stringReplaceAll(data?.code?.toUpperCase(), " ", "_")}`
      }))
    );
  }, [connectionType])

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_CONN_TYPE")}*:`}</CardLabel>
        <Controller
          control={control}
          name={"connectionType"}
          defaultValue={connectionDetails?.connectionType}
          rules={{ required: t("REQUIRED_FIELD") }}
          isMandatory={true}
          render={(props) => (
            <Dropdown
              className="form-field"
              selected={getValues("connectionType")}
              disable={false}
              option={connectionTypeList}
              errorStyle={(localFormState.touched.connectionType && errors?.connectionType?.message) ? true : false}
              select={(e) => {
                props.onChange(e);
                setConnectionDetails({...connectionDetails, connectionType: e})
              }}
              optionKey="i18nKey"
              onBlur={props.onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.connectionType ? errors?.connectionType?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const NoOfTaps = ({ key, t, connectionDetails, localFormState, errors, control, getValues, errorStyle, setConnectionDetails }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_NO_OF_TAPS")}*:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="noOfTaps"
            defaultValue={connectionDetails?.noOfTaps}
            rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
            type="number"
            isMandatory={true}
            render={(props) => (
              <TextInput
                type="number"
                value={props.value}
                errorStyle={(localFormState.touched.noOfTaps && errors?.noOfTaps?.message) ? true : false}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setConnectionDetails({...connectionDetails, noOfTaps: e.target.value})
                }}
                labelStyle={{ marginTop: "unset" }}
                onBlur={props.onBlur}
              />
            )}
          />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.noOfTaps ? errors?.noOfTaps?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const WaterSource = ({ key, t, connectionDetails, control, getValues, waterSource, localFormState, errors, errorStyle, setConnectionDetails }) => {
  const [waterSourceList, setWaterSourceList] = React.useState([]);

  React.useEffect(() => {
    const set = new Set();
    const list = [];

    waterSource?.map(data => ({
      ...data,
      i18nKey: `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.code?.split('.')[0]?.toUpperCase(), " ", "_")}`
    })).forEach((data) => {
      if (!set.has(data?.i18nKey)) {
        set.add(data?.i18nKey);
        list.push(data);
      }
    });

    setWaterSourceList(list);
  }, [waterSource]);

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_WATER_SOURCE")}*:`}</CardLabel>
        <Controller
          control={control}
          name={"waterSource"}
          defaultValue={connectionDetails?.waterSource}
          rules={{ required: t("REQUIRED_FIELD") }}
          isMandatory={true}
          render={(props) => (
            <Dropdown
              className="form-field"
              selected={getValues("waterSource")}
              disable={false}
              option={waterSourceList}
              errorStyle={(localFormState.touched.waterSource && errors?.waterSource?.message) ? true : false}
              select={(e) => {
                setConnectionDetails({ ...connectionDetails, waterSource: e });
                props.onChange(e);
              }}
              optionKey="i18nKey"
              onBlur={props.onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.waterSource ? errors?.waterSource?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const PipeSize = ({ key, t, connectionDetails, control, errors, localFormState, pipeSize, getValues, errorStyle, setConnectionDetails }) => {
  const [pipeSizeList, setPipeSizeList] = React.useState([]);

  React.useEffect(() => {
    setPipeSizeList(pipeSize?.map(data => ({ ...data, i18nKey: `${data.size}` })))
  }, [pipeSize])

  return (
    <React.Fragment>  
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_PIPE_SIZE")}*:`}</CardLabel>
        <Controller
          control={control}
          name={"pipeSize"}
          defaultValue={connectionDetails?.pipeSize}
          rules={{ required: t("REQUIRED_FIELD") }}
          isMandatory={true}
          render={(props) => (
            <Dropdown
              className="form-field"
              selected={getValues("pipeSize")}
              disable={false}
              option={pipeSizeList}
              errorStyle={(localFormState.touched.pipeSize && errors?.pipeSize?.message) ? true : false}
              select={(e) => {
                props.onChange(e);
                setConnectionDetails({...connectionDetails, pipeSize: e})
              }}
              optionKey="i18nKey"
              onBlur={props.onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.pipeSize ? errors?.pipeSize?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const SourceSubData = ({ key, t, connectionDetails, control, waterSource, errors, localFormState, getValues, errorStyle, setConnectionDetails }) => {
  const [waterSubSourceList, setWaterSubSourceList] = React.useState([]);

  React.useEffect(() => {
    const waterSubSource = waterSource?.map(data => ({
      ...data,
      i18nKey: `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`
    }));    
    const listOfSubSource = waterSubSource?.filter(data => data?.code?.split(".")[0] === connectionDetails?.waterSource?.code?.split(".")[0]);
    setWaterSubSourceList(listOfSubSource);
  }, [waterSource, connectionDetails]);

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_WATER_SUB_SOURCE")}*:`}</CardLabel>
        <Controller
          control={control}
          name={"sourceSubData"}
          defaultValue={connectionDetails?.sourceSubData}
          rules={{ required: t("REQUIRED_FIELD") }}
          isMandatory={true}
          render={(props) => (
            <Dropdown
              className="form-field"
              selected={getValues("sourceSubData")}
              disable={false}
              option={waterSubSourceList}
              errorStyle={(localFormState.touched.sourceSubData && errors?.sourceSubData?.message) ? true : false}
              select={(e) => {
                props.onChange(e);
                setConnectionDetails({...connectionDetails, sourceSubData: e                                                                                                                                                                                                                                                                                                                })
              }}
              optionKey="i18nKey"
              onBlur={props.onBlur}
              t={t}
            />
          )}
        />
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.sourceSubData ? errors?.sourceSubData?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const NoOfWaterClosets = ({ key, t, connectionDetails, control, localFormState, errors, getValues, errorStyle, setConnectionDetails }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_NUMBER_WATER_CLOSETS_LABEL")}*:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="noOfWaterClosets"
            defaultValue={connectionDetails?.noOfWaterClosets}
            rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
            type="number"
            isMandatory={true}
            render={(props) => (
              <TextInput
                value={props.value}
                type="number"
                errorStyle={(localFormState.touched.noOfWaterClosets && errors?.noOfWaterClosets?.message) ? true : false}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setConnectionDetails({...connectionDetails, noOfWaterClosets: e.target.value});
                }}
                labelStyle={{ marginTop: "unset" }}
                onBlur={props.onBlur}
              />
            )}
          />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.noOfWaterClosets ? errors?.noOfWaterClosets?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const NoOfToilets = ({ key, t, connectionDetails, control, localFormState, errors, getValues, errorStyle, setConnectionDetails }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ marginTop: "-5px" }} className="card-label-smaller">{`${t("WS_SERV_DETAIL_NO_OF_TOILETS")}*:`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="noOfToilets"
            defaultValue={connectionDetails?.noOfToilets}
            rules={{ validate: (e) => ((e && getPattern("WSOnlyNumbers").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")), required: t("REQUIRED_FIELD") }}
            type="number"
            isMandatory={true}
            render={(props) => (
              <TextInput
                value={props.value}
                type="number"
                errorStyle={(localFormState.touched.noOfToilets && errors?.noOfToilets?.message) ? true : false}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setConnectionDetails({...connectionDetails, noOfToilets: e.target.value});
                }}
                labelStyle={{ marginTop: "unset" }}
                onBlur={props.onBlur}
              />
            )}
          />
        </div>
      </LabelFieldPair>
      <CardLabelError style={errorStyle}>{localFormState.touched.noOfToilets ? errors?.noOfToilets?.message : ""}</CardLabelError>
    </React.Fragment>
  )
}

const ConnectionDetails = ({ key, connectionDetails, setConnectionDetails }) => {
  const { search } = useLocation();
  const { t } = useTranslation();
  const stateCode = Digit.ULBService.getStateId();
  const urlSearchParams = new URLSearchParams(search);
  const serviceType = urlSearchParams.get("service");

  const { isWsServicesMastersLoading, data: wsServicesMastersData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["connectionType", "waterSource"]);
  const { isWSServicesCalculationLoading, data: wsServicesCalculationData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-calculation", ["PipeSize"]);

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  React.useEffect(() => {
    trigger();
  }, [connectionDetails]);

  const commonProps = {
    t,
    errorStyle,
    connectionDetails,
    control,
    errors,
    getValues,
    localFormState,
    key,
    setConnectionDetails,
    connectionType: wsServicesMastersData?.["ws-services-masters"]?.connectionType,
    waterSource: wsServicesMastersData?.["ws-services-masters"]?.waterSource,
    pipeSize: wsServicesCalculationData?.["ws-services-calculation"]?.PipeSize,
  };

  if (isWSServicesCalculationLoading || isWsServicesMastersLoading) {
    return <Loader></Loader>
  }

  return (
    <React.Fragment>
      {
        serviceType === "WATER"
          ? (
            <React.Fragment>
              <ConnectionType {...commonProps}></ConnectionType>
              <WaterSource {...commonProps}></WaterSource>
              <SourceSubData {...commonProps}></SourceSubData>
              <PipeSize {...commonProps}></PipeSize>
              <NoOfTaps {...commonProps}></NoOfTaps>
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <NoOfToilets {...commonProps}></NoOfToilets>
              <NoOfWaterClosets {...commonProps}></NoOfWaterClosets>
            </React.Fragment>
          )
      }
    </React.Fragment>
  )
}

const WSAdditionalConnectionDetails = ({ config, formData, formState, onSelect }) => {
  const [connectionDetails, setConnectionDetails] = React.useState(
    formData[config?.key] || createConnectionDetails()
  );

  React.useEffect(() => {
    onSelect(config?.key, connectionDetails);
  }, [connectionDetails]);

  return (
    <React.Fragment>
      <ConnectionDetails
        key={config?.key}
        connectionDetails={connectionDetails}
        setConnectionDetails={setConnectionDetails}
      ></ConnectionDetails>
    </React.Fragment>
  )
}


export default WSAdditionalConnectionDetails;