import { compose } from "recompose";
import { Button } from "components"
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import HistoryCard from "../../../../../Property/components/HistoryCard";
import { getFormattedDate } from "../../../../../../../utils/PTCommon";

export const getFullRow = (labelKey, labelValue, rowGrid = 12) => {
    let subRowGrid = 1;
    if (rowGrid == 6) {
        subRowGrid = 2;
    }
    return (<div className={`col-sm-${rowGrid} col-xs-12`} style={{ marginBottom: 1, marginTop: 1 }}>
        <div className={`col-sm-${2 * subRowGrid} col-xs-4`} style={{ padding: "3px 0px 0px 0px" }}>
            <Label
                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                label={labelKey}
                fontSize="14px"
            />
        </div>
        <div className={`col-sm-${4 * subRowGrid} col-xs-8`} style={{ padding: "3px 0px 0px 0px", paddingLeft: rowGrid == 12 ? '10px' : '15px' }}>
            <Label
                labelStyle={{ letterSpacing: "0.47px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                label={labelValue}
                fontSize="14px"
            />
        </div>
    </div>)
}


class AssessmentHistory extends Component {



    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showItems: false,
            errorMessage: "PT_ASSESSMENT_HISTORY_ERROR"
        };
    }

    getTotalBillAmount(bills, financialAssmntYr) {
        let totalBillAmount = 0;
        if (bills.length > 0) {
            for (let bill of bills) {

                if (bill && bill.billDetails && financialAssmntYr) {

                    for (let billDetail of bill.billDetails) {
                        const { fromPeriod, toPeriod, amount } = billDetail;

                        const fromYearOfBill = new Date(fromPeriod).getFullYear();
                        const toYear = new Date(toPeriod).getFullYear();
                        const toYearOfBill = parseInt(String(toYear).substr(2, 3));
                        const assmntStrtYr = parseInt(String(financialAssmntYr).substring(0, 4))
                        const assmntEndYr = parseInt(String(financialAssmntYr).substr(5, 6))


                        if (fromYearOfBill === assmntStrtYr && toYearOfBill === assmntEndYr)
                            totalBillAmount += amount;
                    }
                }
            }
        }
        return totalBillAmount;
    }


    getTotalPaymentAmount(bills, financialAssmntYr) {
        let totalBillAmount = 0;
        if (bills) {

            const { billDetails } = bills;
            if (billDetails && financialAssmntYr) {

                for (let billDetail of billDetails) {
                    const { fromPeriod, toPeriod, amount } = billDetail;

                    const fromYearOfBill = new Date(fromPeriod).getFullYear();
                    const toYear = new Date(toPeriod).getFullYear();
                    const toYearOfBill = parseInt(String(toYear).substr(2, 3));
                    const assmntStrtYr = parseInt(String(financialAssmntYr).substring(0, 4))
                    const assmntEndYr = parseInt(String(financialAssmntYr).substr(5, 6))


                    if (fromYearOfBill === assmntStrtYr && toYearOfBill === assmntEndYr)
                        totalBillAmount += amount;
                }
            }
        }
        return totalBillAmount;
    }

    getTotalTaxAmntForAssessmntYr(bills, payments, financialAssmntYr) {

        let totalTaxAmount = 0;
        let totalPaymentAmount = 0;
        let totalBillAmount = this.getTotalBillAmount(bills, financialAssmntYr);

        if (payments.length > 0) {

            const { paymentDetails } = payments[0];

            for (let paymentdetail of paymentDetails) {
                let { bill } = paymentdetail;
                totalPaymentAmount += this.getTotalPaymentAmount(bill, financialAssmntYr);

            }
        }

        totalTaxAmount = totalBillAmount + totalPaymentAmount;

        return totalTaxAmount + "";

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


        const { propertyDetails = [], history, propertyId, Bill: bill, Payments: payments } = this.props;

        const paymentHistoryItems = propertyDetails.map((propertyDetail) => {
            const taxAmount = this.getTotalTaxAmntForAssessmntYr(bill, payments, propertyDetail.financialYear);
            return (
                <div>
                    {getFullRow("PT_HISTORY_ASSESSMENT_DATE", propertyDetail.assessmentDate ? getFormattedDate(propertyDetail.assessmentDate) : "NA", 12)}
                    {getFullRow("PT_ASSESSMENT_NO", propertyDetail.assessmentNumber ? propertyDetail.assessmentNumber : "NA", 12)}
                    {getFullRow("PT_ASSESSMENT_YEAR", propertyDetail.financialYear ? propertyDetail.financialYear : "NA", 12)}
                    {getFullRow("PT_ASSESSMENT_AMOUNT", taxAmount, 6)}
                    {/* Commenting add and assess property for 10 dec release
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div className="assess-history" style={{ float: "right" }}>
                            <Button
                                label={<Label buttonLabel={true} label='PT_RE_ASSESS' color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />}
                                buttonStyle={buttonStyle}
                                onClick={() => {
                                    history &&
                                        history.push(
                                            `/property-tax/assessment-form?FY=${propertyDetail.financialYear}&assessmentId=${propertyDetail.assessmentNumber}&isAssesment=false&isReassesment=true&propertyId=${
                                            propertyId
                                            }&tenantId=${propertyDetail.tenantId}`
                                        );
                                    // lastElement.onClick();
                                }}
                            ></Button>
                        </div>

                            </div > */}

                </div>)

        })
        return paymentHistoryItems;
    }

    render() {
        const { propertyDetails = [], propertyId } = this.props;
        let paymentHistoryItems = [];
        if (propertyDetails.length > 0) {
            paymentHistoryItems = this.getTransformedPaymentHistory();
        }
        // console.log(this.props,'props');
        const items = this.state.showItems ? this.state.items : [];
        const errorMessage = this.state.showItems && items.length == 0 ? this.state.errorMessage : '';
        return (<HistoryCard header={'PT_ASSESMENT_HISTORY'} items={items} errorMessage={errorMessage} onHeaderClick={() => {
            console.log("clicked");
            this.setState({ showItems: !this.state.showItems, items: paymentHistoryItems })
        }}></HistoryCard>)
    }

}

const mapStateToProps = (state, ownProps) => {
    const { propertiesById, Bill = [], Payments = [] } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
    const selPropertyDetails = propertiesById[propertyId] || {};
    const propertyDetails = selPropertyDetails.propertyDetails || [];

    return {
        propertyDetails,
        propertyId,
        Bill,
        Payments
    };
};



export default compose(
    withRouter,
    connect(
        mapStateToProps,
        null
    )
)(AssessmentHistory);