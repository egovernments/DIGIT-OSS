import { FormComposer, Header } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { newConfig as newConfigLocal } from "../../../config/wsCreateConfig";

const NewApplication = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [config, setConfig] = React.useState({ head: "", body: [] });

  React.useEffect(() => {
    const config = newConfigLocal.find((conf) => conf.hideInCitizen);
    setConfig(config);
  });

  return (
    <React.Fragment>
      <div style={{ marginLeft: "15px" }}>
        <Header>{t(config.head)}</Header>
      </div>
      <FormComposer config={config.body}></FormComposer>
    </React.Fragment>
  );
};

export default NewApplication;
