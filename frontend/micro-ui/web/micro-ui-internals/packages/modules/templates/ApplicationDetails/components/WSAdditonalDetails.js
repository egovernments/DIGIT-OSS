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
        {oldValueData?.connectionType && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.connectionType} /> )}
        {oldValueData?.noOfTaps && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.noOfTaps} /> )}
        {oldValueData?.waterSource && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={t(oldValueData?.waterSource?.toUpperCase()?.split(".")[0])} /> )}
        {oldValueData?.pipeSize && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.pipeSize} /> )}
        {oldValueData?.waterSource && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={t(oldValueData?.waterSource?.toUpperCase()?.split(".")[1])} /> )}
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
        {oldValueData?.meterId && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.meterId} /> )}
        {oldValueData?.additionalDetails?.initialMeterReading && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={oldValueData?.additionalDetails?.initialMeterReading} /> )}
        {oldValueData?.meterInstallationDate && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={convertEpochToDate(oldValueData?.meterInstallationDate)} /> )}
        {oldValueData?.connectionExecutionDate && ( <Row label={`${t("WS_OLD_LABEL_NAME")}:`} text={convertEpochToDate(oldValueData?.connectionExecutionDate)} /> )}
      </div>
    );
  };

  var { connectionDetails, plumberDetails, roadCuttingDetails, activationDetails } = wsAdditionalDetails?.additionalDetails || {connectionDetails:[], plumberDetails: []};

  // binding old values with new values
  if(isModify === "MODIFY"){

    connectionDetails = connectionDetails?.map((value) => {
      if(value.title == "WS_SERV_DETAIL_CONN_TYPE" && oldValueData?.connectionType) value["oldValue"] = [
        { value:value?.value, className:"newValue", style:{ display:"inline"} },
        { 
          value:`${t("WS_OLD_LABEL_NAME")} ${oldValueData?.connectionType}`, 
          className:"oldValue", style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}
        }];
      if(value.title == "WS_SERV_DETAIL_NO_OF_TAPS" && oldValueData?.noOfTaps) value["oldValue"] = [
        {value:value?.value,className:"newValue", style:{ display:"inline"}},
        {value:`${t("WS_OLD_LABEL_NAME")} ${oldValueData?.noOfTaps}`, style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"},className:"oldValue"}
      ];
      if(value.title == "WS_SERV_DETAIL_WATER_SOURCE" && oldValueData?.waterSource) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${t(oldValueData?.waterSource?.toUpperCase()?.split(".")[0])}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_PIPE_SIZE_IN_INCHES_LABEL" && oldValueData?.pipeSize) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.pipeSize}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];    
      if(value.title == "WS_SERV_DETAIL_WATER_SUB_SOURCE" && oldValueData?.waterSource) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${t(oldValueData?.waterSource?.toUpperCase()?.split(".")[1])}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_NUMBER_WATER_CLOSETS_LABEL" && oldValueData?.noOfWaterClosets) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.noOfWaterClosets}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_SERV_DETAIL_NO_OF_TOILETS" && oldValueData?.noOfWaterClosets) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.noOfWaterClosets}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      
      return value;
    })

    plumberDetails = plumberDetails?.map((value) => {
      if(value.title == "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" && oldValueData?.additionalDetails?.detailsProvidedBy && oldValueData?.additionalDetails?.detailsProvidedBy !== value.value ) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.additionalDetails?.detailsProvidedBy}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL" && oldValueData?.plumberInfo[0]?.licenseNo ) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.plumberInfo[0]?.licenseNo}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL" && oldValueData?.plumberInfo[0]?.name ) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.plumberInfo[0]?.name}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_PLUMBER_MOBILE_NO_LABEL" && oldValueData?.plumberInfo[0]?.mobileNumber ) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.plumberInfo[0]?.mobileNumber}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      return value;
    })

    roadCuttingDetails = roadCuttingDetails?.map((roadDetail) => {
      const roadDetailValues = roadDetail?.values?.map((value) => {
        if(value.title == "WS_ADDN_DETAIL_ROAD_TYPE" && oldValueData?.roadCuttingInfo[0]?.roadType) value["oldValue"] = [
          {value:value?.value, className:"newValue", style:{ display:"inline"}},
          {
            value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.roadCuttingInfo[0]?.roadType}`,
            style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
          }
        ];
        if(value.title == "WS_ROAD_CUTTING_AREA_LABEL" && oldValueData?.roadCuttingInfo[0]?.roadCuttingArea) value["oldValue"] = [
          {value:value?.value, className:"newValue", style:{ display:"inline"}},
          {
            value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.roadCuttingInfo[0]?.roadCuttingArea}`,
            style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
          }
        ];
        return value;
      })
      return ({...roadDetail,values:roadDetailValues});  
    })

    activationDetails = activationDetails?.map((value) => {
      if(value.title == "WS_SERV_DETAIL_CONN_EXECUTION_DATE" && oldValueData?.connectionExecutionDate) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${convertEpochToDate(oldValueData?.connectionExecutionDate)}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];

      if(value.title == "WS_SERV_DETAIL_METER_ID" && oldValueData?.meterId) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.meterId}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];

      if(value.title == "WS_INITIAL_METER_READING_LABEL" && oldValueData?.initialMeterReading) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${oldValueData?.initialMeterReading}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];

      if(value.title == "WS_INSTALLATION_DATE_LABEL" && oldValueData?.meterInstallationDate) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${convertEpochToDate(oldValueData?.meterInstallationDate)}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];
      if(value.title == "WS_SERV_DETAIL_CONN_EXECUTION_DATE" && oldValueData?.connectionExecutionDate) value["oldValue"] = [
        {value:value?.value, className:"newValue", style:{ display:"inline"}},
        {
          value: `${t("WS_OLD_LABEL_NAME")} ${convertEpochToDate(oldValueData?.connectionExecutionDate)}`,
          style:{color:'gray', paddingLeft:"10px", display:"inline", fontSize:"13px"}, className:"oldValue"
        }
      ];      
      return value;
    })
  };
  
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
                      <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} />
                    </div>
                  );
                })}
              </div>
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.plumberDetails && (
          <StatusTable>
            <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
            <div>
              <div className="plumber-details-new-value-wrapper">

                {plumberDetails?.map((value, index) => {
                  return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} privacy={value.privacy} />;
                })}
              </div>
            </div>
          </StatusTable>
        )}
        {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails && (
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
                          label={`${t(`${roadValue.title}`)}:`}
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
                    <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}:`} text={value?.oldValue ? value?.oldValue: value?.value ? value?.value : ""} />
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
