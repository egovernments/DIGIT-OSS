import React from "react";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { getLocaleLabelsforTL } from "../../ui-utils/commons";
import { transformById } from "../../ui-config/screens/specs/utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));

function SimpleTooltips(props) {
  const { val, ...rest } = props;
  let transfomedKeys = transformById(localizationLabels, "code");
  let translatedLabel = getLocaleLabelsforTL(
    val.value,
    val.key,
    transfomedKeys
  );
  return (
    <div {...rest}>
      <Tooltip title={translatedLabel}>
        <Icon style={{ color: "rgba(0, 0, 0, 0.3799999952316284)" }}>
          info_circle
        </Icon>
      </Tooltip>
    </div>
  );
}

SimpleTooltips.propTypes = {
  classes: PropTypes.object.isRequired
};

export default SimpleTooltips;
