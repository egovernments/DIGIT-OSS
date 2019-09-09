import React from "react";
import { getCommaSeperatedAddress, getDateFromEpoch } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";

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

export const getCompletedTransformedItems = (assessmentsByStatus, cities, localizationLabels) => {
  return (
    assessmentsByStatus &&
    Object.values(assessmentsByStatus).map((item, index) => {
      return {
        primaryText: (
          <div className="assesment-history-info">
            <Label
              label={`INR ${get(item, "receiptInfo.totalAmount")}`}
              fontSize="16px"
              color="#484848"
              bold={true}
              labelStyle={primaryTextLabelStyle}
            />
            <div style={{ height: "auto", marginTop: 0 }}>
              <Label
                label={item && item.financialYear}
                containerStyle={secondaryTextContainer}
                labelStyle={secondaryTextLabelStyle}
                color="#484848"
              />
              <Label
                label={getCommaSeperatedAddress(item.address, cities)}
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
          </div>
        ),
        // secondaryText: (
        //   <div style={{ height: "auto", marginTop: 0 }}>
        //     <Label label={item && item.financialYear} containerStyle={secondaryTextContainer} labelStyle={secondaryTextLabelStyle} color="#484848" />
        //     <Label
        //       label={getCommaSeperatedAddress(item.address, cities)}
        //       containerStyle={secondaryTextContainer}
        //       labelStyle={secondaryTextLabelStyle}
        //       color="#484848"
        //     />
        //     <Label
        //       label={`Assessment No.: ${item.assessmentNumber}`}
        //       containerStyle={secondaryTextContainer}
        //       labelStyle={secondaryTextLabelStyle}
        //       color="#484848"
        //     />
        //   </div>
        //),
        epocDate: item.assessmentDate,
        financialYear: item.financialYear,
        assessmentNo: item.assessmentNumber,
        latestAssessmentNumber: item.latestAssessmentNumber,
        propertyId: item.propertyId,
        propertyDetails: item,
        property: item.property,
        tenantId: item.tenantId,
        date: getDateFromEpoch(item.assessmentDate),
        status: get(item, "receiptInfo.status"),
        consumerCode: `${item.propertyId}:${item.assessmentNumber}`,
        receipt: true,
        localizationLabels: localizationLabels,
        cities: cities,
      };
    })
  );
};
