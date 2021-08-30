import React from 'react';
import { cancelSignal } from './API/api';
import { Loader } from './Components';
import Row from './Row';
import { mobileCheck, transformLocality } from './utils';


const Table = ({ data, header, localityData, sortOrder, t, historyComp, setSortOrder, inboxConfig, historyClick, sort, esclatedComp, isLoading }) => {
    let isMobile = mobileCheck()
    return (<React.Fragment>
        {!isMobile && <Row {...header} sortOrder={sortOrder} t={t} isHeader={true} sort={sort} setSortOrder={setSortOrder}></Row>}
        {data.length != 0 && data.map((item) => <Row {...item} historyClick={historyClick} inboxConfig={inboxConfig} WF_INBOX_HEADER_LOCALITY={localityData && item.BusinessId && transformLocality(localityData[item.BusinessId])} historyComp={historyComp} esclatedComp={esclatedComp} t={t} sortOrder={sortOrder}></Row>)}
        {data.length == 0 && !isLoading && <div>{t("COMMON_INBOX_NO_DATA")}</div>}
        {isLoading && <Loader t={t} cancelSignal={cancelSignal}></Loader>}
    </React.Fragment>)
}

export default Table;