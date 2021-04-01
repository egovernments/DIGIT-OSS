import React from "react";
import { Label } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = theme => ({
  root: {
    marginBottom: 8
  },
  container: {
    paddingBottom: 10
  },
  rightAlign: {
    textAlign: "right"
  }
});

const closebuttonStyle = {
  width: "25px",
  height: "25px",
  color: "#767676"
};

const closeIcon = "close";

const getMultiItem = (billingslabData, classes, style) => {
  return billingslabData.map((item, index) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={9}>
          <LabelContainer
            labelKey={item.taxHeadCode}
            style={{
              color: "rgba(0, 0, 0, 0.6000000238418579)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px",
              marginRight: "10px"
            }}
          />
        </Grid>
        <Grid sm={3} className={classes.rightAlign}>
          <Label
            label={`Rs ${item.estimateAmount}`}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
      </Grid>
    );
  });
};

const getMultiItemForTax = (billingslabData, classes, style) => {
  return billingslabData.map((item, index) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={9}>
          <LabelContainer
            labelKey={item.taxHeadCode}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "16px",
              fontWeigt: 400,
              lineSpacing: "19px",
              marginRight: "10px"
            }}
          />
        </Grid>
        <Grid sm={3} className={classes.rightAlign}>
          <Label
            label={`Rs ${item.estimateAmount}`}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
      </Grid>
    );
  });
};

class ViewBreakupContainer extends React.Component {
  state = {
    style: {
      color: "rgba(0, 0, 0, 0.8700000047683716)",
      fontSize: "20px",
      fontWeigt: 500,
      lineSpacing: "28px",
      marginTop: 25,
      marginRight: 5
    }
  };

  getGridItem = (total, classes, style) => {

    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={9}>
          <LabelContainer
            labelName={"Total"}
            labelKey={"PT_FORM4_TOTAL"}
            style={
              style
                ? style
                : {
                  color: "rgba(0, 0, 0, 0.8700000047683716)",
                  fontSize: "14px",
                  fontWeigt: 400,
                  lineSpacing: "17px",
                  marginRight:"10px"
                }
            }
          />
        </Grid>
        <Grid sm={3} className={classes.rightAlign}>
          <LabelContainer
            labelName={`Rs ${total}`}
            style={
              style
                ? style
                : {
                  color: "rgba(0, 0, 0, 0.8700000047683716)",
                  fontSize: "14px",
                  fontWeigt: 400,
                  lineSpacing: "17px"
                }
            }
          />
        </Grid>
      </Grid>
    );
  };

  handleClose = () => {
    const { screenKey } = this.props;
    this.props.handleField(
      screenKey,
      `components.breakUpDialog`,
      "props.open",
      false
    );
  };

  render() {
    const {
      open,
      appUnitData,
      serviceUnitData,
      appTotal,
      serviceTotal,
      totalAmount,
      taxUnitData,
      taxTotal,
      classes
    } = this.props;
    const { style } = this.state;
    const { getGridItem, handleClose } = this;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        children={[
          serviceTotal > 0 || appTotal > 0 ? (
            <div style={{ padding: "26px" }}>
              <div
                onClick={handleClose}
                style={{ float: "right", cursor: "pointer" }}
              >
                <Icon style={closebuttonStyle}>
                  {" "}
                  <i class="material-icons">{closeIcon} </i>
                </Icon>
              </div>
              <div style={{ paddingBottom: "16px", paddingTop: "8px" }}>
                <LabelContainer
                  labelName="Calculation Breakup"
                  labelKey="WS_CALCULATION_BREAKUP"
                  style={{
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "20px",
                    fontWeigt: 500,
                    lineSpacing: "28px"
                  }}
                />
              </div>
              {appUnitData && appUnitData.length > 0 && (
                <div style={{ paddingBottom: "12px" }}>
                  <LabelContainer
                    labelKey="WS_APPLICATION_FEE_HEADER"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontSize: "16px",
                      fontWeigt: 400,
                      lineSpacing: "19px"
                    }}
                  />
                </div>
              )}
              {appUnitData &&
                appUnitData.length > 0 &&
                getMultiItem(appUnitData, classes)}
              <Divider className={classes.root} />
              {appUnitData &&
                appUnitData.length > 0 &&
                getGridItem(appTotal, classes)}
              {serviceUnitData && serviceUnitData.length > 0 && (
                <div style={{ paddingBottom: "12px", marginTop: 20 }}>
                  <LabelContainer
                    labelKey="WS_SERVICE_FEE_HEADER"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontSize: "16px",
                      fontWeigt: 400,
                      lineSpacing: "19px"
                    }}
                  />
                </div>
              )}
              {serviceUnitData &&
                serviceUnitData.length > 0 &&
                getMultiItem(serviceUnitData, classes)}
              <Divider className={classes.root} />
              {serviceUnitData &&
                serviceUnitData.length > 0 &&
                getGridItem(serviceTotal, classes)}

              {taxUnitData && taxUnitData.length > 0 && (
                getMultiItemForTax(taxUnitData, classes)
              )}
              <Divider className={classes.root} />
              {/* {taxUnitData &&
                taxUnitData.length > 0 &&
                getGridItem(taxTotal, classes)} */}

              {/* {serviceUnitData &&
                serviceUnitData.length > 0 && */}
              {getGridItem(totalAmount, classes, style)}
            </div>
          ) : (
              <div style={{ padding: "16px", width: "500px" }}>
                <div style={{ paddingBottom: "16px" }}>
                  <LabelContainer
                    labelKey="WS_CALCULATION_BREAKUP"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontSize: "20px",
                      fontWeigt: 500,
                      lineSpacing: "28px"
                    }}
                  />
                </div>
                {getGridItem(totalAmount, classes, style)}
              </div>
            )
        ]}
      />
    );
  }
}

const mapStateToProps = (state, ownProps, dispatch) => {
  const { screenConfiguration } = state;
  const { screenKey } = ownProps;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  const serviceUnitData = get(
    preparedFinalObject,
    "dataCalculation.billSlabData.CHARGES"
  );
  const appUnitData = get(
    preparedFinalObject,
    "dataCalculation.billSlabData.FEE"
  );
  const taxUnitData = get(
    preparedFinalObject,
    "dataCalculation.billSlabData.TAX"
  );

  const appTotal = get(
    preparedFinalObject,
    "dataCalculation.fee"
  );
  const serviceTotal = get(
    preparedFinalObject,
    "dataCalculation.charge"
  );

  const totalAmount = get(preparedFinalObject,
    "dataCalculation.totalAmount"
  );

  const taxTotal = get(preparedFinalObject, "dataCalculation.taxAmount");

  const open = get(
    screenConfig,
    `${screenKey}.components.breakUpDialog.props.open`
  );

  return {
    open,
    appUnitData,
    serviceUnitData,
    appTotal,
    serviceTotal,
    taxUnitData,
    taxTotal,
    totalAmount,
    screenKey,
    screenConfig
  };
};

const mapDispatchToProps = dispatch => {
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)) };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ViewBreakupContainer)
);
