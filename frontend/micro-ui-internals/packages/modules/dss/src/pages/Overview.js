import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import Layout from "../components/Layout";

const Overview = () => {
  const { t } = useTranslation();
  const moduleCode = "home";
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{t(response?.[0]?.name)}</Header>
      {response?.responseData?.[0]?.visualizations.map((item, key) => (
        <Layout rowData={item} key={key} />
      ))}
    </div>
  );
};

export default Overview;
