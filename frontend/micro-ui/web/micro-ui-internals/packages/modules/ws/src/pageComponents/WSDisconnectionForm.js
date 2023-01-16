import { 
  CardLabel, 
  FormStep, 
  Loader, 
  RadioButtons, 
  TextInput, 
  UploadFile,
  LabelFieldPair,
  TextArea,
  SubmitBar, 
  CitizenInfoLabel,
  CardHeader ,
  Toast,
  DatePicker,
  Header,
  CardSectionHeader,
  StatusTable, 
  Row,
  InfoBannerIcon,
  ActionBar,
  Dropdown,
  InfoIcon
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import DisconnectTimeline from "../components/DisconnectTimeline";
import { stringReplaceAll, createPayloadOfWSDisconnection, updatePayloadOfWSDisconnection, convertDateToEpoch } from "../utils";
import { addDays, format } from "date-fns";

const WSDisconnectionForm = ({ t, config, onSelect, userType }) => {
  let validation = {};
  const stateCode = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const isMobile = window.Digit.Utils.browser.isMobile();
  const applicationData = Digit.SessionStorage.get("WS_DISCONNECTION");
  const history = useHistory();
  const match = useRouteMatch();
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.type : "",
      date: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.date : "",
      reason: applicationData.WSDisconnectionForm ?  applicationData.WSDisconnectionForm.reason : "",
      documents: applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.documents : []
  });
  const [documents, setDocuments] = useState(applicationData.WSDisconnectionForm ? applicationData.WSDisconnectionForm.documents : []);
  const [error, setError] = useState(null);
  const [disconnectionTypeList, setDisconnectionTypeList] = useState([]);
  const [checkRequiredFields, setCheckRequiredFields] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["disconnectionType"]);
  const { isLoading: wsDocsLoading, data: wsDocs } =  Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(stateCode, "DisconnectionDocuments");
  const {isLoading: slaLoading, data: slaData } = Digit.Hooks.ws.useDisconnectionWorkflow({tenantId});
  const isReSubmit = window.location.href.includes("resubmit");
  const {
    isLoading: creatingWaterApplicationLoading,
    isError: createWaterApplicationError,
    data: createWaterResponse,
    error: createWaterError,
    mutate: waterMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("WATER");

  const {
    isLoading: updatingWaterApplicationLoading,
    isError: updateWaterApplicationError,
    data: updateWaterResponse,
    error: updateWaterError,
    mutate: waterUpdateMutation,
  } = Digit.Hooks.ws.useWSApplicationActions("WATER");


  const {
    isLoading: creatingSewerageApplicationLoading,
    isError: createSewerageApplicationError,
    data: createSewerageResponse,
    error: createSewerageError,
    mutate: sewerageMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("SEWERAGE");

  const {
    isLoading: updatingSewerageApplicationLoading,
    isError: updateSewerageApplicationError,
    data: updateSewerageResponse,
    error: updateSewerageError,
    mutate: sewerageUpdateMutation,
  } = Digit.Hooks.ws.useWSApplicationActions("SEWERAGE");


  const closeToastOfError = () => { setError(null); };

  useEffect(() => {
    const oldData = {...disconnectionData};
    oldData['documents'] = documents;
    setDisconnectionData(oldData);
  }, [documents]);
  

  useEffect(() => {
    const disconnectionTypes = mdmsData?.["ws-services-masters"]?.disconnectionType || []; 
    disconnectionTypes?.forEach(data => data.i18nKey = `WS_DISCONNECTIONTYPE_${stringReplaceAll(data?.code?.toUpperCase(), " ", "_")}`);

    setDisconnectionTypeList(disconnectionTypes);
  }, [mdmsData]);

  useEffect(() => {
    Digit.SessionStorage.set("WS_DISCONNECTION", {...applicationData, WSDisconnectionForm: disconnectionData});
  }, [disconnectionData]);
  const handleSubmit = () => onSelect(config.key, { WSDisConnectionForm: disconnectionData });

  const handleEmployeeSubmit = () => {
    onSelect(config.key, { WSDisConnectionForm: {...disconnectionData, documents:documents} });
  };


  const onSkip = () => onSelect();

  const filedChange = (val) => {
    const oldData = {...disconnectionData};
    oldData[val.code]=val;
    setDisconnectionData(oldData);
  }

  const onSubmit = async (data) => {
    const appDate= new Date();
    const proposedDate= format(addDays(appDate, slaData?.slaDays), 'yyyy-MM-dd').toString();

    if( convertDateToEpoch(data?.date)  <= convertDateToEpoch(proposedDate)){
      setError({key: "error", message: "PROPOSED_DISCONNECTION_INVALID_DATE"});
      setTimeout(() => {
        setError(false);
      }, 3000);
    }

    else if(wsDocsLoading || documents.length < 2 || disconnectionData?.reason?.value === "" || disconnectionData?.reason === "" || disconnectionData?.date === "" || disconnectionData?.type === ""){
      setError({ warning: true, message: "PLEASE_FILL_MANDATORY_DETAILS" });
      setTimeout(() => {
        setError(false);
      }, 3000);
    }

    else {
      const payload = await createPayloadOfWSDisconnection(data, applicationData, applicationData?.applicationData?.serviceType);
      if(payload?.WaterConnection?.water){
        if (waterMutation) {
          setIsEnableLoader(true);
          await waterMutation(payload, {
            onError: (error, variables) => {
              setIsEnableLoader(false);
              setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
              setTimeout(closeToastOfError, 5000);
            },
            onSuccess: async (data, variables) => {
              let response = await updatePayloadOfWSDisconnection(data?.WaterConnection?.[0], "WATER");
              let waterConnectionUpdate = { WaterConnection: response };
              waterConnectionUpdate = {...waterConnectionUpdate, disconnectRequest: true}
              await waterUpdateMutation(waterConnectionUpdate, {
                onError: (error, variables) => {
                  setIsEnableLoader(false);
                  setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
                  setTimeout(closeToastOfError, 5000);
                },
                onSuccess: (data, variables) => {
                  Digit.SessionStorage.set("WS_DISCONNECTION", {...applicationData, DisconnectionResponse: data?.WaterConnection?.[0]});
                  history.push(`/digit-ui/employee/ws/ws-disconnection-response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`);                
                },
              })
            },
          });
        }
      }
      else if(payload?.SewerageConnection?.sewerage){
        if (sewerageMutation) {
          setIsEnableLoader(true);
          await sewerageMutation(payload, {

            onError: (error, variables) => {
              setIsEnableLoader(false);
              setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
              setTimeout(closeToastOfError, 5000);
            },
            onSuccess: async (data, variables) => {
              let response = await updatePayloadOfWSDisconnection(data?.SewerageConnections?.[0], "SEWERAGE");
              let sewerageConnectionUpdate = { SewerageConnection: response };
              sewerageConnectionUpdate = {...sewerageConnectionUpdate, disconnectRequest: true};
              await sewerageUpdateMutation(sewerageConnectionUpdate, {
                onError: (error, variables) => {
                  setIsEnableLoader(false);
                  setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
                  setTimeout(closeToastOfError, 5000);
                },
                onSuccess: (data, variables) => {
                  Digit.SessionStorage.set("WS_DISCONNECTION", {...applicationData, DisconnectionResponse: data?.SewerageConnections?.[0]});
                  history.push(`/digit-ui/employee/ws/ws-disconnection-response?applicationNumber=${data?.SewerageConnections?.[0]?.applicationNo}`);              
                },
              })
            },
          });
        }
      }
    }
    
  } ;

  if (isMdmsLoading || wsDocsLoading || isEnableLoader || slaLoading) return <Loader />


if(userType === 'citizen') {
    return (
      <div>
        {userType === "citizen" && (<DisconnectTimeline currentStep={1} />)}
        <FormStep
          config={config}
          onSelect={handleSubmit}
          onSkip={onSkip}
          t={t}       
        >
          
          <div style={{padding:"0px 10px 10px 10px"}}>
          <CardHeader>{ isReSubmit ? t("RESUBMIT_DISCONNECTION_FORM") : t("WS_APPLICATION_FORM")}</CardHeader>
          <StatusTable>
            <Row key={t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")} label={`${t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")}`} text={applicationData?.connectionNo} className="border-none" />
          </StatusTable> 
          
          <CardLabel className="card-label-smaller" style={{display: "inline"}}>{t("WS_DISCONNECTION_TYPE") + "*"}</CardLabel>
          <RadioButtons
                t={t}
                options={disconnectionTypeList}
                optionsKey="i18nKey"
                value={disconnectionData.type?.value?.code}
                selectedOption={disconnectionData.type?.value}
                isMandatory={false}
                onSelect={(val) => filedChange({code: "type",value: val})}
                labelKey="WS_DISCONNECTION_TYPE"
                inputStyle={isMobile ? {marginLeft:"unset"} : {}}
            />
            <CardLabel className="card-label-smaller" style={{display: "inline"}}>
            {t("WS_DISCONNECTION_PROPOSED_DATE") + "*"}
            <div className={`tooltip`} style={{position: "absolute"}}>
            <InfoIcon/>
            <span className="tooltiptext" style={{
                    whiteSpace: Digit.Utils.browser.isMobile() ? "unset" : "nowrap",
                    fontSize: "medium",
                    width: Digit.Utils.browser.isMobile() ? "150px" : "unset"
                  }}>
                   {t("SHOULD_BE_DATE") + " " + slaData?.slaDays + " " + t("DAYS_OF_APPLICATION_DATE")}
                  </span>
            </div>
          </CardLabel>
          <div className="field">
          <DatePicker
            date={disconnectionData?.date}
            onChange={(date) => {
              setDisconnectionData({ ...disconnectionData, date: date });
            }}
          ></DatePicker>
          </div>

            <LabelFieldPair>
              <CardLabel className="card-label-smaller" style={{display: "inline"}}>{t("WS_DISCONNECTION_REASON")+ "*"}</CardLabel>              
                <TextArea
                  isMandatory={false}
                  optionKey="i18nKey"
                  t={t}
                  name={"reason"}
                  value={disconnectionData.reason?.value}
                  onChange={(e) => filedChange({code:"reason" , value:e.target.value})}
                />              
            </LabelFieldPair>
            <SubmitBar
              label={t("CS_COMMON_NEXT")}
              onSubmit={() => {
                const appDate= new Date();
                const proposedDate= format(addDays(appDate, slaData?.slaDays), 'yyyy-MM-dd').toString();

                if( parseInt(convertDateToEpoch(disconnectionData?.date))  <= parseInt(convertDateToEpoch(proposedDate))){
                  setError({key: "error", message: "PROPOSED_DISCONNECTION_INVALID_DATE"});
                  setTimeout(() => {
                    setError(false);
                  }, 3000);  
                }
                else{
                  history.push(match.path.replace("application-form", "documents-upload"));
                }
                
              }}
              disabled={
                disconnectionData?.reason?.value === "" || disconnectionData?.reason === "" || disconnectionData?.date === "" || disconnectionData?.type === "" 
                ? true 
                : false}
             />
             {error && <Toast error={error?.key === "error" ? true : false} label={t(error?.message)} onClose={() => setError(null)} />}
          </div>
        </FormStep>
        <CitizenInfoLabel style={{ margin: "0px" }} textStyle={{ color: "#0B0C0C" }} text={t(`WS_DISONNECT_APPL_INFO`)} info={t("CS_COMMON_INFO")} />
      </div>
    );
  }

  return (
    <div style={{ margin: "16px" }}>
    <Header styles={{fontSize: "32px", marginLeft: "18px"}}>{t("WS_WATER_AND_SEWERAGE_DISCONNECTION")}</Header>
    <FormStep
          config={config}
          onSelect={handleEmployeeSubmit}
          onSkip={onSkip}
          t={t}       
    >
      <div style={{padding:"10px",paddingTop:"20px",marginTop:"10px"}}>
      <CardSectionHeader>{t("CS_TITLE_APPLICATION_DETAILS")}</CardSectionHeader>
      <StatusTable>
        <Row key={t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")} label={`${t("PDF_STATIC_LABEL_CONSUMER_NUMBER_LABEL")}`} text={applicationData?.applicationData?.connectionNo} className="border-none" />
      </StatusTable>        
      <CardSectionHeader>
        {t("WS_DISCONNECTION_TYPE")+ "*"}
            <div className={`tooltip`} style={{marginLeft: "8px"}}>
            <InfoIcon/>
            <span className="tooltiptext" style={{
                    whiteSpace: Digit.Utils.browser.isMobile() ? "unset" : "nowrap",
                    fontSize: "medium",
                    width:  Digit.Utils.browser.isMobile() && window.location.href.includes("/employee") ? "200px" : "",
                  }}>
                    {`${t(`WS_DISCONNECTION_PERMANENT_TOOLTIP`)}`}
                    <br/><br/>
                    {`${t(`WS_DISCONNECTION_TEMPORARY_TOOLTIP`)}`}
                  </span>
            </div>
      </CardSectionHeader>
        <RadioButtons
                t={t}
                options={disconnectionTypeList}
                optionsKey="i18nKey"
                value={disconnectionData.type?.value?.code}
                selectedOption={disconnectionData.type?.value}
                isMandatory={false}
                onSelect={(val) => filedChange({code: "type",value: val})}
                labelKey="WS_DISCONNECTION_TYPE"
                style={{display: "flex", gap: "0px 3rem"}}
                inputStyle={isMobile ? {marginLeft:"unset"} : {}}
            />
          
          <LabelFieldPair>
          <CardLabel style={{ marginTop: "-5px", fontWeight: "700", display: "inline" }} className="card-label-smaller">
            {t("WS_DISCONNECTION_PROPOSED_DATE")+ "*"} 
            <div className={`tooltip`} style={{position: "absolute", marginLeft: "4px"}}>
            <InfoIcon/>
            <span className="tooltiptext" style={{
                    whiteSpace: Digit.Utils.browser.isMobile() ? "unset" : "nowrap",
                    fontSize: "medium",
                  }}>
                    {t("SHOULD_BE_DATE")+ " " + slaData?.slaDays + " " + t("DAYS_OF_APPLICATION_DATE")}
                  </span>
            </div>
          </CardLabel>
          <div className="field">
          <DatePicker
            date={disconnectionData?.date}
            onChange={(date) => {
              setDisconnectionData({ ...disconnectionData, date: date });
            }}
          ></DatePicker>
          </div>
          
          </LabelFieldPair>
          <LabelFieldPair>
              <CardLabel style={{ marginTop: "-5px", fontWeight: "700", display: "inline" }} className="card-label-smaller">{t("WS_DISCONNECTION_REASON") + "*"}</CardLabel>              
              <div className="field">
                <TextArea
                  isMandatory={false}
                  optionKey="i18nKey"
                  t={t}
                  name={"reason"}
                  value={disconnectionData.reason?.value}
                  onChange={(e) => filedChange({code:"reason" , value:e.target.value})}
                />  
                </div>            
          </LabelFieldPair>
          <CardSectionHeader style={{ marginBottom: "8px"}}>{t("WS_DISCONNECTION_DOCUMENTS")+ "*" }</CardSectionHeader>
          {wsDocs?.DisconnectionDocuments?.map((document, index) => { 
                  return (
                    <SelectDocument
                      key={index}
                      document={document}
                      t={t}
                      error={error}
                      setError={setError}
                      setDocuments={setDocuments}
                      documents={documents}
                      setCheckRequiredFields={setCheckRequiredFields}
                    />
                  );
                  })}
                  {error && <Toast error={error?.key === "error" ? true : false} label={t(error?.message)} warning={error?.warning} onClose={() => setError(null)} />}
      </div>


    </FormStep>
    <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {
            <SubmitBar
              label={t("ACTION_TEST_SUBMIT")}
              onSubmit={() => onSubmit(disconnectionData)}
              style={{ margin: "10px 10px 0px 0px" }}
              // disabled={
              //   wsDocsLoading || documents.length < 2 || disconnectionData?.reason?.value === "" || disconnectionData?.reason === "" || disconnectionData?.date === "" || disconnectionData?.type === ""
              //   ? true 
              //   : false}
            />}
     </ActionBar>
    </div>
  );

};


function SelectDocument({
  t,
  key,
  document: doc,
  setDocuments,
  error,
  setError,
  documents,
  setCheckRequiredFields
}) {

  const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState(
      filteredDocument
          ? { ...filteredDocument, active: true, code: filteredDocument?.documentType, i18nKey: filteredDocument?.documentType }
          : doc?.dropdownData?.length === 1
              ? doc?.dropdownData[0]
              : {}
  );
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

  const handleSelectDocument = (value) => setSelectedDocument(value);

  function selectfile(e) {
      setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (selectedDocument?.code) {
        setDocuments((prev) => {
            const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);
            if (uploadedFile?.length === 0 || uploadedFile === null) return filteredDocumentsByDocumentType;
            const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
            return [
                ...filteredDocumentsByFileStoreId,
                {
                    documentType: selectedDocument?.code,
                    fileStoreId: uploadedFile,
                    documentUid: uploadedFile,
                    fileName: file?.name || "",
                },
            ];
        });
    }
}, [uploadedFile, selectedDocument]);

  useEffect(() => {
      (async () => {
          setError(null);
          if (file) {
              if (file.size >= 5242880) {
                  setError({key: "error", message: "CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"});
              } else {
                  try {
                      setUploadedFile(null);
                      const response = await Digit.UploadServices.Filestorage("WS", file, tenantId?.split(".")[0]);
                      if (response?.data?.files?.length > 0) {
                          setUploadedFile(response?.data?.files[0]?.fileStoreId);
                      } else {
                          setError({key: "error", message: "CS_FILE_UPLOAD_ERROR"});
                      }
                  } catch (err) {
                      setError({key: "error", message: "CS_FILE_UPLOAD_ERROR"});
                  }
              }
          }
      })();
  }, [file]);

  return (
      <div style={{ marginBottom: "24px" }}>
          <LabelFieldPair>
          <CardLabel style={{ marginTop: "-5px", fontWeight: "700", display : "inline" }} className="card-label-smaller">{t(doc?.i18nKey) + "*"}</CardLabel>
          <div className="field">
          <Dropdown
              t={t}
              isMandatory={false}
              option={doc?.dropdownData}
              selected={selectedDocument}
              optionKey="i18nKey"
              select={handleSelectDocument}
          />

          <UploadFile
              id={`noc-doc-1-${key}`}
              extraStyleName={"propertyCreate"}
              accept= "image/*, .pdf, .png, .jpeg, .jpg"
              onUpload={selectfile}
              onDelete={() => {
                  setUploadedFile(null);
                  setCheckRequiredFields(true);
              }}
              message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
              error={error}
          />
          </div>
          </LabelFieldPair>
        
         
      </div>
  );

}

export default WSDisconnectionForm;