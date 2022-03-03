import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import {
  getNextFinancialYearForRenewal
} from "../../ui-utils/commons";
import { getDownloadItems } from "./downloadItems";
import "./index.css";

class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: []
    //responseLength: 0
  };

  getDownloadData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
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
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
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
    const { handleFieldChange, setRoute, dataPath } = this.props;
    let employeeList = [];
    if (item.buttonLabel === "ACTIVATE_CONNECTION") {
      if (item.moduleName === "NewWS1" || item.moduleName === "NewSW1") {
        item.showEmployeeList = false;
      }
    }
    if (dataPath === "BPA") {
      handleFieldChange(`${dataPath}.comment`, "");
      handleFieldChange(`${dataPath}.wfDocuments`, []);
      handleFieldChange(`${dataPath}.assignees`, "");
    } else if (dataPath === "FireNOCs") {
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.comment`, "");
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.assignee`, []);
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.wfDocuments`, []);
    } else if (dataPath === "Property") {
      handleFieldChange(`${dataPath}.workflow.comment`, "");
      handleFieldChange(`${dataPath}.workflow.assignes`, []);
      handleFieldChange(`${dataPath}.workflow.wfDocuments`, []);
    } else {
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].wfDocuments`, []);
      handleFieldChange(`${dataPath}[0].assignee`, []);
    }

    if (item.isLast) {
      let url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;

      /* Quick fix for edit mutation application */
      if (url.includes('pt-mutation/apply')) {
        url = url + '&mode=MODIFY';
        window.location.href = url.replace("/pt-mutation/", '');
        return;
      }

      setRoute(url);
      return;
    }
    if (item.showEmployeeList && process.env.REACT_APP_NAME !== "Citizen") {
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        }, {
          key: "isActive",
          value: true
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

  renewTradelicence = async (financialYear, tenantId, routeUrl) => {
    const { setRoute, state, toggleSnackbar } = this.props;
    const licences = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses`
    );
    this.props.showSpinner();
    const nextFinancialYear = await getNextFinancialYearForRenewal(
      financialYear
    );
    const AllLicences = get(
      state.screenConfiguration.preparedFinalObject,
      `AllLicences`, []
    );

    if (nextFinancialYear && AllLicences && Array.isArray(AllLicences)) {
      if (AllLicences.filter(licence => licence.financialYear == nextFinancialYear).length > 0) {
        this.props.hideSpinner();

        toggleSnackbar(
          true,
          {
            labelName: "Please fill all the mandatory fields!",
            labelKey: "TL_RENEWAL_APPLICATION_EXITS_ALREADY"
          },
          "error"
        );
        return;
      }
    }
    if (routeUrl) {
      this.props.setRoute(
        routeUrl
      );
      return;
    }
    const wfCode = "DIRECTRENEWAL";
    set(licences[0], "action", "INITIATE");
    set(licences[0], "workflowCode", wfCode);
    set(licences[0], "applicationType", "RENEWAL");
    set(licences[0], "financialYear", nextFinancialYear);

    try {
      const response = await httpRequest(
        "post",
        "/tl-services/v1/_update",
        "",
        [],
        {
          Licenses: licences
        }
      );
      const renewedapplicationNo = get(response, `Licenses[0].applicationNumber`);
      const licenseNumber = get(response, `Licenses[0].licenseNumber`);
      this.props.hideSpinner();
      setRoute(
        `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
      );
    } catch (exception) {
      this.props.hideSpinner();
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all the mandatory fields!",
          labelKey: exception && exception.message || exception
        },
        "error"
      );

    }

  };
  render() {
    const {
      contractData,
      handleFieldChange,
      onDialogButtonClick,
      dataPath,
      moduleName,
      state,
      dispatch
    } = this.props;
    const { open, data, employeeList } = this.state;
    const { isDocRequired } = data;
    const appName = process.env.REACT_APP_NAME;
    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${appName.toUpperCase()}_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: () => {
            (moduleName === "NewTL" || moduleName === "EDITRENEWAL") && buttonLabel === "APPLY" ? onDialogButtonClick(buttonLabel, isDocRequired) :
              this.openActionDialog(item);
          }
        };
      });

    if (moduleName === "NewTL") {
      const status = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].status`
      );
      const applicationType = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationType`
      );
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationNumber`
      );
      const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].tenantId`
      );
      const financialYear = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].financialYear`
      );
      const licenseNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].licenseNumber`
      );
      const responseLength = get(
        state.screenConfiguration.preparedFinalObject,
        `licenseCount`,
        1
      );

      const rolearray =
        getUserInfo() &&
        JSON.parse(getUserInfo()).roles.filter(item => {
          if (
            (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
            item.code == "CITIZEN"
          )
            return true;
        });
      const rolecheck = rolearray.length > 0 ? true : false;
      const validTo = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].validTo`
      );
      const currentDate = Date.now();
      const duration = validTo - currentDate;
      const renewalPeriod = get(
        state.screenConfiguration.preparedFinalObject,
        `renewalPeriod`
      );
      if (rolecheck && (status === "APPROVED" || status === "EXPIRED") &&
        duration <= renewalPeriod) {
        const editButton = {
          label: "Edit",
          labelKey: "WF_TL_RENEWAL_EDIT_BUTTON",
          link: () => {
            const baseURL =
              process.env.REACT_APP_NAME === "Citizen"
                ? "/tradelicense-citizen/apply"
                : "/tradelicence/apply";
            const routeUrl = `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`;
            // this.props.setRoute(
            //   `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
            // );
            this.renewTradelicence(financialYear, tenantId, routeUrl);
          }
        };

        const submitButton = {
          label: "Submit",
          labelKey: "WF_TL_RENEWAL_SUBMIT_BUTTON",
          link: () => {
            this.renewTradelicence(financialYear, tenantId);
          }
        };
        if (responseLength > 1) {
          if (applicationType !== "NEW") {
            downloadMenu && downloadMenu.push(editButton);
            downloadMenu && downloadMenu.push(submitButton);
          }

        }
        else if (responseLength === 1) {

          downloadMenu && downloadMenu.push(editButton);
          downloadMenu && downloadMenu.push(submitButton);
        }




      }
    }
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px"
        }
      },
      menu: downloadMenu
    };
    return (
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        {!isEmpty(downloadMenu) && (
          <Container>
            <Item xs={12} sm={12} className="wf-footer-container">
              <MenuButton data={buttonItems} />
            </Item>
          </Container>
        )}
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    showSpinner: () =>
      dispatch(showSpinner()),
    hideSpinner: () =>
      dispatch(hideSpinner())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
