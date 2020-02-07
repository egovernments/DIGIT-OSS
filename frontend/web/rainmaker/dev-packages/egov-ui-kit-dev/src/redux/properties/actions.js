import * as actionTypes from "./actionTypes";
import { PROPERTY, DRAFT, PGService, RECEIPT, BOUNDARY, FETCHBILL, FETCHRECEIPT, DOWNLOADRECEIPT } from "egov-ui-kit/utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
import { transformById } from "egov-ui-kit/utils/commons";
import orderby from "lodash/orderBy";
import get from "lodash/get";
import FileSaver from 'file-saver';
import cloneDeep from "lodash/cloneDeep";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {  getCreatePropertyResponse } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";

const FileDownload = require('js-file-download');
const reset_property_reset = () => {
  return {
    type: actionTypes.RESET_PROPERTY_STATE,
  };
};


const propertyFetchPending = () => {
  return {
    type: actionTypes.PROPERTY_FETCH_PENDING,
  };
};

const fetchBillPending = () => {
  return {
    type: actionTypes.PROPERTY_FETCH_BILL_PENDING,
  };
};

const fetchBillComplete = (payload) => {
  return {
    type: actionTypes.PROPERTY_FETCH_BILL_COMPLETE,
    payload,
  };
};

const fetchBillError = (error) => {
  return {
    type: actionTypes.PROPERTY_FETCH_BILL_ERROR,
    error,
  };
};


const fetchReceiptPending = () => {
  return {
    type: actionTypes.PROPERTY_FETCH_RECEIPT_PENDING,
  };
};

const fetchReceiptComplete = (payload) => {
  return {
    type: actionTypes.PROPERTY_FETCH_RECEIPT_COMPLETE,
    payload,
  };
};

const fetchReceiptError = (error) => {
  return {
    type: actionTypes.PROPERTY_FETCH_RECEIPT_ERROR,
    error,
  };
};




const downloadReceiptPending = () => {
  return {
    type: actionTypes.PROPERTY_DOWNLOAD_RECEIPT_PENDING,
  };
};

const downloadReceiptComplete = (payload) => {
  return {
    type: actionTypes.PROPERTY_DOWNLOAD_RECEIPT_COMPLETE,
    payload,
  };
};

const downloadReceiptError = (error) => {
  return {
    type: actionTypes.PROPERTY_DOWNLOAD_RECEIPT_ERROR,
    error,
  };
};


const draftFetchPending = () => {
  return {
    type: actionTypes.DRAFT_FETCH_PENDING,
  };
};

const propertyFetchComplete = (payload, overWrite) => {
  return {
    type: actionTypes.PROPERTY_FETCH_COMPLETE,
    payload,
  };
};

const draftFetchComplete = (payload) => {
  return {
    type: actionTypes.DRAFT_FETCH_COMPLETE,
    payload,
  };
};

const propertyFetchError = (error) => {
  return {
    type: actionTypes.PROPERTY_FETCH_ERROR,
    error,
  };
};
const draftFetchError = (error) => {
  return {
    type: actionTypes.DRAFT_FETCH_ERROR,
    error,
  };
};

const failedTransactionFetchError = (error) => {
  return {
    type: actionTypes.FAILED_TRANSACTION_FETCH_ERROR,
    error,
  };
};
const failedTransactionFetchComplete = (payload) => {
  return {
    type: actionTypes.FAILED_TRANSACTION_FETCH_COMPLETE,
    payload,
  };
};
const failedTransactionFetchPending = () => {
  return {
    type: actionTypes.FAILED_TRANSACTION_FETCH_PENDING,
  };
};
const successTransactionFetchError = (error) => {
  return {
    type: actionTypes.SUCCESS_TRANSACTION_FETCH_ERROR,
    error,
  };
};
const successTransactionFetchComplete = (payload) => {
  return {
    type: actionTypes.SUCCESS_TRANSACTION_FETCH_COMPLETE,
    payload,
  };
};
const successTransactionFetchPending = () => {
  return {
    type: actionTypes.SUCCESS_TRANSACTION_FETCH_PENDING,
  };
};

