import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const TLDocumentsEmployee = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);
  const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

  let action = "create";

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");

  if (isEditScreen) action = "update";

  const { isLoading, data: documentsData } = Digit.Hooks.pt.usePropertyMDMS(stateId, "TradeLicense", ["documentObj"]);

  const ckeckingLocation = window.location.href.includes("renew-application-details");


  const tlDocuments = documentsData?.TradeLicense?.documentObj;
  const tlDocumentsList = tlDocuments?.["0"]?.allowedDocs;

  let finalTlDocumentsList = [];
  if (tlDocumentsList && tlDocumentsList.length > 0) {
    tlDocumentsList.map(data => {
      if ((!ckeckingLocation || previousLicenseDetails?.action == "SENDBACKTOCITIZEN") && data?.applicationType?.includes("NEW")) {
        finalTlDocumentsList.push(data);
      } else if (ckeckingLocation && previousLicenseDetails?.action != "SENDBACKTOCITIZEN" && data?.applicationType?.includes("RENEWAL")) {
        finalTlDocumentsList.push(data);
      }
    })
  }

  const goNext = () => {
    onSelect(config.key, { documents });
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {finalTlDocumentsList?.map((document, index) => {
        return (
          <SelectDocument
            key={index}
            document={document}
            action={action}
            t={t}
            id={`tl-doc-${index}`}
            error={error}
            setError={setError}
            setDocuments={setDocuments}
            documents={documents}
            formData={formData}
            setFormError={setFormError}
            clearFormErrors={clearFormErrors}
            config={config}
            formState={formState}
          />
        );
      })}
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </div>
  );
};

function SelectDocument({
  t,
  document: doc,
  setDocuments,
  error,
  setError,
  documents,
  action,
  formData,
  setFormError,
  clearFormErrors,
  config,
  formState,
  fromRawData,
  key,
  id
}) {
  const filteredDocument = documents?.filter((item) => item?.documentType);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);
  const acceptFormat = doc?.documentType === "OWNERPHOTO"?".jpg,.png,.jpeg":".jpg,.png,.pdf,.jpeg"

  function selectfile(e, key) {
    e.target.files[0].documentType = key;
    setSelectedDocument({ documentType: key });
    setFile(e.target.files[0]);
  }

  const [isHidden, setHidden] = useState(false);

  const addError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (!type.includes(doc.documentType)) {
      type.push(doc.documentType);
      setFormError(config.key, { type });
    }
  };

  const removeError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (type.includes(doc?.documentType)) {
      type = type.filter((e) => e != doc?.documentType);
      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, { type });
      }
    }
  };

  useEffect(() => {
    if (selectedDocument?.documentType) {
      setDocuments((prev) => {
        const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.documentType);

        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
        if (selectedDocument?.id) {
          return [
            ...filteredDocumentsByFileStoreId,
            {
              documentType: selectedDocument?.documentType,
              fileStoreId: uploadedFile,
              tenantId: tenantId,
              id: selectedDocument?.id
            },
          ];
        } else {
          return [
            ...filteredDocumentsByFileStoreId,
            {
              documentType: selectedDocument?.documentType,
              fileStoreId: uploadedFile,
              tenantId: tenantId
            },
          ];
        }
      });
    }

    if (!isHidden) {
      const isRenewal = window.location.href.includes("renew-application-details");
      if (!isRenewal) {
        if (!uploadedFile || !selectedDocument?.documentType) {
          addError();
        } else if (uploadedFile && selectedDocument?.documentType) {
          removeError();
        }
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, isHidden]);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if(!(acceptFormat?.split(",")?.includes(`.${file?.type?.split("/")?.pop()}`)))
        {
          setError(t("PT_UPLOAD_FORMAT_NOT_SUPPORTED"));
        }
        else if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
          // if (!formState.errors[config.key]) setFormError(config.key, { type: doc?.code });
        } else {
          try {
            setUploadedFile(null);
            const response = await Digit.UploadServices.Filestorage("TL", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  useEffect(() => {
    if (doc && formData?.documents?.documents?.length > 0) {
      for (let i = 0; i < formData?.documents?.documents?.length; i++) {
        if (doc?.documentType === formData?.documents?.documents?.[i]?.documentType) {
          setSelectedDocument({ documentType: formData?.documents?.documents?.[i]?.documentType, id: formData?.documents?.documents?.[i]?.id });
          setUploadedFile(formData?.documents?.documents?.[i]?.fileStoreId);
        }
      }
    }
  }, [doc])
  return (
    <div style={{ marginBottom: "24px" }}>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {doc?.documentType != "OLDLICENCENO" ?
            `${t(`TL_NEW_${doc?.documentType.replaceAll(".", "_")}`)} * :` :
            `${t(`TL_NEW_${doc?.documentType.replaceAll(".", "_")}`)} :`}
        </CardLabel>
        <div className="field">
          <UploadFile
            id={id}
            onUpload={(e) => { selectfile(e, doc?.documentType.replaceAll(".", "_")) }}
            onDelete={() => {
              setUploadedFile(null);
            }}
            message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            textStyles={{ width: "100%" }}
            inputStyles={{ width: "280px" }}
            // disabled={enabledActions?.[action].disableUpload || !selectedDocument?.code}
            buttonType="button"
            accept={doc?.documentType === "OWNERPHOTO" ? "image/*,.jpg,.png" : "image/*,.jpg,.png,.pdf"}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default TLDocumentsEmployee;
