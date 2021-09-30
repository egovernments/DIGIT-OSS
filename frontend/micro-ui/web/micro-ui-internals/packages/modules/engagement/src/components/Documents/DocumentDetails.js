import { Header, ActionBar, SubmitBar, PDFSvg, Menu } from '@egovernments/digit-ui-react-components';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { openDocument } from './DesktopInbox';

const Actions = ['EDIT_DOCUMENT', 'DELETE']
const getUlbName = (tenantId) => {
    let ulbName = tenantId?.split('.')[1];
    ulbName = `${ulbName[0]?.toUpperCase()}${ulbName?.slice(1)} `;
    return ulbName;
}
const DocumentDetails = ({ location, match, history, }) => {
    const { t } = useTranslation();
    const { details } = location?.state;
    const [displayMenu, setDisplayMenu] = React.useState(false);
    function onActionSelect(action) {
        setDisplayMenu(false);
        if (action?.includes('EDIT')) {
          // history.push(`/digit-ui/employee/engagement/documents/update`) //navigate to update form
        }
        if (action?.includes('DELETE')) {
         //  history.push(`/digit-ui/employee/engagement/delete-response`) //delete this doc and navigate to list
        }
    }

    return (
        <div>
            <Header>{t(`CE_DOCUMENT_DETAILS`)}</Header>
            <div className="notice_and_circular_main">
                <div className="documentDetails_wrapper">
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t('ULB')}:`}</p> <p>{getUlbName(details.tenantId)}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t('DOCUMENT_NAME')}:`}</p> <p>{details?.name}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t('DOCUMENT_CATEGORY')}:`}</p> <p>{t(details?.category)}</p> </div>
                    <div className="documentDetails_row"><p className="documentDetails_title">{`${t('DCOUMENT_DESCRIPTION')}:`}</p> <p className="documentDetails__description">{details?.description?.length ? details?.description : 'NA'}</p> </div>
                    <div className="documentDetails_pdf">
                        <span className="documentDetails_subheader">{`${t('Document')}`}</span>
                        <div style={{ width: '100px' }} onClick={() => openDocument(details?.filestoreId, details?.name)}>
                            <PDFSvg />
                        </div>

                    </div>
                </div>
            </div>
            <ActionBar>
                {displayMenu ? (
                    <Menu 
                        style={{width:'240px'}}
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
