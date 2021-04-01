import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

const ReceiptFromAPI = {
  tenantId: null,
  page: {
    totalResults: 10,
    totalPages: 14,
    pageSize: 10,
    currentPage: 0,
    offset: 0
  },
  ResponseInfo: {
    apiId: "Rainmaker",
    ver: ".01",
    ts: "Tue Jul 31 15:09:04 IST 2018",
    resMsgId: "uief87324",
    msgId: `20170310130900|${getLocale()}`,
    status: "200"
  },
  Receipt: [
    {
      tenantId: "default",
      id: "1221",
      transactionId: "DEFA1013112711",
      Bill: [
        {
          id: null,
          payeeName: "9098888888",
          payeeAddress: null,
          payeeEmail: "mail@gmail.com",
          isActive: null,
          isCancelled: null,
          paidBy: "73",
          billDetails: [
            {
              id: "1221",
              bill: null,
              billDate: null,
              billDescription: "PT Consumer Code: AP-PT-2017/07/30-000009-11",
              billNumber: "1875",
              consumerCode: "AP-PT-2017/07/30-000009-11",
              consumerType: null,
              minimumAmount: 100,
              totalAmount: 50,
              collectionModesNotAllowed: [""],
              tenantId: "default",
              businessService: "Property Tax",
              displayMessage: null,
              callBackForApportioning: null,
              receiptNumber: "07/2018-19/000012",
              receiptDate: 1532335355311,
              receiptType: "BILLBASED",
              channel: null,
              voucherHeader: null,
              collectionType: "COUNTER",
              boundary: null,
              reasonForCancellation: null,
              amountPaid: 50,
              cancellationRemarks: null,
              status: "Approved",
              billAccountDetails: [
                {
                  id: "8615",
                  tenantId: "pb.amritsar", //DUMMY DATA
                  billDetail: "1895",
                  glcode: "1405015",
                  order: 1,
                  accountDescription:
                    "PT_OWNER_EXEMPTION-1522540800000-1554076799000",
                  crAmountToBePaid: 0,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "OTHERS"
                },
                {
                  id: "8616",
                  tenantId: "pb.amritsar",
                  billDetail: "1895",
                  glcode: "1405013",
                  order: 1,
                  accountDescription: "PT_TAX-1522540800000-1554076799000",
                  crAmountToBePaid: 400,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "CURRENT_AMOUNT"
                },
                {
                  id: "8617",
                  tenantId: "pb.amritsar",
                  billDetail: "1895",
                  glcode: "1405019",
                  order: 1,
                  accountDescription:
                    "PT_TIME_INTEREST-1522540800000-1554076799000",
                  crAmountToBePaid: 0,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "OTHERS"
                },
                {
                  id: "8618",
                  tenantId: "pb.amritsar",
                  billDetail: "1895",
                  glcode: "1405013",
                  order: 1,
                  accountDescription:
                    "PT_TIME_PENALTY-1522540800000-1554076799000",
                  crAmountToBePaid: 0,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "OTHERS"
                },
                {
                  id: "8619",
                  tenantId: "pb.amritsar",
                  billDetail: "1895",
                  glcode: "1405016",
                  order: 1,
                  accountDescription:
                    "PT_TIME_REBATE-1522540800000-1554076799000",
                  crAmountToBePaid: -52,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "OTHERS"
                },
                {
                  id: "8620",
                  tenantId: "pb.amritsar",
                  billDetail: "1895",
                  glcode: "1405019",
                  order: 1,
                  accountDescription:
                    "PT_UNIT_USAGE_EXEMPTION-1522540800000-1554076799000",
                  crAmountToBePaid: 0,
                  creditAmount: null,
                  debitAmount: null,
                  isActualDemand: true,
                  purpose: "OTHERS"
                }
              ],
              manualReceiptNumber: "",
              stateId: null,
              partPaymentAllowed: null
            }
          ],
          tenantId: "default",
          mobileNumber: null
        }
      ],
      auditDetails: null,
      instrument: {
        id: "692690e0ed4d4de092d26156083f69de",
        transactionNumber: "657837232",
        transactionDate: "24-04-2018",
        transactionDateInput: null,
        amount: 100,
        instrumentType: {
          id: null,
          name: "DD",
          description: null,
          active: null,
          instrumentTypeProperties: []
        },
        instrumentDate: null,
        instrumentNumber: null,
        bank: {
          id: 1770,
          code: null,
          name: null,
          description: null,
          active: null,
          type: null
        },
        branchName: "Bangalore",
        bankAccount: {
          id: null,
          bankBranch: null,
          accountNumber: null,
          accountType: null,
          description: null,
          active: null,
          payTo: null,
          type: null,
          createdBy: null,
          createdDate: null,
          lastModifiedBy: null,
          lastModifiedDate: null,
          tenantId: null
        },
        transactionType: "Debit",
        payee: null,
        drawer: null,
        surrendarReason: null,
        serialNo: null,
        instrumentVouchers: [],
        tenantId: "default"
      },
      onlinePayment: null,
      stateId: null,
      WorkflowDetails: null
    }
  ]
};

export default ReceiptFromAPI;
