import { Header, ActionBar, SubmitBar, PDFSvg, Menu, GenericFileIcon } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from "react-router-dom";
import Confirmation from '../Modal/Confirmation';
import { openUploadedDocument, openDocumentLink } from '../Documents/DesktopInbox';
import { format } from "date-fns";

const Actions = ['EDIT', 'DELETE']
const getUlbName = (tenantId) => {
    let ulbName = tenantId?.split('.')[1];
    ulbName = `${ulbName?.[0]?.toUpperCase()}${ulbName?.slice(1)} `;
    return ulbName;
}
const DocumentDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [displayMenu, setDisplayMenu] = useState(false);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { isLoading, data } = Digit.Hooks.events.useEventDetails(tenantId, { ids: id }, {
        /*select: (data) => {
            console.log({data})
           const details = [{
            title: "",
            asSectionHeader: true,
            values: [
              { title: "EVENTS_ULB_LABEL", value: data?.tenantId },
              { title: "EVENTS_NAME_LABEL", value: data?.name },
              { title: "PUBLIC_BRDCST_TITLE_LABEL", value: data?.description },
              { title: "EVENTS_FROM_DATE_LABEL", value: format(new Date(data?.eventDetails?.fromDate), 'dd/MM/yyyy') },
              { title: "EVENTS_TO_DATE_LABEL", value: format(new Date(data?.eventDetails?.toDate), 'dd/MM/yyyy') },
               { title: "CS_COMMON_DOCUMENTS", belowComponent: () => <DocumentDetails t={t} data={data?.eventDetails?.documents} documents={data?.uploadedFilesData?.data} /> }
            ]
          }]
          return {
            data,
        
          }
        }*/
      });

      function onActionSelect(action) {
        // setSelectedAction(action);
        if (action === "EDIT") {
          history.push(`/digit-ui/employee/engagement/messages/inbox/edit/${id}`)
        }
        if (action === "DELETE") {
          setShowModal(true);
        }
        setDisplayMenu(false);
      }

      const handleDelete = () => {
        const finalData = (({ uploadedFilesData, ...ogData }) => ogData)(data?.applicationData)
        const details = {
          events: [
            {
              ...finalData,
              status: "CANCELLED",
            },
          ],
        };
        history.push("/digit-ui/employee/engagement/messages/response?delete=true", details);
      };

    function onModalCancel() {
        setShowModal(false)
    }
    console.log({data})

    return (
        <div>
            {showModal ? <Confirmation
                t={t}
                docName={data?.applicationData?.name}
                closeModal={() => setShowModal(!showModal)}
                actionCancelLabel={'CS_COMMON_CANCEL'}
                actionCancelOnSubmit={onModalCancel}
                actionSaveLabel={'ES_COMMON_Y_DEL'}
                actionSaveOnSubmit={handleDelete}
            />

                : null}
            <Header>{t(`CS_HEADER_PUBLIC_BRDCST`)}</Header>
            <div className="notice_and_circular_main gap-ten">
                <div className="documentDetails_wrapper">
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t("EVENTS_ULB_LABEL")}:`}</p> <p>{getUlbName(data?.tenantId)}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t("PUBLIC_BRDCST_TITLE_LABEL")}:`}</p> <p>{data?.applicationData?.name}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t("EVENTS_FROM_DATE_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.fromDate ? format(new Date(data?.applicationData?.eventDetails?.fromDate), 'dd/MM/yyyy'):null}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t("EVENTS_TO_DATE_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.toDate ?  format(new Date(data?.applicationData?.eventDetails?.toDate), 'dd/MM/yyyy'):null}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t("EVENTS_COMMENTS_LABEL")}:`}</p> <p className="documentDetails__description">{data?.applicationData?.description?.length ? data?.applicationData?.description : 'NA'}</p> </div>
    
                    {data?.applicationData?.eventDetails?.documents.length ? <div className="documentDetails_pdf">
                        <span className="documentDetails_subheader">{`${t('CS_COMMON_DOCUMENTS')}`}</span>
                        <div style={{ width: '100px' }} onClick={() => openUploadedDocument(data?.applicationData?.eventDetails?.documents[0]?.filestoreId, data?.applicationData?.name)}>
                            <GenericFileIcon />
                        </div>

                    </div>
                        : null
                    }
                </div>
            </div>
            <ActionBar>
                {displayMenu ? (
                    <Menu
                        style={{ width: '240px' }}
                        localeKeyPrefix={"ES_CE"}
                        options={Actions}
                        t={t}
                        onSelect={onActionSelect}
                    />
                ) : null}
                <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
            </ActionBar>
        </div>
    )
}

export default DocumentDetails;
