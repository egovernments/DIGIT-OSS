import React from 'react'
import {
  Card,
  CardCaption,
  CardHeader,
  CardText,
  LinkButton,
  DownloadImgIcon,
  ViewsIcon,
  ExternalLinkIcon,
  GenericFileIcon,
  PDFSvg
} from "@egovernments/digit-ui-react-components";
import { format } from 'date-fns';
import { getFileSize } from './engagement-doc-documents';
import { getFileUrl, openUploadedDocument, openDocumentLink } from './DesktopInbox';

const downloadDocument = async (filestoreId, title) => {
  if (!filestoreId || !filestoreId.length) { alert('No Document exists!'); return; }

  const fileUrl = await getFileUrl(filestoreId);
  if (fileUrl) {
    Digit.Utils.downloadPDFFromLink(fileUrl);
  }else{
    console.error("Invalid Filestoreid or no file found to download");
  }
}

const DocumentCard = ({ documentTitle, documentSize = 2.3, lastModifiedData, description, filestoreId, documentLink, t }) => {
  let isMobile = window.Digit.Utils.browser.isMobile();


  return (
    <div className={`notice_and_circular_main ${!isMobile ? 'gap-ten' : ""}`}>

      <div className="notice_and_circular_image" style={{ width: '100px' }}>
        <GenericFileIcon height={`${isMobile ? 80 : 100}`} width={`${isMobile ? 80 : 100}`} />
      </div>
      <div className="notice_and_circular_content">
        <div className="notice_and_circular_heading_mb">
          <CardHeader>{documentTitle}</CardHeader>
          {documentSize ? <CardCaption>{getFileSize(documentSize)}</CardCaption> : null}
        </div>
        <div className="notice_and_circular_caption">
          <CardCaption>{`${t(`CE_DCOUMENT_UPLOADED_ON`)} ${lastModifiedData ? format(new Date(lastModifiedData), "do MMMM yyyy") : "-"}`}</CardCaption>
        </div>
        <div className="notice_and_circular_text">
          <CardText>
            {description}
          </CardText>
        </div>
        <div className="view_download_main">
          {filestoreId && filestoreId.length ? <LinkButton

            label={
              <div className="views" onClick={() => openUploadedDocument(filestoreId ? filestoreId : null, documentTitle)}>
                <ViewsIcon />
                <p>{t(`CE_DOCUMENT_VIEW_LINK`)}</p>
              </div>
            }
          /> : null
          }
          {documentLink && documentLink.length ?
            (<LinkButton

              label={
                <div className="views" onClick={() => openDocumentLink(documentLink, documentTitle)}>
                  <ExternalLinkIcon />
                  <p>{t(`CE_DOCUMENT_OPEN_LINK`)}</p>
                </div>
              }
            />) : null
          }
          {filestoreId && filestoreId.length ?
            <LinkButton
              label={
                <div className="views download_views_padding" >
                  <DownloadImgIcon />
                  <p>{t(`CE_DOCUMENT_DOWNLOAD_LINK`)}</p>
                </div>
              }
              onClick={() => downloadDocument(filestoreId ? filestoreId : null, documentTitle)}
            /> : null
          }
        </div>
      </div>

    </div>
  )
}

export default DocumentCard;
