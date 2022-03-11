import {
  Card,
  CardHeader,
  DownloadIcon,
  EmailIcon,
  Header,
  Loader,
  MultiLink,
  Poll,
  ShareIcon,
  WhatsappIcon,
} from "@egovernments/digit-ui-react-components";
import { format } from "date-fns";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FilterContext from "../components/FilterContext";
import { endOfMonth, getTime, startOfMonth } from "date-fns";
import { ArrowUpwardElement } from "../components/ArrowUpward";
import { ArrowDownwardElement } from "../components/ArrowDownward";

const key = "DSS_FILTERS";

const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Lac";
  const tenantId = data?.filters?.tenantId || [];
  return { startDate, endDate, title, duration, denomination, tenantId };
};

const colors = [
  { dark: "#0BDE85", light: "rgba(11, 222, 133, 0.14)" },
  { dark: "#FFCA45", light: "rgba(255, 202, 69, 0.24)" },
  { dark: "#8A53FF", light: "rgba(138, 83, 255, 0.24)" },
  { dark: "#048BD0", light: "rgba(4, 139, 208, 0.24)" },
  { dark: "#FF7245", light: "rgba(255, 114, 69, 0.24)" },
  { dark: "#53FFEA", light: "rgba(83, 255, 234, 0.14)" },
  { dark: "#DEBC0B", light: "rgba(222, 188, 11, 0.24)" },
];

const getInsightHeaderValue = (type, data) => {
  switch (type) {
    case "Total Collections":
    case "Total Collection":
      return `₹ ${data} Cr`;

    case "Properties Assessed":
      return `${data} Cr`;

    case "Total Applications":
    case "Total Receipts":
    case "Total Grievances":
    case "Total Permits Issued":
    case "Total FireNoc's Issued":
      return `${data} Lac`;

    case "SLA Achievement":
    case "Target Achievement":
      return `${data}%`;

    default:
      return data;
  }
};

const Chart = ({ data }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id, chartType } = data;

  const requestDate = {
    startDate: getTime(startOfMonth(new Date())),
    endDate: getTime(endOfMonth(new Date())),
    interval: "month",
    title: "",
  };

  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dss-insight-card">
      <p className="p1">{t(data?.name)}</p>
      <p className="p2">{getInsightHeaderValue(t(data?.name), response?.responseData?.data?.[0]?.headerValue)}</p>
      {response?.responseData?.data?.[0]?.insight?.value ? (
        <p className={`p3 ${response?.responseData?.data?.[0]?.insight?.indicator === "upper_green" ? "color-green" : "color-red"}`}>
          {response?.responseData?.data?.[0]?.insight?.indicator === "upper_green" ? ArrowUpwardElement("10px") : ArrowDownwardElement("10px")}
          {response?.responseData?.data?.[0]?.insight?.value}
        </p>
      ) : null}
    </div>
  );
};

const DashBoard = ({ stateCode }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate, title, duration, denomination, tenantId } = getInitialRange();
    return {
      denomination,
      range: { startDate, endDate, title, duration },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: duration,
        title: title,
      },
      filters: {
        tenantId,
      },
    };
  });
  const { moduleCode } = useParams();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading: localizationLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);
  const [showOptions, setShowOptions] = useState(false);

  const handleFilters = (data) => {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  };
  const fullPageRef = useRef();
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: handleFilters,
    }),
    [filters]
  );

  const mobileView = innerWidth <= 640;

  const handlePrint = () => Digit.Download.PDF(fullPageRef, t(dashboardConfig?.[0]?.name));

  const dashboardConfig = response?.responseData;

  const shareOptions = navigator.share
    ? [
        {
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
            }, 500);
          },
        },
        {
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name));
            }, 500);
          },
        },
      ]
    : [
        {
          icon: <EmailIcon />,
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
            }, 500);
          },
        },
        {
          icon: <WhatsappIcon />,
          label: t("ES_DSS_SHARE_PDF"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
            }, 500);
          },
        },
        {
          icon: <EmailIcon />,
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "mail");
            }, 500);
          },
        },
        {
          icon: <WhatsappIcon />,
          label: t("ES_DSS_SHARE_IMAGE"),
          onClick: () => {
            setShowOptions(!showOptions);
            setTimeout(() => {
              return Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig?.[0]?.name), "whatsapp");
            }, 500);
          },
        },
      ];

  if (isLoading || localizationLoading) {
    return <Loader />;
  }

  return (
    <FilterContext.Provider value={provided}>
      <div ref={fullPageRef}>
        <div className="options">
          <Header styles={{ marginBottom: "0px" }}>{t(dashboardConfig?.[0]?.name)}</Header>
          {mobileView ? null : (
            <div>
              <div className="mrlg">
                <MultiLink
                  className="multilink-block-wrapper"
                  label={t(`ES_DSS_SHARE`)}
                  icon={<ShareIcon className="mrsm" />}
                  showOptions={(e) => setShowOptions(e)}
                  onHeadClick={(e) => setShowOptions(e !== undefined ? e : !showOptions)}
                  displayOptions={showOptions}
                  options={shareOptions}
                />
              </div>
              <div className="mrsm" onClick={handlePrint}>
                <DownloadIcon className="mrsm" />
                {t(`ES_DSS_DOWNLOAD`)}
              </div>
            </div>
          )}
        </div>

        {mobileView ? (
          <div className="options-m">
            <div>
              <MultiLink
                className="multilink-block-wrapper"
                label={t(`ES_DSS_SHARE`)}
                icon={<ShareIcon className="mrsm" />}
                showOptions={(e) => setShowOptions(e)}
                onHeadClick={(e) => setShowOptions(e !== undefined ? e : !showOptions)}
                displayOptions={showOptions}
                options={shareOptions}
              />
            </div>
            <div onClick={handlePrint}>
              <DownloadIcon />
              {t(`ES_DSS_DOWNLOAD`)}
            </div>
          </div>
        ) : null}

        {dashboardConfig?.[0]?.visualizations.map((row, key) => {
          return (
            <div className="dss-card" key={key}>
              {row.vizArray.map((item, index) => {
                return (
                  <div
                    className={`dss-card-parent  ${item.name.includes("OVERVIEW") ? "w-100" : ""}`}
                    style={item.name.includes("OVERVIEW") ? { backgroundColor: "#fff" } : { backgroundColor: colors[index].light }}
                    key={index}
                  >
                    <div className="dss-card-header">
                      <Poll />
                      <p style={{ marginLeft: "10px" }}>{t(item.name)}</p>
                    </div>

                    <div className="dss-card-body">
                      {item.charts.map((chart, key) => (
                        <div style={item.name.includes("OVERVIEW") ? { width: "25%" } : { width: "50%" }}>
                          <Chart data={chart} key={key} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </FilterContext.Provider>
  );
};

export default DashBoard;
