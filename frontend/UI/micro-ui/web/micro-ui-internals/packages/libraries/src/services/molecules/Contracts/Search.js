import _ from "lodash";
// import { WorksService } from "../../elements/Works";

const convertEpochToDate = (dateEpoch) => {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

let sampleContractSearchResponse = {
  status: "success",
  isSuccess: true,
  totalCount: 10,
  isLoading: false,
  data: {
    contracts: [
      {
        tenantId: "pb.amritsar",
        contractId: "DB/TO/GF/EE-II/2014/29M",
        contractDate: "08/09/2010",
        contractType: "Work Order",
        nameOfTheWork: "Providing CC Drain in Birla Gaddah ",
        abstractEstimateNumber: "EST/KRPN/1136",
        estimateNumber: "est/ns/2039",
        subEstimateNumber: "wn/ns/2039",
        fileNumber: "14-9/GF/knl/EE-II/14-15",
        fileDate: "10/11/2014",
        agreementAmount: "1908500.00",
        implementingAuthority: "Organisation",
        nameOfOrgn: "Maa Bhagavati Org",
        orgnId: "KMC149",
        preparedBy: "M.Nasir",
        additionalSecurityDeposit: "",
        bankGuarantee: "",
        emdAmount: "",
        engineerIncharge: "S.A Bhasha",
        sla: "15 days",
        status: "Approved",
        additionalDetails: {
          filesAttached: [
            {
              documentType: "application/pdf",
              fileName: "acknowledgement (4).pdf",
              fileStoreId: "37c527b7-a34b-4b23-95df-1ce727ea3f87",
            },
            {
              documentType: "application/pdf",
              fileName: "acknowledgement.pdf",
              fileStoreId: "39686c00-bd88-4a56-99fd-46e5b70017be",
            },
          ],
        },
      },
    ],
  },
};

let workflowDataDetails = {
  data: {
    actionState: {
      applicationBusinessService: "estimate-approval-2",
    },
    timeline: [
      {
        assigner: {
          emailId: "",
          id: 109,
          mobileNumber: "9667076655",
          name: "Est Super User",
          tenantId: "pb.amritsar",
          type: "EMPLOYEE",
          userName: "Nipsyyyy",
          uuid: "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
        },
        assignes: [
          {
            emailId: null,
            id: 111,
            mobileNumber: "8877665544",
            name: "Estimate Checker",
            roles: [
              {
                code: "EST_CHECKER",
                id: null,
                name: "EST_CHECKER",
                tenantId: "pb.amritsar",
              },
            ],
            tenantId: "pb.amritsar",
            type: "EMPLOYEE",
            userName: "EMP-107-000011",
            uuid: "88bd1b70-dd6d-45f7-bcf7-5aa7a6fae7d9",
          },
        ],
        auditDetails: {
          ccreated: "23/11/2022",
          lastModified: "23/11/2022",
          lastModifiedEpoch: 1669175470551,
        },
        caption: [
          {
            mobileNumber: "8877665544",
            name: "Estimate Checker",
          },
        ],
        performedAction: "CREATE",
        rating: 0,
        state: "WORKS_CONTRACT_CREATED",
        status: "CREATED",
        timeLineActions: [],
        wfComment: ["Bill to be revised"],
        wfDocuments: null,
      },
    ],
    ProcessInstances: [
      {
        action: "CREATE",
        assigner: {
          emailId: "",
          id: 109,
          mobileNumber: "9667076655",
          name: "Est Super User",
          tenantId: "pb.amritsar",
          type: "EMPLOYEE",
          userName: "Nipsyyyy",
          uuid: "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
        },
        assignes: [
          {
            emailId: null,
            id: 111,
            mobileNumber: "8877665544",
            name: "Estimate Checker",
            roles: [
              {
                code: "EST_CHECKER",
                id: null,
                name: "EST_CHECKER",
                tenantId: "pb.amritsar",
              },
            ],
            tenantId: "pb.amritsar",
            type: "EMPLOYEE",
            userName: "EMP-107-000011",
            uuid: "88bd1b70-dd6d-45f7-bcf7-5aa7a6fae7d9",
          },
        ],
        auditDetails: {
          createdBy: "c8d0093a-4d2b-495f-8bdf-fd9d3594e43f",
          createdTime: 1668593783889,
          lastModifiedBy: "c8d0093a-4d2b-495f-8bdf-fd9d3594e43f",
          lastModifiedTime: 1668593783889,
        },
        businessId: "EP/2022-23/11/000160",
        businessService: "estimate-approval-2",
        businesssServiceSla: -6902790,
        comment: "",
        documents: null,
        entity: null,
        escalated: false,
        id: "e3f890d0-bcb0-4526-afde-1d36d2be91f4",
        moduleName: "estimate-service",
        nextActions: [
          {
            action: "CHECK",
            active: null,
            auditDetails: null,
            currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
            nextState: "e970bdf2-a968-4be5-b0fe-bc6584e62829",
            roles: ["EST_CHECKER"],
            tenantId: "pb",
            uuid: "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
          },
        ],
        previousStatus: null,
        rating: 0,
        state: {
          actions: [
            {
              action: "CHECK",
              active: null,
              auditDetails: null,
              currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
              nextState: "e970bdf2-a968-4be5-b0fe-bc6584e62829",
              roles: ["EST_CHECKER"],
              tenantId: "pb",
              uuid: "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
            },
          ],
        },
        stateSla: null,
        tenantId: "pb.amritsar",
      },
    ],
  },
};

export const ContractSearch = {
  searchContract: async (tenantId = "pb.jalandhar", filters = {}) => {
    // dymmy response
    const response = sampleContractSearchResponse;
    //actual response
    // const response = await WorksService?.estimateSearch({tenantId,filters})
    // return response?.estimates
  },
  viewContractScreen: async (t, tenantId, loiNumber, subEstimateNumber) => {
    // const workflowDetails = await WorksSearch.workflowDataDetails(tenantId, loiNumber);

    // const loiArr = await WorksSearch.searchLOI(tenantId, {letterOfIndentNumber:loiNumber})
    //  const loi = loiArr?.[0]
    const contract = sampleContractSearchResponse?.data?.contracts[0];
    const additionalDetails = contract?.additionalDetails;
    // const userInfo = Digit.UserService.getUser()?.info || {};
    // const uuidUser = userInfo?.uuid;
    // const {user:users} = await Digit.UserService.userSearch(tenantId, { uuid: [loi?.oicId] }, {});
    // const usersResponse = await HrmsService.search(tenantId,{codes: loi?.oicId }, {});
    // const user = users?.[0]

    const contractDetails = {
      title: "WORKS_CONTRACT_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WORKS_CONTRACT_ID", value: contract?.contractId || t("NA") },
        // { title: "WORKS_DATE_CREATED", value: convertEpochToDate(contract?.auditDetails?.createdTime) || t("NA") },
        { title: "WORKS_DATE_CREATED", value: contract?.contractDate || t("NA") },
        { title: "WORKS_NAME_OF_WORK", value: contract?.nameOfTheWork || t("NA") },
        { title: "WORKS_ESTIMATE_NO", value: contract?.estimateNumber },
        // { title: "WORKS_SUB_ESTIMATE_NO", value: estimate?.estimateDetails?.filter(subEs => subEs?.estimateDetailNumber === subEstimateNumber)?.[0]?.name || t("NA") },
        { title: "WORKS_SUB_ESTIMATE_NO", value: contract?.subEstimateNumber || t("NA") },
        { title: "WORKS_FILE_NO", value: contract?.fileNumber || t("NA") },
        { title: "WORKS_FILE_DATE", value: contract?.fileDate || t("NA") },
        // { title: "WORKS_FILE_DATE", value: convertEpochToDate(contract?.fileDate) || t("NA") },
        { title: "WORKS_CONTRACT_TYPE", value: contract?.contractType || t("NA") },
        { title: "WORKS_STATUS", value: contract?.status || t("NA") },
      ],
    };

    // const agreementAmount = subEs?.amount + ((parseInt(loi?.negotiatedPercentage) * subEs?.amount) / 100)

    const financialDetails = {
      title: "WORKS_FINANCIAL_DETAILS",
      asSectionHeader: true,
      values: [{ title: "WORKS_AGREEMENT_AMT", value: contract.agreementAmount || t("NA") }],
    };
    const agreementDetails = {
      title: "WORKS_AGGREEMENT_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WORKS_IMPLEMENT_AUTH", value: contract?.implementingAuthority || t("NA") },
        { title: "WORKS_NAME_OF_ORGN", value: contract?.nameOfOrgn || t("NA") },
        { title: "WORKS_ORGN_ID", value: contract?.orgnId || t("NA") },
        { title: "WORKS_PREPARED_BY", value: contract?.preparedBy || t("NA") },
        { title: "WORKS_ADD_SECURITY_DP", value: contract?.additionalSecurityDeposit || t("NA") },
        { title: "WORKS_BANK_G", value: contract?.bankGuarantee || t("NA") },
        { title: "WORKS_EMD", value: contract?.emdAmount || t("NA") },
        { title: "WORKS_INCHARGE_ENGG", value: contract?.engineerIncharge || t("NA") },
        // { title: "WORKS_INCHARGE_ENGG", value: additionalDetails?.oic?.nameOfEmp || t("NA") },
      ],
    };
    const files = additionalDetails?.filesAttached;

    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [
          {
            title: "WORKS_RELEVANT_DOCS",
            BS: "Works",
            values: files?.map((document) => {
              return {
                title: document?.fileName,
                documentType: document?.documentType,
                documentUid: document?.fileStoreId,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ],
      },
    };

    let details = [contractDetails, financialDetails, agreementDetails, documentDetails];
    return {
      applicationDetails: details,
      // processInstancesDetails: workflowDetails?.ProcessInstances,
      applicationData: contract,
      workflowDetails: workflowDataDetails,
    };
  },
  viewContractsClosureScreen: async (t, tenantId, loiNumber, subEstimateNumber) => {
    // const workflowDetails = await WorksSearch.workflowDataDetails(tenantId, loiNumber);

    // const loiArr = await WorksSearch.searchLOI(tenantId, {letterOfIndentNumber:loiNumber})
    //  const loi = loiArr?.[0]
    const contract = sampleContractSearchResponse?.data?.contracts[0];
    const additionalDetails = contract?.additionalDetails;
    // const userInfo = Digit.UserService.getUser()?.info || {};
    // const uuidUser = userInfo?.uuid;
    // const {user:users} = await Digit.UserService.userSearch(tenantId, { uuid: [loi?.oicId] }, {});
    // const usersResponse = await HrmsService.search(tenantId,{codes: loi?.oicId }, {});
    // const user = users?.[0]

    const contractDetails = {
      title: " ",
      asSectionHeader: true,
      values: [
        { title: "WORKS_CONTRACT_ID", value: contract?.contractId || t("NA") },
        // { title: "WORKS_DATE_CREATED", value: convertEpochToDate(contract?.auditDetails?.createdTime) || t("NA") },
        { title: "WORKS_DATE_CREATED", value: contract?.contractDate || t("NA") },
      ],
    };

    // const agreementAmount = subEs?.amount + ((parseInt(loi?.negotiatedPercentage) * subEs?.amount) / 100)

    const financialDetails = {
      title: "WORKS_FINANCIAL_DETAILS",
      asSectionHeader: true,
      values: [{ title: "WORKS_CONTRACT_TYPE", value: "Work Order" || t("NA") },
        { title: "WORKS_AGREEMENT_AMT", value: contract.agreementAmount || t("NA") }],
      
    };
    const agreementDetails = {
      title: "WORKS_AGGREEMENT_DETAILS",
      asSectionHeader: true,
      values: [
        { title: "WORKS_EXECUTING_AUTH", value: contract?.implementingAuthority || t("NA") },
        { title: "WORKS_NAME_OF_ORGN", value: contract?.nameOfOrgn || t("NA") },
        { title: "WORKS_ORGN_ID", value: contract?.orgnId || t("NA") },
        { title: "WORKS_CONT_PERIOD", value: contract?.preparedBy || t("NA") },
        { title: "WORKS_OFFICER_INCHARGE_DES", value: contract?.additionalSecurityDeposit || t("NA") },
        { title: "ATM_ENGG_INCHARGE", value: contract?.bankGuarantee || t("NA") },
      ],
    };
    const files = additionalDetails?.filesAttached;

    const documentDetails = {
      title: "",
      asSectionHeader: true,
      additionalDetails: {
        documents: [
          {
            title: "WORKS_RELEVANT_DOCS",
            BS: "Works",
            values: files?.map((document) => {
              return {
                title: document?.fileName,
                documentType: document?.documentType,
                documentUid: document?.fileStoreId,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ],
      },
    };

    let details = [contractDetails, financialDetails, agreementDetails, documentDetails];
    return {
      applicationDetails: details,
      // processInstancesDetails: workflowDetails?.ProcessInstances,
      applicationData: contract,
      workflowDetails: workflowDataDetails,
      CollapseConfig:{
        collapseAll:true,
        groupHeader:"",
        headerLabel:"Contract 1- ID(CTR/2022-23/08/0004) - Type(Work Order)- Date(20-09-2022)",
        headerValue:"₹ 19,08,500"
      },
    };
  }
};
