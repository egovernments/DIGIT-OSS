import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import { ResponsiveContainer } from "recharts";
import { format } from "date-fns";


const Backsvg = ({ onClick }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
        fill="#0B0C0C"
      />
    </svg>
  );
  const key = "DSS_FILTERS";


const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const interval = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Lac";
  const tenantId = data?.filters?.tenantId || [];
  return { startDate, endDate, title, interval, denomination, tenantId };
};

const MapDrillChart = ({
    data,
    drilldown = true,
    selectedState,
    setselectedState,
    drilldownId,
    setdrilldownId,
    setTotalCount,
    setLiveCount,

}) => {
    const { t } = useTranslation();
    const { id } = data;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let filters = {}
    if(selectedState != "") {
      filters.state = selectedState;
    }
  
    filters = {...filters};
  
    const { startDate, endDate, interval, } = getInitialRange();
    const requestDate = {
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      interval: interval,
      title: "home",
    };
  
    const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
      key: drilldownId,
      type: "metric",
      tenantId,
      requestDate: requestDate,
      filters: filters
    });

    const onBack = (selectedState ) => {
      setselectedState("");
      setdrilldownId("none");
      setTotalCount("");
      setLiveCount("");
    }

    if(isLoading){
        return <Loader />;
    }

    const data2 = response?.responseData?.data;

    return (
      <ResponsiveContainer
      width="50%"
      height={240}
      margin={{
        top: 5,
        right: 5,
        left: 5,
        bottom: 5,
      }}
    >
        <div>
          {" "}
          <div style={{ float: "left" }}>
            <Backsvg onClick={onBack} />
          </div>
          {data2 && data2.length == 0 && (
            <div style={{ paddingTop: "60px" }}>
              {t("DSS_NO_DATA")}
            </div>
          )}
          {data2 && data2[0] && (
            <span className={"tab-rows tab-header"}>
              <span>{t(`DSS_${data2[0].plots[1].name}`)}</span>
              <span>{t(`DSS_${data2[0].plots[2].name}`)}</span>
            </span>
          )}
          {data2.map((dat, i) => {
            return (
              <span
                className={"tab-rows"}
                style={{
                  background: i % 2 == 0 ? "none" : "#EEEEEE",
                }}
              >
                <span>{t(`DSS_${dat.plots[1].label}`)}</span>
                <span>{dat.plots[2].value}</span>
              </span>
            );
          })}
        </div>
     </ResponsiveContainer> );
  
}


export default MapDrillChart;