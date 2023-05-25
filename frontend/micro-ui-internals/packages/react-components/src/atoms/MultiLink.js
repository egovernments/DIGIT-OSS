import React, { useCallback, useRef } from "react";
import LinkButton from "./LinkButton";
import { PrimaryDownlaodIcon } from "./svgindex";
import { useTranslation } from "react-i18next";

const MultiLink = ({ className, onHeadClick, displayOptions = false, options, label, icon, showOptions }) => {
  const { t } = useTranslation();
  const menuRef = useRef();
  const handleOnClick = useCallback(() => {
    showOptions?.(false)
  }, [])
  Digit.Hooks.useClickOutside(menuRef, handleOnClick, displayOptions);
  return (
    <div className={className} ref={menuRef}>
      <div className="multilink-labelWrap" onClick={onHeadClick}>
        {icon ? icon : <PrimaryDownlaodIcon />}
        <LinkButton label={label || t("CS_COMMON_DOWNLOAD")} className="multilink-link-button" />
      </div>
      {displayOptions ? (
        <div className="multilink-optionWrap">
          {options.map((option, index) => (
            <div onClick={() => option.onClick()} key={index} className="multilink-option">
              {option?.icon}
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MultiLink;
