import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSApplication from "./ws-application";
import { propertyCardBodyStyle } from "../../../utils";

export const WSMyApplications = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
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
    ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber }
    : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber };

  const { isLoading, isError, error, data } = Digit.Hooks.ws.useWnsMyApplication({ filters: filter1 }, { filters: filter1 });
  if (isLoading) {
    return <Loader />;
  }

  const { WaterConnection: applicationsList } = data || {};
  return (
    <React.Fragment>
      <Header>{`${t("CS_TITLE_MY_APPLICATIONS")}  ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      <div>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <WSApplication application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}

        {applicationsList?.length !== 0 && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("PT_LOAD_MORE_MSG")}{" "}
              <span className="link">{<Link to={`/digit-ui/citizen/pt/property/my-applications/${t1}`}>{t("PT_COMMON_CLICK_HERE")}</Link>}</span>
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
