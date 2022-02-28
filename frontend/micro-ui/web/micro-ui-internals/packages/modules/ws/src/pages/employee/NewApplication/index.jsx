import { FormComposer, Header } from "@egovernments/digit-ui-react-components";
import {newAppConfig} from '../../../config/employee/newApplication/config';
import React from "react";
import { useTranslation } from "react-i18next";

const NewApplication = () => {
  const { t } = useTranslation();

  const getConfig = () => {
    const configs = [];

    // newConfig = newConfig ? newConfig : newConfigTL;
    // newConfig?.map((conf) => {
    //   if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT" && conf.head) {
    //     configs.push(conf);
    //   }
    // });

    return configs;
  };

  return (
    <React.Fragment>
      <div style={{ marginLeft: "15px" }}>
        <Header>{t("APPLICATION FOR NEW WATER & SEWERAGE CONNECTION")}</Header>
      </div>
      <FormComposer config={newAppConfig}></FormComposer>
    </React.Fragment>
  );
};

export default NewApplication;