const ReceiptFetchError = (error) => {
  return {
    type: actionTypes.RECEIPT_FETCH_ERROR,
    error,
  };
};
const ReceiptFetchComplete = (payload) => {
  return {
    type: actionTypes.RECEIPT_FETCH_COMPLETE,
    payload,
  };
};
const ReceiptFetchPending = () => {
  return {
    type: actionTypes.RECEIPT_FETCH_PENDING,
  };
};

const AssessmentStatusFetchError = (error) => {
  return {
    type: actionTypes.ASSESSMENT_STATUS_ERROR,
    error,
  };
};
const AssessmentStatusFetchComplete = (payload) => {
  return {
    type: actionTypes.ASSESSMENT_STATUS_COMPLETE,
    payload,
  };
};
const AssessmentStatusFetchPending = () => {
  return {
    type: actionTypes.ASSESSMENT_STATUS_PENDING,
  };
};

const SingleAssessmentStatusFetchPending = () => {
  return {
    type: actionTypes.SINGLE_ASSESSMENT_STATUS_PENDING,
  };
};
const SingleAssessmentStatusFetchError = (error) => {
  return {
    type: actionTypes.SINGLE_ASSESSMENT_STATUS_ERROR,
    error,
  };
};
const SingleAssessmentStatusFetchComplete = (payload) => {
  return {
    type: actionTypes.SINGLE_ASSESSMENT_STATUS_COMPLETE,
    payload,
  };
};

const mohallaFetchComplete = (payload) => {
  return {
    type: actionTypes.MOHALLA_FETCH_COMPLETE,
    payload,
  };
};

const fetchMohalla = (queryObj) => {
  return async (dispatch) => {
    try {
      let mergedMohallas = [];
      for (let i = 0; i < queryObj.length; i++) {
        const payload = await httpRequest(BOUNDARY.GET.URL, BOUNDARY.GET.ACTION, queryObj[i]);
        if (payload && payload.TenantBoundary) {
          mergedMohallas.push(...payload.TenantBoundary[0].boundary);
        }
      }
      dispatch(mohallaFetchComplete(mergedMohallas));
    } catch (e) {
      console.log(e);
    }
  };
};

const setMohallaInRedux = (dispatch, state, draftResponse) => {
  const tenantId = get(draftResponse, "drafts[0].tenantId");
  const {
    drafts
  } = draftResponse || {};
  const mohallaCodes =
    drafts &&
    drafts.reduce((result, current) => {
      if (current.draftRecord && current.draftRecord.prepareFormData) {
        if (!result[current.tenantId]) result[current.tenantId] = [];
        if (
          get(current, "draftRecord.prepareFormData.Properties[0].address.locality.code") &&
          result[current.tenantId].indexOf(get(current, "draftRecord.prepareFormData.Properties[0].address.locality.code")) === -1
        ) {
          result[current.tenantId].push(get(current, "draftRecord.prepareFormData.Properties[0].address.locality.code"));
        }
      }
      return result;
    }, {});
  const queryObj = Object.keys(mohallaCodes).map((item) => {
    return [{
        key: "tenantId",
        value: item,
      },
      {
        key: "hierarchyTypeCode",
        value: "REVENUE"
      },
      {
        key: "boundaryType",
        value: "Locality"
      },
      {
        key: "codes",
        value: mohallaCodes[item].join(",")
      },
    ];
  });
  dispatch(fetchMohalla(queryObj));
};

