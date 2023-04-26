import _ from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, UnMaskComponent } from "..";
import { PrivacyMaskIcon } from "..";
/**
 * Custom Component to demask the masked values.
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 *
 * @example
 * <WrapUnMaskComponent   privacy={{ uuid: "", fieldName: "name", model: "User" ,hide: false,loadData = {  serviceName="",requestBody={},requestParam=[],jsonPath="",isArray=false}}}   />
 */

const formatValue = (showValue) => {
  return (
    showValue && Digit.Utils.locale.stringReplaceAll(showValue, showValue?.substring(showValue?.indexOf("*"), showValue?.lastIndexOf("*") + 1), "")
  );
};

const WrapUnMaskComponent = React.memo(({ privacy = {}, value, unmaskField, ...rem }) => {
  const [privacyState, setPrivacyState] = useState(false);
  const { loadData = {} } = privacy;
  const { t } = useTranslation();
  const aaa = [
    loadData?.serviceName,
    loadData?.requestParam,
    loadData?.requestBody,
    { recordId: privacy?.uuid, plainRequestFields: Array.isArray(privacy?.fieldName) ? privacy?.fieldName : [privacy?.fieldName] },
    {
      enabled: privacyState,
      select: (data) => {
        if (loadData?.d) {
          return loadData?.d(data, value);
        }
        return unmaskField ? unmaskField(_.get(data, loadData?.jsonPath, value)) : _.get(data, loadData?.jsonPath, value);
      },
    },
  ];
  const { isLoading, data, ...orr } = Digit.Hooks.useCustomAPIHook(...aaa);
  if (isLoading) {
    return !unmaskField ? <Loader /> : <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}><div className={`tooltip`}>
    <PrivacyMaskIcon className="privacy-icon-2" style={{...rem?.style,cursor:"default"}}></PrivacyMaskIcon></div></span>;
  }

  return privacy?.uuid && data ? (
    <React.Fragment>
      {!unmaskField && t(data)}
      {!unmaskField && privacy?.showValue && formatValue(value)}
    </React.Fragment>
  ) : (
    <React.Fragment>
      {!unmaskField && value}
      {privacy && (
        <span style={{ display: "inline-flex", width: "fit-content", marginLeft: "10px" }}>
          <UnMaskComponent
            privacy={privacy}
            unmaskData={() => {
              privacy?.uuid && loadData && setPrivacyState(true);
            }}
            {...rem}
          ></UnMaskComponent>
        </span>
      )}
    </React.Fragment>
  );
});

WrapUnMaskComponent.propTypes = {
  privacy: PropTypes.object,
};
WrapUnMaskComponent.defaultProps = {
  privacy: { uuid: "", fieldName: "", model: "" },
};

export default WrapUnMaskComponent;
