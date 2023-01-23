import React, { useEffect, useState } from "react";
import {
  CardLabel,
  MultiUploadWrapper,
  StatusTable,
  Row,
  LabelFieldPair
} from "@egovernments/digit-ui-react-components";
import DocumentsPreview from "./DocumentsPreview";

function SelectDocument({
  t,
  document: doc,
  setNocDocuments,
  setError,
  nocDocuments
}) {
  const filteredDocument = nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const tenantId = Digit.ULBService.getStateId();
  const [selectedDocument, setSelectedDocument] = useState();
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);
  const handleSelectDocument = (value) => setSelectedDocument(value);
  const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf)$/i;

  function selectfile(e) {
    e && setFile(e.file);
  }

  useEffect(() => {
      if (doc?.dropdownData?.[0]?.code) {
          setNocDocuments((prev) => {
              const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== doc?.dropdownData?.[0]?.code);

              if (uploadedFile?.length === 0 || uploadedFile === null) {
                  return filteredDocumentsByDocumentType;
              }

              const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
              return [
                  ...filteredDocumentsByFileStoreId,
                  {
                      documentType: doc?.dropdownData?.[0].code,
                      fileStoreId: uploadedFile,
                      documentUid: uploadedFile,
                      fileName: file?.name || "",
                  },
              ];
          });
      }
  }, [uploadedFile]);


  useEffect(() => {
      (async () => {
          setError(null);
          if (file) {
              const allowedFileTypesRegex = /(.*?)(jpg|jpeg|png|image|pdf)$/i
              if (file.size >= 5242880) {
                setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else if (file?.type && !allowedFileTypesRegex.test(file?.type)) {
                setError(t(`NOT_SUPPORTED_FILE_TYPE`))
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

  const getData =(state) => {
    let data = Object.fromEntries(state);
    let newArr = Object.values(data);
    selectfile(newArr[newArr.length-1]);
  }

  return (
      <div style={{/*  border: "1px solid #D6D5D4", padding: "16px 0px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px", display: "flex" */ }}>
        <LabelFieldPair style={{width: "98%", marginRight: "10px"}}>
          <CardLabel style={{width: "100%"}}>{doc?.required ? `${t("TL_BUTTON_UPLOAD FILE")}*` : `${t("TL_BUTTON_UPLOAD FILE")}`}</CardLabel>
          <div className="field" style={{width: "100%"}}>
            <MultiUploadWrapper
              module="NOC"
              tenantId={tenantId}
              getFormState={e => getData(e)}
              t={t}
              allowedFileTypesRegex={allowedFileTypes}
              allowedMaxSizeInMB={5}
              acceptFiles="image/*, .pdf, .png, .jpeg, .jpg"
            />
          </div>
        </LabelFieldPair>
      </div>
  );
}
const NOCDocuments = ({ t, noc, docs, isNoc, applicationData,NOCdata, bpaActionsDetails }) => {
  const tenantId = Digit.ULBService.getStateId();
  const stateId = Digit.ULBService.getStateId();
  const bpaApplicationStatus = applicationData?.status || "";
  const actions = bpaActionsDetails?.data?.nextActions || [];
  const { isLoading: nocDocsLoading, data: nocDocs } = Digit.Hooks.obps.useMDMS(stateId, "NOC", ["DocumentTypeMapping"], { enabled: isNoc });
  const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"], { enabled: !isNoc });
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);
  const [commonDocMaping, setCommonDocMaping] = useState([]);
  const [nocTaxDocuments, setNocTaxDocuments] = useState([]);
  const [checkEnablingDocs, setCheckEnablingDocs] = useState(false);
  const [nocDocuments, setNocDocuments] = Digit.Hooks.useSessionStorage(noc?.nocType, []);
  const [error, setError] = useState(null);
  const isEmployee = window.location.href.includes("/employee/")

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
          submissionDetails: noc?.additionalDetails,
          applicationStatus: noc?.applicationStatus,
          appNumberLink: noc?.applicationNo,
          nocNo: noc?.nocNo
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
          let values = value.code.slice(0, code?.length);
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

  useEffect(() => {
    if (bpaApplicationStatus === 'NOC_VERIFICATION_INPROGRESS' && actions?.length > 0) setCheckEnablingDocs(true);
    else setCheckEnablingDocs(false);
  }, [applicationData, bpaActionsDetails])

  return (
    <div style={{ border: "1px solid #D6D5D4", padding: "16px 0px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px", maxWidth:"950px"/*  display: "flex" */ }}>
      <StatusTable>
      <Row label={isEmployee ? `${t(`BPA_${noc?.nocType}_HEADER`)}` : t(`BPA_${noc?.nocType}_HEADER`)} labelStyle={{fontSize: "20px",width:"150%"}}/>
      {NOCdata && NOCdata.map((noc,index) => {
        if (noc?.value) {
          if (noc?.field == "STATUS") {
            return <Row className="border-none"  label={isEmployee ? `${t(noc?.title)}` : t(noc?.title)} text={noc?.value?t(noc?.value):t("CS_NA")} textStyle = {(noc?.value == "APPROVED" || noc?.value == "AUTO_APPROVED") ? {color: "#00703C"} : {color : "#D4351C"}}/>
          } else {
            return <Row className="border-none"  label={isEmployee ? `${t(noc?.title)}` : t(noc?.title)} text={noc?.value?t(noc?.value):t("CS_NA")} />
          }
        }
      })}
      </StatusTable>
      <DocumentsPreview documents={docs} svgStyles={{ width: "80px", height: "100px", viewBox: "0 0 25 25", minWidth: "80px" }}/>
      {checkEnablingDocs && nocTaxDocuments?.map((document, index) => {
        return (
          <SelectDocument
            key={index}
            document={document}
            t={t}
            error={error}
            setError={setError}
            setNocDocuments={setNocDocuments}
            nocDocuments={nocDocuments}
            checkEnablingDocs={checkEnablingDocs}
          />
        );
      })}
    </div>
  );
}

export default NOCDocuments;