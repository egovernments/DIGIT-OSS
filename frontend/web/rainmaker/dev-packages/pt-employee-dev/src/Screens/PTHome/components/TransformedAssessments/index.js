import React from "react";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import { getCommaSeperatedAddress } from "egov-ui-kit/utils/commons";

const secondaryTextLabelStyle = {
  letterSpacing: 0.5
};

const primaryTextLabelStyle = {
  letterSpacing: 0.6
};

const secondaryTextContainer = {
  marginTop: 5
};

export const getTransformedItems = (
  propertiesById,
  cities,
  localizationLabels
) => {
  return (
    propertiesById &&
    Object.values(propertiesById).reduce((acc, curr) => {
      const propertyDetail =
        curr &&
        curr.propertyDetails &&
        curr.propertyDetails.map(item => {
          return {
            primaryText: (
              <Label
                label={`INR ${get(curr, "amountPaid")}`}
                fontSize="16px"
                color="#484848"
                bold={true}
                labelStyle={primaryTextLabelStyle}
              />
            ),

            secondaryText: (
              <div style={{ height: "auto", marginTop: 0 }}>
                <Label
                  label={item && item.financialYear}
                  containerStyle={secondaryTextContainer}
                  labelStyle={secondaryTextLabelStyle}
                  color="#484848"
                />
                <Label
                  label={getCommaSeperatedAddress(curr.address, cities)}
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
            epocDate: item.assessmentDate,
            financialYear: item.financialYear,
            assessmentNo: item.assessmentNumber,
            propertyId: curr.propertyId,
            propertyDetails: item,
            property: curr,
            tenantId: curr.tenantId,
            date: getDateFromEpoch(item.assessmentDate),
            status: "Paid",
            consumerCode: `${curr.propertyId}:${item.assessmentNumber}`,
            receipt: true,
            localizationLabels: localizationLabels
          };
        });
      acc = [...acc, ...propertyDetail];
      return acc;
    }, [])
  );
};

const getTransactionsforIncompleteAssessments = payments => {
  const failedTransactionsConsumercode =
    payments &&
    Object.values(payments).map(transaction => {
      return transaction.consumerCode;
    });
  return (
    failedTransactionsConsumercode &&
    failedTransactionsConsumercode.reduce((result, current) => {
      if (!result[current.split(":")[0]]) result[current.split(":")[0]] = [];
      result[current.split(":")[0]].push(current.split(":")[1]);
      return result;
    }, {})
  );
};

export const getCompletedTransformedItems = (
  assessmentsByStatus,
  cities,
  localizationLabels
) => {
  return (
    assessmentsByStatus &&
    Object.values(assessmentsByStatus).map((item, index) => {
      return {
        primaryText: (
          <div className="complated-assesment-info">
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
        // ),
        epocDate: item.assessmentDate,
        financialYear: item.financialYear,
        assessmentNo: item.assessmentNumber,
        propertyId: item.propertyId,
        propertyDetails: item,
        property: item.property,
        tenantId: item.tenantId,
        date: getDateFromEpoch(item.assessmentDate),
        status: get(item, "receiptInfo.status"),
        consumerCode: `${item.propertyId}:${item.assessmentNumber}`,
        receipt: true,
        localizationLabels: localizationLabels,
        cities: cities
      };
    })
  );
};

export const getTransactionsforCompletedAssessments = payments => {
  const failedTransactionsConsumercode =
    payments &&
    Object.values(payments).map(transaction => {
      return {
        consumerCode: transaction.moduleId,
        amountPaid: transaction.txnAmount
      };
    });
  return (
    failedTransactionsConsumercode &&
    failedTransactionsConsumercode.reduce((result, current) => {
      if (!result[current.consumerCode.split(":")[0]])
        result[current.consumerCode.split(":")[0]] = [];
      const resultValue = {
        assessmentNo: current.consumerCode.split(":")[1],
        amountPaid: current.amountPaid
      };
      result[current.consumerCode.split(":")[0]].push(resultValue);
      return result;
    }, {})
  );
};

const getPropertiesByIdTransactions = (propertiesById, transactions) => {
  return (
    transactions &&
    Object.keys(transactions).reduce((result, moduleId) => {
      if (propertiesById[moduleId] && !result[moduleId]) result[moduleId] = [];
      if (propertiesById[moduleId]) {
        result[moduleId] = propertiesById[moduleId];
      }
      return result;
    }, {})
  );
};

const filterData = (propertiesById, propertyName, ids) => {
  return {
    [propertyName]: {
      ...propertiesById[propertyName],
      amountPaid: ids&&ids[0]&&ids[0].amountPaid && ids[0].amountPaid,
      propertyDetails:
        propertiesById &&
        propertiesById[propertyName]["propertyDetails"] &&
        propertiesById[propertyName]["propertyDetails"].filter(
          item =>
            ids.indexOf(item.assessmentNumber) !== -1 || (ids&&ids[0]&&ids[0].assessmentNo)
        )
    }
  };
};

const mergeFinalData = (propertiesById, failedTransObj) => {
  return (
    propertiesById &&
    Object.keys(propertiesById).reduce((result, current) => {
      result[current] = filterData(
        propertiesById,
        current,
        failedTransObj[current]
      )[current];
      return result;
    }, {})
  );
};

export const getFinalAssessments = (payments, propertiesById) => {
  let url = window.location.pathname.includes("completed-assessments");
  let failedTransObj = url
    ? payments && getTransactionsforCompletedAssessments(payments)
    : payments && getTransactionsforIncompleteAssessments(payments);
  let failedProperties =
    failedTransObj &&
    propertiesById &&
    getPropertiesByIdTransactions(propertiesById, failedTransObj);
  return failedProperties && mergeFinalData(failedProperties, failedTransObj);
};
