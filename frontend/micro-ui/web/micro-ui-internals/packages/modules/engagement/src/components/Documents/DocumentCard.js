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
import { getFileSize } from '../../utils';
import { downloadDocument, openDocumentLink, openUploadedDocument } from '../../utils';


const DocumentCard = ({ documentTitle, documentSize = 2.3, lastModifiedData, description, filestoreId, documentLink, t }) => {
  let isMobile = window.Digit.Utils.browser.isMobile();


  return (
    <div className="notice_and_circular_main">
      <div className="notice_and_circular_image">
        <GenericFileIcon height={`${isMobile ? 66 : 100}`} width={`${isMobile ? 53 : 100}`} />
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
            {description?.length ? description : "NA"}
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
