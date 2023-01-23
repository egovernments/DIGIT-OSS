import {
  Card,
  CaseIcon, ComplaintIcon, HelpLineIcon, Loader, MCollectIcon, PTIcon, RupeeSymbol, ServiceCenterIcon, TimerIcon, ValidityTimeIcon,
  WhatsappIconGreen
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const StaticDynamicCard = ({ moduleCode }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant();
  const { isLoading: isMdmsLoading, data: mdmsData } = Digit.Hooks.useStaticData(Digit.ULBService.getStateId());
  const { isLoading: isSearchLoading, error, data: dynamicData, isSuccess } = Digit.Hooks.useDynamicData({
    moduleCode,
    tenantId: tenantId,
    filters: {},
    t,
  });
  const handleClickOnWhatsApp = (obj) => {
    window.open(obj);
  };

  const IconComponent = ({ module, styles }) => {
    switch (module) {
      case "TL":
        return <CaseIcon className="fill-path-primary-main" styles={styles} />;
      case "PT":
        return <PTIcon className="fill-path-primary-main" styles={styles} />;
      case "MCOLLECT":
        return <MCollectIcon className="fill-path-primary-main" styles={styles} />;
      case "PGR":
        return <ComplaintIcon className="fill-path-primary-main" styles={styles} />;
      default:
        return <CaseIcon className="fill-path-primary-main" styles={styles} />;
    }
  };
  const mdmsConfigResult = mdmsData?.MdmsRes["common-masters"]?.StaticData[0]?.[`${moduleCode}`];

  const StaticDataIconComponentOne = ({ module }) => {
    switch (module) {
      case "PT":
      case "WS":
        return (
          <span className="timerIcon">
            <TimerIcon />
          </span>
        );
      default:
        return null;
    }
  };
  const StaticDataIconComponentTwo = ({ module }) => {
    switch (module) {
      case "PT":
        return (
          <span className="rupeeSymbol">
            <RupeeSymbol />
          </span>
        );
      case "WS":
        return (
          <span className="timerIcon">
            <TimerIcon />
          </span>
        );
      default:
        return null;
    }
  };
  const staticContent = (module) => {
    switch (module) {
      case "TL":
      case "PT":
      case "MCOLLECT":
        return {
          staticCommonContent: t("COMMON_VALIDITY"),
          validity: mdmsConfigResult?.validity + (mdmsConfigResult?.validity === "1" ? t("COMMON_DAY") : t("COMMON_DAYS")),
        };
      case "PGR":
        return {
          staticCommonContent: t("ACTION_TEST_COMPLAINT_TYPES"),
        };
      case "OBPS":
        return {
          staticCommonContent: t("BUILDING_PLAN_PERMIT_VALIDITY"),
          validity: mdmsConfigResult?.validity + " " + (mdmsConfigResult?.validity === "1" ? t("COMMON_DAY") : t("COMMON_DAYS")),
        };
      default:
        return {
          staticCommonContent: "",
        };
    }
  };

  const staticData = (module) => {
    switch (module) {
      case "PT":
        return {
          staticDataOne: mdmsConfigResult?.staticDataOne + " " + t("COMMON_DAYS"),
          staticDataOneHeader: t("APPLICATION_PROCESSING_TIME"),
          staticDataTwo: mdmsConfigResult?.staticDataTwo,
          staticDataTwoHeader: t("APPLICATION_PROCESSING_FEE"),
        };
      case "WS":
        return {
          staticDataOne: "",
          staticDataOneHeader:
            t("PAY_WATER_CHARGES_BY") + " " + mdmsConfigResult?.staticDataOne + " " + t("COMMON_DAYS") + " " + t("OF_BILL_GEN_TO_AVOID_LATE_FEE"),
          staticDataTwo: mdmsConfigResult?.staticDataTwo + " " + t("COMMON_DAYS"),
          staticDataTwoHeader: t("APPLICATION_PROCESSING_TIME"),
        };
      default:
        return {};
    }
  };

  if (isMdmsLoading || isSearchLoading) {
    return <Loader />;
  }
  return mdmsConfigResult ? (
    <React.Fragment>
      {mdmsConfigResult && mdmsConfigResult?.payViaWhatsApp ? (
        <Card style={{ margin: "16px", padding: "16px", maxWidth: "unset" }}>
          <div className="pay-whatsapp-card" onClick={() => handleClickOnWhatsApp(mdmsConfigResult?.payViaWhatsApp)}>
            <div className="pay-whatsapp-text">{t("PAY_VIA_WHATSAPP")}</div>
            <div className="whatsAppIconG">
              <WhatsappIconGreen />
            </div>
          </div>
        </Card>
      ) : null}
      {mdmsConfigResult && mdmsConfigResult?.helpline ? (
        <Card style={{ margin: "16px", padding: "16px", maxWidth: "unset" }}>
          <div className="static-home-Card">
            <div className="static-home-Card-header">{t("CALL_CENTER_HELPLINE")}</div>
            <div className="helplineIcon">
              <HelpLineIcon />
            </div>
          </div>
          <div className="call-center-card-text">
            {mdmsConfigResult?.helpline?.contactOne ? (
              <div className="call-center-card-content">
                <a href={`tel:${mdmsConfigResult?.helpline?.contactOne}`}>{mdmsConfigResult?.helpline?.contactOne}</a>
              </div>
            ) : null}
            {mdmsConfigResult?.helpline?.contactTwo ? (
              <div className="call-center-card-content">
                <a href={`tel:${mdmsConfigResult?.helpline?.contactTwo}`}>{mdmsConfigResult?.helpline?.contactTwo}</a>
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}
      {mdmsConfigResult && mdmsConfigResult?.serviceCenter ? (
        <Card style={{ margin: "16px", padding: "16px", maxWidth: "unset" }}>
          <div className="static-home-Card">
            <div className="static-home-Card-header">{t("CITIZEN_SERVICE_CENTER")}</div>
            <div className="serviceCentrIcon">
              <ServiceCenterIcon />
            </div>
          </div>
          <div className="service-center-details-card">
            <div className="service-center-details-text">{mdmsConfigResult?.serviceCenter}</div>
          </div>
          {mdmsConfigResult?.viewMapLocation ? (
            <div className="link">
              <a href={mdmsConfigResult?.viewMapLocation}>{t("VIEW_ON_MAP")}</a>
            </div>
          ) : null}
        </Card>
      ) : (
        <div />
      )}
      <Card style={{ margin: "16px", padding: "16px", maxWidth: "unset" }}>
        {error || dynamicData == null || dynamicData?.dynamicDataOne === null ? (
          <div />
        ) : (
          <div className="dynamicDataCard">
            <div className="dynamicData">
              <IconComponent module={moduleCode} styles={{ width: "24px", height: "24px" }} />
              <span className="dynamicData-content">{dynamicData?.dynamicDataOne}</span>
            </div>
          </div>
        )}
        {error || dynamicData == null || dynamicData?.dynamicDataTwo === null ? (
          <div />
        ) : (
          <div className="dynamicDataCard">
            <div className="dynamicData">
              <IconComponent module={moduleCode} styles={{ width: "24px", height: "24px" }} />
              <span className="dynamicData-content">{dynamicData?.dynamicDataTwo}</span>
            </div>
          </div>
        )}
        {mdmsConfigResult && mdmsConfigResult?.staticDataOne ? (
          <div className="staticDataCard">
            <div className="staticData">
              <StaticDataIconComponentOne module={moduleCode} />
              <span className="static-data-content">
                <span
                  className="static-data-content-first"
                  style={{
                    marginTop: staticData(moduleCode)?.staticDataOne === "" ? "8px" : "unset",
                  }}
                >
                  {staticData(moduleCode)?.staticDataOneHeader}
                </span>
                <span className="static-data-content-second">{`${staticData(moduleCode)?.staticDataOne}`}</span>
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        {mdmsConfigResult && mdmsConfigResult?.staticDataTwo ? (
          <div className="staticDataCard">
            <div className="staticData">
              <StaticDataIconComponentTwo module={moduleCode} />
              <span className="static-data-content">
                <span className="static-data-content-first">{staticData(moduleCode)?.staticDataTwoHeader}</span>
                <span className="static-data-content-second">{staticData(moduleCode)?.staticDataTwo}</span>
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        {mdmsConfigResult && mdmsConfigResult?.validity ? (
          <div className="staticDataCard">
            <div className="staticData">
              <span className="validityIcon">
                <ValidityTimeIcon />
              </span>
              <span className="static-data-content">
                <span className="static-data-content-first">{staticContent(moduleCode)?.staticCommonContent}</span>
                <span className="static-data-content-second">{staticContent(moduleCode)?.validity}</span>
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        {error || dynamicData == null || !dynamicData?.staticData || dynamicData?.staticData === null ? (
          <div />
        ) : (
          <div className="staticDataCard">
            <div className="staticData">
              {moduleCode === "PGR" ? (
                <IconComponent module={moduleCode} styles={{ width: "24px", height: "24px", marginLeft: "13px", marginTop: "12px" }} />
              ) : (
                <span className="validityIcon">
                  <ValidityTimeIcon />
                </span>
              )}
              <span className="static-data-content">
                <span className="static-data-content-first">{staticContent(moduleCode)?.staticCommonContent}</span>
                <span className="static-data-content-second">{dynamicData?.staticData}</span>
              </span>
            </div>
          </div>
        )}
      </Card>
    </React.Fragment>
  ) : (
    <React.Fragment />
  );
};

export default StaticDynamicCard;
