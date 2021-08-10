import React, { Component } from "react";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { connect } from "react-redux";
import get from "lodash/get";

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
  borderBottom: "1px solid rgba(5, 5, 5, 0.12)",
  margin:"15px 0px"
};

class DividerWithLabel extends Component {
  render() {
    const { labelProps, label, localizationLabels } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
   
    if(label.labelKey === "WS_TASK_PROP_OWN_HEADER" && this.props.propertyOwners &&  this.props.propertyOwners.length > 1){
      let componentJsonpath = this.props.componentJsonpath;
      translatedLabel = translatedLabel + " "+ (parseInt(componentJsonpath.split('items[')[1][0])+1)
    }
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

const mapSateToProps = (state, ownprops) => {
  const { app, screenConfiguration } = state;
  const { localizationLabels } = app;
  const { componentJsonpath } = ownprops;
  let propertyOwners = [];
  if(ownprops.label.labelKey === "WS_TASK_PROP_OWN_HEADER"){
    propertyOwners = get(
      screenConfiguration.preparedFinalObject,
      "WaterConnection[0].property.owners"
    );
  }
  
  return { localizationLabels, componentJsonpath, propertyOwners};
};

export default connect(
  mapSateToProps,
  null
)(DividerWithLabel);
