import { compose } from "recompose";
import {  Button } from "components";
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import HistoryCard from "../../../../../Property/components/HistoryCard";
import { getFormattedDate } from "../../../../../../../utils/PTCommon";
class PaymentHistory extends Component {
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
        const { Payments = [] } = this.props;
        const paymentHistoryItems = Payments.map((payment) => {
            return (
                <div>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_RECEIPT_NO"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={payment.paymentDetails[0].receiptNumber? payment.paymentDetails[0].receiptNumber: "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_AMOUNT_PAID"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={payment.totalAmountPaid ? 'Rs '+payment.totalAmountPaid : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_PAYMENT_DATE"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={payment.transactionDate ? getFormattedDate(payment.transactionDate) : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div className="col-sm-2 col-xs-2" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_BILL_NO"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={payment.transactionNumber ? ''+payment.transactionNumber : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div className="col-sm-4 col-xs-4" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                                label="PT_HISTORY_BILL_PERIOD"
                                fontSize="15px"
                            />
                        </div>
                        <div className="col-sm-8 col-xs-8" style={{ padding: "5px 0px 0px 0px" }}>
                            <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={payment.transactionNumber ? payment.transactionNumber : "NA"}
                                fontSize="15px"
                            />
                        </div>
                    </div>
                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                        <div style={{ float: "right" }}>
                            <Button
                                label={<Label buttonLabel={true} label="PT_DOWNLOAD_RECEIPT" color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />}
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
        console.log(this.props.Bill, 'bill');
        console.log(this.props.Payments, 'Payments');
        const { Payments = [] } = this.props;
        const paymentHistoryItems = Payments.map((payment) => {
            return {
                receiptNumber: payment.paymentDetails[0].receiptNumber,
                totalAmountPaid: payment.totalAmountPaid,
                transactionDate: payment.transactionDate,
                transactionNumber: payment.transactionNumber,
                financialYear: ''
            }
        })
        let paymentHistoryItem = [];
        if (Payments.length > 0) {
            paymentHistoryItem = this.getTransformedPaymentHistory();
        }
        console.log(paymentHistoryItems);

        const items = this.state.showItems ? this.state.items : [];
        return (<HistoryCard header={'PT_PAYMENT_HISTORY'} items={items}  onHeaderClick={() => {
            console.log("clicked");
            this.setState({ showItems: !this.state.showItems, items: paymentHistoryItem })
        }}></HistoryCard>)
    }
}


const mapStateToProps = (state, ownProps) => {
    const { Bill = [], Payments = [] } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);

    return {
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
)(PaymentHistory);