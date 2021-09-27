import React from "react";
import { Receipt, Icon, Divider, Button } from "egov-ui-kit/components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import AssessmentInfoTable from "../AssessmentInfoTable";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getTranslatedLabel } from "../../../../../utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

const editIconStyle = {
  fill: "#767676",
  width: 19,
  height: 20,
  marginRight: 8,
  fill: "#fe7a51",
};

const ReceiptItems = ({ items, propertyTaxAssessmentID, history, tenantId, onButtonClick }) => {
  return (
    <div className="property-informtion">
      {/* <div className="rainmaker-displayInline" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="receipt-displayInline assignment-title-half">
          <Icon action="action" name="assignment" color="#767676" className="assignment-icon" />
          <Label
            bold={true}
            label={`${getTranslatedLabel("PT_PROPERTY_PTUID", localizationLabelsData)} ${propertyTaxAssessmentID}`}
            containerStyle={{ marginLeft: "13px" }}
            labelStyle={{ letterSpacing: 0 }}
            color="#767676"
          />
        </div>
        <div className="receipt-displayInline text-right accesspay-button" style={{ cursor: "pointer", marginRight: 5 }}>
          // { <Button
          //   onClick={onButtonClick}
          //   label={<Label buttonLabel={true} label="PT_PAYMENT_ASSESS_AND_PAY" fontSize="12px" />}
          //   primary={true}
          //   style={{ height: 30, lineHeight: "auto", minWidth: "inherit" }}
          // /> }
        </div>
      </div> */}
      {/* <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} /> */}
      <div>
        {items.map((item, index) => {
          return (
            <div key={index} className="property-info-subsection">
              <div style={{backgroundColor:'rgb(242,242,242)' , marginBottom:'10px', marginTop:'10px'}}>
                <div className="rainmaker-displayInline" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div className="receipt-displayInline">
                    {/* <Icon action={item.iconAction} name={item.iconName} color="#767676" /> */}
                    <Label
                      label={item.heading}
                      containerStyle={{ marginLeft: "13px" }}
                      fontWeight="400"
                      fontSize="18px"
                      labelStyle={{ letterSpacing: "0.75px", lineHeight: "20px", color: "rgba(0, 0, 0, 0.87)" }}
                    />
                  </div>
                  {/* {process.env.REACT_APP_NAME === "Employee" &&
                    item.heading === "Property Address" && (
                      <div
                        className="receipt-displayInline text-right"
                        onClick={(e) => {
                          history.push(`${tenantId}/edit-property`);
                        }}
                        style={{ cursor: "pointer", marginRight: 5 }}
                      >
                        <Icon style={editIconStyle} action="image" name="edit" />
                        <Label label="EDIT" color="#fe7a51" fontSize="16px" />
                      </div>
                    )} */}
                </div>
                {item.showTable ? (
                  <AssessmentInfoTable items={item.items} tableHeaderItems={item.tableHeaderItems} />
                ) : item.nestedItems ? (
                  item.items.map((nestedItem, nestedIndex) => {
                    return <Receipt receiptItems={nestedItem.items} header={item.items.length > 1 && `Owner ${nestedIndex + 1}`} />;
                  })
                ) : (
                  <Receipt receiptItems={item.items} />
                )}
              </div>
              {index < items.length - 1 && (
                <div />
                // <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0, marginTop: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReceiptItems;
