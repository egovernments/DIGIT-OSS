import React from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { ActionDialog } from "../";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { Container, Item } from "egov-ui-framework/ui-atoms";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import MenuButton from "egov-ui-framework/ui-atoms/MenuButton";
import { getDownloadItems } from "./downloadItems";
import get from "lodash/get";
import "./index.css";

class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: []
  };

  getDownloadData = () => {
    const { Licenses, state } = this.props;
    const { status, applicationNumber } = (Licenses && Licenses[0]) || "";
    return {
      label: "Download",
      leftIcon: "cloud_download",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      menu: getDownloadItems(status, applicationNumber, state).downloadMenu
      // menu: ["One ", "Two", "Three"]
    };
  };

  getPrintData = () => {
    const { Licenses, state } = this.props;
    const { status, applicationNumber } = (Licenses && Licenses[0]) || "";
    return {
      label: "Print",
      leftIcon: "print",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      // menu: ["One ", "Two", "Three"]
      menu: getDownloadItems(status, applicationNumber, state).printMenu
    };
  };

  openActionDialog = async item => {
    const { handleFieldChange, setRoute } = this.props;
    let employeeList = [];
    handleFieldChange("Licenses[0].comment", "");
    handleFieldChange("Licenses[0].assignee", "");
    if (item.isLast) {
      const url = process.env.NODE_ENV === "development" ? item.buttonUrl : `employee/${item.buttonUrl}` ;
      window.location.href = `${window.origin}/${url}`;
      return;
    }
    if (item.showEmployeeList) {
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        }
      ];
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "",
        queryObj
      );
      employeeList =
        payload &&
        payload.Employees.map((item, index) => {
          const name = get(item, "user.name");
          return {
            value: item.uuid,
            label: name
          };
        });
    }

    this.setState({ open: true, data: item, employeeList });
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {
      color,
      variant,
      contractData,
      handleFieldChange,
      onDialogButtonClick
    } = this.props;
    const { open, data, employeeList } = this.state;
    const { getPrintData, getDownloadData } = this;
    return (
      <div
        className="apply-wizard-footer"
        id="custom-atoms-footer"
        style={{ textAlign: "right" }}
      >
        <Container>
          <Item xs={12} sm={4} style={{ paddingLeft: "20px" }}>
            <Container>
              <Item xs={12} sm={6}>
                <MenuButton data={getDownloadData()} />
              </Item>

              <Item xs={12} sm={6}>
                <MenuButton data={getPrintData()} />
              </Item>
            </Container>
          </Item>
          <Item xs={12} sm={8}>
            {contractData &&
              contractData.map(item => {
                const { buttonLabel, moduleName } = item;
                return (
                  <Button
                    color={color}
                    variant={variant}
                    onClick={() => this.openActionDialog(item)}
                    style={{
                      minWidth: "200px",
                      height: "48px",
                      marginRight: "45px"
                    }}
                  >
                    <LabelContainer
                      labelName={buttonLabel}
                      labelKey={`WF_${moduleName.toUpperCase()}_${buttonLabel}`}
                    />
                  </Button>
                );
              })}
          </Item>
        </Container>
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { Licenses } = preparedFinalObject;
  return { Licenses, state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
