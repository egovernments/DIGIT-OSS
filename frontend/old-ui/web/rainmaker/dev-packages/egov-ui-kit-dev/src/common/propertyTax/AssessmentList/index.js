import React from "react";
import { Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import PTList from "./components/PTList";
import PTInformation from "./components/PTInformation";

import BlankAssessment from "./components/BlankAssessment";
import DropDown from "./components/DropDown";
import "./index.css";

const getItemStatus = (item, history, generalMDMSDataById) => {
  let status = item.status;
  let styles = {
    paidIconStyle: {
      marginLeft: "10px",
      height: "18px",
    },
  };

  switch (status) {
    case "Paid":
    case "Paid-Disable":
      return (
        <div>
          <div className="assessment-displayInline" style={item.date ? { marginTop: "8px" } : { marginTop: "0px" }}>
            <Label label={"PT_STATUS_COMMON_PAID"} labelStyle={{ marginLeft: "8px" }} color={"#22b25f"} />
            <Icon action="navigation" name="check" style={styles.paidIconStyle} color={"#22b25f"} />
          </div>

          <div style={{ height: "30px", marginTop: "8px" }}>
            {history && <DropDown history={history} item={item} generalMDMSDataById={generalMDMSDataById} />}
          </div>
        </div>
      );
      break;

    case "Pending":
          return (
            <div>
              <div className="assessment-displayInline" style={{ marginTop: "8px" }}>
                <Label label="PT_STATUS_COMMON_PENDING" labelStyle={{ marginLeft: "8px" }} color={"#e74c3c"} />
                <Icon action="navigation" name="exclamation" style={styles.paidIconStyle} color={"#e74c3c"} />
              </div>
              <div style={{ height: "30px", marginTop: "8px" }}>
                {history && <DropDown generalMDMSDataById={generalMDMSDataById} history={history} item={item} />}
              </div>
            </div>
          );
          break;
    case "Partially Paid":
    case "Completed":
      return (
        <div>
          <div className="assessment-displayInline" style={{ marginTop: "8px" }}>
            <Label label="PT_STATUS_COMMON_PARTIALLY_PAID" labelStyle={{ marginLeft: "8px" }} color={"#22b25f"} />
            <Icon action="navigation" name="check" style={styles.paidIconStyle} color={"#22b25f"} />
          </div>
          <div style={{ height: "30px", marginTop: "8px" }}>
            {history && <DropDown generalMDMSDataById={generalMDMSDataById} history={history} item={item} />}
          </div>
        </div>
      );
      break;
    case "Payment failed":
      return (
        <div className="assessment-displayInline" style={{ marginTop: "10px" }}>
          <Label label={item.status} labelStyle={{ marginLeft: "8px" }} color={"#e74c3c"} />
          <Icon action="alert" name="warning" style={styles.paidIconStyle} color={"#e74c3c"} />
        </div>
      );
      break;
    case "Saved Draft":
      return (
        <div
          onClick={() => {
            history && history.push(`/property-tax/assessment-form?assessmentId=${item.assessmentNo}`);
          }}
          className="assessment-displayInline"
          style={{ marginTop: "10px" }}
        >
          <Label label={item.status} labelStyle={{ marginLeft: "8px" }} color={"#00bbd3"} />
          <Icon action="image" name="edit" style={styles.paidIconStyle} color={"#00bbd3"} />
        </div>
      );
      break;
    case "ASSESS & PAY":
      return (
        <div className="assessment-displayInline">
          <Button
            label={<Label buttonLabel={true} label="PT_PAYMENT_ASSESS_AND_PAY" fontSize="12px" />}
            primary={true}
            onClick={(e) => {
              history && history.push(`/property-tax/assessment-form?assessmentId=${item.assessmentNo}&purpose=assess`);
            }}
            style={{
              height: 20,
              lineHeight: "auto",
              minWidth: "inherit",
            }}
          />
        </div>
      );
    default:
      return "";
  }
};

const getRightIconItems = (item, history, generalMDMSDataById) => {
  return item.date || item.status || item.receipt || item.action ? (
    <div
      className="assessment-right-icon"
      style={{ width: "auto", top: "0px", bottom: "0px", height: "inherit", margin: "auto", alignItems: "center", display: "flex", right: 0 }}
    >
      <div>
        {item.date && <Label label={item.date} containerStyle={{ marginRight: 5 }} labelStyle={{ textAlign: "right" }} color="#484848" />}
        {getItemStatus(item, history, generalMDMSDataById)}
      </div>
    </div>
  ) : (
    item.rightIcon
  );
};

const getListItems = (items, history, generalMDMSDataById) => {
  return (
    items &&
    items.map((item, index) => {
      return (
        item && {
          primaryText: item.primaryText, //<Label label="2018 - 2019" fontSize="16px" color="#484848" labelStyle={{ fontWeight: 500 }} />
          secondaryText:
            item.secondaryText &&
            (typeof item.secondaryText === "object" ? (
              item.secondaryText
            ) : (
              <Label label={item.secondaryText} fontSize="14px" color="#484848" containerStyle={{ marginTop: "15px" }} />
            )),
          route: item.route,
          leftIcon: item.leftIcon,
          rightIcon: getRightIconItems(item, history, generalMDMSDataById),
          initiallyOpen: item.initiallyOpen,
          nestedItems:
            item &&
            item.nestedItems &&
            item.nestedItems.map((nestedItem) => {
              return {
                primaryText: nestedItem.leftIcon ? (
                  <div style={{ alignItems: "center", display: "flex" }}>
                    {nestedItem.leftIcon}
                    <Label label={nestedItem.primaryText} fontSize="14px" color="#484848" containerStyle={{ marginLeft: "8px" }} />
                  </div>
                ) : (
                  nestedItem.primaryText
                  // <Label label={nestedItem.primaryText} fontSize="16px" color="#484848" containerStyle={{ padding: "10px 0" }} />
                ),
                secondaryText: nestedItem.secondaryText,
                route: nestedItem.route,
                rightIcon: getRightIconItems(nestedItem, history, generalMDMSDataById),
              };
            }),
        }
      );
    })
  );
};

const AssessmentList = ({properties,
  items,
  history,
  onItemClick,
  button,
  innerDivStyle,
  listItemStyle,
  noAssessmentMessage,
  yearDialogue,
  closeDialogue,
  onNewPropertyButtonClick,
  hoverColor,
  generalMDMSDataById,
  totalBillAmountDue,
  documentsUploaded,
  toggleSnackbarAndSetText
}) => {
  return items.length == 0 ? (
    <BlankAssessment
      noAssessmentMessage={noAssessmentMessage}
      button={button}
      dialogueOpen={yearDialogue}
      closeDialogue={closeDialogue}
      onButtonClick={onNewPropertyButtonClick}
      history={history}
    />
  ) : (

    properties== null ? ( <PTList
      properties={properties}
        items={getListItems(items, history, generalMDMSDataById)}
        history={history}
        onItemClick={onItemClick}
        innerDivStyle={innerDivStyle}
        listItemStyle={listItemStyle}
        hoverColor={hoverColor}
      />):( <PTInformation
      properties={properties}
        items={getListItems(items, history, generalMDMSDataById)}
        history={history}
        onItemClick={onItemClick}
        innerDivStyle={innerDivStyle}
        listItemStyle={listItemStyle}
        hoverColor={hoverColor}
        generalMDMSDataById={generalMDMSDataById}
        totalBillAmountDue={totalBillAmountDue}
        documentsUploaded={documentsUploaded}
        toggleSnackbarAndSetText={toggleSnackbarAndSetText}
      />)





  );
};

export default AssessmentList;
