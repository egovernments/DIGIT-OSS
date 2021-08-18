import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader } from "@egovernments/digit-ui-react-components";

const SelectDocuments = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);

  const { isLoading, data } = Digit.Hooks.pt.useMDMS(
    tenantId,
    "PT",
    "PROPERTY_TAX_DOCUMENTS",
    {},
    {
      details: {
        tenantId: "pb",
        moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "Documents" }] }],
      },
    }
  );

  const propertyTaxDocuments = data?.PropertyTax?.Documents;

  const goNext = () => {
    onSelect(config.key, { documents, propertyTaxDocumentsLength: propertyTaxDocuments?.length });
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {propertyTaxDocuments?.map((document, index) => (
        <SelectDocument key={index} document={document} t={t} error={error} setError={setError} setDocuments={setDocuments} documents={documents} />
      ))}
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </div>
  );
};

function SelectDocument({ t, document, setDocuments, error, setError, documents }) {
  const filteredDocument = documents?.filter((item) => item?.documentType?.includes(document?.code))[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState(
    filteredDocument
      ? { ...filteredDocument, active: filteredDocument?.status === "ACTIVE", code: filteredDocument?.documentType }
      : document?.dropdownData?.length === 1
      ? document?.dropdownData[0]
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

        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
        return [
          ...filteredDocumentsByFileStoreId,
          {
            documentType: selectedDocument?.code,
            fileStoreId: uploadedFile,
            documentUid: uploadedFile,
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
            const response = await Digit.UploadServices.Filestorage("PT", file, tenantId?.split(".")[0]);
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <div style={{ marginBottom: "24px" }}>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t(document?.code)}</CardLabel>
        <Dropdown
          className="form-field"
          selected={selectedDocument}
          disable={document?.dropdownData?.length === 0}
          option={document?.dropdownData}
          select={handleSelectDocument}
          optionKey="code"
          t={t}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller"></CardLabel>
        <div className="field">
          <UploadFile
            onUpload={selectfile}
            onDelete={() => {
              setUploadedFile(null);
            }}
            message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            textStyles={{ width: "100%" }}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default SelectDocuments;
