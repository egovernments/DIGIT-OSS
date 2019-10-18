import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Typography from "@material-ui/core/Typography";

// const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));
// const transfomedKeys = transformById(localizationLabels, "code");
const styles = {
  //   backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  //   color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  marginBottom: "35px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};
class ULBSummaryCard extends Component {
  onSelect = value => {
    const { onChange } = this.props;
    //Storing multiSelect values not handled yet
    onChange({ target: { value: value.value } });
  };

  render() {
    const { data, preparedFinalObject, logoBase64, ...rest } = this.props;
    //For multiSelect to be enabled, pass isMultiSelect=true in props.
    return (
      <div style={styles}>
        <img src={logoBase64} width={50} height={61.5} />
        <br />
        <Typography variant="title">{data.corporationName}</Typography>
        {data.corporationAddress}
        <br />
        Contact: {data.corporationContact}
        <br />
        Website: {data.corporationWebsite}
        <br />
        Email: {data.corporationEmail}
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let { sourceJsonPath, data, logopath, logoBase64 } = ownprops;
  data = data
    ? data
    : get(state.screenConfiguration.preparedFinalObject, sourceJsonPath);

  logoBase64 = logoBase64 = logoBase64
    ? logoBase64
    : get(state.screenConfiguration.preparedFinalObject, logopath);

  return { data, logoBase64 };
};

export default connect(
  mapStateToProps,
  null
)(ULBSummaryCard);
