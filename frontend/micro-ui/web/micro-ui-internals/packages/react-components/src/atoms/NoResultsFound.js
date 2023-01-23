import React from "react";
import { NoResultsFoundIcon } from "./svgindex";
import { useTranslation } from "react-i18next";

const NoResultsFound = () => {
    const {t} = useTranslation();
    return (
        <div className="no-data-found">
              <NoResultsFoundIcon />
              <span className="error-msg">{t("COMMON_NO_RESULTS_FOUND")}</span>
        </div>
    )
}

export default NoResultsFound;