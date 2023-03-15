import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader, PDFSvg } from "@egovernments/digit-ui-react-components";

// const PDFSvg = ({ width = 34, height = 34, style, viewBox = "0 0 34 34" }) => (
//   <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox} fill="gray">
//     <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
//   </svg>
// );

function PropertyDocuments({ documents, svgStyles = {}, isSendBackFlow=false }) {
  const { t } = useTranslation();
  const [filesArray, setFilesArray] = useState(() => [] );
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pdfFiles, setPdfFiles] = useState({});

  useEffect(() => {
    let acc = [];
    documents?.forEach((element, index, array) => {
      acc = [...acc, ...(element.values?element.values:[])];
    });
    setFilesArray(acc?.map((value) => value?.fileStoreId));
  }, [documents]);

  useEffect(() => {
     if (filesArray?.length && documents?.[0]?.BS === "BillAmend") {
      Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getCurrentTenantId()).then((res) => {
        setPdfFiles(res?.data);
      });
    }
    else if(filesArray?.length)
   { 
     Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId()).then((res) => {
      setPdfFiles(res?.data);
     });
    }
    
  }, [filesArray]);

  const checkLocation = window.location.href.includes("employee/tl") || window.location.href.includes("/obps") || window.location.href.includes("employee/ws");
  const isStakeholderApplication = window.location.href.includes("stakeholder");

  return (
    <div style={{ marginTop: "19px" }}>
      {!isStakeholderApplication && documents?.map((document, index) => (
        <React.Fragment key={index}>
          {document?.title ? <CardSubHeader style={checkLocation ? { marginTop: "32px", marginBottom: "18px", color: "#0B0C0C, 100%", fontSize: "24px", lineHeight: "30px" } : { marginTop: "32px", marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(document?.title)}</CardSubHeader>: null}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
            {document?.values && document?.values.length>0 ? document?.values?.map((value, index) => (
              <a target="_" href={pdfFiles[value.fileStoreId]?.split(",")[0]} style={{ minWidth: "80px", marginRight: "10px", maxWidth: "100px", height: "auto" }} key={index}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PDFSvg />
                </div>
                <p style={checkLocation ? { marginTop: "8px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F", textAlign: "center" } : { marginTop: "8px", fontWeight: "bold" }}>{t(value?.title)}</p>
               {isSendBackFlow? value?.documentType?.includes("NOC")?<p style={{textAlign:"center"}}>{t(value?.documentType.split(".")[1])}</p> :<p style={{textAlign:"center"}}>{t(value?.documentType)}</p>:""}
              </a>
            )):!(window.location.href.includes("citizen"))&& <div><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>}
          </div>
        </React.Fragment>
      ))}
      {isStakeholderApplication && documents?.map((document, index) => (
        <React.Fragment key={index}>
          {document?.title ? <CardSubHeader style={{ marginTop: "32px", marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(document?.title)}</CardSubHeader> : null} 
          <div>
            {document?.values && document?.values.length>0 ? document?.values?.map((value, index) => (
              <a target="_" href={pdfFiles[value.fileStoreId]?.split(",")[0]} style={{ minWidth: svgStyles?.minWidth ? svgStyles?.minWidth : "160px", marginRight: "20px" }} key={index}>
                <div  style={{maxWidth: "940px", padding: "8px", borderRadius: "4px", border: "1px solid #D6D5D4", background: "#FAFAFA"}}>
                  <p style={{ marginTop: "8px", fontWeight: "bold", marginBottom: "10px" }}>{t(value?.title)}</p>
                  {value?.docInfo ? <div style={{fontSize: "12px", color: "#505A5F", fontWeight: 400, lineHeight: "15px", marginBottom: "10px"}}>{`${t(value?.docInfo)}`}</div> : null}
                  <PDFSvg />
                  {/* <div>{decodeURIComponent(pdfFiles[value.fileStoreId]?.split(",")[0].split("?")[0].split("/").pop().slice(13))}</div> */}
                  <p style={{ marginTop: "8px", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{`${t(value?.title)}`}</p> 
                </div>
              </a>
            )):!(window.location.href.includes("citizen"))&& <div><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default PropertyDocuments;
