import { Loader, PDFSvg } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink, getDocumentsName } from "../utils";

function OBPSDocument({ value = {},Code,index, isNOC = false, svgStyles={width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }, isStakeHolder=false}) {
  const { t } = useTranslation();
  const { isLoading, isError, error, data } = Digit.Hooks.obps.useOBPSDocumentSearch(
    {
      value,
    },
    { value }, Code, index, isNOC
  );
  let documents = [];

  if(isNOC){
    value?.nocDocuments ? value?.nocDocuments?.nocDocuments.length>0 && value?.nocDocuments?.nocDocuments.filter((ob) => ob?.documentType?.includes(Code)).map((ob) => {
      documents.push(ob);
    }) : value?.length>0 && value?.filter((ob) => ob?.documentType?.includes(Code)).map((ob) => {
      documents.push(ob);
    });
  }
  else{
  value?.documents ? value?.documents?.documents.filter(doc => doc?.documentType?.includes(Code)).map((ob)=>{
    documents.push(ob);
  }) : value.filter(doc => doc?.documentType?.includes(Code)).map((ob)=>{
    documents.push(ob);
  })
}
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{ marginTop: "19px" }}>
      <React.Fragment>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {documents?.map((document, index) => {
            let documentLink = pdfDownloadLink(data.pdfFiles, document?.fileStoreId);
            // let documentName = getDocumentsName(data.pdfFiles, document?.fileStoreId);
            return (
              <a target="_blank" href={documentLink} style={{ minWidth: "100px",marginRight:"10px" }} key={index}>
                <PDFSvg width={svgStyles?.width} height={svgStyles?.height} viewBox={svgStyles?.viewBox} style={{ background: "#f6f6f6", padding: "8px" }} />
                {/* <p style={{ marginTop: "8px",textAlign:"center" }}>{`${t(`ES_COMMON_DOC_DOCUMENT`)} - ${index + 1}`}</p> */}
                {isStakeHolder ? <p style={{ marginTop: "8px",textAlign:"center" }}>{document?.fileName ? `${document?.fileName}` : `${t(`ES_COMMON_DOC_DOCUMENT`)} - ${index + 1}`}</p>: null}
                {!isStakeHolder ? <p style={{ marginTop: "8px",textAlign:"center" }}>{`${t(Code)}`}</p>: null}
              </a>
            );
          })}
        </div>
      </React.Fragment>
    </div>
  );
}

export default OBPSDocument;