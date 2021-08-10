import React from "react";
import { getCommaSeperatedAddress, getDateFromEpoch } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import Divider from "@material-ui/core/Divider";
import './index.css';

const secondaryTextLabelStyle = {
  letterSpacing: 0.5,
};

const primaryTextLabelStyle = {
  letterSpacing: 0.6,
};

const secondaryTextContainer = {
  marginTop: 5,
};

export const getTransformedItems = (propertiesById) => {
  return (
    propertiesById &&
    Object.values(propertiesById).reduce((acc, curr) => {
      const propertyDetail =
        curr.propertyDetails &&
        curr.propertyDetails.map((item) => {
          return {
            primaryText: <Label label="INR 1300.00" fontSize="16px" color="#484848" bold={true} labelStyle={primaryTextLabelStyle} />,

            secondaryText: (
              <div style={{ height: "auto", marginTop: 0 }}>
                <Label
                  label={item && item.financialYear}
                  containerStyle={secondaryTextContainer}
                  labelStyle={secondaryTextLabelStyle}
                  color="#484848"
                />
                <Label
                  label={getCommaSeperatedAddress(curr.address.buildingName, curr.address.street)}
                  containerStyle={secondaryTextContainer}
                  labelStyle={secondaryTextLabelStyle}
                  color="#484848"
                />
                <Label
                  label={`Assessment No.: ${item.assessmentNumber}`}
                  containerStyle={secondaryTextContainer}
                  labelStyle={secondaryTextLabelStyle}
                  color="#484848"
                />
              </div>
            ),
            date: getDateFromEpoch(item.assessmentDate),
            status: "Paid",

            receipt: true,
          };
        });
      acc = [...acc, ...propertyDetail];
      return acc;
    }, [])
  );
};

export const getCompletedTransformedItems = (assessmentsByStatus = [], cities, localizationLabels, propertyId,property={}) => {
  assessmentsByStatus.sort((x, y) => x.financialYear.localeCompare(y.financialYear));
  return (
    assessmentsByStatus &&
    Object.values(assessmentsByStatus).map((item, index) => {
      return {
        primaryText: (
          <div className="assesment-history-info" style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
            <div style={{ height: "auto", marginTop: 0 }}>
              <div style={{ padding: "5px 0px 0px 0px" }} className="pt-assessment-info  ">
                <div className="pt-assessment-key">
                  <Label
                    labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                    label="PT_ASSESSMENT_YEAR"
                    fontSize="15px"
                  /></div>
                <div className="pt-assessment-value">
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={`  ${item && item.financialYear}`}
                    fontSize="15px"
                  />
                </div>
              </div>
              {get(item, "receiptInfo.totalAmount") != null && <div style={{ padding: "5px 0px 0px 0px" }} className="pt-assessment-info  ">
                <div className="pt-assessment-key">
                  <Label
                    labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                    label="PT_AMOUNT_PAID"
                    fontSize="15px"
                  />
                </div>
                <div className="pt-assessment-value">
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={` Rs ${get(item, "receiptInfo.totalAmount")}`}
                    fontSize="15px"
                  />
                </div>
              </div>}
              <div style={{ padding: "5px 0px 0px 0px" }} className="pt-assessment-info  ">
                <div className="pt-assessment-key">
                  <Label
                    labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                    label="PT_ASSESSMENT_NO"
                    fontSize="15px"
                  /></div>
                <div className="pt-assessment-value">
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={`  ${item.assessmentNumber}`}
                    fontSize="15px"
                  />
                </div>
              </div>
              <div style={{ padding: "5px 0px 0px 0px" }} className="pt-assessment-info  ">
              </div>
              <div style={{ padding: "5px 0px 0px 0px" }} className="pt-assessment-info  ">
                <div className="pt-assessment-key">
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px" }}
                    label="PT_ASSESSMENT_DATE"
                    fontSize="15px"
                  /></div>
                <div className="pt-assessment-value">
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={`  ${getDateFromEpoch(item.assessmentDate)}`}
                    fontSize="15px"
                  />
                </div>
              </div>
            </div>
            {(index!==Object.values(assessmentsByStatus).length-1)&&<Divider style={{ marginBottom: 0, marginTop: "15px" }} />}
          </div>
        ),
        epocDate: item.assessmentDate,
        financialYear: item.financialYear,
        assessmentNo: item.assessmentNumber,
        latestAssessmentNumber: item.latestAssessmentNumber || item.assessmentNumber,
        propertyId: item.propertyId || propertyId || '',
        propertyDetails: item,
        property: item.property||property,
        tenantId: item.tenantId,
        status: get(item, "receiptInfo.status") || 'Pending',
        consumerCode: item.propertyId || propertyId || '',
        receipt: true,
        localizationLabels: localizationLabels,
        cities: cities,
      };
    })
  );
};