export const fetchProperties = (queryObjectproperty, queryObjectDraft, queryObjectFailedPayments, queryObjectSuccessPayments) => {
  return async (dispatch, getState) => {
    if (queryObjectDraft) {
      dispatch(draftFetchPending());
      try {
        const draftpayload = await httpRequest(DRAFT.GET.URL, DRAFT.GET.ACTION, queryObjectDraft);
        setMohallaInRedux(dispatch, getState(), draftpayload);
        dispatch(draftFetchComplete(draftpayload));
      } catch (error) {
        dispatch(draftFetchError(error.message));
      }
    }

    if (queryObjectproperty) {
      dispatch(propertyFetchPending());
      try {
        let payloadProperty = await httpRequest(PROPERTY.GET.URL, PROPERTY.GET.ACTION,queryObjectproperty);
        payloadProperty=getCreatePropertyResponse(payloadProperty);
        if(payloadProperty.Properties && payloadProperty.Properties[0] &&payloadProperty.Properties[0].documents){
          let fileStoreId = "";
          payloadProperty.Properties[0].documentsUploaded = [];
          payloadProperty.Properties[0].documents.map(doc=>{
              fileStoreId = fileStoreId + doc.fileStoreId + ","
          });
          fileStoreId = fileStoreId.slice(0, fileStoreId.length-1);
          getFileUrlFromAPI(fileStoreId).then(fileUrl=>{
            if(fileUrl && fileUrl.fileStoreIds) {
              fileUrl.fileStoreIds.map((file, key)=>{
                payloadProperty.Properties[0].documentsUploaded.push({
                  "title": payloadProperty.Properties[0].documents[key].documentType,
                  "link" : file.fileUrl,
                  "linkText": "View",
                  "name" : payloadProperty.Properties[0].documents[key].documentType
                })
              });
            }
            console.log("fileUrl", fileUrl);
            console.log(payloadProperty.Properties[0].documents);
            dispatch(propertyFetchComplete(payloadProperty));
          });
        } else {
          dispatch(propertyFetchComplete(payloadProperty));
        }
        
      } catch (error) {
        dispatch(propertyFetchError(error.message));
      }
    }

    if (queryObjectFailedPayments) {
      dispatch(failedTransactionFetchPending());
      try {
        const payloadFailedPayments = await httpRequest(PGService.GET.URL, PGService.GET.ACTION, queryObjectFailedPayments, {}, [], {}, true);
        dispatch(failedTransactionFetchComplete(payloadFailedPayments));
      } catch (error) {
        dispatch(failedTransactionFetchError(error.message));
      }
    }

    if (queryObjectSuccessPayments) {
      dispatch(successTransactionFetchPending());
      try {
        const payloadSuccessPayments = await httpRequest(PGService.GET.URL, PGService.GET.ACTION, queryObjectSuccessPayments, {}, [], {}, true);
        dispatch(successTransactionFetchComplete(payloadSuccessPayments));
      } catch (error) {
        dispatch(successTransactionFetchError(error.message));
      }
    }
  };
};

export const fetchReceipts = (queryObj) => {
  return async (dispatch) => {
    dispatch(ReceiptFetchPending());
    try {
      const payloadReceipts = await httpRequest(RECEIPT.GET.URL, RECEIPT.GET.ACTION, queryObj, {}, [], {
        ts: 0
      });
      dispatch(ReceiptFetchComplete(payloadReceipts));
    } catch (error) {
      dispatch(ReceiptFetchError(error.message));
    }
  };
};

