import React, { Component } from "react";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { connect } from "react-redux";

const labelStyle = {
  position: "relative",
  fontFamily: "Roboto",
  fontSize: 14,
  letterSpacing: 0.6,
  padding: "5px 0px",
  display: "inline-block"
};

const underlineStyle = {
  position: "absolute",
  bottom: -1,
  borderBottom: "2px solid #FE7A51",
  width: "100%"
};

const dividerStyle = {
  borderBottom: "1px solid rgba(5, 5, 5, 0.12)"
};

class DividerWithLabel extends Component {
  render() {
    const { labelProps, label, localizationLabels } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    return (
      <div style={dividerStyle}>
        <div style={{ ...labelStyle, ...labelProps.style }}>
          <span>{translatedLabel}</span>
          <div style={underlineStyle} />
        </div>
      </div>
    );
  }
}

const mapSateToProps = state => {
  const { app } = state;
  const { localizationLabels } = app;
  return { localizationLabels };
};

export default connect(
  mapSateToProps,
  null
)(DividerWithLabel);
