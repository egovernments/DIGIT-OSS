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

    let address = JSON.parse(getUserInfo()).permanentAddress ? JSON.parse(getUserInfo()).permanentAddress : "-"
    const date = (from, to) => {
      let fromDate = new Date(convertEpochToDate(from))
      let toDate = new Date(convertEpochToDate(to))
      return fromDate.getFullYear().toString() + '-' + toDate.getFullYear().toString().substring(2)
    }
    const data = pastPaymentsDetails.map((element) =>
      <div style={{ marginLeft: '0px', padding: '0px', position: 'relative', borderBottom: '1px solid  rgb(224, 224, 224)' }}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={12}>
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
                  label={address}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>
              <div style={{ height: "auto" }}>
                <Label
                  label={`Consumer No. :${element.paymentDetails[0].bill.consumerCode}`}
                  labelStyle={secondaryTextLabelStyle}
                  fontSize="14px"
                  containerStyle={secondaryTextContainer}
                  color="#484848"
                />
              </div>

            </div>
          </Grid>
          <Grid item sm={6} xs={12} style={{ margin: '20px 0px' }}>
            <div style={{ textAlign: "end" }}>
              <Label
                label={`${convertEpochToDate(element.transactionDate)}`}
                fontSize="14px"
                color="#484848"
                labelStyle={primaryTextLabelStyle}
                bold={false}
              />
              <div style={{ height: "auto" }}>
                {getItemStatus(element.totalDue, element.totalAmountPaid)}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
    return (
      <div>
        <BreadCrumbs url={urls} history="" />
        <div className="form-without-button-cont-generic">
          <div className="rainmaker-card clearfix property-tax-card">
            <div className="list-main-card">
              <div style={{ padding: '0px 20px', background: 'rgb(255, 255, 255)' }}>
                {
                  pastPaymentsDetails && pastPaymentsDetails.length > 0 ? (
                    data,
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
  const pastPaymentsDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "pastPayments",
    []
  );
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
