import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Banner, Card, LinkLabel, AddFileFilled, ArrowLeftWhite, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";

const Response = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryStrings = Digit.Hooks.useQueryParams();
  const [isResponseSuccess, setIsResponseSuccess] = useState(
    queryStrings?.isSuccess === "true" ? true : queryStrings?.isSuccess === "false" ? false : true
  );
  const { state } = useLocation();

  const navigate = (page) => {
    switch (page) {
      case "home": {
        history.push(`/${window.contextPath}/employee`);
      }
    }
  };

  return (
    <Card>
      <Banner
        successful={isResponseSuccess}
        message={t(state?.message || "SUCCESS")}
        info={`${state?.showID ? t("CONTRACTS_WO_ID") : ""}`}
        whichSvg={`${isResponseSuccess ? "tick" : null}`}
      />
      <div style={{ display: "flex" }}>
        <LinkLabel style={{ display: "flex", marginRight: "3rem" }} onClick={() => navigate("home")}>
          <ArrowLeftWhite fill="#F47738" style={{ marginRight: "8px", marginTop: "3px" }} />
          {t("CORE_COMMON_GO_TO_HOME")}
        </LinkLabel>
      </div>
      <ActionBar>
        <Link to={`/${window.contextPath}/employee`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default Response;