const getStatusAndAmount = (receiptArrayItem) => {
  const receiptTransformed = receiptArrayItem.reduce((result, current) => {
    if (!result.totalAmount) result.totalAmount = 0;
    result.totalAmount += current.amountPaid;
    result.totalAmountToPay = receiptArrayItem[receiptArrayItem.length - 1].totalAmount;
    return result;
  }, {});
  if (receiptTransformed.totalAmount === receiptTransformed.totalAmountToPay) {
    receiptTransformed["status"] = "Paid";
  } else {
    receiptTransformed["status"] = "Partially Paid";
  }
  return receiptTransformed;
};
const getFinancialYear = (fromDate, toDate) => {
  let financialYear = '';
  financialYear = (new Date(fromDate).getFullYear()) + '-' + String(new Date(toDate).getFullYear()).slice(2);
  return financialYear;
}
const getYearlyAssessments = (propertiesArray = []) => {
  let yearlyAssessments = [];
  propertiesArray && propertiesArray.map((property) => {
    if (yearlyAssessments.length == 0) {
      yearlyAssessments[0] = [property];
    } else {
      let bool = true;
      for (let pty of yearlyAssessments) {
        if (pty[0].financialYear == property.financialYear) {
          pty.push(property)
          bool = false;
        }
      }
      if (bool) {
        yearlyAssessments.push([property]);
      }
    }
  })
  for (let eachYrAssessments of yearlyAssessments) {
    eachYrAssessments.sort((x, y) => y.receiptDate - x.receiptDate);
  }
  yearlyAssessments.sort((x, y) => x[0].financialYear.localeCompare(y[0].financialYear));
  return yearlyAssessments;
}
const mergeReceiptsInProperty = (receiptsArray, propertyObj) => {
  const transformedPropertyObj = {
    ...propertyObj
  };
  Object.keys(receiptsArray).forEach((item) => {
    if (transformedPropertyObj.hasOwnProperty(item)) {
      transformedPropertyObj[item].receiptInfo = getStatusAndAmount(orderby(receiptsArray[item], "totalAmount", "asc"));
    }
  });
  const mergedReceiptsProperties = Object.values(transformedPropertyObj).filter((property) => {
    return property.receiptInfo;
  });
  const groupByPropertyId = mergedReceiptsProperties.reduce((res, item) => {
    if (!res[item.propertyId]) res[item.propertyId] = {};
    if (!res[item.propertyId][item.financialYear]) res[item.propertyId][item.financialYear] = [];
    res[item.propertyId][item.financialYear].push(item);
    return res;
  }, {});
  for (let propertyId in groupByPropertyId) {
    for (let year in groupByPropertyId[propertyId]) {
      const assessmentByDate = orderby(groupByPropertyId[propertyId][year], "assessmentDate", "asc");

      // if (assessmentByDate.findIndex((item) => item.receiptInfo.status === "Paid") > -1) {
      for (let i = 0; i < assessmentByDate.length; i++) {
        if (i !== assessmentByDate.length - 1) {
          if (assessmentByDate[i].receiptInfo.status === "Partially Paid") {
            assessmentByDate[i].receiptInfo.status = "Completed";
          } else {
            assessmentByDate[i].receiptInfo.status = "Paid-Disable";
          }
        }
      }
      // }
    }
  }
  return mergedReceiptsProperties;
};

