import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { pdfDocumentName, pdfDownloadLink } from "../utils";

const PDFSvg = ({ width = 20, height = 20, style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="gray">
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </svg>
);

function TLDocument({ value = {} }) {
  const { t } = useTranslation();
  const { isLoading, isError, error, data } = Digit.Hooks.tl.useTLDocumentSearch(
    {
      value,
    },
    { value }
  );
  let documents = window.location.href.includes("/tl/tradelicence/application/") ? value?.tradeLicenseDetail?.applicationDocuments : [];
  if(value?.workflowDocs) documents = value?.workflowDocs;
  if(value?.owners?.documents["ProofOfIdentity"]) documents.push(value.owners.documents["ProofOfIdentity"]);
  if(value?.owners?.documents["ProofOfOwnership"]) documents.push(value.owners.documents["ProofOfOwnership"]);
  if(value?.owners?.documents["OwnerPhotoProof"]) documents.push(value.owners.documents["OwnerPhotoProof"]);
  

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
              <a target="_" href={documentLink} style={{ minWidth: "100px",marginRight:"10px" }} key={index}>
                <PDFSvg width={85} height={100} style={{ background: "#f6f6f6", padding: "8px" }} />
                <p style={{ marginTop: "8px",textAlign:"center" }}>{value?.workflowDocs ? t(`${document?.documentType}`) : t(`TL_${document?.documentType}_LABEL`)}</p>
              </a>
            );
          })}
        </div>
      </React.Fragment>
    </div>
  );
}

export default TLDocument;
