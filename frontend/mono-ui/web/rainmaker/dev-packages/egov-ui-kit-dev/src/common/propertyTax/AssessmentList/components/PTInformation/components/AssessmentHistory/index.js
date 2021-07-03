import { Button } from "components";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { formWizardConstants, getPropertyLink, PROPERTY_FORM_PURPOSE } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { getFormattedDate } from "../../../../../../../utils/PTCommon";
import HistoryCard from "../../../../../Property/components/HistoryCard";

export const getFullRow = (labelKey, labelValue, rowGrid = 12) => {
    let subRowGrid = 1;
    if (rowGrid == 6) {
        subRowGrid = 2;
    }
    return (<div className={`col-sm-${rowGrid} col-xs-12`} style={{ marginBottom: 1, marginTop: 1 }}>
        <div className={`col-sm-${2 * subRowGrid} col-xs-4`} style={{ padding: "3px 0px 0px 0px" }}>
            <Label
                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px !important" }}
                label={labelKey}
                fontSize="14px"
            />
        </div>
        <div className={`col-sm-${4 * subRowGrid} col-xs-8`} style={{ padding: "3px 0px 0px 0px", paddingLeft: rowGrid == 12 ? '10px' : '15px' }}>
            <Label
                labelStyle={{ letterSpacing: "0.47px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px !important" }}
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

    getLatestAssessments(Assessments = []) {
        let latestAssessments = [];
        let financialYears = [];
        Assessments.sort((a1, a2) => a2.assessmentDate - a1.assessmentDate);

        Assessments.map(Assessment => {
            if (!financialYears.includes(Assessment.financialYear)) {
                latestAssessments.push(Assessment);
                financialYears.push(Assessment.financialYear);
            }

        })
        return latestAssessments;
    }
    getTransformedAssessmentHistory() {
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
        const { Assessments = [], history, propertyId } = this.props;

        const assessmentHistoryItems = this.getLatestAssessments(Assessments).map((Assessment) => {
            return (
                <div>
                    {getFullRow("PT_HISTORY_ASSESSMENT_DATE", Assessment.assessmentDate ? getFormattedDate(Assessment.assessmentDate) : "NA", 12)}
                    {getFullRow("PT_ASSESSMENT_NO", Assessment.assessmentNumber ? Assessment.assessmentNumber : "NA", 12)}
                    {getFullRow("PT_ASSESSMENT_YEAR", Assessment.financialYear ? Assessment.financialYear : "NA", 6)}

                    <div className="col-sm-6 col-xs-12" style={{ marginBottom: 1, marginTop: 1 }}>
                        <div className="assess-history" style={{ float: "right" }}>
                            <Button
                                label={<Label buttonLabel={true} label={formWizardConstants[PROPERTY_FORM_PURPOSE.REASSESS].parentButton} color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />}
                                buttonStyle={buttonStyle}
                                onClick={() => {
                                    if (this.props.selPropertyDetails.status != "ACTIVE") {
                                        this.props.toggleSnackbarAndSetText(
                                            true,
                                            { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
                                            "error"
                                        );
                                    } else {
                                        history &&
                                            history.push(getPropertyLink(propertyId, Assessment.tenantId, PROPERTY_FORM_PURPOSE.REASSESS, Assessment.financialYear, Assessment.assessmentNumber)
                                            );
                                    }
                                    // lastElement.onClick();
                                }}
                            ></Button>
                        </div>

                    </div >

                </div>)

        })
        return assessmentHistoryItems;
    }

    render() {
        let { propertyDetails = [], propertyId, Assessments = [] } = this.props;
        if (Assessments.length > 0) {
            Assessments = this.getTransformedAssessmentHistory();
        }
        const items = this.state.showItems ? this.state.items : [];
        const errorMessage = this.state.showItems && items.length == 0 ? this.state.errorMessage : '';
        return (<HistoryCard header={'PT_ASSESMENT_HISTORY'} items={items} errorMessage={errorMessage} onHeaderClick={() => {
            this.setState({ showItems: !this.state.showItems, items: Assessments })
        }}></HistoryCard>)
    }

}



const mapStateToProps = (state, ownProps) => {
    const { propertiesById, Assessments = [] } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
    const selPropertyDetails = propertiesById[propertyId] || {};
    const propertyDetails = selPropertyDetails.propertyDetails || [];
    return {
        selPropertyDetails,
        propertyDetails,
        propertyId,
        Assessments
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    };
};




export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(AssessmentHistory);