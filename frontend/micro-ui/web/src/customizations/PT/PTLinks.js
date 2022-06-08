import { CaseIcon, CitizenHomeCard } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export const PTLinks = ({ matchPath, userType }) => {

    const { t } = useTranslation();
    let PTlinksPath = matchPath; 
    PTlinksPath = PTlinksPath.substr(0, PTlinksPath.length - 2);
    
    const [params, setParams, clearParams] = window.Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {});

    useEffect(() => {
      clearParams();
    }, []);

    /* const links = [
      {
        link: "/citizen/property-tax",
        i18nKey: t("PROPERTYTAX_HOME"),
      },
      {
        link: "/citizen/pt-mutation/propertySearch",
        i18nKey: t("PT_PAY_PROPERTYTAX"),
      },
      {
        link: "/citizen/property-tax/my-properties",
        i18nKey: t("PT_MY_PROPERTIES"),
      },
      {
        link: "/citizen//pt-mutation/my-applications",
        i18nKey: t("PT_MY_APPLICATIONS"),
      },
    ]; */

   

    //return <CitizenHomeCard header={t("ACTION_TEST_PT")} links={links} Icon={() => <CaseIcon className="fill-path-primary-main" />} />;
    return (
        <div className="CitizenHomeCard">
          <div className="header">
            <h2>PT</h2>
          </div>

          <div className="links">
            <a href="/citizen/property-tax">{t("PROPERTYTAX_HOME")}</a>
            <a href="/citizen/pt-mutation/propertySearch">{t("PT_PAY_PROPERTYTAX")}</a>
            <a href="/citizen/property-tax/my-properties">{t("PT_MY_PROPERTIES")}</a>
            <a href="/citizen/pt-mutation/my-applications">{t("PT_MY_APPLICATIONS")}</a>
          </div>
        </div>
    );
  };

const customize = (props) => {
    window.Digit.ComponentRegistryService.setComponent("PTLinks", PTLinks);
    return <PTLinks {...props}/>
  };

  export default customize;