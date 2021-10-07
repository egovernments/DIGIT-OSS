import React from 'react'
import {
  Card,
  CardCaption,
  CardHeader,
  CardText,
  LinkButton,
  DownloadImgIcon,
  ViewsIcon,
  //PDFDocumentIcon,
  PDFSvg
} from "@egovernments/digit-ui-react-components";
import { format } from 'date-fns';
import { getFileSize } from './engagement-doc-documents';
import { getFileUrl, openDocument } from './DesktopInbox';



const openDocumentLink = (link, title) => {
  const w = window.open('', '_blank');
  w.location = link;
  w.document.title = title;
}

/* const downloadDocument = async (filestoreId, title) => {
  const fileUrl = await getFileUrl(filestoreId);
  if(fileUrl){
    const anchorTag = document.createElement('a');
    anchorTag.href = fileUrl;
    anchorTag.download = title;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
  }
} */

const DocumentCard = ({ documentTitle, documentSize = 2.3, lastModifiedData, description, filestoreId, documentLink, t }) => {
  let isMobile = window.Digit.Utils.browser.isMobile();


  return (
    <div className={`notice_and_circular_main ${!isMobile ? 'gap-ten' : ""}`}>

      <div className="notice_and_circular_image" style={{ width: '100px' }}>
        <PDFSvg height={`${isMobile ? 80 : 100}`} width={`${isMobile ? 80 : 100}`} />
      </div>
      <div className="notice_and_circular_content">
        <div className="notice_and_circular_heading_mb">
          <CardHeader>{documentTitle}</CardHeader>
          {documentSize ? <CardCaption>{getFileSize(documentSize)}</CardCaption> : null}
        </div>
        <div className="notice_and_circular_caption">
          <CardCaption>{`${t(`CE_DCOUMENT_UPLOADED_ON`)} ${format(lastModifiedData, "eo MMMM yyyy")}`}</CardCaption>
        </div>
        <div className="notice_and_circular_text">
          <CardText>
            {description}
          </CardText>
        </div>
        <div className="view_download_main">
          <LinkButton

            label={
              <div className="views" onClick={() => openDocument(filestoreId ? filestoreId : documentLink, documentTitle)}>
                <ViewsIcon />
                <p>{t(`CE_DOCUMENT_VIEW_LINK`)}</p>
              </div>
            }
          />

          {documentLink && documentLink.length ?
            (<LinkButton

              label={
                <div className="views" onClick={() => openDocumentLink(documentLink, documentTitle)}>
                  <ViewsIcon />
                  <p>{t(`CE_DOCUMENT_OPEN_LINK`)}</p>
                </div>
              }
            />) : null
          }
          <LinkButton
            label={
              <div className="views download_views_padding" onClick={() => openDocument(filestoreId ? filestoreId : documentLink, documentTitle)} >
                <DownloadImgIcon />
                <p>{t(`CE_DOCUMENT_DOWNLOAD_LINK`)}</p>
              </div>
            }
          />
        </div>
      </div>

    </div>
  )
}

export default DocumentCard;
