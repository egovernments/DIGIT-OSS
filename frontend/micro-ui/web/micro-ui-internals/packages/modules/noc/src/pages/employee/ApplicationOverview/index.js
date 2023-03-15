import {
  CardSectionHeader, Header, MultiUploadWrapper, PDFSvg, Row, StatusTable, LabelFieldPair, CardLabel, Loader
} from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { convertEpochToDate, stringReplaceAll } from "../../../utils";

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
  const [filesArray, setFilesArray] = useState(() => []);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const isMobile = window.Digit.Utils.browser.isMobile();


  const { isLoading: nocDocsLoading, data: nocDocs } = Digit.Hooks.obps.useMDMS(state, "NOC", ["DocumentTypeMapping"]);
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(state, "common-masters", ["DocumentType"]);

  const { isLoading, data: applicationDetails } = Digit.Hooks.noc.useNOCDetails(t, tenantId, { applicationNo: id });

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.noc.useNOCApplicationActions(tenantId);


  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "NOC",
  });

  if (workflowDetails?.data?.actionState?.nextActions && !workflowDetails.isLoading)
    workflowDetails.data.actionState.nextActions = [...workflowDetails?.data?.nextActions];

  if (workflowDetails && workflowDetails.data && !workflowDetails.isLoading){
      workflowDetails.data.initialActionState=workflowDetails?.data?.initialActionState||{...workflowDetails?.data?.actionState}||{} ;
      workflowDetails.data.actionState = { ...workflowDetails.data };
  }
  
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
    sessionStorage.setItem("NewNOCDocs", JSON.stringify(nocDocuments));
  }, [nocDocuments]);

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
    if (nocDataDetails?.length && nocDocumentsList?.length && nocDataDetails?.[0] != undefined) {
      const status = `WF_${nocDataDetails?.[0]?.additionalDetails.workflowCode}_${nocDataDetails?.[0]?.applicationStatus}`;
      return (
        <Fragment>
          <div style={{
            border: "1px solid #D6D5D4",
            background: "#FAFAFA",
            boxSizing: "border-box",
            borderRadius: "4px",
            padding: "8px",
            maxWidth: "950px",
            minWidth: "280px"
          }}>
            <CardSectionHeader style={{ marginBottom: "16px", fontSize: "20px" }}>{`${t(`NOC_MAIN_${stringReplaceAll(nocDocumentsList?.[0]?.code, ".", "_")}_LABEL`)}`}</CardSectionHeader>
            <StatusTable style={{ position: "relative", marginTop: "19px" }}>
              <Row className="border-none" label={`${t(`NOC_${nocDataDetails?.[0]?.nocType}_APPLICATION_LABEL`)}`} text={t(nocDataDetails?.[0]?.applicationNo) || "NA"} />
              <Row className="border-none" label={`${t("NOC_STATUS_LABEL")}`} text={t(status) || "NA"} textStyle={nocDataDetails?.[0]?.applicationStatus == "APPROVED" || nocDataDetails?.[0]?.applicationStatus == "AUTO_APPROVED" ? {color : "#00703C"} : {color: "#D4351C"}}/>
              <Row className="border-none" label={`${t("NOC_SUBMITED_ON_LABEL")}`} text={nocDataDetails?.[0]?.additionalDetails?.SubmittedOn ? convertEpochToDate(Number(nocDataDetails?.[0]?.additionalDetails?.SubmittedOn)) : "NA"} />
              <Row className="border-none" label={`${t("NOC_APPROVAL_NO_LABEL")}`} text={nocDataDetails?.[0]?.nocNo || "NA"} />
              <Row className="border-none" label={`${t("NOC_APPROVED_ON_LABEL")}`} text={(status === "APPROVED" || status === "REJECTED" || status === "AUTO_APPROVED" || status === "AUTO_REJECTED") ? convertEpochToDate(Number(nocDataDetails?.[0]?.auditDetails?.lastModifiedTime)) : "NA"} />
              <Row className="border-none" label={`${t("Documents")}`} text={""} /> 
            </StatusTable>
            {nocDataDetails?.[0]?.documents && nocDataDetails?.[0]?.documents.length>0 ? 
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
              {nocDataDetails?.[0]?.documents?.map((value, index) => (
                <a target="_" href={pdfFiles[value.fileStoreId]?.split(",")[0]} style={{ minWidth: "80px", marginRight: "10px", maxWidth: "100px", height: "auto" }} key={index}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                      <PDFSvg />
                    </div>
                  <p style={{ marginTop: "8px", fontWeight: "bold", textAlign: "center", width: "100px", color: "#505A5F" }}>{t(`NOC_MAIN_${stringReplaceAll(nocDocumentsList?.[0]?.code, ".", "_")}_LABEL`)/* t(value?.title ? value?.title : decodeURIComponent( pdfFiles[value.fileStoreId]?.split(",")?.[0]?.split("?")?.[0]?.split("/")?.pop()?.slice(13))) */}</p>
                </a>
              ))}
            </div> : <div><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>}
              <div>
                {workflowDetails?.data?.nextActions?.length > 0 ? nocTaxDocuments?.map((document, index) => {
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
                }) : null}
              </div>
          </div>
        </Fragment>
      );
    } else return <Loader />
  }
  const getBuldingComponent = (details = []) => details.map(detail => ({
    title: detail.title, belowComponent: () => <Fragment>
      <div style={{maxWidth: "950px"}}>
      <StatusTable style={{ position: "relative", marginTop: "19px" }}>
        {detail.values.map(value => <Row className="border-none" label={`${t(value?.title)}`} text={value?.value || "NA"} />
        )}
      </StatusTable>
      </div>
    </Fragment>
  }))


  useEffect(() => {
    if (applicationDetails) {
      setIsDetailsLoading(true);
      const { applicationDetails: details } = applicationDetails;
      setAppDetails({ ...applicationDetails, applicationDetails: [getBuldingComponent(details)?.[0], { title: "NOC_DETAILS_SUMMARY_LABEL", belowComponent: () => <DocumentDetails t={t} data={applicationDetails} nocDataDetails={nocDatils} nocDocumentsList={nocTaxDocuments} /> }] })
      setIsDetailsLoading(false);
    }
  }, [applicationDetails, nocTaxDocuments, nocDatils, uploadedFile, filesArray, pdfFiles]);

  return (
    <div className={"employee-main-application-details"}>
      <div>
        <Header styles={{fontSize: "32px"}}>{t("NOC_APP_OVER_VIEW_HEADER")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={appDetails}
        isLoading={isLoading || isDetailsLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : applicationDetails?.applicationData?.businessService}
        moduleCode="NOC"
        ActionBarStyle={isMobile?{}:{paddingRight:"50px"}}
        MenuStyle={isMobile?{}:{right:"50px"}}
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={`WF_${applicationDetails?.applicationData?.additionalDetails?.workflowCode}_`}
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
  const tenantId = Digit.ULBService.getStateId(); //Digit.ULBService.getCurrentTenantId(doc);
  const [selectedDocument, setSelectedDocument] = useState(doc?.dropdownData?.[0]);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

  const handleSelectDocument = (value) => setSelectedDocument(value);

  const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf)$/i;

  function selectfile(e) {
    e && setFile(e.file);
  }

  useEffect(() => {
    if (selectedDocument?.code) {
      setNocDocuments((prev) => {
        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return prev;
        }

        const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile);
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

  const getData = (state) => {
    let data = Object.fromEntries(state);
    let newArr = Object.values(data);
    let nocNewDocs = newArr && newArr?.map((fileObject) => {return({
      documentType: selectedDocument?.code,
      fileStoreId: fileObject?.fileStoreId?.fileStoreId,
      documentUid: fileObject?.fileStoreId?.fileStoreId,
      fileName: fileObject?.file?.name || "",
    })})
    sessionStorage.setItem("NewNOCDocs", JSON.stringify(nocNewDocs));
    selectfile(newArr[newArr.length - 1]);
  }

  return (
    <div >
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={{fontWeight: "700", width: "50%"}}>{`${t("NOC_UPLOAD_FILE_LABEL")}`}</CardLabel>
        <div className="field">
          <MultiUploadWrapper
            module="NOC"
            tenantId={tenantId}
            getFormState={e => getData(e)}
            t={t}
            allowedFileTypesRegex={allowedFileTypes}
            allowedMaxSizeInMB={5}
            acceptFiles= "image/*, .pdf, .png, .jpeg, .jpg"
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default ApplicationOverview;