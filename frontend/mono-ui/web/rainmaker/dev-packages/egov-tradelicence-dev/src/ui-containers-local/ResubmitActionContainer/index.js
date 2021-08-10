import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../../ui-molecules-local";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import "./index.css";

import {
  getQueryArg,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";


import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";

const tenant = getQueryArg(window.location.href, "tenantId");
class ResubmitActionContainer extends React.Component {
  state = {
    open: false,
    data: {},
  };
  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };
  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,

      updateUrl
    } = this.props;
    let data = get(preparedFinalObject, dataPath, []);

    if (getQueryArg(window.location.href, "edited")) {
      const removedDocs = get(
        preparedFinalObject,
        "LicensesTemp[0].removedDocs",
        []
      );
      if (data[0] && data[0].commencementDate) {
        data[0].commencementDate = convertDateToEpoch(
          data[0].commencementDate,
          "dayend"
        );
      }
      let owners = get(data[0], "tradeLicenseDetail.owners");
      owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
      set(data[0], "tradeLicenseDetail.owners", owners);
      set(data[0], "tradeLicenseDetail.applicationDocuments", [
        ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
        ...removedDocs
      ]);

      // Accessories issue fix by Gyan
      let accessories = get(data[0], "tradeLicenseDetail.accessories");
      let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
      set(
        data[0],
        "tradeLicenseDetail.tradeUnits",
        getMultiUnits(tradeUnits)
      );
      set(
        data[0],
        "tradeLicenseDetail.accessories",
        getMultiUnits(accessories)
      );
    }

    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    try {
      const payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });

      this.setState({
        open: false
      });

      if (payload) {
        let path = "";
        path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        window.location.href = `acknowledgement?purpose=resubmit&status=success&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow update error!",
          labelKey: "ERR_WF_UPDATE_ERROR"
        },
        "error"
      );
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = get(preparedFinalObject, dataPath, []);

    if (dataPath !== "BPA") {
      data = data[0];
    }
  
    //setting the action to send in RequestInfo
    let appendToPath = dataPath === "FireNOCs" ? "fireNOCDetails." : "";
    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      const documents = get(data, "wfDocuments");
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else {
      this.wfUpdate(label);
    }
  };

  openActionDialog = item => {
    const { prepareFinalObject, dataPath } = this.props;
    prepareFinalObject(`${dataPath}[0].comment`, "");
    prepareFinalObject(`${dataPath}[0].assignee`, []);
    this.setState({ open: true, data: item });
  };

  onClose = () => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject("ResubmitAction", false)

  };

  render() {
    const {
      prepareFinalObject,
      onDialogButtonClick,
      dataPath,
    } = this.props;
    const { open, data } = this.props;

    return (
      <div className="apply-wizard-footer" id="custom-atoms-footer">
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          handleFieldChange={prepareFinalObject}
          onButtonClick={this.createWorkFLow}
          dataPath={dataPath}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  const { ResubmitAction: open } = preparedFinalObject;
  return { ProcessInstances, preparedFinalObject, open };

};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResubmitActionContainer);
