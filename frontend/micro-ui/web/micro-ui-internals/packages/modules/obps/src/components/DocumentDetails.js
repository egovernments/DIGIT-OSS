import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PDFSvg, Row } from "@egovernments/digit-ui-react-components";

const DocumentDetails = ({ documents }) => {
  const { t } = useTranslation();
  const [filesArray, setFilesArray] = useState(() => [] );
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pdfFiles, setPdfFiles] = useState({});
  useEffect(() => {
    let acc = [];
    documents?.forEach((element, index, array) => {
      acc = [...acc, element];
    });
    setFilesArray(acc?.map((value) => value?.filestoreIdArray.map((val) => val)));
  }, [documents]);

  useEffect(() => {
    if(filesArray?.length)
   { 
     Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId()).then((res) => {
      setPdfFiles(res?.data);
     });
    }
  }, [filesArray]);

  return (
    <Fragment>
      {documents?.map(document => (
        <Fragment>
        <Row labelStyle={{paddingTop:"10px",width:"100%"}} label={t(document?.title)} />
        <div style={{ display: "flex", flexWrap: "wrap" }}>
        {document?.filestoreIdArray && document?.filestoreIdArray.map((filestoreId,index) => 
          <a target="_" href={pdfFiles[filestoreId]?.split(",")[0]} style={{ minWidth: "100px",marginRight:"10px" }} key={index}>
          <PDFSvg style={{background: "#f6f6f6", padding: "8px" }} width="100px" height="100px" viewBox="0 0 25 25" minWidth="100px" />
          <p style={{ marginTop: "8px",textAlign:"center" }}>{`${t(`ES_COMMON_DOC_DOCUMENT`)} - ${index + 1}`}</p>
        </a>
        )  
        }
        </div>
        </Fragment>
      ))}
    </Fragment>
  );
}

export default DocumentDetails;