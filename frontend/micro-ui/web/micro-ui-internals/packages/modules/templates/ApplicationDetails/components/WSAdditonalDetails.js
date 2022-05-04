import { StatusTable, Row, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { getQueryStringParams } from "../../../ws/src/utils";

const cardSubHeaderStyles = () => {
  // return { fontSize: "24px", padding: "0px", margin: "0px", color: "#505A5F" };
  return { fontSize: "24px", marginBottom: "16px", marginTop: "32px" };
};

const cardDivStyles = () => {
  return {
    border: "1px solid #D6D5D4",
    background: "#FAFAFA",
    borderRadius: "4px",
    padding: "10px 10px 0px 10px",
    marginBottom: "10px",
    display: "flex",
  };
};

const convertEpochToDate = (dateEpoch) => {
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};

const WSAdditonalDetails = ({ wsAdditionalDetails, oldValue }) => {
  const { t } = useTranslation();
  let filters = getQueryStringParams(location.search);
  const serviceType = filters?.service;
  const isModify = filters?.mode;

  const oldValueData = oldValue?.[1];

  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  const renderSWConnectionDetails = () => {
    return (
      <div className="connection-details-old-value-wrapper">
        {oldValueData?.connectionType ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.connectionType} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}

        {oldValueData?.noOfWaterClosets ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.noOfWaterClosets} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.noOfToilets ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.noOfToilets} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  const renderWSConnectionDetails = () => {
    return (
      <div className="connection-details-old-value-wrapper">
        {oldValueData?.connectionType ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.connectionType} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}

        {oldValueData?.noOfTaps ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.noOfTaps} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.waterSource ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={t(oldValueData?.waterSource?.toUpperCase()?.split(".")[0])} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.pipeSize ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.pipeSize} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.waterSource ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={t(oldValueData?.waterSource?.toUpperCase()?.split(".")[1])} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  const renderSWPlumberDetails = () => {
    return (
      <div className="plumber-details-old-value-wrapper">
        {oldValueData?.additionalDetails?.detailsProvidedBy !== wsAdditionalDetails?.additionalDetails?.plumberDetails[0]?.value &&
        oldValueData?.additionalDetails?.detailsProvidedBy !== null ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.additionalDetails?.detailsProvidedBy} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.plumberInfo ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.plumberInfo[0]?.licenseNo} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.plumberInfo ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.plumberInfo[0]?.name} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.plumberInfo ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.plumberInfo[0]?.mobileNumber} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  const renderWSPlumberDetails = () => {
    return (
      <div className="plumber-details-old-value-wrapper">
        {oldValueData?.additionalDetails?.detailsProvidedBy !== wsAdditionalDetails?.additionalDetails?.plumberDetails[0]?.value ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.additionalDetails?.detailsProvidedBy || "NA"} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  const renderSWRoadCuttingDetails = () => {
    {
      oldValueData?.roadCuttingInfo?.map((info) => {
        return (
          <div className="plumber-details-old-value-wrapper">
            <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={t(`WS_ROADTYPE_${info?.roadType}`) || "NA"} />
            <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={info?.roadCuttingArea || "NA"} />
          </div>
        );
      });
    }
  };

  const renderSWActivationDetails = () => {
    return (
      <div className="plumber-details-old-value-wrapper">
        {oldValueData?.connectionExecutionDate ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={convertEpochToDate(oldValueData?.connectionExecutionDate)} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  const renderWSActivationDetails = () => {
    return (
      <div className="plumber-details-old-value-wrapper">
        {oldValueData?.meterId ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.meterId} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.additionalDetails?.initialMeterReading ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.additionalDetails?.initialMeterReading} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.meterInstallationDate ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={convertEpochToDate(oldValueData?.meterInstallationDate)} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
        {oldValueData?.connectionExecutionDate ? (
          <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={convertEpochToDate(oldValueData?.connectionExecutionDate)} />
        ) : (
          <div className="old-value-null-wrapper ">{"NA"}</div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
        {wsAdditionalDetails?.additionalDetails?.connectionDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
            <div>
              <div className="connection-details-new-value-wrapper">
                {wsAdditionalDetails?.additionalDetails?.connectionDetails?.map((value, index) => {
                  return (
                    <div>
                      <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.value ? value?.value : ""} />
                    </div>
                  );
                })}
              </div>

              {serviceType === "SEWERAGE" && isModify === "MODIFY"
                ? renderSWConnectionDetails()
                : serviceType === "WATER" && isModify === "MODIFY"
                ? renderWSConnectionDetails()
                : null}
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.plumberDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">
                {wsAdditionalDetails?.additionalDetails?.plumberDetails?.map((value, index) => {
                  return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.value ? value?.value : ""} />;
                })}
              </div>
              {serviceType === "SEWERAGE" && isModify === "MODIFY"
                ? renderSWPlumberDetails()
                : serviceType === "WATER" && isModify === "MODIFY"
                ? renderWSPlumberDetails()
                : null}
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ROAD_CUTTING_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">
                {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails?.map((value) => {
                  return (
                    <div
                      style={
                        wsAdditionalDetails?.additionalDetails?.roadCuttingDetails?.length > 1
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
                          label={`${t(`${roadValue.title}`)}:`}
                          text={roadValue?.value ? roadValue?.value : ""}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
              {serviceType === "SEWERAGE" && isModify === "MODIFY"
                ? renderSWRoadCuttingDetails()
                : serviceType === "WATER" && isModify === "MODIFY"
                ? renderSWRoadCuttingDetails()
                : null}
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.activationDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ACTIVATION_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">
                {wsAdditionalDetails?.additionalDetails?.activationDetails?.map((value, index) => {
                  return (
                    <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.value ? value?.value : ""} />
                  );
                })}
              </div>
              {serviceType === "SEWERAGE" && isModify === "MODIFY"
                ? renderSWActivationDetails()
                : serviceType === "WATER" && isModify === "MODIFY"
                ? renderWSActivationDetails()
                : null}
            </div>
          </StatusTable>
        )}
      </div>
    </Fragment>
  );
};

export default WSAdditonalDetails;
