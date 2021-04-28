import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000000",
  },
  popper: {
    zIndex: 99999999,
  },
}))(Tooltip);

const ToolTipContainer = (props) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">
            {getLocaleLabels(
              `BILL_${props.toolTipData[0].code.substr(
                0,
                props.toolTipData[0].code.indexOf(".")
              )}_TOOLTIP_MESSAGE`,`BILL_${props.toolTipData[0].code.substr(
                0,
                props.toolTipData[0].code.indexOf(".")
              )}_TOOLTIP_MESSAGE`
            )}
          </Typography>
          {props.toolTipData.map((item, index) => (
            <div>
              <span>{index + 1}.</span>&nbsp;&nbsp;{getLocaleLabels(item.code,item.code)}
            </div>
          ))}
        </React.Fragment>
      }
    >
      <Icon className="toolTipIcon">
        <i class="material-icons" style={{ fontSize: 18 }}>
          info_circle
        </i>
      </Icon>
    </HtmlTooltip>
  );
};

export default ToolTipContainer;
