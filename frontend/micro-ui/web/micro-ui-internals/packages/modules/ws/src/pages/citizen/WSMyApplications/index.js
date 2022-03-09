import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WSApplication from "./ws-application";
import { propertyCardBodyStyle } from "../../../utils";

export const WSMyApplications = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  let filter = window.location.href.split("/").pop();
  let t1;
  let off;
  if (!isNaN(parseInt(filter))) {
    off = filter;
    t1 = parseInt(filter) + 50;
  } else {
    t1 = 4;
  }
  console.log(user,"user");
  let filter1 = !isNaN(parseInt(filter))
    ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber }
    : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber };

  const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });

  const { isLoading: isSWLoading, isError : isSWError, error : SWerror, data: SWdata } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1,BusinessService:"SW"}, { filters: filter1 });
  if (isLoading || isSWLoading) {
    return <Loader />;
  }
  const { WaterConnection: WSapplicationsList } = data || {};
  const { SewerageConnections: SWapplicationsList } = SWdata || {};
  const applicationsList =WSapplicationsList.concat(SWapplicationsList)
  console.log(applicationsList);
  return (
    <React.Fragment>
      <Header>{`${t("My Applications")} ${applicationsList ? `(${applicationsList.length})` : ""}`}</Header>
      <div>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <WSApplication application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}

        {/* {applicationsList?.length !== 0 && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("PT_LOAD_MORE_MSG")}{" "}
              <span className="link">{<Link to={`/digit-ui/citizen/pt/property/my-applications/${t1}`}>{t("PT_COMMON_CLICK_HERE")}</Link>}</span>
            </p>
          </div>
        )} */}
      </div>

      {/* <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("PT_TEXT_NOT_ABLE_TO_FIND_THE_APPLICATION")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/pt/property/new-application/info">{t("PT_COMMON_CLICK_HERE_TO_REGISTER_NEW_PROPERTY")}</Link>
        </span>
      </p> */}
    </React.Fragment>
  );
};
