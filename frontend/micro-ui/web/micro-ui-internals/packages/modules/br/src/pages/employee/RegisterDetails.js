import { Header, ActionBar, SubmitBar, ExternalLinkIcon, Menu, GenericFileIcon, LinkButton } from '@egovernments/digit-ui-react-components';
import React, { useState , useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from "react-router-dom";



const RegisterDetails = ({ location, match }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading, data  } = Digit.Hooks.br.useBRSearch(tenantId, { ids: id})

console.log("getting!!",data?.BirthRegistrationApplications?.filter((na)=> na.id === id));

console.log("iDddd",id);





    let isMobile = window.Digit.Utils.browser.isMobile();
    


    function onActionSelect(action) {
        // setSelectedAction(action);
        
       
          history.push(`/digit-ui/employee/br/responseemp`)
    }


    return (
        <div>
            {/* {showModal ? <Confirmation
                t={t}
                heading={'CONFIRM_DELETE_DOC'}
                docName={details?.name}
                closeModal={() => setShowModal(!showModal)}
                actionCancelLabel={'CS_COMMON_CANCEL'}
                actionCancelOnSubmit={onModalCancel}
                actionSaveLabel={'ES_COMMON_Y_DEL'}
                actionSaveOnSubmit={onModalSubmit}
            />

                : null} */}
            <Header>{t(`Birth-Registration Details`)}</Header>
            <div className="notice_and_circular_main gap-ten">
                <div className="documentDetails_wrapper">
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('ULB')}:`}</p> <p>{data?.tenantId}</p> </div> */}
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Babys First NAME')}:`}</p> <p>{data?.BirthRegistrationApplications?.filter((na)=> na.id === id)?.[0].babyFirstName}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Babys Last NAME')}:`}</p> <p>{t(data?.BirthRegistrationApplications?.filter((na)=> na.id === id)?.[0].babyLastName)}</p> </div>
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Father NAME')}:`}</p> <p>{t(data?.BirthRegistrationApplications[0].fatherName)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Mother NAME')}:`}</p> <p>{t(data?.BirthRegistrationApplications[0].motherName)}</p> </div> */}
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Doctor NAME')}:`}</p> <p>{t(data?.BirthRegistrationApplications?.filter((na)=> na.id === id)?.[0].doctorName)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Hospital NAME')}:`}</p> <p>{t(data?.BirthRegistrationApplications?.filter((na)=> na.id === id)?.[0].hospitalName)}</p> </div>
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Applicant MobileNumber')}:`}</p> <p>{t(data?.BirthRegistrationApplications.applicantMobileNumber)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Correspondence Address')}:`}</p> <p>{t(data?.correspondenceAddress)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Correspondence City')}:`}</p> <p>{t(data?.BirthRegistrationApplications.correspondenceCity)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Permanent Address')}:`}</p> <p>{t(data?.BirthRegistrationApplications.permanentAddress)}</p> </div> */}
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('Place Of Birth')}:`}</p> <p>{t(data?.BirthRegistrationApplications?.filter((na)=> na.id === id)?.[0].placeOfBirth)}</p> </div>
    
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('DCOUMENT_DESCRIPTION')}:`}</p> <p className="documentDetails__description">{details?.description?.length ? details?.description : 'NA'}</p> </div> */}
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('ES_COMMON_LINK_LABEL')}:`}</p>
                        {details?.documentLink ? <LinkButton
                            label={
                                <div className="link" onClick={() => openDocumentLink(details?.documentLink, details?.name)}>
                                    <p>{t(`CE_DOCUMENT_OPEN_LINK`)}</p>
                                </div>
                            }
                        /> : 'NA'}
                    </div> */}
                  
                </div>
            </div>
            <ActionBar>
        {displayMenu ? (
          <Menu
            localeKeyPrefix={"BR"}
            options={['Approve', 'Reject']}
            t={t}
            onSelect={onActionSelect}
          />
        ) : null}
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
      {showModal &&
        <Modal
          headerBarMain={<Heading label={t('ES_EVENT_DELETE_POPUP_HEADER')} />}
          headerBarEnd={<CloseBtn onClick={() => setShowModal(false)} />}
          actionCancelLabel={t("CS_COMMON_CANCEL")}
          actionCancelOnSubmit={() => setShowModal(false)}
          actionSaveLabel={t('APPROVE')}
          actionSaveOnSubmit={handleDelete}
        >
          <Card style={{ boxShadow: "none" }}>
            <CardText>{t(`REJECT`)}</CardText>
          </Card>
        </Modal>
          }
        </div>
    )
}

export default RegisterDetails;