export const getAssesmentsandStatus = (queryObjectproperty) => {
  return async (dispatch) => {
    dispatch(AssessmentStatusFetchPending());
    try {
      const payloadProperty = await httpRequest(PROPERTY.GET.URL, PROPERTY.GET.ACTION, queryObjectproperty);
      const propertybyId = transformById(payloadProperty["Properties"], "propertyId");
      const consumerCodes =
        propertybyId &&
        Object.values(propertybyId).reduce((result, curr) => {
          const propertyDetail =
            curr &&
            curr.propertyDetails &&
            curr.propertyDetails.reduce((consumerCodes, item) => {
              consumerCodes[`${curr.propertyId}`] = {
                ...item,
                propertyId: curr.propertyId,
                address: curr.address,
                tenantId: curr.tenantId,
                property: curr,
              };
              return consumerCodes;
            }, []);

          result.push(propertyDetail);
          return result;
        }, []);
      const finalcc =
        consumerCodes &&
        consumerCodes.reduce((acc, curr) => {
          Object.keys(curr).map((item) => {
            acc[item] = curr[item];
          });
          return acc;
        }, {});
      const commaSeperatedCC = Object.keys(finalcc).join(",");

      const payloadReceipts = await httpRequest(
        RECEIPT.GET.URL,
        RECEIPT.GET.ACTION,
        [{ key: "consumerCode", value: commaSeperatedCC.split(':')[0] }],
        {},
        [], {
          ts: 0,
        },
        true
      );
      const receiptbyId = transformById(payloadReceipts["Receipt"], "transactionId");
      const receiptDetails =
        receiptbyId &&
        Object.values(receiptbyId).reduce((acc, curr) => {
          if (!acc[curr.Bill[0].billDetails[0].consumerCode]) acc[curr.Bill[0].billDetails[0].consumerCode] = [];
          acc[curr.Bill[0].billDetails[0].consumerCode].push({
            amountPaid: curr.Bill[0].billDetails[0].amountPaid,
            consumerCode: curr.Bill[0].billDetails[0].consumerCode,
            totalAmount: curr.Bill[0].billDetails[0].totalAmount,
          });
          return acc;
        }, {});

      const receiptDetailsArray =
        receiptbyId &&
        Object.values(receiptbyId).reduce((acc, curr) => {
          if (!acc[curr.Bill[0].billDetails[0].consumerCode]) acc[curr.Bill[0].billDetails[0].consumerCode] = [];
          acc[curr.Bill[0].billDetails[0].consumerCode].push({
            amountPaid: curr.Bill[0].billDetails[0].amountPaid,
            consumerCode: curr.Bill[0].billDetails[0].consumerCode,
            totalAmount: curr.Bill[0].billDetails[0].totalAmount,
            fromPeriod: curr.Bill[0].billDetails[0].fromPeriod,
            toPeriod: curr.Bill[0].billDetails[0].toPeriod,
            receiptDate: curr.Bill[0].billDetails[0].receiptDate,
          });
          return acc;
        }, {});
      let arr = [mergeReceiptsInProperty(receiptDetails, finalcc), { receiptDetailsArray }]
      dispatch(AssessmentStatusFetchComplete(arr));
    } catch (error) {
      dispatch(AssessmentStatusFetchError(error.message));
    }
  };
};

export const getSingleAssesmentandStatus = (queryObjectproperty) => {
  return async (dispatch) => {
    dispatch(SingleAssessmentStatusFetchPending());
    try {
      const latestPropertyDetails =
        queryObjectproperty && queryObjectproperty.propertyDetails && getLatestPropertyDetails(queryObjectproperty.propertyDetails);
      const consumerCodes =
        queryObjectproperty &&
        queryObjectproperty.propertyDetails &&
        queryObjectproperty.propertyDetails.reduce((acc, item) => {
          acc[`${queryObjectproperty.propertyId}`] = {
            ...item,
            propertyId: queryObjectproperty.propertyId,
            address: queryObjectproperty.address,
            tenantId: queryObjectproperty.tenantId,
            property: queryObjectproperty,
            latestAssessmentNumber: latestPropertyDetails.assessmentNumber,
          };
          return acc;
        }, {});

      const finalcc = Object.keys(consumerCodes).join(",");
      const payloadReceipts = await httpRequest(
        RECEIPT.GET.URL,
        RECEIPT.GET.ACTION,
        [{ key: "consumerCode", value: finalcc.split(':')[0] }],
        {},
        [],
        {
          ts: 0,
        },
        true
      );
      const payloadWithReceiptAsId = cloneDeep(payloadReceipts["Receipt"])
        .filter((item) => get(item, "Bill[0].billDetails[0].status", "").toLowerCase() !== "Cancelled")
        .map((item) => {
          item.receiptNumber = get(item, "Bill[0].billDetails[0].receiptNumber", "");
          return item;
        });
      const receiptbyId = transformById(payloadWithReceiptAsId, "receiptNumber");
      const receiptDetails =
        receiptbyId &&
        Object.values(receiptbyId).reduce((acc, curr) => {
          if (!acc[curr.Bill[0].billDetails[0].consumerCode]) acc[curr.Bill[0].billDetails[0].consumerCode] = [];
          acc[curr.Bill[0].billDetails[0].consumerCode].push({
            amountPaid: curr.Bill[0].billDetails[0].amountPaid,
            consumerCode: curr.Bill[0].billDetails[0].consumerCode,
            totalAmount: curr.Bill[0].billDetails[0].totalAmount,
          });
          return acc;
        }, {});
      const receiptDetailArray =
        receiptbyId &&
        Object.values(receiptbyId).reduce((acc, curr) => {
          if (!acc[curr.Bill[0].billDetails[0].consumerCode]) acc[curr.Bill[0].billDetails[0].consumerCode] = [];
          acc[curr.Bill[0].billDetails[0].consumerCode].push({
            amountPaid: curr.Bill[0].billDetails[0].amountPaid,
            consumerCode: curr.Bill[0].billDetails[0].consumerCode,
            totalAmount: curr.Bill[0].billDetails[0].totalAmount,
            fromPeriod: curr.Bill[0].billDetails[0].fromPeriod,
            toPeriod: curr.Bill[0].billDetails[0].toPeriod,
            receiptDate: curr.Bill[0].billDetails[0].receiptDate,
            financialYear: getFinancialYear(curr.Bill[0].billDetails[0].fromPeriod, curr.Bill[0].billDetails[0].toPeriod)
          });
          return acc;
        }, {});
      let receiptDetailsArray = receiptDetailArray && getYearlyAssessments(receiptDetailArray[finalcc]);
      let arr = [mergeReceiptsInProperty(receiptDetails, finalcc), { receiptDetailsArray }]
      dispatch(SingleAssessmentStatusFetchComplete(arr));
    } catch (error) {
      dispatch(SingleAssessmentStatusFetchError(error.message));
    }
  };
};

