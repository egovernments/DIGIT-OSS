import { compose } from "recompose";
import { Button } from "components"
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import HistoryCard from "../../../../../Property/components/HistoryCard";
import { getFormattedDate } from "../../../../../../../utils/PTCommon";
class AssessmentHistory extends Component {



    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showItems: false,
        };
    }


    getTransformedPaymentHistory() {
        const labelStyle = {
            letterSpacing: 1.2,
            fontWeight: "600",
            lineHeight: "40px",
        };
        const buttonStyle = {
            float: 'right',
            lineHeight: "35px",
            height: "35px",
            backgroundColor: "rgb(242, 242, 242)",
            boxShadow: "none",
            border: "1px solid rgb(254, 122, 81)",
            borderRadius: "2px",
            outline: "none",
            alignItems: "right",
        };
        const { propertyDetails = [] } = this.props;
        const paymentHistoryItems = propertyDetails.map((propertyDetail) => {
            return (
                <div>

                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_ASSESSMENT_DATE"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={propertyDetail.assessmentDate ? getFormattedDate(propertyDetail.assessmentDate)  : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_ASSESSMENT_NO"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={propertyDetail.assessmentNumber ? propertyDetail.assessmentNumber : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_ASSESSMENT_YEAR"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-8 col-xs-8" style={{ padding: "3px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={propertyDetail.financialYear ? propertyDetail.financialYear : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div style={{ float: "right" }}>
                            <Button
                                label={<Label buttonLabel={true} label='PT_RE_ASSESS' color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />}
                                buttonStyle={buttonStyle}
                                onClick={() => {
                                    // lastElement.onClick();
                                }}
                            ></Button>
                        </div>

                    </div >

                </div>)

        })
        return paymentHistoryItems;
    }

    render() {
        const { propertyDetails = [], propertyId } = this.props;
        const assessmentHistoryItems = propertyDetails.map((propertyDetail) => {
            return {
                financialYear: propertyDetail.financialYear,
                assessmentNumber: propertyDetail.assessmentNumber,
                assessmentDate: propertyDetail.assessmentDate,
                tenantId: propertyDetail.tenantId,
                propertyId
            }
        })

        console.log(assessmentHistoryItems);
        let paymentHistoryItems = [];
        if (propertyDetails.length > 0) {
            paymentHistoryItems = this.getTransformedPaymentHistory();
        }

        const items = this.state.showItems ? this.state.items : [];
        return (<HistoryCard header={'PT_ASSESMENT_HISTORY'} items={items}  onHeaderClick={() => {
            console.log("clicked");
            this.setState({ showItems: !this.state.showItems, items: paymentHistoryItems })
        }}></HistoryCard>)
    }

}

const mapStateToProps = (state, ownProps) => {
    const { propertiesById } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
    const selPropertyDetails = propertiesById[propertyId] || {};
    const propertyDetails = selPropertyDetails.propertyDetails || [];

    return {
        propertyDetails,
        propertyId
    };
};



export default compose(
    withRouter,
    connect(
        mapStateToProps,
        null
    )
)(AssessmentHistory);