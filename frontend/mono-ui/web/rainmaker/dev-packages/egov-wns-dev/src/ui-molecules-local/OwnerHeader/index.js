import React, { Component } from "react";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { connect } from "react-redux";
import get from "lodash/get";

const labelStyle = {
  position: "relative",
  fontFamily: "Roboto",
  fontSize: 18,
  letterSpacing: 0.6,
  padding: "5px 0px",
  display: "inline-block",
  color: 'black'
};

const dividerStyle = {
};

class OwnerHeader extends Component {
  render() {
    const { labelProps, label, localizationLabels } = this.props;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    if(this.props.propertyOwners &&  this.props.propertyOwners.length > 1){
      let componentJsonpath = this.props.componentJsonpath;
      translatedLabel = translatedLabel + " - "+ (parseInt(componentJsonpath.split('items[')[1][0])+1)
    }

    return (
      <div style={dividerStyle}>
        <div style={{ ...labelStyle, ...labelProps.style }}>
          <span>{translatedLabel}</span>
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
    propertyOwners = get(
      screenConfiguration.preparedFinalObject,
      "applyScreen.property.owners"
    );

  return { localizationLabels, componentJsonpath, propertyOwners};
};

export default connect(
  mapSateToProps,
  null
)(OwnerHeader);
