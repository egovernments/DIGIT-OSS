import { Header, ActionBar, SubmitBar, PDFSvg, Menu, GenericFileIcon, Loader } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from "react-router-dom";
import Confirmation from '../Modal/Confirmation';
import { format } from "date-fns";
import { openUploadedDocument } from '../../utils';

const Actions = ['EDIT', 'DELETE']
const getUlbName = (tenantId) => {
  let ulbName = tenantId?.split('.')[1];
  ulbName = `${ulbName?.[0]?.toUpperCase()}${ulbName?.slice(1)} `;
  return ulbName;
}
const DocumentDetails = () => {
  let isMobile = window.Digit.Utils.browser.isMobile();
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data } = Digit.Hooks.events.useEventDetails(tenantId, { ids: id }, {
  });

  function onActionSelect(action) {
    // setSelectedAction(action);
    if (action === "EDIT") {
      history.push(`/digit-ui/employee/engagement/event/edit-event/${id}`)
    }
    if (action === "DELETE") {
      setShowModal(true);
    }
    setDisplayMenu(false);
  }

  const handleDelete = () => {
    const details = {
        events: [
          {
            ...data?.applicationData,
            status: "CANCELLED",
          },
        ],
      };
      history.push("/digit-ui/employee/engagement/event/response?delete=true", details);
  };

  function onModalCancel() {
    setShowModal(false)
  }
 
  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      {showModal ? <Confirmation
        t={t}
        heading={'CONFIRM_DELETE_EVENT'}
        docName={data?.applicationData?.name}
        closeModal={() => setShowModal(!showModal)}
        actionCancelLabel={'CS_COMMON_CANCEL'}
        actionCancelOnSubmit={onModalCancel}
        actionSaveLabel={'ES_COMMON_Y_DEL'}
        actionSaveOnSubmit={handleDelete}
      />

        : null}
      <Header>{t(`ES_TITLE_APPLICATION_DETAILS`)}</Header>
  
      <div className="notice_and_circular_main gap-ten">
        <div className="documentDetails_wrapper">
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_ULB_LABEL")}:`}</p> <p>{getUlbName(data?.tenantId)}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_CATEGORY_LABEL")}:`}</p> <p>{data?.applicationData?.eventCategory}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_DESCRIPTION_LABEL")}:`}</p> <p className="documentDetails__description">{data?.applicationData?.description?.length ? data?.applicationData?.description : 'NA'}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_FROM_DATE_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.fromDate ? format(new Date(data?.applicationData?.eventDetails?.fromDate), 'dd/MM/yyyy') : null}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_TO_DATE_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.toDate ? format(new Date(data?.applicationData?.eventDetails?.toDate), 'dd/MM/yyyy') : null}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_FROM_TIME_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.fromDate ? format(new Date(data?.applicationData?.eventDetails?.fromDate), 'HH:mm') : null}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_TO_TIME_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.toDate ? format(new Date(data?.applicationData?.eventDetails?.toDate), 'HH:mm') : null}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t("EVENTS_ADDRESS_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.address ? data?.applicationData?.eventDetails?.address : null}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t( "EVENTS_MAP_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.latitude && data?.applicationData?.eventDetails?.longitude ?
                Digit.Utils.getStaticMapUrl(data?.applicationData?.eventDetails?.latitude, data?.applicationData?.eventDetails?.longitude) :
                'N/A' }</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t( "EVENTS_ORGANIZER_NAME_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.organizer ? data?.applicationData?.eventDetails?.organizer : "-"}</p> </div>
          <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t( "EVENTS_ENTRY_FEE_INR_LABEL")}:`}</p> <p>{data?.applicationData?.eventDetails?.fees ? data?.applicationData?.eventDetails?.fees: "NA"}</p> </div>  


          {data?.applicationData?.eventDetails?.documents?.length ? <div className="documentDetails_pdf">
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
            style={{ width: isMobile ? 'full' : '240px' }}
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
