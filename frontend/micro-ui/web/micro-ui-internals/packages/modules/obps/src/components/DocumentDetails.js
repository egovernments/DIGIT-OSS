import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PDFSvg, Row } from "@egovernments/digit-ui-react-components";

const DocumentDetails = ({ documents }) => {
  const { t } = useTranslation();
  const [filesArray, setFilesArray] = useState(() => []);
  const [pdfFiles, setPdfFiles] = useState({});

  if (documents?.length == 0) {
    return <div style={{padding: "10px 0px"}}><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>
  }
  useEffect(() => {
    let acc = [];
    documents?.forEach((element, index, array) => {
      acc = [...acc, element];
    });
    setFilesArray(acc?.map((value) => value?.filestoreIdArray.map((val) => val)));
  }, [documents]);

  useEffect(() => {
    if (filesArray?.length) {
      Digit.UploadServices.Filefetch(filesArray, Digit.ULBService.getStateId()).then((res) => {
        setPdfFiles(res?.data);
      });
    }
  }, [filesArray]);

  return (
    <Fragment>
      {documents?.map((document, docIndex) => (
        <Fragment>
          <Row className="border-none" labelStyle={{ paddingTop: "10px", width: "100%" }} label={t(document?.title?.split('_')?.slice(0, 2).join('_'))} />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {document?.filestoreIdArray && document?.filestoreIdArray.map((filestoreId, index) =>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignContent: "center" }}>
                <a target="_blank" href={pdfFiles[filestoreId]?.split(",")[0]} style={{ minWidth: "100px", marginRight: "10px", maxWidth: "100px", height: "auto" }} key={index}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <PDFSvg />
                  </div>
                  <p style={{ marginTop: "8px", textAlign: "center", color: "#505A5F", fontWeight: "400", lineHeight: "19px", fontSize: "16px" }}>{t(document?.title)}</p>
                </a>
              </div>
            )}
          </div>
          {documents?.length != docIndex + 1 ? <hr style={{ color: "#D6D5D4", backgroundColor: "#D6D5D4", height: "2px", marginTop: "20px", marginBottom: "20px" }} /> : null}
        </Fragment>
      ))}
    </Fragment>
  );
}

export default DocumentDetails;