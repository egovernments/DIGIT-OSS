import { CaseIcon, CitizenHomeCard } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const TLLinks = ({ matchPath, userType }) => {
    const { t } = useTranslation();
    const [params, setParams, clearParams] = window.Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {});

    useEffect(() => {
      clearParams();
    }, []);

    const links = [
      {
        link: `${matchPath}/tradelicence/new-application`,
        i18nKey: t("TL_CREATE_TRADE"),
      },
      {
        link: `${matchPath}/tradelicence/renewal-list`,
        i18nKey: t("TL_RENEWAL_HEADER"),
      },
      {
        link: `${matchPath}/tradelicence/my-application`,
        i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
      },     
    ];

    return <CitizenHomeCard header={t("ACTION_TEST_TRADE_LICENSE")} links={links} Icon={() => <CaseIcon className="fill-path-primary-main" />} />;
  };

const customize = (props) => {
    window.Digit.ComponentRegistryService.setComponent("TLLinks", TLLinks);
    return <TLLinks {...props}/>
  };

  export default customize;