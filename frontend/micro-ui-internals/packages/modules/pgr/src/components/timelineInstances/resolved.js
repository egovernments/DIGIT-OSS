import React from "react";
import { ActionLinks } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import StarRated from "./StarRated";
import { useTranslation } from "react-i18next";
import Reopen from "./reopen";
//const GetTranslatedAction = (action, t) => t(`CS_COMMON_${action}`);

const Resolved = ({ action, nextActions, rating, serviceRequestId, reopenDate }) => {
  const { t } = useTranslation();
  const __nextActions = [...new Set(nextActions)];
  if (action === "RESOLVE") {
    let actions =
      __nextActions &&
      __nextActions.map(
        (action, index) =>
          action && (
            <Link key={index} to={`/digit-ui/citizen/pgr/${action.toLowerCase()}/${serviceRequestId}`}>
              <ActionLinks>{action}</ActionLinks>
            </Link>
          )
      );
    return (
      <div>
        {t(`CS_COMMON_COMPLAINT_RESOLVED`)} <div>{actions}</div>
      </div>
    );
  } else if (action === "RATE" && rating) {
    return (
      <React.Fragment>
        <div>{t(`CS_COMMON_COMPLAINT_RESOLVED`)}</div>
        <StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={rating} />
      </React.Fragment>
    );
  } else if (action === "REOPEN") {
    return <Reopen text={t(`CS_COMMON_COMPLAINT_REOPENED`)} reopenDate={reopenDate} />;
  } else {
    return <React.Fragment></React.Fragment>;
  }
};

export default Resolved;
