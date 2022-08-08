import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

import { newConfig } from "../../../components/config/config";

const Create = () => {
  
  const { t } = useTranslation();

  
  /* use newConfig instead of commonFields for local development in case needed */

  const configs = newConfig?newConfig:newConfig;

  return (
    <FormComposer
    heading={t("Create Birth Registration")}
    label={t("ES_COMMON_APPLICATION_SUBMIT")}
    config={configs.map((config) => {
      return {
        ...config,
        body: config.body.filter((a) => !a.hideInEmployee),
      };
    })}
    // config={configs}
    fieldStyle={{ marginRight: 0 }}
  />
  );
};

export default Create;
