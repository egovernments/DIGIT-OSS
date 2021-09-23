import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Header,
  CardSectionHeader,
  StatusTable,
  Row,
  UploadFile,
  PDFSvg
} from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { convertEpochToDate } from "../../../utils";

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

const ApplicationOverview = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0]
  const [appDetails, setAppDetails] = useState({});
  const [showToast, setShowToast] = useState(null);

  const filteredDocument = {};
  const [uploadedFile,] = useState(() => filteredDocument?.fileStoreId || null);
  const [error, setError] = useState(null);
  const [nocTaxDocuments, setNocTaxDocuments] = useState([]);
  const [nocDatils, setNocDetails] = useState([]);
  const [nocDocumentTypeMaping, setNocDocumentTypeMaping] = useState([]);
  const [commonDocMaping, setCommonDocMaping] = useState([]);
  const [nocDocuments, setNocDocuments] = useState([]);
  const [pdfFiles, setPdfFiles] = useState({});
  const [filesArray, setFilesArray] = useState(() => [] );


  const { isLoading: nocDocsLoading, data: nocDocs } = Digit.Hooks.obps.useMDMS(state, "NOC", ["DocumentTypeMapping"]);
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(state, "common-masters", ["DocumentType"]);

  const { isLoading, data: applicationDetails } = Digit.Hooks.noc.useNOCDetails(t, tenantId, { applicationNo: id });

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.obps.useBPAREGApplicationActions(tenantId);

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "NOC",
  });

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    setNocDetails([applicationDetails?.applicationData]);
  }, [applicationDetails?.applicationData]);

  useEffect(() => {
    setNocDocumentTypeMaping(nocDocs?.NOC?.DocumentTypeMapping);
  }, [nocDocs]);

  useEffect(() => {
    setCommonDocMaping(commonDocs?.["common-masters"]?.DocumentType);
  }, [commonDocs]);

  useEffect(() => {
    if (nocDatils?.length && nocDocumentTypeMaping?.length) {
      let documents = [];
      nocDatils.map(noc => {
        const filteredData = nocDocumentTypeMaping.filter(data => (data?.applicationType === noc?.applicationType && data?.nocType === noc?.nocType))
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
      });

      let documentsList = [];
      if (documents && documents.length > 0) {
        documents.map(doc => {
          let code = doc.documentType;
          let nocType = doc.nocType;
          doc.dropdownData = [];
          commonDocMaping.forEach(value => {
            let values = value.code.slice(0, code.length);
            if (code === values) {
              doc.hasDropdown = true;
              doc.dropdownData.push(value);
            }
          });
          documentsList.push(doc);
        })
      }
      documentsList.forEach(data => {
        data.code = data.documentType;
        data.dropdownData.forEach(dpData => {
          dpData.i18nKey = dpData.code;
        })
      })
      setNocTaxDocuments(documentsList);
    }
  }, [nocDatils, nocDocumentTypeMaping, commonDocMaping]);

  useEffect(() => {
    debugger;
    let acc = [];
    nocDatils?.[0]?.documents?.forEach((element, index, array) => {
      acc.push(element?.fileStoreId)
    });
    setFilesArray(acc?.map((value) => value));
  }, [nocDatils?.[0]?.documents]);

  useEffect(() => {
    if (filesArray?.length) {
      Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId()).then((res) => {
        setPdfFiles(res?.data);
      });
    }
  }, [filesArray]);

  const DocumentDetails = ({ t, data, nocDataDetails, nocDocumentsList }) => {
    if (nocDataDetails?.length && nocDocumentsList?.length) {
      const status = nocDataDetails?.[0]?.applicationStatus;
      return (
        <Fragment>
          <div style={{
            border: "1px solid #D6D5D4",
            background: "#FAFAFA",
            boxSizing: "border-box",
            borderRadius: "4px",
            padding: "8px",
          }}>
            <CardSectionHeader style={{ marginBottom: "16px" }}>{`${t(`NOC_MAIN_${stringReplaceAll(nocDocumentsList?.[0]?.code, ".", "_")}_LABEL`)}:`}</CardSectionHeader>
            <StatusTable style={{ position: "relative", marginTop: "19px" }}>
              <Row className="border-none" label={`${t(`NOC_${nocDataDetails?.[0]?.nocType}_APPLICATION_LABEL`)}:`} text={t(nocDataDetails?.[0]?.applicationNo) || "NA"} />
              <Row className="border-none" label={`${t("NOC_STATUS_LABEL")}:`} text={status || "NA"} />
              <Row className="border-none" label={`${t("NOC_SUBMITED_ON_LABEL")}:`} text={nocDataDetails?.[0]?.additionalDetails?.SubmittedOn ? convertEpochToDate(Number(nocDataDetails?.[0]?.additionalDetails?.SubmittedOn)) : "NA"} />
              <Row className="border-none" label={`${t("NOC_APPROVAL_NO_LABEL")}:`} text={nocDataDetails?.[0]?.nocNo || "NA"} />
              <Row className="border-none" label={`${t("NOC_APPROVED_ON_LABEL")}:`} text={(status === "APPROVED" || status === "REJECTED" || status === "AUTO_APPROVED" || status === "AUTO_REJECTED") ? convertEpochToDate(Number(nocDataDetails?.[0]?.auditDetails?.lastModifiedTime)) : "NA"} />
              <Row className="border-none" label={`${t("Documents")}:`} text={""} />
            </StatusTable>
            { nocDataDetails?.[0]?.documents ? <div style={{ display: "flex", flexWrap: "wrap" }}>
              {nocDataDetails?.[0]?.documents?.map((value, index) => (
                <a target="_" href={pdfFiles[value.fileStoreId]?.split(",")[0]} style={{ minWidth: "160px", marginRight: "20px" }} key={index}>
                  <PDFSvg />
                  <p style={{ marginTop: "8px", fontWeight: "bold", textAlign: "center", width: "100px" }}>{t(value?.title ? value?.title : `DOCUMENT_${index}`)}</p>
                </a>
              ))}
            </div> : null }
            <div style={{ display: "flex", paddingBottom: "8px", marginBottom: "8px" }}>
              <h1 style={{ width: "40%", fontWeight: 700, paddingTop: "20px" }}>{`${t("NOC_UPLOAD_FILE_LABEL")}:`}</h1>
              <div style={{ width: "50%" }}>
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
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else return <div></div>
  }



  useEffect(() => {
    if (applicationDetails) {
      const { applicationDetails: details } = applicationDetails;
      setAppDetails({ ...applicationDetails, applicationDetails: [...details, { title: "NOC_DETAILS_SUMMARY_LABEL", belowComponent: () => <DocumentDetails t={t} data={applicationDetails} nocDataDetails={nocDatils} nocDocumentsList={nocTaxDocuments} /> }] })
    }
  }, [applicationDetails, nocTaxDocuments, nocDatils, uploadedFile, filesArray, pdfFiles]);

  console.log(applicationDetails, nocTaxDocuments, nocDatils, nocDocumentTypeMaping, commonDocMaping, "applicationDetailsapplicationDetailsapplicationDetailsapplicationDetails")

  return (
    <div >
      <div style={{ marginLeft: "15px" }}>
        <Header>{t("NOC_APP_OVER_VIEW_HEADER")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={appDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : applicationDetails?.applicationData?.businessService}
        moduleCode="BPAREG"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"WF_NEWTL_"}
      />
    </div>
  )
}

function SelectDocument({
  t,
  document: doc,
  setNocDocuments,
  error,
  setError,
  nocDocuments,
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
            console.error("Modal -> err ", err);
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <div >
      <UploadFile
        id={"noc-doc"}
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => { setUploadedFile(null); }}
        message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
        error={error}
      />
    </div>
  );
}

export default ApplicationOverview;