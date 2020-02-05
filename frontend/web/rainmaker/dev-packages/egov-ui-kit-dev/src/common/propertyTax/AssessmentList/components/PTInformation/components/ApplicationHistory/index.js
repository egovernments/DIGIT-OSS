import { compose } from "recompose";
import { Button } from "components";
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import HistoryCard from "../../../../../Property/components/HistoryCard";
import { getFormattedDate } from "../../../../../../../utils/PTCommon";
import { getFullRow } from "../AssessmentHistory";
import { downloadReceipt } from "egov-ui-kit/redux/properties/actions";

class ApplicationHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            showItems: false,
            errorMessage: "PT_APPLICATION_HISTORY_ERROR"
        };
    }
    getTransformedPaymentHistory() {
        const labelStyle = {
            letterSpacing: 1.2,
            fontWeight: "600",
            lineHeight: "35px",
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
        const { Payments = [], downloadReceipt } = this.props;
        const paymentHistoryItems = [];
        return paymentHistoryItems;
    }
    render() {
        const { Payments = [] } = this.props;
        let paymentHistoryItem = [];
        if (Payments.length > 0) {
            paymentHistoryItem = this.getTransformedPaymentHistory();
        }
        const items = this.state.showItems ? this.state.items : [];
        const errorMessage = this.state.showItems && items.length == 0 ? this.state.errorMessage : '';
        return (<HistoryCard header={'PT_APPLICATION_HISTORY'} items={items} errorMessage={errorMessage} onHeaderClick={() => {
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

const mapDispatchToProps = (dispatch) => {
    return {
        downloadReceipt: (receiptQueryString) => dispatch(downloadReceipt(receiptQueryString)),
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ApplicationHistory);