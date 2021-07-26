import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import store from "ui-redux/store";
import { showHideAdhocPopup } from "../../ui-config/screens/specs/utils";
import {
  isWorkflowExists
} from "../../ui-utils/commons";
// import { getRequiredDocData, showHideAdhocPopup } from "egov-billamend/ui-config/screens/specs/utils"
class Footer extends React.Component {
  state = {
    open: false,
  };
  render() {
    let downloadMenu = [];
    const {
      connectionNumber,
      tenantId,
      toggleSnackbar,
      applicationNo,
      applicationNos,
      businessService,
      bill,
      isAmendmentInWorkflow
    } = this.props;
    const editButton = {
      label: "Edit",
      labelKey: "WS_MODIFY_CONNECTION_BUTTON",
      link: async () => {
        // checking for the due amount
        let due = getQueryArg(window.location.href, "due");
        let errLabel =
          applicationNo && applicationNo.includes("WS")
            ? "WS_DUE_AMOUNT_SHOULD_BE_ZERO"
            : "SW_DUE_AMOUNT_SHOULD_BE_ZERO";
        if (due && parseInt(due) > 0) {
          toggleSnackbar(
            true,
            {
              labelName: "Due Amount should be zero!",
              labelKey: errLabel,
            },
            "error"
          );

          return false;
        }

        // check for the WF Exists
        const queryObj = [
          { key: "businessIds", value: applicationNos },
          { key: "tenantId", value: tenantId },
        ];

        let isApplicationApproved = await isWorkflowExists(queryObj);
        if (!isApplicationApproved) {
          toggleSnackbar(
            true,
            {
              labelName: "WorkFlow already Initiated",
              labelKey: "WS_WORKFLOW_ALREADY_INITIATED",
            },
            "error"
          );
          return false;
        }
        store.dispatch(
          setRoute(
            `/wns/apply?applicationNumber=${applicationNo}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=edit&mode=MODIFY`
          )
        );
      },
    };
    const BillAmendment = {
      label: "Edit",
      labelKey: "WS_BILL_AMENDMENT_BUTTON",
      link: async () => {
        // checking for the due amount

        showHideAdhocPopup(
          this.props.state,
          store.dispatch,
          "connection-details"
        );
        // let due = getQueryArg(window.location.href, "due");
        // let errLabel = (applicationNo && applicationNo.includes("WS"))?"WS_DUE_AMOUNT_SHOULD_BE_ZERO":"SW_DUE_AMOUNT_SHOULD_BE_ZERO";
        // if(due && (parseInt(due) > 0)){
        //   toggleSnackbar(
        //     true,
        //     {
        //       labelName: "Due Amount should be zero!",
        //       labelKey: errLabel
        //     },
        //     "error"
        //   );

        //   return false;
        // }

        // check for the WF Exists
        const queryObj = [
          { key: "businessIds", value: applicationNos },
          { key: "tenantId", value: tenantId },
        ];

        // let isApplicationApproved = await isWorkflowExists(queryObj);
        // if(!isApplicationApproved){
        //   toggleSnackbar(
        //     true,
        //     {
        //       labelName: "WorkFlow already Initiated",
        //       labelKey: "WS_WORKFLOW_ALREADY_INITIATED"
        //     },
        //     "error"
        //   );
        //   return false;
        // }
        // store.dispatch(setRoute(`/wns/apply?applicationNumber=${applicationNo}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=edit&mode=MODIFY`));
      },
    };
    //if(applicationType === "MODIFY"){
    downloadMenu && downloadMenu.push(editButton);
    if (
      businessService && (businessService.includes("ws-services-calculation") ||
      businessService.includes("sw-services-calculation"))
    ) {
      if (bill.Demands && bill.Demands.length > 0 &&isAmendmentInWorkflow) {
        downloadMenu && downloadMenu.push(BillAmendment);
      }
    }

    //}
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
          width: "200px",
        },
      },
      menu: downloadMenu,
    };

    return (
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        <Container>
          <Item xs={12} sm={12} className="wf-footer-container">
            <MenuButton data={buttonItems} />
          </Item>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let connectionObj = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection",
    []
  );
  /* For WorkFlow check */
  let applicationNos = get(
    state.screenConfiguration.preparedFinalObject,
    "applicationNos",
    []
  );
  let bill = get(
    state.screenConfiguration.preparedFinalObject,
    "BILL_FOR_WNS",
    ""
  );
  let isAmendmentInWorkflow = get(
    state.screenConfiguration.preparedFinalObject,
    "isAmendmentInWorkflow",
    true
  );
  
  let connectDetailsData = get(
    state.screenConfiguration.preparedFinalObject,
    "connectDetailsData"
  );

  if (connectionObj.length === 0) {
    connectionObj = get(
      state.screenConfiguration.preparedFinalObject,
      "SewerageConnection",
      []
    );
  }
  const applicationNo =
    connectionObj && connectionObj.length > 0
      ? connectionObj[0].applicationNo
      : "";
  const businessService = connectDetailsData 
  && connectDetailsData.BillingService 
  && connectDetailsData.BillingService.BusinessService 
  && connectDetailsData.BillingService.BusinessService.length 
  && connectDetailsData.BillingService.BusinessService.map(
    (item) => {
      return item.businessService;
    }
  );
  return { state, applicationNo, applicationNos, businessService, bill , isAmendmentInWorkflow};
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