export const fetchTotalBillAmount = (fetchBillQueryObject) => {
  return async (dispatch) => {
    if (fetchBillQueryObject) {
      dispatch(fetchBillPending());
      try {
        const payloadProperty = await httpRequest(FETCHBILL.GET.URL, FETCHBILL.GET.ACTION, fetchBillQueryObject);
        dispatch(fetchBillComplete(payloadProperty));
      } catch (error) {
        dispatch(toggleSnackbarAndSetText(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        ))
        dispatch(fetchBillError(error.message));
      }
    }
  }
}
export const fetchReceipt = (fetchReceiptQueryObject) => {
  return async (dispatch) => {
    if (fetchReceiptQueryObject) {
      dispatch(fetchReceiptPending());
      try {
        const payloadProperty = await httpRequest(FETCHRECEIPT.GET.URL, FETCHRECEIPT.GET.ACTION, fetchReceiptQueryObject);
        dispatch(fetchReceiptComplete(payloadProperty));
      } catch (error) {
        dispatch(fetchReceiptError(error.message));
      }
    }
  }
}
export const getFileUrlFromAPI = async fileStoreId => {
  const queryObject = [
    { key: "tenantId", value: "pb" },
    { key: "fileStoreIds", value: fileStoreId }
  ];
  try {
    const fileUrl = await httpRequest(
      "/filestore/v1/files/url",
      "",
      queryObject,
      {},
      [], {}, false, true
    );
    return fileUrl;
  } catch (e) {
    console.log(e);
  }
};

export const downloadReceipt = (receiptQueryString) => {
  return async (dispatch) => {
    if (receiptQueryString) {
      dispatch(downloadReceiptPending());
      try {
        const payloadReceiptDetails = await httpRequest(FETCHRECEIPT.GET.URL, FETCHRECEIPT.GET.ACTION, receiptQueryString);
        const queryStr = [
          { key: "key", value: "consolidatedreceipt" },
          { key: "tenantId", value: receiptQueryString[1].value.split('.')[0]}
        ]

        httpRequest(DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Payments: payloadReceiptDetails.Payments }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
          .then(res => {
            getFileUrlFromAPI(res.filestoreIds[0]).then((fileRes) => {
              var win = window.open(fileRes[res.filestoreIds[0]], '_blank');
              win.focus();
            });

          });

      } catch (error) {
        dispatch(downloadReceiptError(error.message));
      }
    }
  }
}
