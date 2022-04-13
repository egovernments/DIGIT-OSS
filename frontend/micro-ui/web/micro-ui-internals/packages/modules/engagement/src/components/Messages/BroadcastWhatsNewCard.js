import React from "react";
import { useTranslation } from "react-i18next";
import { openUploadedDocument, downloadDocument } from "../../utils";

const renderSingleViewAndDownloadButton = (t, documents) => {
  if (!documents?.length) return null;
  const { fileStoreId, fileName } = documents?.[0];
  return (
    <div className="display-flex-gap-2">
      {fileStoreId && fileStoreId.length ? (
        <span className="link" onClick={() => openUploadedDocument(fileStoreId, fileName)}>
          {" "}
          {t("CE_DOCUMENT_VIEW_LINK")}{" "}
        </span>
      ) : null}
      {fileStoreId && fileStoreId.length ? (
        <span className="link" onClick={() => downloadDocument(fileStoreId, fileName)}>
          {" "}
          {t("CE_DOCUMENT_DOWNLOAD_LINK")}{" "}
        </span>
      ) : null}
    </div>
  );
};

const renderMultipleViewAndDownloadButtons = (t, documents) => {
  if (!documents.length) return null;
  return (
    <div className="broadcastnotifications_actionswrapper-multi">
      {documents.map(({ fileName, fileStoreId }, index) => {
        return (
          <div className="display-flex-gap-2">
            {fileName.length ? <p>{fileName} : </p> : null}
            {fileStoreId.length ? (
              <span className="link" onClick={() => openUploadedDocument(fileStoreId, fileName)}>
                {" "}
                {t("CE_DOCUMENT_VIEW_LINK")}{" "}
              </span>
            ) : null}
            {fileStoreId.length ? (
              <span className="link" onClick={() => downloadDocument(fileStoreId, fileName)}>
                {" "}
                {t("CE_DOCUMENT_DOWNLOAD_LINK")}{" "}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const BroadcastWhatsNewCard = ({ header, actions, eventNotificationText, timePastAfterEventCreation, timeApproxiamationInUnits, ...props }) => {
  const { t } = useTranslation();
  const uploadedDocuments = props.eventDetails.documents;
  const getTransformedLocale = (label) => {
    if (typeof label === "number") return label;
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
  };

  return (
    <div className="WhatsNewCard">
      <h2>{t(header)}</h2>
      <p>{eventNotificationText}</p>
      {actions?.map((i) => (
        <a href={i?.actionUrl}>{`${t(`CS_COMMON_${getTransformedLocale(i?.code)}`)}`}</a>
      ))}
      {uploadedDocuments?.length > 1
        ? renderMultipleViewAndDownloadButtons(t, uploadedDocuments)
        : renderSingleViewAndDownloadButton(t, uploadedDocuments)}
      <p>{timePastAfterEventCreation + ` ${t(timeApproxiamationInUnits)}`}</p>
    </div>
  );
};

export default BroadcastWhatsNewCard;
