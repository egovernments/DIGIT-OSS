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

const DocumentCard = ({ documentTitle, documentSize = 2.3, lastModifiedData, description, documentLink, t }) => {
  return (
    <div className="notice_and_circular_main">

      <div className="notice_and_circular_image" style={{ width: '100px' }}>
      <PDFSvg height={100} width={100}/>
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
              <div className="views">
                <ViewsIcon />
                <p>{t(`CE_DOCUMENT_VIEW_LINK`)}</p>
              </div>
            }
          />
          <LinkButton
            label={
              <div className="views download_views_padding">
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
