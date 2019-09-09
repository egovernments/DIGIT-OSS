import React, { Component } from "react";
import { Dialog } from "components";
import SingleButtonForm from "./components/SingleButtonForm";
import Label from "egov-ui-kit/utils/translationNode";
import formHoc from "egov-ui-kit/hocs/form";
import { resetFormWizard } from "egov-ui-kit/utils/PTCommon";
import { connect } from "react-redux";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import commonConfig from "config/common.js";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import "./index.css";

const YearDialogueHOC = formHoc({
  formKey: "financialYear",
  path: "PropertyTaxPay",
  isCoreConfiguration: true
})(SingleButtonForm);

class YearDialog extends Component {
  componentDidMount = () => {
    const { fetchGeneralMDMSData, toggleSpinner } = this.props;
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "egf-master",
            masterDetails: [
              {
                name: "FinancialYear",
                filter: "[?(@.module == 'PT')]"
              }
            ]
          }
        ]
      }
    };
    toggleSpinner();
    fetchGeneralMDMSData(requestBody, "egf-master", ["FinancialYear"]);
    toggleSpinner();
  };

  resetForm = () => {
    const { form, removeForm, prepareFormData } = this.props;
    resetFormWizard(form, removeForm);
    prepareFormData("Properties", []);
  };

  render() {
    let { open, closeDialogue, getYearList, history, urlToAppend } = this.props;
    return getYearList ? (
      <Dialog
        open={open}
        children={[
          <div key={1}>
            <div className="dialogue-question">
              <Label
                label="PT_PROPERTY_TAX_WHICH_YEAR_QUESTIONS"
                fontSize="16px"
                color="#484848"
              />
            </div>
            <div className="year-range-botton-cont">
              {Object.values(getYearList).map((item, index) => (
                <YearDialogueHOC
                  key={index}
                  label={item}
                  history={history}
                  resetFormWizard={this.resetForm}
                  urlToAppend={urlToAppend}
                />
              ))}
            </div>
          </div>
        ]}
        bodyStyle={{ backgroundColor: "#ffffff" }}
        isClose={false}
        onRequestClose={closeDialogue}
        contentClassName="year-dialog-content"
        // contentStyle={{ width: "20%" }}
      />
    ) : null;
  }
}

const mapStateToProps = state => {
  const { common, form } = state;
  const { generalMDMSDataById } = common;
  const FinancialYear =
    generalMDMSDataById && generalMDMSDataById.FinancialYear;
  const getYearList = FinancialYear && Object.keys(FinancialYear);
  return { getYearList, form };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) =>
      dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    removeForm: formkey => dispatch(removeForm(formkey)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    prepareFormData: (path, value) => dispatch(prepareFormData(path, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDialog);
