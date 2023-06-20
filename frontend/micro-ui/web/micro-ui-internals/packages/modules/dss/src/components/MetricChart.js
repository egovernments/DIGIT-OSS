import { DownwardArrow, Rating, UpwardArrow } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
//import {ReactComponent as Arrow_Downward} from "../images/Arrow_Downward.svg";
import { ArrowDownwardElement } from "./ArrowDownward";
import { ArrowUpwardElement } from "./ArrowUpward";

const MetricData = ({ t, data, code }) => {
  const { value } = useContext(FilterContext);
  const insight=data?.insight?.value?.replace(/[+-]/g, "")?.split('%');
  return (
    <div>
      <p className="heading-m" style={{ textAlign: "right", paddingTop: "0px", whiteSpace: "nowrap" }}>
        {code === "citizenAvgRating" ? (
          <Rating currentRating={Math.round(data?.headerValue * 10) / 10} styles={{ width: "unset" }} starStyles={{ width: "25px" }} />
        ) : (
          `${Digit.Utils.dss.formatter(data?.headerValue, data?.headerSymbol, value?.denomination, true, t)} ${
            code === "totalSludgeTreated" ? t(`DSS_KL`) : ""
          }`
        )}
      </p>
      {data?.insight && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
          }}
        >
          {data?.insight?.indicator === "upper_green" ? ArrowUpwardElement("10px") : ArrowDownwardElement("10px")}
          <p className={`${data?.insight.colorCode}`} style={{ whiteSpace: "pre" }}>
            {insight?.[0]&&`${Digit.Utils.dss.formatter(insight[0], 'number', value?.denomination, true, t)}% ${t(Digit.Utils.locale.getTransformedLocale('DSS'+insight?.[1]||""))}`}
          </p>
        </div>
      )}
    </div>
  );
};

const ColumnMetricData = ({data, setChartDenomination, index }) => {
  const { id, chartType } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [showDateOrCount, setShowDateOrCount] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
    moduleLevel: value?.moduleLevel
  });

  useEffect(() => {
    if (response) {
      let plots = response?.responseData?.data?.[0]?.plots || null;
      if (plots && Array.isArray(plots) && plots.length > 0 && plots?.every((e) => e.value))
      setShowDateOrCount(oldstate=>({...oldstate,[id]:{
          todaysDate: Digit.DateUtils.ConvertEpochToDate(plots?.[0]?.value),
          lastUpdatedTime: Digit.DateUtils.ConvertEpochToTimeInHours(plots?.[1]?.value),
          count: plots?.[2]?.value
        }}));
      index === 0 && setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    } else {
      setShowDateOrCount({});
    }
  }, [response]);

  if (isLoading) {
    return false;
  }
  
    return (
      <div style={{marginRight: 16, maxWidth: "20%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        {response ? <p className="heading-m" style={{ textAlign: "left", paddingTop: "0px", whiteSpace: "nowrap", paddingBottom: "0px" }}>
            {`${Digit.Utils.dss.formatter(response?.responseData?.data?.[0]?.headerValue, response?.responseData?.data?.[0]?.headerSymbol, value?.denomination, true, t)}`}
        </p> : <div style={{ whiteSpace: "pre" }}>{t("DSS_NO_DATA")}</div>}
        <div className={`tooltip`} >
        <span
          className="tooltiptext"
          style={{
            fontSize: "medium",
            width: t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400,
            height: 50,
            whiteSpace: "normal",
            visibility: "visible"
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{`${showDateOrCount?.[id]?.count ? `${showDateOrCount?.[id]?.count} ` : ""}${t(`TIP_${data.name}`)}`}</span>
        </span>
        
        </div>
        <div style={{ textAlign: "center", paddingTop: "0px", wordWrap: "break-word" }}>{`${showDateOrCount?.[id]?.count ? `${showDateOrCount?.[id]?.count} ` : ""}${t(`${data.name}`)}`}</div>
      </div>
      
    );
  
};

const MetricChartRow = ({ data, setChartDenomination, index }) => {
  const { id, chartType } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [showDate, setShowDate] = useState({});
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
    moduleLevel: value?.moduleLevel
  });

  useEffect(() => {
    if (response) {
      let plots = response?.responseData?.data?.[0]?.plots || null;
      if (plots && Array.isArray(plots) && plots.length > 0 && plots?.every((e) => e.value))
        setShowDate(oldstate=>({...oldstate,[id]:{
          todaysDate: Digit.DateUtils.ConvertEpochToDate(plots?.[0]?.value),
          lastUpdatedTime: Digit.DateUtils.ConvertEpochToTimeInHours(plots?.[1]?.value),
        }}));
      index === 0 && setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    } else {
      setShowDate({});
    }
  }, [response]);

  if (isLoading) {
    return false;
  }

  if (!response) {
    return (
      <div className="row">
      <div className={`tooltip`} >
        {t(data.name)}
        <span
          className="tooltiptext"
          style={{
            fontSize: "medium",
            width: t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400,
            height: 50,
            whiteSpace: "normal",
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
        </span>
      </div>
        <span style={{ whiteSpace: "pre" }}>{t("DSS_NO_DATA")}</span>
    </div>
    );
  }
  let name=t(data?.name)||"";

  const getWidth = (data) => {
    if (isMobile) return "auto";
    else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400;
    // if (isMobile) return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 300;
    // else return t(`TIP_${data.name}`).length < 50 ? "fit-content" : 400;
  }

  const getHeight = (data) => {
    if (isMobile) return "auto";
    else return 50;
    // if (isMobile) return t(`TIP_${data.name}`).length < 50 ? 50 : "auto";
    // else return 50;
  }

  return (
    <div className="row">
      <div className={`tooltip`} >
        {typeof name=="string"&&name}
        {Array.isArray(name)&&name?.filter(ele=>ele)?.map(ele=><div style={{ whiteSpace: "pre" }}>{ele}</div>)}
        <span className="dss-white-pre" style={{ display: "block" }}> {showDate?.[id]?.todaysDate}</span>
        <span
          className="tooltiptext"
          style={{
            fontSize: "medium",
            width: getWidth(data),
            height: getHeight(data),
            whiteSpace: "normal",
          }}
        >
          <span style={{ fontWeight: "500", color: "white" }}>{t(`TIP_${data.name}`)}</span>
          <span style={{ color: "white" }}> {showDate?.[id]?.lastUpdatedTime}</span>
        </span>
      </div>
      <MetricData t={t} data={response?.responseData?.data?.[0]} code={response?.responseData?.visualizationCode} />
      {/* <div>{`${displaySymbol(response.headerSymbol)} ${response.headerValue}`}</div> */}
    </div>
  );
};

const MetricChart = ({ data, setChartDenomination }) => {
  const { charts } = data;
  return (
    <>
    <span className={`chart-metric-wrapper`} style={{flexWrap: "wrap", display: "flex"}}>
  
      {charts.map((chart, index) => (
        
        data?.isHorizontalChart ? (
          <ColumnMetricData data={chart} key={index} index={index} setChartDenomination={setChartDenomination} />
        ) : (
          <MetricChartRow data={chart} key={index} index={index} setChartDenomination={setChartDenomination} />
        )
      ))}
        </span>
    </>
  );
};

export default MetricChart;
