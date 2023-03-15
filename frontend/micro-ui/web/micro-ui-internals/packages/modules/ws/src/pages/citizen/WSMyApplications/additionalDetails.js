import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { stringReplaceAll } from "../../../utils";
//import PropertyDocument from "../../pageComponents/PropertyDocument";

const WSAdditionalDetails = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = Digit.ULBService.getCurrentTenantId() || user?.info?.permanentCity;
  const applicationNobyData = window.location.href.includes("SW_")
    ? window.location.href.substring(window.location.href.indexOf("SW_"))
    : window.location.href.substring(window.location.href.indexOf("WS_"));

 
    let filter1 = { tenantId: tenantId, applicationNumber: applicationNobyData };
    const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch(
      { filters: filter1, BusinessService: applicationNobyData?.includes("SW") ? "SW" : "WS" },
      { filters: filter1 }
    );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Header>{t("WS_COMMON_ADDN_DETAILS")}</Header>
      <div className="hide-seperator">
        <Card>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL")}
              text={data?.WaterConnection?.[0]?.connectionType || data?.SewerageConnections?.[0]?.connectionType || t("NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            {data?.WaterConnection && data?.WaterConnection?.length > 0 && <div>
              <Row
              className="border-none"
              label={t("WS_SERV_DETAIL_NO_OF_TAPS")}
              text={data?.WaterConnection?.[0]?.noOfTaps || data?.SewerageConnections?.[0]?.noOfTaps || t("CS_NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_PIPE_SIZE_IN_INCHES_LABEL")}
              text={data?.WaterConnection?.[0]?.pipeSize || data?.SewerageConnections?.[0]?.pipeSize || t("CS_NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_SERV_DETAIL_WATER_SOURCE")}
              text={
                t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.WaterConnection?.[0]?.waterSource?.split(".")?.[0], ".", "_")}`) ||
                t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(data?.SewerageConnections?.[0]?.waterSource, ".", "_")}`) ||
                t("CS_NA")
              }
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")}
              text={t(data?.WaterConnection?.[0]?.waterSource?.split(".")?.[1]) || t("CS_NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            </div>}
          </StatusTable>
          {data?.SewerageConnections && data?.SewerageConnections?.length > 0 && (
            <StatusTable>
              <Row
                className="border-none"
                label={t("WS_NUMBER_WATER_CLOSETS_LABEL")}
                text={data?.SewerageConnections?.[0]?.proposedWaterClosets}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                className="border-none"
                label={t("WS_SERV_DETAIL_NO_OF_TOILETS")}
                text={data?.SewerageConnections?.[0]?.proposedToilets || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
              />
            </StatusTable>
          )}
        </Card>
        {
          <Card>
            <CardSubHeader>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
            <StatusTable>
              <Row
                className="border-none"
                label={t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY")}
                text={
                  (data?.WaterConnection?.[0]?.additionalDetails?.detailsProvidedBy === "ULB" ? t("WS_PLUMBER_ULB") : t("WS_PLUMBER_SELF")) ||
                  (data?.SewerageConnections?.[0]?.additionalDetails?.detailsProvidedBy === "ULB" ? t("WS_PLUMBER_ULB") : t("WS_PLUMBER_SELF")) ||
                  t("NA")
                }
                textStyle={{ whiteSpace: "pre" }}
              />
              {(data?.WaterConnection?.[0]?.additionalDetails?.detailsProvidedBy === "ULB" || data?.SewerageConnections?.[0]?.additionalDetails?.detailsProvidedBy === "ULB") && (
                <div>
                  <Row
                    className="border-none"
                    label={t("WS_PLUMBER_LIC_NO")}
                    text={data?.WaterConnection?.[0]?.plumberInfo?.[0]?.licenseNo || data?.SewerageConnections?.[0]?.plumberInfo?.licenseNo || t("NA")}
                    textStyle={{ whiteSpace: "pre" }}
                  />
                  <Row
                    className="border-none"
                    label={t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL")}
                    text={data?.WaterConnection?.[0]?.plumberInfo?.[0]?.name || data?.SewerageConnections?.[0]?.plumberInfo?.name || "NA"}
                    textStyle={{ whiteSpace: "pre" }}
                  />
                  <Row
                    className="border-none"
                    label={t("WS_PLUMBER_MOB_NO")}
                    text={data?.WaterConnection?.[0]?.plumberInfo?.[0]?.mobileNumber || data?.SewerageConnections?.[0]?.plumberInfo?.mobileNumber || "NA"}
                    textStyle={{ whiteSpace: "pre" }}
                    privacy={{ uuid: applicationNobyData, fieldName: ["plumberInfoMobileNumber"], model: "WnSConnectionPlumber",showValue: false,
                    loadData: {
                      serviceName: applicationNobyData?.includes("WS") ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                      requestBody: {},
                      requestParam: { tenantId, applicationNumber : applicationNobyData },
                      jsonPath: applicationNobyData?.includes("WS")? "WaterConnection[0].plumberInfo[0].mobileNumber" : "SewerageConnections[0].plumberInfo[0].mobileNumber",
                      isArray: false,
                    }, }
                  }
                  />
                </div>
              )}
            </StatusTable>
          </Card>
        }
        <Card>
          <CardSubHeader>{t("WS_ROAD_CUTTING_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t("WS_ADDN_DETAIL_ROAD_TYPE")}
              text={ data?.WaterConnection?.[0]?.roadCuttingInfo?.[0]?.roadType || data?.SewerageConnections?.[0]?.roadCuttingInfo?.[0]?.roadType ?
                t(
                  `WS_ROADTYPE_${
                    data?.WaterConnection?.[0]?.roadCuttingInfo?.[0]?.roadType || data?.SewerageConnections?.[0]?.roadCuttingInfo?.[0]?.roadType
                  }`
                ) : t("CS_NA")
              }
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_ADDN_DETAILS_AREA_LABEL")}
              text={
                data?.WaterConnection?.[0]?.roadCuttingInfo?.[0]?.roadCuttingArea ||
                data?.SewerageConnections?.[0]?.roadCuttingInfo?.[0]?.roadCuttingArea ||
                t("NA")
              }
              textStyle={{ whiteSpace: "pre" }}
            />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("WS_ACTIVATION_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")}
              text={
                data?.WaterConnection?.[0]?.connectionExecutionDate || data?.SewerageConnections?.[0]?.connectionExecutionDate
                  ? Digit.DateUtils.ConvertEpochToDate(
                      data?.WaterConnection?.[0]?.connectionExecutionDate || data?.SewerageConnections?.[0]?.connectionExecutionDate
                    )
                  : t("NA")
              }
              textStyle={{ whiteSpace: "pre" }}
            />
            {data?.WaterConnection && data?.WaterConnection?.length > 0 && <div>
            <Row
              className="border-none"
              label={t("WS_SERV_DETAIL_METER_ID")}
              text={data?.WaterConnection?.[0]?.meterId || data?.SewerageConnections?.[0]?.meterId || t("NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_ADDN_DETAIL_METER_INSTALL_DATE")}
              text={
                data?.WaterConnection?.[0]?.meterInstallationDate || data?.SewerageConnections?.[0]?.meterInstallationDate
                  ? Digit.DateUtils.ConvertEpochToDate(
                      data?.WaterConnection?.[0]?.meterInstallationDate || data?.SewerageConnections?.[0]?.meterInstallationDate
                    )
                  : t("NA")
              }
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_ADDN_DETAILS_INITIAL_METER_READING")}
              text={
                data?.WaterConnection?.[0]?.additionalDetails?.initialMeterReading ||
                data?.SewerageConnections?.[0]?.additionalDetails?.initialMeterReading ||
                "NA"
              }
              textStyle={{ whiteSpace: "pre" }}
            />
            </div>}
          </StatusTable>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSAdditionalDetails;
