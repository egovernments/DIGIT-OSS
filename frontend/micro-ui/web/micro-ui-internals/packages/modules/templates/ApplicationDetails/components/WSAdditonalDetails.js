import { StatusTable, Row, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { getQueryStringParams } from "../../../ws/src/utils";

const cardSubHeaderStyles = () => {
  return { fontSize: "24px", marginBottom: "16px", marginTop: "32px" };
};

const WSAdditonalDetails = ({ wsAdditionalDetails, oldValue }) => {
  const { t } = useTranslation();
  let filters = getQueryStringParams(location.search);
  const isModify = filters?.mode;

  var { connectionDetails, plumberDetails, roadCuttingDetails, activationDetails } = wsAdditionalDetails?.additionalDetails || {connectionDetails:[], plumberDetails: []};
    
  return (
    <Fragment>
      <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
        {wsAdditionalDetails?.additionalDetails?.connectionDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
            <div>
              <div className="connection-details-new-value-wrapper">
                {connectionDetails?.map((value, index) => {
                  return (
                    <div>
                      <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} />
                    </div>
                  );
                })}
              </div>
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.plumberDetails && isModify != "MODIFY" && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">

                {plumberDetails?.map((value, index) => {
                  return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} privacy={value.privacy} />;
                })}
              </div>
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails && isModify != "MODIFY" && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ROAD_CUTTING_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">
                {roadCuttingDetails?.map((value) => {
                  return (
                    <div
                      style={ roadCuttingDetails?.length > 1
                          ? {
                              border: "1px solid #D6D5D4",
                              background: "#FAFAFA",
                              borderRadius: "4px",
                              padding: "10px 10px 0px 10px",
                              margin: "5px 0px",
                            }
                          : {}
                      }
                    >
                      {value?.values?.map((roadValue) => (
                        <Row
                          className="border-none"
                          key={`${roadValue.title}`}
                          label={`${t(`${roadValue.title}`)}`}
                          text={roadValue?.oldValue ? roadValue?.oldValue: roadValue?.value ? roadValue?.value : ""}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>             
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.activationDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ACTIVATION_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">
                {activationDetails?.map((value, index) => {
                  return (
                    <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} />
                  );
                })}
              </div>              
            </div>
          </StatusTable>
        )}
      </div>
    </Fragment>
  );
};

export default WSAdditonalDetails;