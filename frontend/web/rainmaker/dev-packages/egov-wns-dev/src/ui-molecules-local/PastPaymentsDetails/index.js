import React, { Component } from "react";
import { connect } from "react-redux";
import BreadCrumbs from "../../ui-atoms-local/BreadCrumbs";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import Grid from '@material-ui/core/Grid';
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { getItemStatus } from "../common/AssessmentList"
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

const secondaryTextLabelStyle = {
  letterSpacing: 0.5
};

const primaryTextLabelStyle = {
  letterSpacing: 0.6
};

const secondaryTextContainer = {
  marginTop: 0
};

const innerDivStyle = {
  padding: "0px",
  borderBottom: "1px solid #e0e0e0"
};
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};
class PastPayments extends Component {
  iconStyle = {
    marginLeft: "10px",
    height: "20px"
  };

  render() {
    const { urls, pastPaymentsDetails } = this.props;
    let name = JSON.parse(getUserInfo()).name ? JSON.parse(getUserInfo()).name : "-"
    const date = (from, to) => {
      if (from !== undefined && to !== 'NA') { return convertEpochToDate(from) + " - " + convertEpochToDate(to); }
      else { return "NA" }
    }
    const data = pastPaymentsDetails.map((element) =>
      <div style={{ marginLeft: '0px', padding: '0px', position: 'relative', borderBottom: '1px solid  rgb(224, 224, 224)', flexgrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={8} >
            <div className="incomplete-assesment-info">
              <Label
                label={`INR ${element.totalAmountPaid}`}
                fontSize="16px"
                color="#484848"
                labelStyle={primaryTextLabelStyle}
                bold={true}
              />
              <div style={{ height: "auto" }}>
                <Label
                  label={`${date(element.paymentDetails[0].bill.billDetails[0].fromPeriod, element.paymentDetails[0].bill.billDetails[0].toPeriod)}`}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>
              <div style={{ height: "auto" }}>
                <Label
                  label={`Consumer No : ${element.paymentDetails[0].bill.consumerCode}`}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>
              <div style={{ height: "auto" }}>
                <Label
                  label={`Owner Name : ${name}`}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>
              <div style={{ height: "auto" }}>
                <Label
                  label={`Amount Paid : ${element.totalAmountPaid}`}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>
              <div style={{ height: "auto" }}>
                <Label
                  label={element.payerAddress ? element.payerAddress : "NA"}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>


            </div>
          </Grid>
          <Grid item xs={4} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            placeContent: "flex-end"
          }}>
            <div style={{ textAlign: "end" }}>
              <Label
                label={`${convertEpochToDate(element.transactionDate)}`}
                fontSize="14px"
                color="#484848"
                labelStyle={primaryTextLabelStyle}
                bold={false}
              />
              <div style={{ height: "auto" }}>
                {getItemStatus(element.totalDue, element.totalAmountPaid, element.paymentDetails[0].bill.tenantId, element.paymentDetails[0].bill.consumerCode,'',element.paymentDetails[0].businessService)}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
    return (
      <div class="screen screen-with-bredcrumb">
        <BreadCrumbs url={urls} history="" label="WS_COMMON_PAST_PAYMENTS"/>
        <div className="form-without-button-cont-generic">
          <div className="rainmaker-card clearfix property-tax-card">
            <div className="list-main-card">
              <div style={{ padding: '0px 20px', background: 'rgb(255, 255, 255)' }}>
                {
                  pastPaymentsDetails && pastPaymentsDetails.length > 0 ? (
                    data
                  ) : (
                      <div style={{
                        display: "flex",
                        width: "100%",
                        height: '50vh',
                        alignItems: 'center',
                        justifyContent: "center",
                        textAlign: "center"
                      }}>
                        <LabelContainer
                          labelKey={"No results Found!"}
                        />
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
const mapStateToProps = state => {
  const pastPaymentsForWater = get(
    state.screenConfiguration.preparedFinalObject,
    "pastPaymentsForWater",
    []
  );
  const pastPaymentsForSewerage = get(
    state.screenConfiguration.preparedFinalObject,
    "pastPaymentsForSewerage",
    []
  );
  const pastPaymentsDetails = pastPaymentsForWater.concat(pastPaymentsForSewerage)
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, pastPaymentsDetails };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path))
    // handleField: (screenKey, jsonPath, fieldKey, value) =>
    //   dispatch(handleField(screenKey, jsonPath, fieldKey, value))
  };
};
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PastPayments)
);
