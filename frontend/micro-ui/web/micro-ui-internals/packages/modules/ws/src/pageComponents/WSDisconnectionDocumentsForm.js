import React, { useEffect, useState } from "react";
// import { pdfDocumentName, pdfDownloadLink, getDocumentsName,stringReplaceAll } from "../utils";
import DisconnectTimeline from "../components/DisconnectTimeline";
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
  const storedData = formData?.WSDisconnectionDocumentsForm?.WSDisconnectionDocumentsForm||formData?.WSDisconnectionDocumentsForm

  const [documents, setDocuments] = useState(storedData || []);
  const [error, setError] = useState(null);
  const [enableSubmit, setEnableSubmit] = useState(true)
  const [checkRequiredFields, setCheckRequiredFields] = useState(false);

  useEffect(() =>{
      setDocuments(storedData||[])
  },[]);

  const handleSubmit = () => {
      onSelect(config.key, {WSDisconnectionDocumentsForm: documents});
  };
 
  const { isLoading: wsDocsLoading, data: wsDocs } =  Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId, 'DisconnectionDocuments');
 
  if(wsDocsLoading) {
    return <Loader />;
  }

  return (
    <div style={{ marginTop: "19px" }}>
      {userType === "citizen" && (<DisconnectTimeline currentStep={2} />)}
      <FormStep
        t={t}
        config={config}
        onSelect={handleSubmit}       
        // isDisabled={enableSubmit}
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
            //   setCheckRequiredFields={setCheckRequiredFields}
            />
          );
        })}
        <SubmitBar label={t(`CS_COMMON_NEXT`)} submit={true} />
        {error && <Toast label={error} onClose={() => setError(null)} error />}
      </FormStep> 
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