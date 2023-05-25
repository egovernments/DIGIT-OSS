import React from "react";
import { Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import PTList from "./components/PTList";
import BlankAssessment from "../BlankAssessment";
import DropDown from "./components/DropDown";
import "./index.css";
import { Link } from "react-router-dom"
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { download } from "egov-common/ui-utils/commons"

const downloadReceipt = (tenantId, consumerCode,businessService) => {
  const val = [
    {
      key: 'consumerCodes',
      value: consumerCode
    },
    { key: 'tenantId', value: tenantId }
    ,
    { key: 'businessService', value: businessService }]
  download(val,'download',"consolidatedreceipt",'PAYMENT')
}

export const getItemStatus = (due, paid, tenantId, consumerCode, history = "",businessService) => {
  let status;
  if (due === paid) {
    status = "Paid"
  } else {
    status = "Partially Paid"
  }
  let styles = {
    paidIconStyle: {
      marginLeft: "10px",
      height: "18px",
      marginTop: "5px"
    },
  };
  switch (status) {
    case "Paid":
      return (
        <div>
          <div className="assessment-displayInline">
            <Label label={status} labelStyle={{ marginLeft: 10 }} color={"#22b25f"} />
            <Icon action="navigation" name="check" style={styles.paidIconStyle} color={"#22b25f"} />
          </div>
          <div className="assessment-displayInline" style={{ color: '#fe7a51' }} onClick={() => downloadReceipt(tenantId, consumerCode,businessService)}>
            <LabelContainer labelKey="WS_COMMON_BUTTON_DOWNLOAD_RECEIPT" />
          </div>
        </div>
      );
      break;
    case "Partially Paid":
      return (
        <div>
          <div className="assessment-displayInline" style={{ marginTop: "8px" }}>
            <Label label={status} labelStyle={{ marginLeft: "8px" }} color={"#22b25f"} />
            <Icon action="navigation" name="check" style={styles.paidIconStyle} color={"#22b25f"} />
          </div>
          <div className="assessment-displayInline" style={{ color: '#fe7a51' }} onClick={() => downloadReceipt(tenantId, consumerCode,businessService)}>
            <LabelContainer labelKey="WS_COMMON_BUTTON_DOWNLOAD_RECEIPT" />
          </div>
        </div>
      );
      break;
    case "Payment failed":
      return (
        <div className="assessment-displayInline" style={{ marginTop: "10px" }}>
          <Label label={item.status} labelStyle={{ marginLeft: "5px" }} color={"#e74c3c"} />
          <Icon action="alert" name="warning" style={styles.paidIconStyle} color={"#e74c3c"} />
        </div>
      );
      break;
    case "Saved Draft":
      return (
        <div>
          <div className="assessment-displayInline" style={{ marginTop: "10px" }} >
            <Label label="paid" labelStyle={{ marginLeft: "8px" }} color={"#22b25f"} />
            <Icon action="navigation" name="check" style={styles.paidIconStyle} color={"#22b25f"} />
          </div>
          <div className="assessment-displayInline" style={{ paddingTop: "10px", color: '#fe7a51' }} onClick={() => downloadReceipt(tenantId, consumerCode)}>
            {/* <Link to="home" style={{ color: '#fe7a51' }}> */}
            <LabelContainer labelKey="WS_COMMON_BUTTON_DOWNLOAD_RECEIPT" />
            {/* </Link> */}
          </div>
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

              history.push(
                `/property-tax/assessment-form?FY=${item.financialYear}&assessmentId=${item.assessmentNo}&isReassesment=true&propertyId=${
                item.propertyId
                }&tenantId=${item.tenantId}`
              );
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

const getRightIconItems = (item, history) => {
  return item.date || item.status || item.receipt || item.action ? (
    <div
      className="assessment-right-icon"
      style={{ width: "auto", top: "0px", bottom: "0px", height: "inherit", margin: "auto", alignItems: "center", display: "flex", right: 0 }}
    >
      <div>
        <div style={{ marginBottom: '5px' }}><LabelContainer labelKey="WS_PAST_PAYMENTS_AMOUNT_PAID_LABEL" style={{ color: "#484848" }} />:<div style={{ color: "#484848", display: 'inline-block' }}>{`INR 277`}</div></div>
        {item.date && <Label label={item.date} containerStyle={{ marginRight: 5 }} labelStyle={{ textAlign: "right" }} color="#484848" />}
        {getItemStatus(item, history)}
      </div>
    </div>
  ) : (
      item.rightIcon
    );
};

const getListItems = (items, history) => {
  return (
    items &&
    items.map((item, index) => {
      return (
        item && {
          primaryText: item.primaryText,
          secondaryText:
            item.secondaryText &&
            (typeof item.secondaryText === "object" ? (
              item.secondaryText
            ) : (
                <Label label={item.secondaryText} fontSize="14px" color="#484848" containerStyle={{ marginTop: "15px" }} />
              )),
          route: item.route && item.route,
          leftIcon: item.leftIcon,
          rightIcon: getRightIconItems(item, history),
          tenantId: item.tenantId,
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
                  ),
                secondaryText: nestedItem.secondaryText,
                route: nestedItem.route,
                rightIcon: getRightIconItems(nestedItem, history),
              };
            }),
        }
      );
    })
  );
};

const AssessmentList = ({
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
}) => {
  return items && items.length == 0 ? (
    <BlankAssessment
      noAssessmentMessage={noAssessmentMessage}
      button={button}
      dialogueOpen={yearDialogue}
      closeDialogue={closeDialogue}
      onButtonClick={onNewPropertyButtonClick}
      history={history}
    />
  ) : (
      <PTList
        items={getListItems(items, history)}
        history={history}
        onItemClick={onItemClick}
        innerDivStyle={innerDivStyle}
        listItemStyle={listItemStyle}
        hoverColor={hoverColor}
      />
    );
};

export default AssessmentList;