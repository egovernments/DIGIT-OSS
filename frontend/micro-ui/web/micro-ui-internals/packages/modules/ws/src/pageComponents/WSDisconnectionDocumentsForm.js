import React, { useEffect, useState } from "react";
// import { pdfDocumentName, pdfDownloadLink, getDocumentsName,stringReplaceAll } from "../utils";
import Timeline from "../components/Timeline";
import {
  CardLabel,
  Dropdown,
  UploadFile,
  Toast,
  Loader,
  FormStep,
  CardHeader,
  SubmitBar
} from "@egovernments/digit-ui-react-components";


function WSDisconnectionDocumentsForm({ t, config, onSelect, userType, formData  }) { 
  const tenantId = Digit.ULBService.getStateId();
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);
  const [enableSubmit, setEnableSubmit] = useState(true)
  const [checkRequiredFields, setCheckRequiredFields] = useState(false);

  // const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId);
  const goNext = () => {
    onSelect("DocsReq", "");
  }
  const handleSubmit = () => {
      // let document = formData.documents;
      // let documentStep;
      // documentStep = { ...document, documents: documents };
      // onSelect(config.key, documentStep);
  };
  const onSkip = () => onSelect();


  // useEffect(() => {
  //     let count = 0;
  //     wsDocs?.Documents.map(doc => {
  //         let isRequired = false;
  //         documents.map(data => {
  //             if (doc.required && data?.documentType.includes(doc.code)) isRequired = true;
  //         });
  //         if (!isRequired && doc.required) count = count + 1;
  //     });
  //     if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);
  //     else setEnableSubmit(true);
  // }, [documents, checkRequiredFields])

  // console.log(wsDocs,"PROOOFFFFF");

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
 
  return (
    <div style={{ marginTop: "19px" }}>
      {userType === "citizen" && (<Timeline currentStep={3} />)}
      {/* {!wsDocsLoading ?  */}
      <FormStep
        t={t}
        config={config}
        // onSelect={handleSubmit}
        // onSkip={onSkip}
        isDisabled={enableSubmit}
        // onAdd={onAdd}
      >
        <CardHeader>{t(`WS_DISCONNECTION_UPLOAD_DOCUMENTS`)}</CardHeader>
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
              setCheckRequiredFields={setCheckRequiredFields}
            />
          );
          })}
          {error && <Toast label={error} onClose={() => setError(null)} error />}
      </FormStep> 
      {/* : <Loader />} */}
      <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />

    </div>
  );
}

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
          <CardLabel>{t(doc?.i18nKey)}</CardLabel>
          <Dropdown
              t={t}
              isMandatory={false}
              option={doc?.dropdownData}
              selected={selectedDocument}
              optionKey="i18nKey"
              select={handleSelectDocument}
          />
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
      </div>
  );

}

export default WSDisconnectionDocumentsForm;