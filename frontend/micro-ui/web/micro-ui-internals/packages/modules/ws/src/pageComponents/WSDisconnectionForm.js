import { CardLabel, CheckBox, Dropdown, FormStep, Loader, MobileNumber, RadioButtons, TextInput, UploadFile,LabelFieldPair,TextArea,SubmitBar, CitizenInfoLabel, CardHeader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import DisconnectTimeline from "../components/DisconnectTimeline";
import { stringReplaceAll } from "../utils";

const WSDisConnectionForm = ({ t, config, onSelect, userType, formData }) => {
  let validation = {};
  const stateCode = Digit.ULBService.getStateId();

  const storedData = formData?.WSDisConnectionForm?.WSDisConnectionForm||formData?.WSDisConnectionForm
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: storedData?.type || "",
      date: storedData?.date || "",
      reason: storedData?.reason || "",
  })
  const [disconnectionTypeList, setDisconnectionTypeList] = useState([]);

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["disconnectionType"]);

  useEffect(() =>{
    setDisconnectionData({
      type:storedData?.type||"",
      date: storedData?.date || "",
      reason: storedData?.reason || "",
    });
  },[]);

  useEffect(() => {
    const disconnectionTypes = mdmsData?.["ws-services-masters"]?.disconnectionType || []; 
    disconnectionTypes?.forEach(data => data.i18nKey = `WS_DISCONNECTIONTYPE_${stringReplaceAll(data?.code?.toUpperCase(), " ", "_")}`);

    setDisconnectionTypeList(disconnectionTypes);
  }, [mdmsData]);

  const handleSubmit = () => onSelect(config.key, { WSDisConnectionForm: disconnectionData });

  const onSkip = () => onSelect();

  const filedChange = (val) => {
    const oldData = {...disconnectionData};
    oldData[val.code]=val;
    setDisconnectionData(oldData);
  }

  if (isMdmsLoading) return <Loader />

  return (
    <div>
      {userType === "citizen" && (<DisconnectTimeline currentStep={1} />)}
      <FormStep
        config={config}
        onSelect={handleSubmit}
        onSkip={onSkip}
        t={t}       
      >
         
        <div style={{padding:"10px",paddingTop:"20px",marginTop:"10px"}}>
        <CardHeader>{t("WS_APPLICATION_FORM")}</CardHeader>
        <CardLabel>
          {t('WS_CONSUMER_NUMBER')} 
          <span style={{float:'right'}}>PG-WS-2021-09-29-006024</span>
        </CardLabel>
        
        <CardLabel>{t("WS_DISCONNECTION_TYPE")}</CardLabel>
          <RadioButtons
              t={t}
              options={disconnectionTypeList}
              optionsKey="i18nKey"
              value={disconnectionData.type?.value}
              selectedOption={disconnectionData.type}
              isMandatory={false}
              onSelect={filedChange}
              labelKey="WS_DISCONNECTION_TYPE"
          />
          
        <CardLabel>{t("WS_DISCONNECTION_DATE")}</CardLabel>
          <TextInput
            t={t}
            type={"text"}
            style={{background:"#FAFAFA"}}
            isMandatory={false}
            optionKey="i18nKey"
            name="date"
            value={disconnectionData?.date?.value}
            onChange={(e) => filedChange({code:"date" , value:e.target.value})}
          />

          <LabelFieldPair>
            <CardLabel>{t("WS_DISCONNECTION_REASON")}</CardLabel>              
              <TextArea
                isMandatory={false}
                optionKey="i18nKey"
                t={t}
                name={"reason"}
                value={disconnectionData.reason?.value}
                onChange={(e) => filedChange({code:"reason" , value:e.target.value})}
              />              
          </LabelFieldPair>
          <SubmitBar label={t(`CS_COMMON_NEXT`)} submit={true} />
        </div>
      </FormStep>
      <CitizenInfoLabel style={{ margin: "0px" }} textStyle={{ color: "#0B0C0C" }} text={t(`WS_DISONNECT_APPL_INFO`)} />
    </div>
  );
};

export default WSDisConnectionForm;