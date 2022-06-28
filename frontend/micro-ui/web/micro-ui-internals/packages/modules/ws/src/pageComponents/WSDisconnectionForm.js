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
  ActionBar
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import DisconnectTimeline from "../components/DisconnectTimeline";
import { stringReplaceAll, createPayloadOfWSDisconnection } from "../utils";

const WSDisconnectionForm = ({ t, config, onSelect, userType }) => {
  let validation = {};
  const stateCode = Digit.ULBService.getStateId();

  const applicationData = Digit.SessionStorage.get("WS_DISCONNECTION");
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: "",
      date: "",
      reason: "",
      documents: []
  });
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [disconnectionTypeList, setDisconnectionTypeList] = useState([]);
  const [checkRequiredFields, setCheckRequiredFields] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["disconnectionType"]);
  const { isLoading: wsDocsLoading, data: wsDocs } =  Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(stateCode, "Disconnection");
  const {
    isLoading: creatingWaterApplicationLoading,
    isError: createWaterApplicationError,
    data: createWaterResponse,
    error: createWaterError,
    mutate: waterMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("WATER");

  const {
    isLoading: creatingSewerageApplicationLoading,
    isError: createSewerageApplicationError,
    data: createSewerageResponse,
    error: createSewerageError,
    mutate: sewerageMutation,
  } = Digit.Hooks.ws.useWaterCreateAPI("SEWERAGE");

  // useEffect(() =>{
  //   setDisconnectionData({
  //     type:storedData?.type||"",
  //     date: storedData?.date || "",
  //     reason: storedData?.reason || "",
  //     documents: storedData?.documents || []
  //   });
  //   setDocuments(storedData?.documents || [])

  // },[]);

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

  const handleSubmit = () => onSelect(config.key, { WSDisConnectionForm: disconnectionData });

  const handleEmployeeSubmit = () => {
    console.log("Emp Submit");
    onSelect(config.key, { WSDisConnectionForm: {...disconnectionData, documents:documents} });
  };


  const onSkip = () => onSelect();

  const filedChange = (val) => {
    const oldData = {...disconnectionData};
    oldData[val.code]=val;
    setDisconnectionData(oldData);
  }

  const onSubmit = async (data) => {
    if(data?.documents?.length === 0 || data?.documents?.length < 2){
      setError({key: "error", message: "DOCUMENTS_MANDATORY"})
    }

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
            history.push(`/digit-ui/employee/ws/ws-response?applicationNumber=${data?.WaterConnection?.[0]?.applicationNo}`);
          },
        });
      }
    }
    else if(payload?.SewerageConnections?.sewerage){
      if (sewerageMutation) {
        setIsEnableLoader(true);
        await sewerageMutation(payload, {
          onError: (error, variables) => {
            setIsEnableLoader(false);
            setError({ key: "error", message: error?.response?.data?.Errors?.[0].message ? error?.response?.data?.Errors?.[0].message : error });
            setTimeout(closeToastOfError, 5000);
          },
          onSuccess: async (data, variables) => {
            history.push(`/digit-ui/employee/ws/ws-response?applicationNumber=${data?.SewerageConnections?.[0]?.applicationNo}`);
          },
        });
      }
    }
  } ;

  if (isMdmsLoading || wsDocsLoading || isEnableLoader) return <Loader />


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
          
          <div style={{padding:"10px",paddingTop:"20px",marginTop:"10px"}}>
          <CardHeader>{t("WS_APPLICATION_FORM")}</CardHeader>
          <CardLabel>
            {t('WS_CONSUMER_NUMBER')} 
            <span style={{float:'right'}}>{"PG-WS-2021-09-29-006024"}</span>
          </CardLabel>
          
          <CardLabel>{t("WS_DISCONNECTION_TYPE")}</CardLabel>
          <RadioButtons
                t={t}
                options={disconnectionTypeList}
                optionsKey="i18nKey"
                value={disconnectionData.type?.value?.code}
                selectedOption={disconnectionData.type?.value}
                isMandatory={false}
                onSelect={(val) => filedChange({code: "type",value: val})}
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
  }

  console.log("Disconnection Data: " + JSON.stringify(disconnectionData));
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
        {t("WS_DISCONNECTION_TYPE")}
            <div className={`tooltip`}>
            <InfoBannerIcon fill="#0b0c0c"/>
            <span className="tooltiptext" style={{
                    whiteSpace: "nowrap",
                    fontSize: "medium"
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
            />
          
          <LabelFieldPair>
          <CardLabel style={{ marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">
            {t("WS_DISCONECTION_DATE")}
            <div className={`tooltip`} style={{position: "absolute"}}>
            <InfoBannerIcon fill="#0b0c0c"/>
            <span className="tooltiptext" style={{
                    whiteSpace: "nowrap",
                    fontSize: "medium"
                  }}>
                    {`${t(`WS_DISCONNECTION_DATE_TOOLTIP`)}`}
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
              <CardLabel style={{ marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{t("WS_DISCONNECTION_REASON")}</CardLabel>              
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
          <CardSectionHeader>{t("WS_DISCONNECTION_DOCUMENTS")}</CardSectionHeader>
          {wsDocs?.Disconnection?.map((document, index) => { 
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
                  {error && <Toast error={error?.key === "error" ? true : false} label={t(error?.message)} onClose={() => setError(null)} />}
      </div>


    </FormStep>
    <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {
            <SubmitBar
              label={t("ACTION_TEST_SUBMIT")}
              onSubmit={onSubmit(disconnectionData)}
              style={{ margin: "10px 10px 0px 0px" }}
              disabled={wsDocsLoading || documents.length === 0 ? true : false}
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
          setDocuments((prev) => {
              const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);
              if (uploadedFile?.length === 0 || uploadedFile === null) return filteredDocumentsByDocumentType;
              const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
              return [
                  ...filteredDocumentsByFileStoreId,
                  {
                      documentType: doc?.code,
                      fileStoreId: uploadedFile,
                      documentUid: uploadedFile,
                      fileName: file?.name || "",
                  },
              ];
          });
  }, [uploadedFile, selectedDocument]);


  useEffect(() => {
      (async () => {
          setError(null);
          if (file) {
              if (file.size >= 5242880) {
                  setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                  try {
                      setUploadedFile(null);
                      const response = await Digit.UploadServices.Filestorage("WS", file, tenantId?.split(".")[0]);
                      if (response?.data?.files?.length > 0) {
                          setUploadedFile(response?.data?.files[0]?.fileStoreId);
                      } else {
                          setError(t("CS_FILE_UPLOAD_ERROR"));
                      }
                  } catch (err) {
                      // console.error("Modal -> err ", err);
                      setError(t("CS_FILE_UPLOAD_ERROR"));
                  }
              }
          }
      })();
  }, [file]);

  return (
      <div style={{ marginBottom: "24px" }}>
          <LabelFieldPair>
          <CardLabel style={{ marginTop: "-5px", fontWeight: "700" }} className="card-label-smaller">{t(doc?.i18nKey) + "*"}</CardLabel>
          {/* <Dropdown
              t={t}
              isMandatory={false}
              option={doc?.dropdownData}
              selected={selectedDocument}
              optionKey="i18nKey"
              select={handleSelectDocument}
          /> */}
          <div className="field">
          <UploadFile
              id={`noc-doc-1-${key}`}
              extraStyleName={"propertyCreate"}
              accept=".jpg,.png,.pdf"
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