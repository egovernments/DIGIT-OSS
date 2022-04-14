import {
  Card,
  CardCaption,
  CardLabel,
  DownloadIcon,
  EllipsisMenu,
  EmailIcon,
  SearchIconSvg,
  TextInput,
  WhatsappIcon,
} from "@egovernments/digit-ui-react-components";
import React, { useRef, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchImg = () => {
  return <SearchIconSvg className="signature-img" />;
};

const GenericChart = ({
  header,
  subHeader,
  className,
  caption,
  children,
  showHeader = true,
  showSearch = false,
  showDownload = false,
  onChange,
  chip = [],
  updateChip,
  value = {},
}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [chartData, setChartData] = useState(null);
  const [chartDenomination, setChartDenomination] = useState(null);
  const isMobile = window.Digit.Utils.browser.isMobile();
  const chart = useRef();
  const menuItems = [
    {
      code: "image",
      i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
      icon: <DownloadIcon />,
    },
    {
      code: "shareImage",
      i18nKey: t("ES_DSS_SHARE_IMAGE"),
      target: "mail",
      icon: <EmailIcon />,
    },
    {
      code: "shareImage",
      i18nKey: t("ES_DSS_SHARE_IMAGE"),
      target: "whatsapp",
      icon: <WhatsappIcon />,
    },
  ];

  function download(data) {
    setTimeout(() => {
      switch (data.code) {
        case "pdf":
          return Digit.Download.PDF(chart, t(header));
        case "image":
          return Digit.Download.IndividualChartImage(chart, t(header));
        case "sharePdf":
          return Digit.ShareFiles.PDF(tenantId, chart, t(header), data.target);
        case "shareImage":
          return Digit.ShareFiles.IndividualChartImage(tenantId, chart, t(header), data.target);
        default:
          return null;
      }
    }, 500);
  }

  const handleExcelDownload = () => {
    return Digit.Download.Excel(chartData, t(header));
  };
  let headerName = t(Digit.Utils.locale.getTransformedLocale(header));
  return (
    <Card className={`chart-item ${className}`} ReactRef={chart}>
      <div className={`chartHeader ${showSearch && "column-direction"}`}>
        <div>
          {showHeader && (
            <CardLabel className={"dss-header-label"}>
              <span className={`tooltip ${headerName?.length < (isMobile ? 20 : 30) ? "dss-white-pre" : "dss-white-pre-line"}`}>
                {headerName}
                {chartDenomination?.toLowerCase() === "amount" && (
                  <span style={{ whiteSpace: "pre" }}> ({t(`DSS_${Digit.Utils.locale.getTransformedLocale(value?.denomination)}`)})</span>
                )}
                <span
                  className="tooltiptext"
                  style={{
                    whiteSpace: !isMobile ? "nowrap" : "normal",
                    fontSize: "medium",
                    marginLeft: t(`TIP_${Digit.Utils.locale.getTransformedLocale(header)}`).length > 30 ? -120 : -60,
                  }}
                >
                  {t(`TIP_${Digit.Utils.locale.getTransformedLocale(header)}`)}
                </span>
              </span>
              {/* {`${t(header)}`} */}
            </CardLabel>
          )}
          {subHeader && <p style={{ color: "#505A5F", fontWeight: 700 }}>{subHeader}</p>}
        </div>
        <div className="sideContent">
          {chip && chip.length > 1 && <Chip items={chip} onClick={updateChip} t={t} />}
          <span className="table-search-wrapper">
            {showSearch && (
              <TextInput className="searchInput" placeholder="Search" signature={true} signatureImg={<SearchImg />} onChange={onChange} />
            )}
            {showDownload && <DownloadIcon className="mrlg cursorPointer" onClick={handleExcelDownload} />}
          </span>
          {!showDownload && <EllipsisMenu menuItems={menuItems} displayKey="i18nKey" onSelect={(data) => download(data)} />}
        </div>
      </div>
      {caption && <CardCaption>{caption}</CardCaption>}
      {React.cloneElement(children, { setChartData, setChartDenomination })}
    </Card>
  );
};

export default GenericChart;

const Chip = (props) => {
  const [state, setState] = useState(1);
  return (
    <div className="table-switch-card-chip">
      {props.items.map((item, index) => {
        return (
          <div
            className={item.active && state ? "table-switch-card-active" : "table-switch-card-inactive"}
            onClick={() => {
              props.onClick && props.onClick(item.index);
              setState((prev) => prev + 1);
            }}
          >
            {props.t(`DSS_TAB_${item?.tabName?.toUpperCase()}`)}
          </div>
        );
      })}
    </div>
  );
};
