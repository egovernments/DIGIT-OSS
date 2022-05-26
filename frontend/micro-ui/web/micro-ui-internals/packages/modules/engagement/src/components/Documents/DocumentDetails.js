import { Header, ActionBar, SubmitBar, ExternalLinkIcon, Menu, GenericFileIcon, LinkButton } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { openDocumentLink, openUploadedDocument } from '../../utils';
import Confirmation from '../Modal/Confirmation';


const Actions = ['EDIT_DOCUMENT', 'DELETE']
const getUlbName = (tenantId) => {
    let ulbName = tenantId?.split('.')[1];
    ulbName = `${ulbName[0]?.toUpperCase()}${ulbName?.slice(1)} `;
    return ulbName;
}
const DocumentDetails = ({ location, match, history, }) => {
    let isMobile = window.Digit.Utils.browser.isMobile();
    const { t } = useTranslation();
    const { details } = location?.state;
    const [displayMenu, setDisplayMenu] = React.useState(false);
    const [showModal, setShowModal] = useState(false);

    const { data: ulbArray, isLoading: loading } = Digit.Hooks.useTenants();
    const currrentUlb = Digit.ULBService.getCurrentUlb();
    const stateId = Digit.ULBService.getStateId();
    const { data: categoryOptions, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
        select: (d) => {
            const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
            return data[0].categoryList.map((name) => ({ name }));
        },
    });


    function onActionSelect(action) {
        setDisplayMenu(false);

        if (action?.includes('EDIT')) {
            const DocumentEntity = {
                tenantIds: details?.tenantId,
                documentName: details?.name,
                docCategory: categoryOptions?.filter((item) => item.name === details?.category)?.[0],
                document: {
                    filestoreId: { fileStoreId: details?.filestoreId },
                    documentLink: details?.documentLink
                },
                ULB: {code:details?.tenantId},
                ...details
            }
            history.push({
                pathname: `/digit-ui/employee/engagement/documents/inbox/update`,
                state: { DocumentEntity }
            })
        }

        if (action?.includes('DELETE')) {
            setShowModal(true)
        }
    }

    function onModalSubmit() {
        setShowModal(false)
        const DocumentEntity = {
            ...details
        }
        history.push({
            pathname: `/digit-ui/employee/engagement/documents/delete-response`,
            state: { DocumentEntity }
        })
    }

    function onModalCancel() {
        setShowModal(false)
    }

    return (
        <div>
            {showModal ? <Confirmation
                t={t}
                heading={'CONFIRM_DELETE_DOC'}
                docName={details?.name}
                closeModal={() => setShowModal(!showModal)}
                actionCancelLabel={'CS_COMMON_CANCEL'}
                actionCancelOnSubmit={onModalCancel}
                actionSaveLabel={'ES_COMMON_Y_DEL'}
                actionSaveOnSubmit={onModalSubmit}
            />

                : null}
            <Header>{t(`CE_DOCUMENT_DETAILS`)}</Header>
            <div className="notice_and_circular_main gap-ten">
                <div className="documentDetails_wrapper">
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('ULB')}:`}</p> <p>{getUlbName(details?.tenantId)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('DOCUMENT_NAME')}:`}</p> <p>{details?.name}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('DOCUMENT_CATEGORY')}:`}</p> <p>{t(details?.category)}</p> </div>
                    <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('DCOUMENT_DESCRIPTION')}:`}</p> <p className="documentDetails__description">{details?.description?.length ? details?.description : 'NA'}</p> </div>
                    {/* <div className="documentDetails_row_items"><p className="documentDetails_title">{`${t('ES_COMMON_LINK_LABEL')}:`}</p>
                        {details?.documentLink ? <LinkButton
                            label={
                                <div className="link" onClick={() => openDocumentLink(details?.documentLink, details?.name)}>
                                    <p>{t(`CE_DOCUMENT_OPEN_LINK`)}</p>
                                </div>
                            }
                        /> : 'NA'}
                    </div> */}
                    {details?.filestoreId ? <div className="documentDetails_pdf">
                        <span className="documentDetails_subheader">{`${t('Document')}`}</span>
                        <div style={{ width: '100px' }} onClick={() => openUploadedDocument(details?.filestoreId, details?.name)}>
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
