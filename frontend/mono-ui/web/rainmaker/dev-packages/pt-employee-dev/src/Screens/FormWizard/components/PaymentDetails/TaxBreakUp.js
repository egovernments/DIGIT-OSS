import React from "react";
import { Divider, Icon } from "components";
import { Card, CardHeader, CardText } from "material-ui/Card";
import get from "lodash/get";
import Label from "egov-ui-kit/utils/translationNode";
import isUndefined from "lodash/isUndefined";

const AdditionalDetails = ({
  estimationDetails,
  importantDates,
  optionSelected
}) => {
  const { taxHeadEstimates, totalAmount } =
    (estimationDetails && estimationDetails[0]) || {};
  const { fireCess, intrest, penalty, rebate } = importantDates;

  return (
    <Card
      style={{ marginBottom: 20,padding:'16px', backgroundColor: "rgb(242, 242, 242)" ,boxShadow:'none!important' }}
      initiallyExpanded={true}
    >
      <div  >
        <div className="clearfix fare-section">
              <div className="col-sm-12" >
              <div style={{ float: 'left' }}>
              <Label label="PT_HOME_PROPERTY_TAX"  lineHeight="19px" letterSpacing="0.67px" fontSize="18px" color="rgba(0, 0, 0, 0.87)" />
                </div>
                <div style={{ float: 'right' }}>
                  <Label label="PT_TOTAL_AMOUNT"></Label>
                </div>
              </div> </div>
            <div className="clearfix fare-section">
              <div
                className="col-sm-12"       >
                <div style={{ float: 'right' }}>
                  <Label
                    className="property-dues-total-amount"
                    label={`Rs ${
                      totalAmount
                        ? `${
                        !(optionSelected === "Partial_Amount")
                          ? parseInt(totalAmount)
                          : parseInt(totalAmount -
                          get(
                            taxHeadEstimates[
                            taxHeadEstimates.findIndex(
                              item =>
                                item.taxHeadCode
                                  .toLowerCase()
                                  .indexOf("rebate") !== -1
                            )
                            ],
                            "estimateAmount",
                            0
                          ))
                        }`
                        : totalAmount === 0
                          ? "0"
                          : "NA"
                      }`}
                    fontSize="24px"
                    color="#484848"
                    fontWeight="600"
                  />
                </div>

              </div>
            </div>
        <div className="clearfix fare-section">
          <div
            className="col-sm-6 col-xs-12"
            style={{
              backgroundColor: "rgb(242, 242, 242)",
              marginRight: 100,
              padding: 16
            }}
          >
            {/* <Label
              containerStyle={{ marginBottom: 16 }}
              color="#484848"
              label="PT_FORM4_DETAILED_BILL"
              bold={true}
            /> */}
            {taxHeadEstimates &&
              taxHeadEstimates.map((item, index) => {
                return (
                  !isUndefined(item.estimateAmount) && (
                    <div
                      key={index}
                      className="clearfix"
                      style={{ marginBottom: 8 }}
                    >
                      <div className="col-sm-9" style={{ padding: 0 }}>
                        <Label label={item.taxHeadCode} />
                      </div>
                      <div className="col-sm-3">
                        <Label
                          containerStyle={{ textAlign: "right" }}
                          className="pt-rf-price"
                          label={
                            (item.estimateAmount > 0 &&
                            (item.category === "EXEMPTION" ||
                              item.category === "REBATE")
                              ? "- "
                              : "") +
                            `${
                              !(
                                optionSelected === "Partial_Amount" &&
                                item.taxHeadCode
                                  .toLowerCase()
                                  .indexOf("rebate") !== -1
                              )
                                ? item.estimateAmount
                                : 0
                            }`
                          }
                        />
                      </div>
                    </div>
                  )
                );
              })}
            <Divider
              className="reciept-divider"
              inset={true}
              lineStyle={{ marginLeft: 0, marginRight: 0, height: 2 }}
            />
            <div className="clearfix" style={{ marginTop: 8 }}>
              <div className="col-sm-9" style={{ padding: 0 }}>
                <Label label="PT_FORM4_TOTAL" />
              </div>
              <div className="col-sm-3">
                <Label
                  containerStyle={{ textAlign: "right" }}
                  labelStyle={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#fe7a51"
                  }}
                  label={
                    totalAmount
                      ? `${
                          !(optionSelected === "Partial_Amount")
                            ? parseInt(totalAmount)
                            : parseInt(totalAmount -
                              get(
                                taxHeadEstimates[
                                  taxHeadEstimates.findIndex(
                                    item =>
                                      item.taxHeadCode
                                        .toLowerCase()
                                        .indexOf("rebate") !== -1
                                  )
                                ],
                                "estimateAmount",
                                0
                              ))
                        }`
                      : totalAmount === 0
                      ? "0"
                      : "NA"
                  }
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xs-12 date-details-container"  style={{
              backgroundColor: "white"}}>
            <div className="date-details">
              <Label
                containerStyle={{ marginBottom: 16 }}
                color="#484848"
                label="PT_FORM4_IMPORTANT_DATES"
                bold={true}
              />
              <ul>
                {rebate && rebate.endingDay && (
                  <li>
                    <span>
                      <Label
                        label={`Last Date for Rebate (${rebate.rate}% of PT)`}
                      />
                    </span>
                    <span>{`${rebate.endingDay}`}</span>
                  </li>
                )}
                {penalty && penalty.startingDay && (
                  <li>
                    <span>
                      <Label
                        label={`Penalty (${penalty.rate}% of PT) applied from`}
                      />
                    </span>
                    <span>{`${penalty.startingDay}`}</span>
                  </li>
                )}
                {intrest && intrest.startingDay && (
                  <li>
                    <span>
                      <Label
                        label={`Interest (${
                          intrest.rate
                        }% p.a. daily) applied from`}
                      />
                    </span>
                    <span>{`${intrest.startingDay}`}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <CardHeader
        className="tax-calculation-card-header"
        actAsExpander={true}
        showExpandableButton={true}
        closeIcon={
          <div>
            <div className="pt-tax-calc-details-btn">
              <Label label="PT_VIEW_DETAILS" color="#FE7A51" />
            </div>
          </div>
        }
        iconStyle={{}}
        title={
          <div
            className="tax-header-price rainmaker-displayInline"
            style={{ marginLeft: 5 }}
          >
            {/* <Icon action="custom" name="property-tax" /> 
            <Label
              label="PT_HOME_PROPERTY_TAX"
              fontSize="16px"
              color="#484848"
              containerStyle={{ marginLeft: 5 }}
            />
            {/* <Label
              className="property-dues-total-amount"
              label={`INR ${
                totalAmount
                  ? `${
                      !(optionSelected === "Partial_Amount")
                        ? totalAmount
                        : totalAmount -
                          get(
                            taxHeadEstimates[
                              taxHeadEstimates.findIndex(
                                item =>
                                  item.taxHeadCode
                                    .toLowerCase()
                                    .indexOf("rebate") !== -1
                              )
                            ],
                            "estimateAmount",
                            0
                          )
                    }`
                  : totalAmount === 0
                  ? "0"
                  : "NA"
              }`}
              fontSize="16px"
              color="#484848"
            /> */}
          {/* </div>
        }
      />
      <CardText expandable={true}>
        
      </CardText> */}
    </Card>
  );
};

export default AdditionalDetails;
