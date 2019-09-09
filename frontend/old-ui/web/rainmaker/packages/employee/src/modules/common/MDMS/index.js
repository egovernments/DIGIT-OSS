import React, { Component } from "react";
import Field from "egov-ui-kit/utils/field";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { initForm, resetForm } from "egov-ui-kit/redux/form/actions";
import { fetchSpecs } from "egov-ui-kit/redux/mdms/actions";
import { upperCaseFirst } from "egov-ui-kit/utils/commons";
import { Icon, Button } from "components";
import "./index.css";
import MDMSFormUI from "./MDMSForm";
import MDMSTableUI from "./MDMSTable";

const MDMSForm = ({ handleFieldChange, form, handleClose }) => {
  const { fields, submit } = form || {};
  return (
    <div>
      <div className="mdms-form-wrapper">
        {Object.keys(fields || []).map((fieldKey, index) => {
          const field = fields[fieldKey];
          return (
            <div key={index} className="col-xs-6" style={{ marginBottom: 5 }}>
              <Field fieldKey={fieldKey} field={field} handleFieldChange={handleFieldChange} />
            </div>
          );
        })}
      </div>
      <div className="col-xs-12" style={{ marginTop: 40, marginBottom: 36 }}>
        <div className="col-xs-6" />
        <div className="col-xs-6" style={{ textAlign: "right" }}>
          <Button
            label="CANCEL"
            onClick={handleClose}
            labelStyle={{ letterSpacing: 0.7, padding: 0 }}
            buttonStyle={{ border: "1px solid #fe7a51" }}
            style={{ marginRight: 45, width: "36%" }}
          />
          <Button
            label="ADD"
            style={{ width: "36%" }}
            backgroundColor="#fe7a51"
            labelStyle={{ letterSpacing: 0.7, padding: 0 }}
            buttonStyle={{ border: 0 }}
            {...submit}
          />
        </div>
      </div>
    </div>
  );
};

class MDMS extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      dialogOpen: false,
      defaultPageSize: 5,
      edit: false,
    };
  }

  fetchSpecs = (moduleName, masterName) => {
    const { fetchSpecs, tenantId } = this.props;
    const requestBody = {
      MdmsCriteria: {
        tenantId: tenantId, // To be changed later
        moduleDetails: [
          {
            moduleName,
            masterDetails: [
              {
                name: masterName,
              },
            ],
          },
        ],
      },
    };
    fetchSpecs([], moduleName, masterName, tenantId, requestBody);
  };

  componentDidMount() {
    const { match } = this.props;
    this.fetchSpecs(match.params.moduleName, match.params.masterName);
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    if (this.props.masterName !== nextProps.masterName) {
      this.fetchSpecs(match.params.moduleName, match.params.masterName);
    }
  }

  // hack to prevent form re rendering on form update; necessary because the form hoc is already subscribed to the form
  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextProps.rowData) != JSON.stringify(this.props.rowData) ||
      nextState.dialogOpen != this.state.dialogOpen ||
      nextState.search != this.state.search ||
      nextState.edit != this.state.edit
    );
  }

  onAddClick = () => {
    this.setState({ dialogOpen: true });
  };

  onDialogAddClick = () => {
    this.setState({ dialogOpen: false, edit: false });
  };

  setFieldProperty = (form, fieldKey, propertyKey, propertyValue) => {
    const fields = form.fields || {};
    const field = fields[fieldKey] || {};
    return {
      ...form,
      fields: {
        ...fields,
        [fieldKey]: { ...field, [propertyKey]: propertyValue },
      },
    };
  };

  onEditClick = (rowIndex) => {
    let { form, masterName, rowData, initForm } = this.props;
    const unEditableFields = ["code"];
    rowData = rowData[rowIndex];
    Object.keys(rowData).forEach((fieldKey) => {
      form = this.setFieldProperty(form, fieldKey, "value", rowData[fieldKey]);
      if (unEditableFields.indexOf(fieldKey) > -1) {
        form = this.setFieldProperty(form, fieldKey, "disabled", true);
      }
    });
    form = { ...form, name: `MDMS_${masterName}` };
    initForm(form);
    this.setState({ dialogOpen: true, edit: true });
  };

  onDialogClose = () => {
    const { resetForm, match } = this.props;
    const { masterName } = match.params;
    this.setState({ dialogOpen: false, edit: false });
    resetForm(`MDMS_${masterName}`);
  };

  setHeaders = (header) => {
    let columns = [{ Header: "S. No.", accessor: "SNo" }];
    header &&
      header.map((item) => {
        var label = item.label.split(".").pop();
        if (label.toLowerCase() !== "tenantid") {
          columns.push({
            Header: upperCaseFirst(label),
            accessor: label,
          });
        }
      });
    columns.push({
      Header: "Actions",
      Cell: (row) => <Icon onClick={this.onEditClick.bind(null, row.index)} action="image" name="edit" />,
    });
    return columns;
  };

  transformData = (rowData) => {
    return rowData.map((item, index) => {
      return { ...item, SNo: ++index, active: item.active == true ? "Yes" : "No" };
    });
  };

  render() {
    const { transformData } = this;
    const { defaultPageSize, edit } = this.state;
    const { header, rowData, masterName } = this.props;
    // not a good idea to prepare a hoc in render method
    const MDMSFormHOC = formHoc({ formKey: `MDMS_${masterName}`, edit })(MDMSForm);
    let tableData = transformData(rowData);
    if (this.state.search) {
      tableData = tableData.filter((row) => {
        return row.name.toLowerCase().includes(this.state.search.toLowerCase()) || row.code.toLowerCase().includes(this.state.search.toLowerCase());
      });
    }

    return (
      <div style={{ padding: "16px", width: "100%" }}>
        <MDMSFormUI
          open={this.state.dialogOpen}
          handleClose={this.onDialogClose}
          children={[<MDMSFormHOC key={1} handleClose={this.onDialogClose} onDialogAddClick={this.onDialogAddClick} />]}
          title="Add Entry"
        />
        <MDMSTableUI
          masterName={masterName}
          onSearch={(e) => this.setState({ search: e.target.value })}
          onAddClick={this.onAddClick}
          tableData={tableData}
          columns={this.setHeaders(header)}
          defaultPageSize={defaultPageSize}
          searchValue={this.state.search}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { tenantId } = state.auth.userInfo;
  const { specs, data } = state.mdms;
  const { moduleName, masterName } = ownProps && ownProps.match && ownProps.match.params;
  const form = state.form[`MDMS_${masterName}`] || {};
  const { header } = (specs[moduleName] && specs[moduleName][masterName]) || [];
  const rowData = (data[moduleName] && data[moduleName][masterName]) || [];
  return { header, form, masterName, rowData, tenantId };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSpecs: (queryObj, moduleName, masterName, tenantId, requestBody) =>
      dispatch(fetchSpecs(queryObj, moduleName, masterName, tenantId, requestBody)),
    initForm: (form) => dispatch(initForm(form)),
    resetForm: (formKey) => dispatch(resetForm(formKey)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MDMS);
