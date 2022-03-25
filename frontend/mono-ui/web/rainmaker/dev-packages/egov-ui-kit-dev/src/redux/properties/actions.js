import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import { getCreatePropertyResponse, setPTDocuments } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { transformById ,getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import { BOUNDARY, DOWNLOADRECEIPT, DRAFT, FETCHASSESSMENTS, FETCHBILL, FETCHRECEIPT, PGService, PROPERTY, RECEIPT } from "egov-ui-kit/utils/endPoints";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import { getCommonTenant } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import orderby from "lodash/orderBy";
import { downloadConReceipt } from "egov-common/ui-utils/commons";
import * as actionTypes from "./actionTypes";

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
const fetchAssessmentsPending = () => {
  return {
    type: actionTypes.PROPERTY_FETCH_ASSESSMENTS_PENDING,
  };
};

const fetchAssessmentsComplete = (payload) => {
  return {
    type: actionTypes.PROPERTY_FETCH_ASSESSMENTS_COMPLETE,
    payload,
  };
};

const fetchAssessmentsError = (error) => {
  return {
    type: actionTypes.PROPERTY_FETCH_ASSESSMENTS_ERROR,
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
        let payloadProperty = await httpRequest(PROPERTY.GET.URL, PROPERTY.GET.ACTION, queryObjectproperty, {}, [], {}, true);
        if (queryObjectDraft !== "citizen_search") {
          if (payloadProperty && payloadProperty.Properties && payloadProperty.Properties.length > 0) {
            let convertedProperties = payloadProperty.Properties.map(property => {
              // property.owners.reverse(); // Owner is coming in reverse order from the API
              let properties = getCreatePropertyResponse({ Properties: [property] });
              return properties && properties.Properties && properties.Properties.length > 0 && properties.Properties[0];
            });
            payloadProperty.Properties = convertedProperties;
          }
          if (payloadProperty.Properties && payloadProperty.Properties[0] && payloadProperty.Properties[0].documents && queryObjectproperty != []) {
            payloadProperty.Properties[0].documentsUploaded = await setPTDocuments(
              payloadProperty,
              "Properties[0].documents",
              "documentsUploaded",
              dispatch,
              'PT'
            );
            dispatch(propertyFetchComplete(payloadProperty));
          } else {
            dispatch(propertyFetchComplete(payloadProperty));
          }
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
          error.message&& error.message.includes&& error.message.includes("No Demands Found") ? "warning" : "error"
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
        let businessService = '';
        fetchReceiptQueryObject && Array.isArray(fetchReceiptQueryObject) && fetchReceiptQueryObject.map(query => {
          if (query.key == "businessService") {
            businessService = query.value;
          }
        })
        fetchReceiptQueryObject = fetchReceiptQueryObject && Array.isArray(fetchReceiptQueryObject) && fetchReceiptQueryObject.filter(query => query.key != "businessService")
       
        const payloadProperty = await httpRequest(getPaymentSearchAPI(businessService), FETCHRECEIPT.GET.ACTION, fetchReceiptQueryObject);
        dispatch(fetchReceiptComplete(payloadProperty));
      } catch (error) {
        dispatch(fetchReceiptError(error.message));
      }
    }
  }
}
export const fetchAssessments = (fetchAssessmentsQueryObject) => {
  return async (dispatch) => {
    if (fetchAssessmentsQueryObject) {
      dispatch(fetchAssessmentsPending());
      try {
        const payloadProperty = await httpRequest(FETCHASSESSMENTS.GET.URL, FETCHASSESSMENTS.GET.ACTION, fetchAssessmentsQueryObject);
        dispatch(fetchAssessmentsComplete(payloadProperty));
      } catch (error) {
        dispatch(fetchAssessmentsError(error.message));
      }
    }
  }
}
export const getFileUrlFromAPI = async fileStoreId => {
  const queryObject = [
    { key: "tenantId", value: getCommonTenant() },
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
  }
};

/* Download Receipt using PDF service */
/* export const downloadReceipt = (receiptQueryString) => {
  return async (dispatch) => {
    if (receiptQueryString) {
      // dispatch(downloadReceiptPending());
      try {
        let businessService = '';
        receiptQueryString && Array.isArray(receiptQueryString) && receiptQueryString.map(query => {
          if (query.key == "businessService") {
            businessService = query.value;
          }
        })
        receiptQueryString = receiptQueryString && Array.isArray(receiptQueryString) && receiptQueryString.filter(query => query.key != "businessService")
       
        const payloadReceiptDetails = await httpRequest(getPaymentSearchAPI(businessService), FETCHRECEIPT.GET.ACTION, receiptQueryString);
  
        const oldFileStoreId = get(payloadReceiptDetails.Payments[0], "fileStoreId")
        const paymentStatus = get(payloadReceiptDetails.Payments[0], "paymentStatus")
        if (oldFileStoreId && paymentStatus!="CANCELLED") {
          downloadReceiptFromFilestoreID(oldFileStoreId, "download")
        }
        else if(oldFileStoreId && paymentStatus=="CANCELLED"){
          getFileUrlFromAPI(oldFileStoreId).then((fileRes) => {
            if(fileRes&&fileRes[oldFileStoreId]){
            var win = window.open(fileRes[oldFileStoreId], '_blank');
            win.focus();}
            else{
              download(payloadReceiptDetails.Payments,receiptQueryString[1].value.split('.')[0] )
            }
          });
        }
        else {
          download(payloadReceiptDetails.Payments,receiptQueryString[1].value.split('.')[0] )
        }
      } catch (error) {
        dispatch(downloadReceiptError(error.message));
      }
    }
  }
} */

/* Download Receipt using EGOV-PDF service */
export const downloadReceipt = (receiptQueryString) => {
  return async (dispatch) => {
    if (receiptQueryString) {
      // dispatch(downloadReceiptPending());
      try {
        downloadConReceipt(receiptQueryString,'consolidatedreceipt',"PAYMENT",`PTRECEIPT-consolidated.pdf` )
      } catch (error) {
        dispatch(downloadReceiptError(error.message));
      }
    }
  }
}


const download =(Payments,tenant)=>{
  const queryStr = [
    { key: "key", value: "consolidatedreceipt" },
    { key: "tenantId", value:tenant }
  ]
  httpRequest(DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Payments: Payments }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
            .then(res => {
              getFileUrlFromAPI(res.filestoreIds[0]).then((fileRes) => {
                var win = window.open(fileRes[res.filestoreIds[0]], '_blank');
                win.focus();
              });

            });
}