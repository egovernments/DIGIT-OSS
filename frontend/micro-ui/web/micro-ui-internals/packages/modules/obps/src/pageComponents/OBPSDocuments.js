import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink } from "../utils";

const PDFSvg = ({ width = 85, height = 100, viewBox="0 0 20 20", style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox} fill="gray">
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </svg>
);

function OBPSDocument({ value = {},Code,index, isNOC = false, svgStyles={width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }}) {
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
            return (
              <a target="_blank" href={documentLink} style={{ minWidth: "100px",marginRight:"10px" }} key={index}>
                <PDFSvg width={svgStyles?.width} height={svgStyles?.height} viewBox={svgStyles?.viewBox} style={{ background: "#f6f6f6", padding: "8px" }} />
                {/* <p style={{ marginTop: "8px",textAlign:"center" }}>{`${t(`ES_COMMON_DOC_DOCUMENT`)} - ${index + 1}`}</p> */}
                <p style={{ marginTop: "8px",textAlign:"center" }}>{document?.fileName ? document?.fileName :`${t(`ES_COMMON_DOC_DOCUMENT`)} - ${index + 1}`}</p>
              </a>
            );
          })}
        </div>
      </React.Fragment>
    </div>
  );
}

export default OBPSDocument;