import React from "react";
import LinkButton from "./LinkButton";
import { PrimaryDownlaodIcon } from "./svgindex";
import { useTranslation } from "react-i18next";

const MultiLink = ({ onHeadClick, displayOptions = false, options }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="multilink-labelWrap" onClick={onHeadClick}>
        <PrimaryDownlaodIcon />
        <LinkButton label={t("CS_COMMON_DOWNLOAD")} className="multilink-link-button" />
      </div>
      {displayOptions ? (
        <div className="multilink-optionWrap">
          {options.map((option, index) => (
            <div onClick={option.onClick} key={index} className="multilink-option">
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MultiLink;
