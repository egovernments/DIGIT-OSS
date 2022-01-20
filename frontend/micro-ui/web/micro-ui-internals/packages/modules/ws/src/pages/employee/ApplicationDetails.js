import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as func from "../../utils"
import { ActionBar, Card, CardSectionHeader, CardSubHeader, CheckPoint, ConnectingCheckPoints, DocumentSVG, Header, Loader, Menu, PDFSvg, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import TLCaption from "../../../../templates/ApplicationDetails/components/TLCaption";
import ActionModal from "../../../../templates/ApplicationDetails/Modal/FSMActionModal";
import { getDate } from "../../../../../libraries/src/utils/date";
import get from "lodash/get";
import orderBy from "lodash/orderBy";

const ApplicationDetails = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let filters = func.getQueryStringParams(location.search);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    let actions =[];
    const businessService="NEWWS1";
    const Waterresult = Digit.Hooks.ws.useWaterConnectionSearch({ tenantId, filters: { ...filters }, BusinessService: "WS", t });
    function onActionSelect(action) {
        setSelectedAction(action);
        setDisplayMenu(false);
    }

    const getTimelineCaptions = (checkpoint) => {
        console.log(checkpoint);
        const __comment = checkpoint?.comment?.split("~");
        const reason = __comment ? __comment[0] : null;
        const reason_comment = __comment ? __comment[1] : null;
        const caption = {
            date: getDate(checkpoint?.auditDetails?.lastModifiedTime),
            name: checkpoint?.assigner.name,
            mobileNumber: checkpoint?.assigner.mobileNumber,
            documents: checkpoint?.documents,
            comment: reason ? t(`${reason}`) : null,
            otherComment: reason_comment ? reason_comment : null,
        };
        return <React.Fragment> <TLCaption data={caption} /></React.Fragment>

    }

    if (Waterresult?.isLoading || Waterresult == undefined) {
        return <Loader />;
    }
    console.log(Waterresult[0]?.ProcessInstances);

    if (Waterresult[0]?.ProcessInstances?.length > 0) {
        let filteredActions = [];
        filteredActions = get(Waterresult[0]?.ProcessInstances[0], "nextActions", [])?.filter(
          item => item.action != "ADHOC"
        );
        console.log(filteredActions);
        actions= orderBy(filteredActions, ["action"], ["desc"]);
        console.log(actions);
    }
    return (
        <React.Fragment>
            <div>
                <Header>{t("WS_TASK_DETAILS")}</Header>
            </div>
            <div style={{ maxHeight: "calc(100vh - 12em)" }}>
                <Card>
                    <StatusTable>
                        <Row label={t("WS_ACKNO_APP_NO_LABEL")} text={Waterresult[0]?.applicationNo || "NA"} textStyle={{ whiteSpace: "pre" }} />
                        <Row label={t("WS_SERV_DETAIL_CONN_TYPE")} text={Waterresult[0]?.connectionType || "NA"} textStyle={{ whiteSpace: "pre" }} />
                        <Row label={t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED")} text={Waterresult[0]?.proposedTaps || "NA"} textStyle={{ whiteSpace: "pre" }} />
                        <Row label={t("WS_TASK_DETAILS_CONN_DETAIL_PIPE_SIZE_PROPOSED")} text={Waterresult[0]?.proposedPipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
                    </StatusTable>
                    <CardSubHeader className="card-section-header">{t("WS_TASK_DETAILS_FEE_ESTIMATE")} </CardSubHeader>
                    <StatusTable style={{ padding: "10px 0px" }}>

                        {Waterresult[0]?.billData[0]?.billDetails[0]?.billAccountDetails?.map((data) => {
                            return (
                                <Row label={t(func.stringReplaceAll(data?.taxHeadCode, ".", "_"))} text={`₹${data?.amount}` || 0} textStyle={{ whiteSpace: "pre" }} />
                            );
                        })}
                        <hr style={{ width: "35%", border: "1px solid #D6D5D4", marginTop: "1rem", marginBottom: "1rem" }} />
                        <Row
                            label={<b style={{ padding: "10px 0px" }}>{t("WS_COMMON_TOTAL_AMT")}</b>}
                            text={`₹${Waterresult[0]?.billData[0]?.totalAmount}`}
                            textStyle={{ fontSize: "24px", padding: "10px 0px", fontWeight: "700" }}
                        />
                        <Row
                            label={<CardSubHeader className="card-section-header">{t("TL_COMMON_TABLE_COL_STATUS")} </CardSubHeader>}
                            text={
                                Waterresult[0]?.billData[0]?.status == 'PAID' ? <div className="sla-cell-success"> {t(Waterresult[0]?.billData[0]?.status)} </div> : <div className="sla-cell-error">{t(Waterresult[0]?.billData[0]?.status)}</div>
                            }
                            textStyle={{ fontWeight: "bold", maxWidth: "6.5rem" }}
                        />

                    </StatusTable>
                    <CardSubHeader className="card-section-header">{t("WS_COMMON_PROP_DETAIL")} </CardSubHeader>
                    <StatusTable>
                        <Row label={t("WS_PROPERTY_ID_LABEL")} text={Waterresult[0]?.propertyId || "NA"} textStyle={{ whiteSpace: "pre" }} />
                        <Row label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={Waterresult[0]?.properties[0].owners[0].name || "NA"} textStyle={{ whiteSpace: "pre" }} />
                    </StatusTable>



                    <StatusTable>
                        <Row label={t("WS_COMMON_DOCS")} text={""} />
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Waterresult[0]?.documents?.map((document, index) => {
                                return (
                                    <a onClick={() => handleDownload(document)} style={{ minWidth: "160px", marginRight: "20px" }} key={index}>
                                        <PDFSvg />
                                        <p style={{ marginTop: "8px", maxWidth: "196px", }}>{t(`WS_${document.documentType}`)}</p>
                                    </a>
                                );
                            })}
                        </div>
                    </StatusTable>
                    <CardSubHeader className="card-section-header">{t("WS_COMMON_ADDN_DETAILS_HEADER")} </CardSubHeader>
                    <StatusTable>
                        <Row label={t("WS_COMMON_CONNECTION_DETAILS")} text={""} />
                        <div style={{ marginBottom: "24px", maxWidth: "950px", minWidth: "280px", background: "#FAFAFA", borderRadius: "4px", border: "1px solid #D6D5D4", padding: "8px" }}>
                            <Row label={t("WS_SERV_DETAIL_CONN_TYPE")} text={Waterresult[0]?.connectionType || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            <Row label={t("WS_SERV_DETAIL_NO_OF_TAPS")} text={Waterresult[0]?.noOfTaps || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            <Row label={t("WS_SERV_DETAIL_WATER_SOURCE")} text={Waterresult[0]?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            <Row label={t("WS_SERV_DETAIL_PIPE_SIZE")} text={Waterresult[0]?.pipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            <Row label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")} text={Waterresult[0]?.connectionType || "NA"} textStyle={{ whiteSpace: "pre" }} />
                        </div>
                        <StatusTable>
                            <Row label={t("WS_COMMON_PLUMBER_DETAILS")} text={""} />
                            <div style={{ marginBottom: "24px", maxWidth: "950px", minWidth: "280px", background: "#FAFAFA", borderRadius: "4px", border: "1px solid #D6D5D4", padding: "8px" }}>
                                <Row label={t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY")} text={t('WS_PLUMBER_ULB') || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL")} text={Waterresult[0]?.plumberInfo[0].licenseNo || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL")} text={Waterresult[0]?.plumberInfo[0].name || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL")} text={Waterresult[0]?.plumberInfo[0].mobileNumber || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            </div>
                        </StatusTable>
                        <StatusTable>
                            <Row label={t("WS_ROAD_CUTTING_CHARGE_DETAILS")} text={""} />
                            <div style={{ marginBottom: "24px", maxWidth: "950px", minWidth: "280px", background: "#FAFAFA", borderRadius: "4px", border: "1px solid #D6D5D4", padding: "8px" }}>
                                <Row label={t("WS_ADDN_DETAIL_ROAD_TYPE")} text={t(`WS_ROADTYPE_${Waterresult[0]?.roadCuttingInfo[0].roadTyp}`) || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAILS_AREA_LABEL")} text={Waterresult[0]?.roadCuttingInfo[0].roadCuttingArea || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            </div>
                        </StatusTable>
                        <StatusTable>
                            <Row label={t("WS_ACTIVATION_DETAILS")} text={""} />
                            <div style={{ marginBottom: "24px", maxWidth: "950px", minWidth: "280px", background: "#FAFAFA", borderRadius: "4px", border: "1px solid #D6D5D4", padding: "8px" }}>
                                <Row label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")} text={Waterresult[0]?.roadCuttingInfo[0].roadType || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_SERV_DETAIL_METER_ID")} text={Waterresult[0]?.roadCuttingInfo[0].roadCuttingArea || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAIL_METER_INSTALL_DATE")} text={Waterresult[0]?.roadCuttingInfo[0].roadType || "NA"} textStyle={{ whiteSpace: "pre" }} />
                                <Row label={t("WS_ADDN_DETAILS_INITIAL_METER_READING")} text={Waterresult[0]?.roadCuttingInfo[0].roadCuttingArea || "NA"} textStyle={{ whiteSpace: "pre" }} />
                            </div>
                        </StatusTable>
                    </StatusTable>


                    <Fragment>
                        <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                            {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
                        </CardSectionHeader>
                        {Waterresult[0].ProcessInstances && Waterresult[0].ProcessInstances.length === 1 ? (

                            <CheckPoint
                                isCompleted={true}
                                label={t(`"WF_NEWTL_"${Waterresult[0].ProcessInstances[0].state}`)}
                                customChild={getTimelineCaptions(Waterresult[0].ProcessInstances[0])}
                            />
                        ) : (
                            <ConnectingCheckPoints>
                                {Waterresult[0].ProcessInstances &&
                                    Waterresult[0].ProcessInstances.map((checkpoint, index, arr) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <CheckPoint
                                                    keyValue={index}
                                                    isCompleted={index === 0}
                                                    label={t(
                                                        `WF_NEWSW1_${checkpoint?.action
                                                        }`
                                                    )}
                                                    customChild={getTimelineCaptions(checkpoint)}
                                                />
                                            </React.Fragment>
                                        );
                                    })}
                            </ConnectingCheckPoints>
                        )}
                    </Fragment>
                </Card>
            </div>
            {/* {showModal ? (
        <ActionModal t={t} action={selectedAction} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      ) : null} */}
          {actions?.length > 0 && (
        <ActionBar>
          {displayMenu ? (
            <Menu
              localeKeyPrefix={ `WF_EMPLOYEE_${businessService?.toUpperCase()}`}
              options={actions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
            />
          ) : null}
          <SubmitBar label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>)}

      
        </React.Fragment>
    );
}
export default ApplicationDetails;