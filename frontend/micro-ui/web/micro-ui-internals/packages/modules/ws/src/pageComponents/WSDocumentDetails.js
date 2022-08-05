import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, UploadFile, Toast, Loader, FormStep } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSDocumentDetails = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
  const tenantId = Digit.ULBService.getStateId();
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [checkRequiredFields, setCheckRequiredFields] = useState(false);

  const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId);

  const handleSubmit = () => {
    let document = formData.documents;
    let documentStep;
    documentStep = { ...document, documents: documents };
    onSelect(config.key, documentStep);
  };
  const onSkip = () => onSelect();
  function onAdd() {}

  useEffect(() => {
    let count = 0;
    wsDocs?.Documents.map((doc) => {
      let isRequired = false;
      documents.map((data) => {
        if (doc.required && data?.documentType.includes(doc.code)) isRequired = true;
      });
      if (!isRequired && doc.required) count = count + 1;
    });
    if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);
    else setEnableSubmit(true);
  }, [documents, checkRequiredFields]);

  return (
    <div>
      {userType === "citizen" && <Timeline currentStep={3} />}
      {!wsDocsLoading ? (
        <FormStep t={t} config={config} onSelect={handleSubmit} onSkip={onSkip} isDisabled={enableSubmit} onAdd={onAdd}>
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
      ) : (
        <Loader />
      )}
    </div>
  );
};

function SelectDocument({ t, key, document: doc, setDocuments, error, setError, documents, setCheckRequiredFields }) {
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
            documentUid: selectedDocument?.documentUid || null,
            id: selectedDocument?.id || null,
            fileName: file?.name || "",
            status: "ACTIVE",
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
      <CardLabel>{doc?.required ? `${t(doc?.i18nKey)} *` : `${t(doc?.i18nKey)}`}</CardLabel>
      <Dropdown t={t} isMandatory={false} option={doc?.dropdownData} selected={selectedDocument} optionKey="i18nKey" select={handleSelectDocument} />
      <UploadFile
        id={`noc-doc-${key}`}
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
  );
}

export default WSDocumentDetails;
