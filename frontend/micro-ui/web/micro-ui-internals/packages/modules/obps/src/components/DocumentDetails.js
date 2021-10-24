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
    setFilesArray(acc?.map((value) => value?.fileStoreId));
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
          <Row label={t(document?.title)} />
          <a target="_" href={pdfFiles[document.fileStoreId]?.split(",")[0]}>
            <PDFSvg style={{background: "#f6f6f6", padding: "8px" }} width="100px" height="100px" viewBox="0 0 25 25" minWidth="100px" />
          </a>
        </Fragment>
      ))}
    </Fragment>
  );
}

export default DocumentDetails;