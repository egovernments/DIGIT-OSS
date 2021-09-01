import React from 'react';
import { svgIcons } from './Components';
import { getWfLink, mobileCheck } from './utils';


const { SortDown,
    SortUp } = svgIcons;

const Row = React.memo((props) => {
    const { sortOrder = { }, BusinessId: id, t, inboxConfig = { } } = props;
    let keys = Object.keys(sortOrder);
    keys.sort((x, y) => sortOrder[x].order - sortOrder[y].order);

    let isMobile = mobileCheck()

    if (isMobile) {
        return <div className="inbox-row-card" key={id} style={{ cursor: "pointer" }} onClick={() => {
            if (inboxConfig) {
                window.location.href = getWfLink(inboxConfig, props.BusinessId, props.other.BusinessService);
            }
        }}>
            {
                keys.map((key, index) => {
                    const isSLA = key == "WF_INBOX_HEADER_SLA_DAYS_REMAINING" && !props.isHeader ? true : false;
                    return (<span style={{ padding: '15px' }} key={index} className={`row-${key}`}>
                        <span style={{ textAlign: "left" }}>
                            {isSLA ? "SLA" : t(key)}
                        </span> {' : '}
                        <span style={isSLA?{ textAlign: "right", color: "rgba(0, 0, 0, 0.97)" ,display: "inline-block"}:{ textAlign: "right", color: "rgba(0, 0, 0, 0.97)" }}>
                            {isSLA ? (<span className={"jk-inbox-sla-wrapper"}>
                                <span style={{ backgroundColor: props.other.color }} className={"inbox-cell-badge-primary"}>
                                    {props[key]}
                                </span>
                                {props.Esclated && <span className="jk-inbox-eslcated-mark">{props.esclatedComp}</span>}
                                {!props.Esclated && <span className="jk-inbox-eslcated-mark">{" "}</span>}

                            </span>)
                                : t(props[key]) || t("COMMON_NA")}
                        </span>
                    </span>)
                })
            }
            {<span key={7} className={`row-7 history-wrapper-sm`}> <span style={{ textAlign: "left" }}>
                {t('CS_COMMON_VIEW_HISTORY_LINK')} {' ' }
            </span> <span className="jk-inbox-pointer" onClick={() => props.historyClick(id)}>{props.historyComp}</span></span>}
        </div>
    }
    return (
        <span key={id} className="inbox-row-holder">
            {
                keys.map((key, index) => {
                    const isSLA = key == "WF_INBOX_HEADER_SLA_DAYS_REMAINING" && !props.isHeader ? true : false;
                    let slaHeader = false;
                    let clickFunction = () => { };
                    if (key == "WF_INBOX_HEADER_SLA_DAYS_REMAINING" && props.isHeader) {
                        clickFunction = () => { props.setSortOrder(state => !state) }
                        slaHeader = true;
                    } else if (key == "WF_INBOX_HEADER_APPLICATION_NO") {
                        clickFunction = () => {
                            if (inboxConfig) {
                                window.location.href = getWfLink(inboxConfig, props.BusinessId, props.other.BusinessService);
                            }
                        }
                    }
                    return (<span style={{ width: `${props.sortOrder[key].width}%` }} key={index} className={`row-${key}${props.isHeader ? '-head inbox-row-header-ele' : ""} ${slaHeader && "jk-inbox-pointer"} inbox-row-element }`} onClick={clickFunction}>
                        {isSLA ? (<span className={"jk-inbox-sla-wrapper"}>
                            <span style={{ backgroundColor: props.other.color }} className={"inbox-cell-badge-primary"}>
                                {props[key]}
                            </span>
                            {props.Esclated && <span className="jk-inbox-eslcated-mark">{props.esclatedComp}</span>}
                            {!props.Esclated && <span className="jk-inbox-eslcated-mark">{""}</span>}
                            <span className="jk-inbox-pointer" onClick={() => props.historyClick(id)}>{props.historyComp}</span>
                        </span>) : t(props[key]) || t("COMMON_NA")}
                        {slaHeader && <span className="jk-inbox-pointer" >{props.sort ? <SortDown /> : <SortUp />}</span>}
                    </span>)
                })
            }
        </span>)
})

export default Row;