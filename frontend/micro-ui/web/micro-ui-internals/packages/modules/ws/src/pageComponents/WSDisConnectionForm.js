import { 
  CardLabel, 
  Dropdown, 
  UploadFile,
  Toast,
  FormStep, 
  Loader, MobileNumber, 
  RadioButtons, 
  TextInput, 
  LabelFieldPair,
  TextArea,
  SubmitBar, 
  CitizenInfoLabel, 
  CardHeader 
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/Timeline";
// import { stringReplaceAll } from "../utils";

const WSDisConnectionForm = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  console.log("userType",userType)
  let validation = {};
  const storedData = formData?.WSDisConnectionForm?.WSDisConnectionForm||formData?.WSDisConnectionForm
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: storedData?.type || "",
      date: storedData?.date || "",
      reason: storedData?.reason || "",
  })

  const [documents, setDocuments] = useState(storedData?.documents || []);
  const [error, setError] = useState(null);

  useEffect(() =>{
    setDisconnectionData({
      type:storedData?.type||"",
      date: storedData?.date || "",
      reason: storedData?.reason || "",     
    });
    setDocuments(storedData?.documents || [])
  },[]);

  const tenantId = Digit.ULBService.getCurrentTenantId();

  let menu = [
    { i18nKey: 'WS_PERMANENT', code: `type`, value: `PERMANENT` },
    { i18nKey: 'WS_TEMPORARY', code: `type`, value: `TEMPORARY` }
  ];

  const wsDocs={Documents: [
    {
      "code": "OWNER.IDENTITYPROOF",
      "documentType": "OWNER",
      "required": true,
      "active": true,
      "hasDropdown": true,
      "dropdownData": [
          {
              "code": "OWNER.IDENTITYPROOF.AADHAAR",
              "active": true,
              "i18nKey": "OWNER_IDENTITYPROOF_AADHAAR"
          },
          {
              "code": "OWNER.IDENTITYPROOF.VOTERID",
              "active": true,
              "i18nKey": "OWNER_IDENTITYPROOF_VOTERID"
          },
          {
              "code": "OWNER.IDENTITYPROOF.DRIVING",
              "active": true,
              "i18nKey": "OWNER_IDENTITYPROOF_DRIVING"
          },
          {
              "code": "OWNER.IDENTITYPROOF.PAN",
              "active": true,
              "i18nKey": "OWNER_IDENTITYPROOF_PAN"
          },
          {
              "code": "OWNER.IDENTITYPROOF.PASSPORT",
              "active": true,
              "i18nKey": "OWNER_IDENTITYPROOF_PASSPORT"
          }
      ],
      "description": "OWNER.ADDRESSPROOF.IDENTITYPROOF_DESCRIPTION",
      "i18nKey": "OWNER_IDENTITYPROOF"
  },
  {
    "code": "OWNER.ADDRESSPROOF",
    "documentType": "OWNER",
    "required": true,
    "active": true,
    "hasDropdown": true,
    "dropdownData": [
        {
            "code": "OWNER.ADDRESSPROOF.ELECTRICITYBILL",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_ELECTRICITYBILL"
        },
        {
            "code": "OWNER.ADDRESSPROOF.DL",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_DL"
        },
        {
            "code": "OWNER.ADDRESSPROOF.VOTERID",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_VOTERID"
        },
        {
            "code": "OWNER.ADDRESSPROOF.AADHAAR",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_AADHAAR"
        },
        {
            "code": "OWNER.ADDRESSPROOF.PAN",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_PAN"
        },
        {
            "code": "OWNER.ADDRESSPROOF.PASSPORT",
            "active": true,
            "i18nKey": "OWNER_ADDRESSPROOF_PASSPORT"
        }
    ],
    "description": "OWNER.ADDRESSPROOF.ADDRESSPROOF_DESCRIPTION",
    "i18nKey": "OWNER_ADDRESSPROOF"
}
]}


const handleSubmit = () => onSelect(config.key, { WSDisConnectionForm: {...disconnectionData, documents:documents} });

  const onSkip = () => onSelect();
  const filedChange = (val) => {
    const oldData = {...disconnectionData};
    oldData[val.code]=val;
    setDisconnectionData(oldData);
  }

  return (
    <div>
       {userType === "citizen" && (<Timeline currentStep={2} />)}
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
              options={menu}
              optionsKey="i18nKey"
              value={disconnectionData.type?.value}
              selectedOption={disconnectionData.type}
              isMandatory={false}
              onSelect={filedChange}
              labelKey="WS_DISCONNECTION_TYPE"
          />
          
          <LabelFieldPair>
          <CardLabel>{t("WS_DISCONEECTION_DATE")}</CardLabel>
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
          </LabelFieldPair>
        


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

          {userType !== "citizen" && (
              <React.Fragment>
              <CardHeader>{t(`WS_DISCONNECTION_DOCUMENTS`)}</CardHeader>
                {wsDocs?.Documents?.map((document, index) => { 
                  return (
                    <SelectDocument
                      key={index}
                      document={document}
                      t={t}
                      error={error}
                      setError={setError}
                      setDocuments={setDocuments}
                      documents={documents}
                    //   setCheckRequiredFields={setCheckRequiredFields}
                    />
                  );
                  })}
                  {error && <Toast label={error} onClose={() => setError(null)} error />}
              </React.Fragment>
            )
          }
          <SubmitBar label={t(`CS_COMMON_NEXT`)} submit={true} />
        </div>
        </FormStep>
       {userType === "citizen" && (<CitizenInfoLabel style={{ margin: "0px" }} textStyle={{ color: "#0B0C0C" }} text={t(`WS_DISONNECT_APPL_INFO`)} />)}
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
          <CardLabel>{t(doc?.i18nKey)}</CardLabel>
          {/* <Dropdown
              t={t}
              isMandatory={false}
              option={doc?.dropdownData}
              selected={selectedDocument}
              optionKey="i18nKey"
              select={handleSelectDocument}
          /> */}
          <UploadFile
              id={`noc-doc-${key}`}
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
          </LabelFieldPair>
        
         
      </div>
  );

}

export default WSDisConnectionForm;