import React, { useEffect, useState } from "react";
import {
  CardLabel,
  Dropdown,
  UploadFile,
  Toast,
  Loader,
  FormStep,
  StatusTable,
  Row
} from "@egovernments/digit-ui-react-components";
import PropertyDocuments from "./PropertyDocuments";

function SelectDocument({
  t,
  document: doc,
  setNocDocuments,
  error,
  setError,
  nocDocuments,
  setCheckRequiredFields
}) {

  const filteredDocument = nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const tenantId = Digit.ULBService.getCurrentTenantId(doc);
  const [selectedDocument, setSelectedDocument] = useState(doc?.dropdownData?.[0]);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

  const handleSelectDocument = (value) => setSelectedDocument(value);

  function selectfile(e) {
      setFile(e.target.files[0]);
  }

  useEffect(() => {
      if (selectedDocument?.code) {
          setNocDocuments((prev) => {
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
                      const response = await Digit.UploadServices.Filestorage("PT", file, Digit.ULBService.getStateId());
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

  return (
      <div style={{ border: "1px solid #D6D5D4", padding: "16px 0px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px" }}>
        <UploadFile
            id={"noc-doc"}
            extraStyleName={"propertyCreate"}
            accept=".jpg,.png,.pdf"
            onUpload={selectfile}
            onDelete={() => {
                setUploadedFile(null);
                // setCheckRequiredFields(true);
            }}
            message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
            error={error}
        />
      </div>
  );
}
const NOCDocuments = ({ t, noc, docs, isNoc, applicationData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { isLoading: nocDocsLoading, data: nocDocs } = Digit.Hooks.obps.useMDMS(stateId, "NOC", ["DocumentTypeMapping"], { enabled: isNoc });
  const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"], { enabled: !isNoc });
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);
  const [commonDocMaping, setCommonDocMaping] = useState([]);
  const [nocTaxDocuments, setNocTaxDocuments] = useState([]);
  const [nocDocuments, setNocDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCommonDocMaping(commonDocs?.["common-masters"]?.DocumentType);
  }, [commonDocs]);

  useEffect(() => {
    let documents = [];
    let filteredData
    if (isNoc) {
      filteredData = nocDocs?.NOC?.DocumentTypeMapping?.filter((data => {
        return data?.applicationType === noc?.applicationType && data?.nocType === noc?.nocType
      }));
    }
    else {
      filteredData = bpaDocs?.BPA?.DocTypeMapping?.filter(data => (data.WFState == applicationData?.status && data.RiskType == applicationData?.riskType && data.ServiceType == applicationData?.additionalDetails?.serviceType && data.applicationType == applicationData?.additionalDetails?.applicationType))
    }
    if (filteredData?.[0]?.docTypes?.[0]) {
      filteredData[0].docTypes[0].nocType = filteredData[0].nocType;
      filteredData[0].docTypes[0].additionalDetails = {
          submissionDetails: noc.additionalDetails,
          applicationStatus: noc.applicationStatus,
          appNumberLink: noc.applicationNo,
          nocNo: noc.nocNo
      }
      documents.push(filteredData[0].docTypes[0]);
    }
    let documentsList = [];
    if (documents && documents.length > 0) {
      documents.map((doc) => {
        let code = doc.documentType;
        let nocType = doc.nocType;
        doc.dropdownData = [];
        commonDocMaping?.forEach((value) => {
          let values = value.code.slice(0, code.length);
          if (code === values) {
            doc.hasDropdown = true;
            doc.dropdownData.push(value);
          }
        });
        documentsList.push(doc);
      });
      setNocTaxDocuments(documentsList);
    }
  }, [nocDocs, commonDocMaping]);

  return (
    <div>
      <PropertyDocuments documents={docs} />
      {nocTaxDocuments?.map((document, index) => {
        return (
          <SelectDocument
            key={index}
            document={document}
            t={t}
            error={error}
            setError={setError}
            setNocDocuments={setNocDocuments}
            nocDocuments={nocDocuments}
            // setCheckRequiredFields={setCheckRequiredFields}
          />
        );
      })}
    </div>
  );
}

export default NOCDocuments;