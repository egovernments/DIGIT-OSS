import { Card, CardSubHeader, CardText, Header, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MyProperty from "./my-properties";
import { propertyCardBodyStyle } from "../../../utils";

export const MyProperties = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  let filter = window.location.href.split("/").pop();
  let t1;
  let off;
  if (!isNaN(parseInt(filter))) {
    off = filter;
    t1 = parseInt(filter) + 50;
  } else {
    t1 = 4;
  }
  let filter1 = !isNaN(parseInt(filter))
    ? { limit: "50", sortOrder: "ASC", sortBy: "createdTime", offset: off }
    : { limit: "4", sortOrder: "ASC", sortBy: "createdTime", offset: "0" };
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ filters: filter1 }, { filters: filter1 });

  if (isLoading) {
    return <Loader />;
  }

  const { Properties: applicationsList } = data || {};

  return (
    <React.Fragment>
      <Header>{`${t("PT_MY_PROPERTIES_HEADER")} ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 14em)" }}>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <MyProperty application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_PROP_FOUND_MSG")}</p>}

        {applicationsList?.length !== 0 && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("PT_LOAD_MORE_MSG")}{" "}
              <span className="link">{<Link to={`/digit-ui/citizen/pt/property/my-properties/${t1}`}>{t("PT_COMMON_CLICK_HERE")}</Link>}</span>
            </p>
          </div>
        )}
      </div>
      <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("PT_TEXT_NOT_ABLE_TO_FIND_THE_APPLICATION")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/pt/property/new-application/info">{t("PT_COMMON_CLICK_HERE_TO_REGISTER_NEW_PROPERTY")}</Link>
        </span>
      </p>
    </React.Fragment>
  );
};
