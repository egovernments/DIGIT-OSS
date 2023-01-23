import cloneDeep from "lodash/cloneDeep";
import _ from "lodash";
import { WorksService } from "../../elements/Works";
import HrmsService from "../../elements/HRMS";


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


export const WorksSearch = {
    searchEstimate: async (tenantId="pb.jalandhar", filters = {} ) => {
        
        //dymmy response
        //const response = sampleEstimateSearchResponse
        //actual response
        const response = await WorksService?.estimateSearch({tenantId,filters})
        return response?.estimates
    },
    searchLOI: async (tenantId,filters={}) => {
        //dymmy response
        
        //const response = sampleLOISearchResponse
        //actual response
        const response = await WorksService?.loiSearch({tenantId,filters})
        return response?.letterOfIndents
    },
    viewProjectDetailsScreenInCreateEstimate: async(t, tenantId, estimateNumber)=> {
        const DepartmentDetails = {
            title: " ",
            asSectionHeader: false,
            values: [
                { title: "PROJECT_OWNING_DEPT", value: "Housing and Urban Development Department" },
                { title: "WORKS_EXECUTING_DEPT", value: "Housing and Urban Development Department" },
                { title: "WORKS_BENEFICIERY", value: "Local Slums" },
                { title: "WORKS_LOR", value: "201/A  - 19 December 2021" },
                { title: "PROJECT_ESTIMATED_COST", value: "5,00,000" },
            ],
        };
        const WorkTypeDetails = {
            title: "PROJECT_WORK_TYPE_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_WORK_TYPE", value: "Rain Water Harvesting" },
                { title: "WORKS_SUB_TYPE_WORK", value: "NA" },
                { title: "WORKS_WORK_NATURE", value: "Capital Works" },
                { title: "WORKS_MODE_OF_INS", value: "Direct Assignment" },
            ],
        };
        const LocationDetails = {
            title: "WORKS_LOCATION_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_LOCALITY", value: "Vivekananda Nagar" },
                { title: "WORKS_WARD", value: "1" },
                { title: "PDF_STATIC_LABEL_ESTIMATE_ULB", value: "Jatni Municipality" },
                { title: "WORKS_GEO_LOCATION", value: "82.1837913, 19.138134" },
            ],
        };
        const Documents = {
            title: "CS_COMMON_DOCUMENTS",
            asSectionHeader: true,
            additionalDetails: {
                documentsWithUrl: [
                    {
                        title: "",
                        values: [
                            {
                                url: "",
                                title: "Document 1",
                                documentType: "pdf",
                            },
                            {
                                url: "",
                                title: "Document 2",
                                documentType: "pdf",
                            },
                            {
                                url: "",
                                title: "Document 3",
                                documentType: "pdf",
                            },
                            {
                                url: "",
                                title: "Document 3",
                                documentType: "pdf",
                            }
                        ]
                    }
                ],
            }
        };
        const details = [DepartmentDetails, WorkTypeDetails, LocationDetails, Documents]

         return {
            applicationDetails: details,
            processInstancesDetails: [],
            applicationData: {},
            workflowDetails: [],
            applicationData:{}
        }
    }, 
    viewEstimateScreen: async (t, tenantId, estimateNumber) => {

        const workflowDetails = await WorksSearch.workflowDataDetails(tenantId, estimateNumber);

        const estimateArr = await WorksSearch?.searchEstimate(tenantId, { estimateNumber })
        const estimate = estimateArr?.[0]
        let wardLocation =estimate?.location.replace(/(^:)|(:$)/g, '').split(":")
        const additionalDetails = estimate?.additionalDetails
        //const estimate = sampleEstimateSearchResponse?.estimates?.[0] 
        let details = []
        const estimateValues={
            title: " ",
            asSectionHeader: true,
            values: [
                { title: "WORKS_ESTIMATE_ID", value: estimate?.estimateNumber},
                { title: "WORKS_STATUS", value: t(`ES_COMMON_${estimate?.estimateStatus}`)}
            ]
        }

        const estimateDetails = {
            title: "WORKS_ESTIMATE_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_DATE_PROPOSAL", value: Digit.DateUtils.ConvertEpochToDate(estimate?.proposalDate) || t("NA") },
                { title: "WORKS_DEPARTMENT", value: t(`ES_COMMON_${estimate?.department}`) || t("NA") },
                { title: "WORKS_LOR", value: estimate?.requirementNumber || t("NA") },
                { title: "WORKS_ELECTION_WARD", value: wardLocation[4] ? t(`ES_COMMON_${wardLocation[4]}`) : t("NA") },
                { title: "WORKS_LOCATION", value: wardLocation[5] ? t(`ES_COMMON_${wardLocation[5]}`) : t("NA") },
                { title: "WORKS_WORK_CATEGORY", value: estimate?.workCategory || t("NA") },
                { title: "WORKS_BENEFICIERY", value: estimate?.beneficiaryType || t("NA") },
                { title: "WORKS_WORK_NATURE", value: estimate?.natureOfWork || t("NA") },
                { title: "WORKS_WORK_TYPE", value: estimate?.typeOfWork || t("NA") },
                { title: "WORKS_SUB_TYPE_WORK", value: t(`ES_COMMON_${estimate?.subTypeOfWork}`) || t("NA") },
                { title: "WORKS_MODE_OF_INS", value: estimate?.entrustmentMode || t("NA") },
            ]
        };

        const approveEstimateDetails = {
            title: "WORKS_ESTIMATE_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_DATE_PROPOSAL", value: Digit.DateUtils.ConvertEpochToDate(estimate?.proposalDate) || t("NA") },
                { title: "WORKS_LOR", value: estimate?.requirementNumber || t("NA") }
            ]
        }

        const locationDetails = {
            title: "WORKS_LOCATION_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_LOCATION", value: (`ES_COMMON_${wardLocation[5]}`) || t("NA") },
                { title: "WORKS_LOCALITY", value: (`ES_COMMON_${wardLocation[5]}`) || t("NA")},
                { title: "WORKS_WARD", value: t(`ES_COMMON_${wardLocation[4]}`) || t("NA") },
                { title: "WORKS_ULB", value: (`ES_COMMON_${wardLocation[3]}`) || t("NA")},
                { title: "WORKS_GEO_LOCATION", value: (`ES_COMMON_${wardLocation[2]}`) || t("NA")}
            ]
        }

        const approvedWorkDetails = {
            title: "WORKS_WORK_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_WORK_NATURE", value: estimate?.natureOfWork || t("NA") },
                { title: "WORKS_WORK_TYPE", value: estimate?.typeOfWork || t("NA") }
            ]
        }

        const approvedFinancialDetails = {
            title: "WORKS_FINANCIAL_DETAILS",
            asSectionHeader: true,
            values: [
                {title: "WORKS_CHART_ACCOUNTS", value: ""}
            ]
        }

        const financialDetails = {
            title: "WORKS_FINANCIAL_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_FUND", value: t(`ES_COMMON_FUND_${estimate?.fund}`) || t("NA") },
                { title: "WORKS_FUNCTION", value: t(`ES_COMMON_${estimate?.function}`) || t("NA") },
                { title: "WORKS_BUDGET_HEAD", value: t(`ES_COMMON_${estimate?.budgetHead}`) || t("NA") },
                { title: "WORKS_SCHEME", value: t(`ES_COMMON_${estimate?.scheme}`) || t("NA") },
                { title: "WORKS_SUB_SCHEME", value: t(`ES_COMMON_${estimate?.subScheme}`) || t("NA") },
            ]
        };
        let tableHeader=[]
        {estimate.estimateStatus === "APPROVED" ?
            tableHeader = [t("WORKS_SNO"), t("WORKS_NAME_OF_WORK"), t("WORKS_ESTIMATED_AMT"),t("WORKS_ACTION")] :
            tableHeader = [t("WORKS_SNO"), t("WORKS_NAME_OF_WORK"), t("WORKS_ESTIMATED_AMT")] }

        // const tableRows = [["1", "Construction of CC drain from D No 45-142-A-58-A to 45-142-472-A at Venkateramana Colony in Ward No 43", "640000"], ["", "Total Amount", "640000"]]
        let totalAmount = 0;
        const tableRows=estimate?.estimateDetails.map((item,index)=>{
            totalAmount= totalAmount + item.amount;
            return (estimate?.estimateStatus === "APPROVED" ?
                [index+1,
                item?.name,
                item?.amount,
                t("WORKS_CREATE_CONTRACT")] :
                [index+1,
                item?.name,
                item?.amount]
            )
        })
        tableRows.push(["",t("WORKS_TOTAL_AMT"),totalAmount])
        tableRows.map((item)=>{
            let amount = item[2];
            amount = amount.toString();
            var lastThree = amount.substring(amount.length-3);
            var otherNumbers = amount.substring(0,amount.length-3);
            if(otherNumbers != '')
                lastThree = ',' + lastThree;
            var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            item[2] = res
        })

        const workDetails = {
            title: "WORKS_WORK_DETAILS",
            asSectionHeader: true,
            isTable: true,
            headers: tableHeader,
            tableRows: tableRows,
            state: estimate
        }
        const files = additionalDetails?.filesAttached
        const documentDetails = {
            title: "",
            asSectionHeader: true,
            additionalDetails: {
                documents: [{
                    title: "WORKS_RELEVANT_DOCS",
                    BS: 'Works',
                    values: files?.map((document) => {
                        return {
                            title: document?.fileName,
                            documentType: document?.documentType,
                            documentUid: document?.fileStoreId,
                            fileStoreId: document?.fileStoreId,
                        };
                    }),
                },
                ]
            }
        }
        estimate?.estimateStatus === "APPROVED" ?
        details = [...details, estimateValues, approveEstimateDetails, locationDetails, approvedWorkDetails, approvedFinancialDetails, workDetails, documentDetails] :
        details = [...details, estimateValues, estimateDetails, financialDetails, workDetails, documentDetails]
        return {
            applicationDetails: details,
            processInstancesDetails: workflowDetails?.ProcessInstances,
            applicationData:estimate,
            workflowDetails: workflowDetails
        }
    },
    workflowDataDetails: async (tenantId, businessIds) => {
        const response = await Digit.WorkflowService.getByBusinessId(tenantId, businessIds);
        return response;
    },
    viewLOIScreen: async (t, tenantId, loiNumber,subEstimateNumber) => {
        
        
        const workflowDetails = await WorksSearch.workflowDataDetails(tenantId, loiNumber);

        const loiArr = await WorksSearch.searchLOI(tenantId, {letterOfIndentNumber:loiNumber})
         const loi = loiArr?.[0]
        //const loi = sampleLOISearchResponse?.letterOfIndents?.[0]
        //const estimate = sampleEstimateSearchResponse?.estimates?.[0]
        const estimateArr = await WorksSearch?.searchEstimate(tenantId, { estimateDetailNumber:subEstimateNumber })
        const estimate = estimateArr?.[0]   
       
        const additionalDetails = loi?.additionalDetails
        // const userInfo = Digit.UserService.getUser()?.info || {};
        // const uuidUser = userInfo?.uuid;
        // const {user:users} = await Digit.UserService.userSearch(tenantId, { uuid: [loi?.oicId] }, {});
        // const usersResponse = await HrmsService.search(tenantId,{codes: loi?.oicId }, {});
        // const user = users?.[0]
        
        const loiDetails = {
            title: "WORKS_LOI_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_LOI_NUMBER", value: loi?.letterOfIndentNumber || t("NA") },
                { title: "WORKS_DATE_CREATED", value: convertEpochToDate(loi?.auditDetails?.createdTime) || t("NA") },
                { title: "WORKS_ESTIMATE_NO", value: estimate?.estimateNumber || t("NA") },
                { title: "WORKS_SUB_ESTIMATE_NO", value: subEstimateNumber },
                { title: "WORKS_NAME_OF_WORK", value: estimate?.estimateDetails?.filter(subEs => subEs?.estimateDetailNumber === subEstimateNumber)?.[0]?.name || t("NA") },
                { title: "WORKS_DEPARTMENT", value: t(`ES_COMMON_${estimate?.department}`) || t("NA") },
                { title: "WORKS_FILE_NO", value: loi?.fileNumber || t("NA") },
                { title: "WORKS_FILE_DATE", value: convertEpochToDate(loi?.fileDate) || t("NA") },
            ]
        };

        const subEs = estimate?.estimateDetails?.filter(subEs => subEs?.estimateDetailNumber === subEstimateNumber)?.[0]

        const agreementAmount = subEs?.amount + ((parseInt(loi?.negotiatedPercentage) * subEs?.amount) / 100)


        const financialDetails = {
            title: "WORKS_FINANCIAL_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_ESTIMATED_AMT", value: estimate?.estimateDetails?.filter(subEs => subEs?.estimateDetailNumber === subEstimateNumber)?.[0]?.amount || t("NA") },
                { title: "WORKS_FINALIZED_PER", value: loi?.negotiatedPercentage || t("NA") },
                { title: "WORKS_AGREEMENT_AMT", value: agreementAmount || t("NA") },
            ]
        }
        const agreementDetails = {
            title: "WORKS_AGGREEMENT_DETAILS",
            asSectionHeader: true,
            values: [
                { title: "WORKS_AGENCY_NAME", value: t("NA") },
                { title: "WORKS_CONT_ID", value: loi?.contractorId || t("NA") },
                { title: "WORKS_PREPARED_BY", value:  t("NA") },
                { title: "WORKS_ADD_SECURITY_DP", value:loi?.securityDeposit || t("NA") },
                { title: "WORKS_BANK_G", value: loi?.bankGuarantee || t("NA") },
                { title: "WORKS_EMD", value: loi?.emdAmount || t("NA") },
                { title: "WORKS_INCHARGE_ENGG", value: additionalDetails?.oic?.nameOfEmp || t("NA") },
            ]
        }
        const files = additionalDetails?.filesAttached
        

        const documentDetails = {
            title: "",
            asSectionHeader: true,
            additionalDetails: {
                documents: [{
                    title: "WORKS_RELEVANT_DOCS",
                    BS: 'Works',
                    values: files?.map((document) => {
                        return {
                            title: document?.fileName,
                            documentType: document?.documentType,
                            documentUid: document?.fileStoreId,
                            fileStoreId: document?.fileStoreId,
                        };
                    }),
                },
                ]
            }
        }

        let details = [loiDetails,financialDetails,agreementDetails,documentDetails]
        return {
            applicationDetails: details,
            processInstancesDetails: workflowDetails?.ProcessInstances,
            applicationData:loi,
        }
    },
    viewProjectClosureScreen: (tenantId) => {
        //dummy estimate data
        const result = {
            "applicationDetails": [
                {
                    "title": " ",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_ESTIMATE_ID",
                            "value": "EP/2022-23/12/000174"
                        },
                        {
                            "title": "WORKS_STATUS",
                            "value": "Checked"
                        }
                    ]
                },
                {
                    "title": "WORKS_ESTIMATE_DETAILS",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_DATE_PROPOSAL",
                            "value": "13/12/2022"
                        },
                        {
                            "title": "WORKS_LOR",
                            "value": "123123"
                        },
                    ]
                },
                {
                    "title": "WORKS_LOCATION_DETAILS",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_LOCATION",
                            "value": "Venkata Ramana Colony, gate no 1"
                        },
                        {
                            "title": "WORKS_LOCALITY",
                            "value": "Venkata Ramana Colony"
                        },
                        {
                            "title": "WORKS_WARD",
                            "value": "Ward No 23"
                        },
                        {
                            "title": "CS_SELECTED_TEXT",
                            "value": "Patna"
                        },
                        {
                            "title": "WORKS_GEO_LOCATION",
                            "value": "Patna"
                        },
                    ]
                },
                {
                    "title": "WORKS_WORK_DETAILS",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_WORK_NATURE",
                            "value": "General Fund"
                        },
                        {
                            "title": "WORKS_WORK_TYPE",
                            "value": "General Fund"
                        },
                    ]
                },
                {
                    "title": "WORKS_FINANCIAL_DETAILS",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_CHART_OF_ACCOUNT",
                            "value": "General Fund"
                        },
                    ]
                },
                {
                    "title": "WORKS_WORK_DETAILS",
                    "asSectionHeader": true,
                    "isTable": true,
                    "headers": [
                        "WORKS_SNO",
                        "WORKS_NAME_OF_WORK",
                        "WORKS_ESTIMATED_AMOUNT"
                    ],
                    "tableRows": [
                        [
                            1,
                            "work",
                            "12,312"
                        ],
                        [
                            "",
                            "Total Amount",
                            "12,312"
                        ]
                    ],
                    "state": {
                        "id": "7a376942-12b6-48ad-8054-9883c53b18d7",
                        "tenantId": "pb.amritsar",
                        "estimateNumber": "EP/2022-23/12/000174",
                        "adminSanctionNumber": null,
                        "proposalDate": 1670920740935,
                        "status": "ACTIVE",
                        "estimateStatus": "CHECKED",
                        "subject": "Construct new schools v2",
                        "requirementNumber": "123123",
                        "description": "Construct new schools",
                        "department": "DEPT_1",
                        "location": "",
                        "workCategory": "Engineering",
                        "beneficiaryType": "General",
                        "natureOfWork": "Operation & Maintenance",
                        "typeOfWork": "Road",
                        "subTypeOfWork": "RD01",
                        "entrustmentMode": "Nomination",
                        "fund": "01",
                        "function": "0001",
                        "budgetHead": "01",
                        "scheme": "15th CFC",
                        "subScheme": "15th CFC-01",
                        "totalAmount": null,
                        "estimateDetails": [
                            {
                                "id": "9dfa2d69-497a-487c-ae42-ab0edbf7724e",
                                "estimateDetailNumber": "EP/2022-23/12/000174/000155",
                                "name": "work",
                                "amount": 12312,
                                "additionalDetails": null
                            }
                        ],
                        "auditDetails": {
                            "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "createdTime": 1670920740935,
                            "lastModifiedTime": 1672053008013
                        },
                        "additionalDetails": {
                            "formData": [
                                {
                                    "name": "work",
                                    "amount": 12312
                                }
                            ]
                        }
                    }
                },
                {
                    "title": "",
                    "asSectionHeader": true,
                    "additionalDetails": {
                        "documents": [
                            {
                                "title": "WORKS_RELEVANT_DOCS",
                                "BS": "Works"
                            }
                        ]
                    }
                }
            ],
            "processInstancesDetails": [
                {
                    "id": "1b9a428d-5c1c-4219-a878-015217aa9d94",
                    "tenantId": "pb.amritsar",
                    "businessService": "estimate-approval-2",
                    "businessId": "EP/2022-23/12/000174",
                    "action": "CHECK",
                    "moduleName": "estimate-service",
                    "state": {
                        "auditDetails": null,
                        "uuid": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                        "tenantId": "pb",
                        "businessServiceId": "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                        "sla": null,
                        "state": "CHECKED",
                        "applicationStatus": "CHECKED",
                        "docUploadRequired": false,
                        "isStartState": false,
                        "isTerminateState": false,
                        "isStateUpdatable": null,
                        "actions": [
                            {
                                "auditDetails": null,
                                "uuid": "a952bc13-07ef-4384-9214-9c7c3e974ec8",
                                "tenantId": "pb",
                                "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "action": "TECHNICALSANCATION",
                                "nextState": "e41d89f8-0977-4b43-9193-3e17c1257ff6",
                                "roles": [
                                    "EST_TECH_SANC"
                                ],
                                "active": null
                            },
                            {
                                "auditDetails": null,
                                "uuid": "c788321f-dc5b-4dc8-a6e6-bd78c6a769fb",
                                "tenantId": "pb",
                                "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "action": "REJECT",
                                "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                "roles": [
                                    "EST_TECH_SANC"
                                ],
                                "active": null
                            }
                        ]
                    },
                    "comment": null,
                    "documents": null,
                    "assigner": {
                        "id": 109,
                        "userName": "Nipsyyyy",
                        "name": "Nipun ",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9667076655",
                        "emailId": "",
                        "roles": [
                            {
                                "id": null,
                                "name": "Employee",
                                "code": "EMPLOYEE",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST CREATOR",
                                "code": "EST_CREATOR",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST_CHECKER",
                                "code": "EST_CHECKER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI APPROVER",
                                "code": "LOI_APPROVER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST TECH SANC",
                                "code": "EST_TECH_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST FIN SANC",
                                "code": "EST_FIN_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI CREATOR",
                                "code": "LOI_CREATOR",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "SUPER USER",
                                "code": "SUPERUSER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST TECH SANC",
                                "code": "EST_ADMIN_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI CHECKER",
                                "code": "LOI_CHECKER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "HRMS Admin",
                                "code": "HRMS_ADMIN",
                                "tenantId": "pb.amritsar"
                            }
                        ],
                        "tenantId": "pb.amritsar",
                        "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                    },
                    "assignes": [
                        {
                            "id": 109,
                            "userName": "Nipsyyyy",
                            "name": "Nipun ",
                            "type": "EMPLOYEE",
                            "mobileNumber": "9667076655",
                            "emailId": "",
                            "roles": [
                                {
                                    "id": null,
                                    "name": "Employee",
                                    "code": "EMPLOYEE",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST CREATOR",
                                    "code": "EST_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST_CHECKER",
                                    "code": "EST_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI APPROVER",
                                    "code": "LOI_APPROVER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_TECH_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST FIN SANC",
                                    "code": "EST_FIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CREATOR",
                                    "code": "LOI_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "SUPER USER",
                                    "code": "SUPERUSER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_ADMIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CHECKER",
                                    "code": "LOI_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "HRMS Admin",
                                    "code": "HRMS_ADMIN",
                                    "tenantId": "pb.amritsar"
                                }
                            ],
                            "tenantId": "pb.amritsar",
                            "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                        }
                    ],
                    "nextActions": [
                        {
                            "auditDetails": null,
                            "uuid": "c788321f-dc5b-4dc8-a6e6-bd78c6a769fb",
                            "tenantId": "pb",
                            "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                            "action": "REJECT",
                            "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                            "roles": [
                                "EST_TECH_SANC"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "a952bc13-07ef-4384-9214-9c7c3e974ec8",
                            "tenantId": "pb",
                            "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                            "action": "TECHNICALSANCATION",
                            "nextState": "e41d89f8-0977-4b43-9193-3e17c1257ff6",
                            "roles": [
                                "EST_TECH_SANC"
                            ],
                            "active": null
                        }
                    ],
                    "stateSla": null,
                    "businesssServiceSla": -793324953,
                    "previousStatus": null,
                    "entity": null,
                    "auditDetails": {
                        "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                        "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                        "createdTime": 1672053008038,
                        "lastModifiedTime": 1672053008038
                    },
                    "rating": 0,
                    "escalated": false
                },
                {
                    "id": "0a618d8b-8604-4aae-8e70-c45e3fccdf51",
                    "tenantId": "pb.amritsar",
                    "businessService": "estimate-approval-2",
                    "businessId": "EP/2022-23/12/000174",
                    "action": "CREATE",
                    "moduleName": "estimate-service",
                    "state": {
                        "auditDetails": null,
                        "uuid": "67d17040-0c49-40a1-b932-a7b5a5266557",
                        "tenantId": "pb",
                        "businessServiceId": "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                        "sla": null,
                        "state": "CREATED",
                        "applicationStatus": "CREATED",
                        "docUploadRequired": false,
                        "isStartState": true,
                        "isTerminateState": false,
                        "isStateUpdatable": null,
                        "actions": [
                            {
                                "auditDetails": null,
                                "uuid": "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                                "tenantId": "pb",
                                "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                "action": "CHECK",
                                "nextState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "roles": [
                                    "EST_CHECKER"
                                ],
                                "active": null
                            },
                            {
                                "auditDetails": null,
                                "uuid": "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                "tenantId": "pb",
                                "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                "action": "REJECT",
                                "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                "roles": [
                                    "EST_CHECKER"
                                ],
                                "active": null
                            }
                        ]
                    },
                    "comment": "string",
                    "documents": null,
                    "assigner": {
                        "id": 109,
                        "userName": "Nipsyyyy",
                        "name": "Nipun ",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9667076655",
                        "emailId": "",
                        "roles": [
                            {
                                "id": null,
                                "name": "Employee",
                                "code": "EMPLOYEE",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST CREATOR",
                                "code": "EST_CREATOR",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST_CHECKER",
                                "code": "EST_CHECKER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI APPROVER",
                                "code": "LOI_APPROVER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST TECH SANC",
                                "code": "EST_TECH_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST FIN SANC",
                                "code": "EST_FIN_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI CREATOR",
                                "code": "LOI_CREATOR",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "SUPER USER",
                                "code": "SUPERUSER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "EST TECH SANC",
                                "code": "EST_ADMIN_SANC",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "LOI CHECKER",
                                "code": "LOI_CHECKER",
                                "tenantId": "pb.amritsar"
                            },
                            {
                                "id": null,
                                "name": "HRMS Admin",
                                "code": "HRMS_ADMIN",
                                "tenantId": "pb.amritsar"
                            }
                        ],
                        "tenantId": "pb.amritsar",
                        "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                    },
                    "assignes": [
                        {
                            "id": 109,
                            "userName": "Nipsyyyy",
                            "name": "Nipun ",
                            "type": "EMPLOYEE",
                            "mobileNumber": "9667076655",
                            "emailId": "",
                            "roles": [
                                {
                                    "id": null,
                                    "name": "Employee",
                                    "code": "EMPLOYEE",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST CREATOR",
                                    "code": "EST_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST_CHECKER",
                                    "code": "EST_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI APPROVER",
                                    "code": "LOI_APPROVER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_TECH_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST FIN SANC",
                                    "code": "EST_FIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CREATOR",
                                    "code": "LOI_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "SUPER USER",
                                    "code": "SUPERUSER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_ADMIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CHECKER",
                                    "code": "LOI_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "HRMS Admin",
                                    "code": "HRMS_ADMIN",
                                    "tenantId": "pb.amritsar"
                                }
                            ],
                            "tenantId": "pb.amritsar",
                            "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                        }
                    ],
                    "nextActions": [
                        {
                            "auditDetails": null,
                            "uuid": "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                            "tenantId": "pb",
                            "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                            "action": "CHECK",
                            "nextState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                            "roles": [
                                "EST_CHECKER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                            "tenantId": "pb",
                            "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                            "action": "REJECT",
                            "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                            "roles": [
                                "EST_CHECKER"
                            ],
                            "active": null
                        }
                    ],
                    "stateSla": null,
                    "businesssServiceSla": -793324953,
                    "previousStatus": null,
                    "entity": null,
                    "auditDetails": {
                        "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                        "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                        "createdTime": 1670920740971,
                        "lastModifiedTime": 1670920740971
                    },
                    "rating": 0,
                    "escalated": false
                }
            ],
            "applicationData": {
                "id": "7a376942-12b6-48ad-8054-9883c53b18d7",
                "tenantId": "pb.amritsar",
                "estimateNumber": "EP/2022-23/12/000174",
                "adminSanctionNumber": null,
                "proposalDate": 1670920740935,
                "status": "ACTIVE",
                "estimateStatus": "CHECKED",
                "subject": "Construct new schools v2",
                "requirementNumber": "123123",
                "description": "Construct new schools",
                "department": "DEPT_1",
                "location": "",
                "workCategory": "Engineering",
                "beneficiaryType": "General",
                "natureOfWork": "Operation & Maintenance",
                "typeOfWork": "Road",
                "subTypeOfWork": "RD01",
                "entrustmentMode": "Nomination",
                "fund": "01",
                "function": "0001",
                "budgetHead": "01",
                "scheme": "15th CFC",
                "subScheme": "15th CFC-01",
                "totalAmount": null,
                "estimateDetails": [
                    {
                        "id": "9dfa2d69-497a-487c-ae42-ab0edbf7724e",
                        "estimateDetailNumber": "EP/2022-23/12/000174/000155",
                        "name": "work",
                        "amount": 12312,
                        "additionalDetails": null
                    }
                ],
                "auditDetails": {
                    "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                    "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                    "createdTime": 1670920740935,
                    "lastModifiedTime": 1672053008013
                },
                "additionalDetails": {
                    "formData": [
                        {
                            "name": "work",
                            "amount": 12312
                        }
                    ]
                }
            },
            workflowDetails: {
                "ResponseInfo": null,
                "ProcessInstances": [
                    {
                        "id": "1b9a428d-5c1c-4219-a878-015217aa9d94",
                        "tenantId": "pb.amritsar",
                        "businessService": "estimate-approval-2",
                        "businessId": "EP/2022-23/12/000174",
                        "action": "CHECK",
                        "moduleName": "estimate-service",
                        "state": {
                            "auditDetails": null,
                            "uuid": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                            "tenantId": "pb",
                            "businessServiceId": "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                            "sla": null,
                            "state": "CHECKED",
                            "applicationStatus": "CHECKED",
                            "docUploadRequired": false,
                            "isStartState": false,
                            "isTerminateState": false,
                            "isStateUpdatable": null,
                            "actions": [
                                {
                                    "auditDetails": null,
                                    "uuid": "a952bc13-07ef-4384-9214-9c7c3e974ec8",
                                    "tenantId": "pb",
                                    "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                    "action": "TECHNICALSANCATION",
                                    "nextState": "e41d89f8-0977-4b43-9193-3e17c1257ff6",
                                    "roles": [
                                        "EST_TECH_SANC"
                                    ],
                                    "active": null
                                },
                                {
                                    "auditDetails": null,
                                    "uuid": "c788321f-dc5b-4dc8-a6e6-bd78c6a769fb",
                                    "tenantId": "pb",
                                    "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                    "action": "REJECT",
                                    "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                    "roles": [
                                        "EST_TECH_SANC"
                                    ],
                                    "active": null
                                }
                            ]
                        },
                        "comment": null,
                        "documents": null,
                        "assigner": {
                            "id": 109,
                            "userName": "Nipsyyyy",
                            "name": "Nipun ",
                            "type": "EMPLOYEE",
                            "mobileNumber": "9667076655",
                            "emailId": "",
                            "roles": [
                                {
                                    "id": null,
                                    "name": "Employee",
                                    "code": "EMPLOYEE",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST CREATOR",
                                    "code": "EST_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST_CHECKER",
                                    "code": "EST_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI APPROVER",
                                    "code": "LOI_APPROVER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_TECH_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST FIN SANC",
                                    "code": "EST_FIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CREATOR",
                                    "code": "LOI_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "SUPER USER",
                                    "code": "SUPERUSER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_ADMIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CHECKER",
                                    "code": "LOI_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "HRMS Admin",
                                    "code": "HRMS_ADMIN",
                                    "tenantId": "pb.amritsar"
                                }
                            ],
                            "tenantId": "pb.amritsar",
                            "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                        },
                        "assignes": [
                            {
                                "id": 109,
                                "userName": "Nipsyyyy",
                                "name": "Nipun ",
                                "type": "EMPLOYEE",
                                "mobileNumber": "9667076655",
                                "emailId": "",
                                "roles": [
                                    {
                                        "id": null,
                                        "name": "Employee",
                                        "code": "EMPLOYEE",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST CREATOR",
                                        "code": "EST_CREATOR",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST_CHECKER",
                                        "code": "EST_CHECKER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI APPROVER",
                                        "code": "LOI_APPROVER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST TECH SANC",
                                        "code": "EST_TECH_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST FIN SANC",
                                        "code": "EST_FIN_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI CREATOR",
                                        "code": "LOI_CREATOR",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "SUPER USER",
                                        "code": "SUPERUSER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST TECH SANC",
                                        "code": "EST_ADMIN_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI CHECKER",
                                        "code": "LOI_CHECKER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "HRMS Admin",
                                        "code": "HRMS_ADMIN",
                                        "tenantId": "pb.amritsar"
                                    }
                                ],
                                "tenantId": "pb.amritsar",
                                "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                            }
                        ],
                        "nextActions": [
                            {
                                "auditDetails": null,
                                "uuid": "c788321f-dc5b-4dc8-a6e6-bd78c6a769fb",
                                "tenantId": "pb",
                                "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "action": "REJECT",
                                "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                "roles": [
                                    "EST_TECH_SANC"
                                ],
                                "active": null
                            },
                            {
                                "auditDetails": null,
                                "uuid": "a952bc13-07ef-4384-9214-9c7c3e974ec8",
                                "tenantId": "pb",
                                "currentState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "action": "TECHNICALSANCATION",
                                "nextState": "e41d89f8-0977-4b43-9193-3e17c1257ff6",
                                "roles": [
                                    "EST_TECH_SANC"
                                ],
                                "active": null
                            }
                        ],
                        "stateSla": null,
                        "businesssServiceSla": -793324953,
                        "previousStatus": null,
                        "entity": null,
                        "auditDetails": {
                            "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "createdTime": 1672053008038,
                            "lastModifiedTime": 1672053008038
                        },
                        "rating": 0,
                        "escalated": false
                    },
                    {
                        "id": "0a618d8b-8604-4aae-8e70-c45e3fccdf51",
                        "tenantId": "pb.amritsar",
                        "businessService": "estimate-approval-2",
                        "businessId": "EP/2022-23/12/000174",
                        "action": "CREATE",
                        "moduleName": "estimate-service",
                        "state": {
                            "auditDetails": null,
                            "uuid": "67d17040-0c49-40a1-b932-a7b5a5266557",
                            "tenantId": "pb",
                            "businessServiceId": "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                            "sla": null,
                            "state": "CREATED",
                            "applicationStatus": "CREATED",
                            "docUploadRequired": false,
                            "isStartState": true,
                            "isTerminateState": false,
                            "isStateUpdatable": null,
                            "actions": [
                                {
                                    "auditDetails": null,
                                    "uuid": "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                                    "tenantId": "pb",
                                    "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                    "action": "CHECK",
                                    "nextState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                    "roles": [
                                        "EST_CHECKER"
                                    ],
                                    "active": null
                                },
                                {
                                    "auditDetails": null,
                                    "uuid": "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                    "tenantId": "pb",
                                    "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                    "action": "REJECT",
                                    "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                    "roles": [
                                        "EST_CHECKER"
                                    ],
                                    "active": null
                                }
                            ]
                        },
                        "comment": "string",
                        "documents": null,
                        "assigner": {
                            "id": 109,
                            "userName": "Nipsyyyy",
                            "name": "Nipun ",
                            "type": "EMPLOYEE",
                            "mobileNumber": "9667076655",
                            "emailId": "",
                            "roles": [
                                {
                                    "id": null,
                                    "name": "Employee",
                                    "code": "EMPLOYEE",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST CREATOR",
                                    "code": "EST_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST_CHECKER",
                                    "code": "EST_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI APPROVER",
                                    "code": "LOI_APPROVER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_TECH_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST FIN SANC",
                                    "code": "EST_FIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CREATOR",
                                    "code": "LOI_CREATOR",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "SUPER USER",
                                    "code": "SUPERUSER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "EST TECH SANC",
                                    "code": "EST_ADMIN_SANC",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "LOI CHECKER",
                                    "code": "LOI_CHECKER",
                                    "tenantId": "pb.amritsar"
                                },
                                {
                                    "id": null,
                                    "name": "HRMS Admin",
                                    "code": "HRMS_ADMIN",
                                    "tenantId": "pb.amritsar"
                                }
                            ],
                            "tenantId": "pb.amritsar",
                            "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                        },
                        "assignes": [
                            {
                                "id": 109,
                                "userName": "Nipsyyyy",
                                "name": "Nipun ",
                                "type": "EMPLOYEE",
                                "mobileNumber": "9667076655",
                                "emailId": "",
                                "roles": [
                                    {
                                        "id": null,
                                        "name": "Employee",
                                        "code": "EMPLOYEE",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST CREATOR",
                                        "code": "EST_CREATOR",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST_CHECKER",
                                        "code": "EST_CHECKER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI APPROVER",
                                        "code": "LOI_APPROVER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST TECH SANC",
                                        "code": "EST_TECH_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST FIN SANC",
                                        "code": "EST_FIN_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI CREATOR",
                                        "code": "LOI_CREATOR",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "SUPER USER",
                                        "code": "SUPERUSER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "EST TECH SANC",
                                        "code": "EST_ADMIN_SANC",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "LOI CHECKER",
                                        "code": "LOI_CHECKER",
                                        "tenantId": "pb.amritsar"
                                    },
                                    {
                                        "id": null,
                                        "name": "HRMS Admin",
                                        "code": "HRMS_ADMIN",
                                        "tenantId": "pb.amritsar"
                                    }
                                ],
                                "tenantId": "pb.amritsar",
                                "uuid": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda"
                            }
                        ],
                        "nextActions": [
                            {
                                "auditDetails": null,
                                "uuid": "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                                "tenantId": "pb",
                                "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                "action": "CHECK",
                                "nextState": "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                "roles": [
                                    "EST_CHECKER"
                                ],
                                "active": null
                            },
                            {
                                "auditDetails": null,
                                "uuid": "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                "tenantId": "pb",
                                "currentState": "67d17040-0c49-40a1-b932-a7b5a5266557",
                                "action": "REJECT",
                                "nextState": "af66155b-f5ac-447f-947b-f56539c4d671",
                                "roles": [
                                    "EST_CHECKER"
                                ],
                                "active": null
                            }
                        ],
                        "stateSla": null,
                        "businesssServiceSla": -793324953,
                        "previousStatus": null,
                        "entity": null,
                        "auditDetails": {
                            "createdBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "lastModifiedBy": "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            "createdTime": 1670920740971,
                            "lastModifiedTime": 1670920740971
                        },
                        "rating": 0,
                        "escalated": false
                    }
                ],
                "totalCount": 0
            }
        }
        return result
    },
    viewProjectClosureScreenBills:(tenantId)=> {
        const result = {
            "applicationDetails": [
                {
                    "title": " ",
                    "asSectionHeader": true,
                    "values": [
                        {
                            "title": "WORKS_CREATED_BY",
                            "value": "EP/2022-23/12/000174"
                        },
                        {
                            "title": "WORKS_LOI_STATUS",
                            "value": "Checked"
                        },
                        {
                            "title": "WORKS_LABOUR_COST",
                            "value": "Checked"
                        },
                        {
                            "title": "WORKS_MATERIAL_COST",
                            "value": "Checked"
                        },
                        {
                            "title": "WORKS_COMMISSION",
                            "value": "Checked"
                        },
                        {
                            "title": "MODULE_CSS",
                            "value": "Checked"
                        },
                        {
                            "title": "WORKS_ROYALTY",
                            "value": "Checked"
                        },
                        {
                            "title": "OTHERS",
                            "value": "Checked"
                        },
                        {
                            "title": "RT_TOTAL",
                            "value": "Checked"
                        }
                    ]
                },
            ],
            workflowDetails : {
                isLoading: false,
                error: null,
                isError: false,
                breakLineRequired: false,
                data: {
                    nextActions: [
                        {
                            action: "REJECT",
                            roles: "EST_CHECKER,EST_CHECKER",
                        },
                        {
                            action: "APPROVE",
                            roles: "EST_CHECKER,EST_CHECKER",
                        },
                        {
                            action: "EDIT",
                            roles: "EST_CHECKER,EST_CHECKER",
                        },
                    ],
                    actionState: {
                        auditDetails: {
                            createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                            lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                            createdTime: 1663568004997,
                            lastModifiedTime: 1663568004997,
                        },
                        uuid: "67d17040-0c49-40a1-b932-a7b5a5266557",
                        tenantId: "pb.amritsar",
                        businessServiceId: "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                        sla: null,
                        state: "CREATED",
                        applicationStatus: "CREATED",
                        docUploadRequired: false,
                        isStartState: true,
                        isTerminateState: false,
                        isStateUpdatable: true,
                        actions: [
                            {
                                auditDetails: {
                                    createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    createdTime: 1663568004997,
                                    lastModifiedTime: 1663568004997,
                                },
                                uuid: "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                tenantId: "pb.amritsar",
                                currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                action: "REJECT",
                                nextState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                roles: ["EST_CHECKER"],
                                active: true,
                            },
                            {
                                auditDetails: {
                                    createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    createdTime: 1663568004997,
                                    lastModifiedTime: 1663568004997,
                                },
                                uuid: "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                tenantId: "pb.amritsar",
                                currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                action: "APPROVE",
                                nextState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                roles: ["EST_CHECKER"],
                                active: true,
                            },
                        ],
                        nextActions: [
                            {
                                auditDetails: {
                                    createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    createdTime: 1663568004997,
                                    lastModifiedTime: 1663568004997,
                                },
                                uuid: "af66155b-f5ac-447f-947b-f56539c4d671",
                                tenantId: "pb.amritsar",
                                businessServiceId: "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                                sla: null,
                                state: "REJECTED",
                                applicationStatus: "ATTENDANCE_REJECTED",
                                docUploadRequired: false,
                                isStartState: false,
                                isTerminateState: false,
                                isStateUpdatable: true,
                                actions: [
                                    {
                                        auditDetails: {
                                            createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                            lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                            createdTime: 1663568004997,
                                            lastModifiedTime: 1663568004997,
                                        },
                                        uuid: "0250f409-7e07-464d-926e-97ac72457d72",
                                        tenantId: "pb.amritsar",
                                        currentState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                        action: "EDIT",
                                        nextState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                        roles: ["EST_CREATOR"],
                                        active: true,
                                    },
                                ],
                                assigneeRoles: ["EST_CREATOR"],
                                action: "REJECT",
                                roles: ["EST_CHECKER"],
                            },
                            {
                                auditDetails: {
                                    createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                    createdTime: 1663568004997,
                                    lastModifiedTime: 1663568004997,
                                },
                                uuid: "af66155b-f5ac-447f-947b-f56539c4d671",
                                tenantId: "pb.amritsar",
                                businessServiceId: "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                                sla: null,
                                state: "APPROVE",
                                applicationStatus: "ATTENDANCE_APPROVE",
                                docUploadRequired: false,
                                isStartState: false,
                                isTerminateState: false,
                                isStateUpdatable: true,
                                actions: [
                                    {
                                        auditDetails: {
                                            createdBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                            lastModifiedBy: "7e46e32c-187c-4fb4-9d6b-1ac70fa8f011",
                                            createdTime: 1663568004997,
                                            lastModifiedTime: 1663568004997,
                                        },
                                        uuid: "0250f409-7e07-464d-926e-97ac72457d72",
                                        tenantId: "pb.amritsar",
                                        currentState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                        action: "EDIT",
                                        nextState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                        roles: ["EST_CREATOR"],
                                        active: true,
                                    },
                                ],
                                assigneeRoles: ["EST_CREATOR"],
                                action: "APPROVE",
                                roles: ["EST_CHECKER"],
                            },
                        ],
                        roles: ["EST_CHECKER", "EST_CHECKER"],
                    },
                    applicationBusinessService: "estimate-approval-2",
                    processInstances: [
                        {
                            id: "e3f890d0-bcb0-4526-afde-1d36d2be91f4",
                            tenantId: "pb.amritsar",
                            businessService: "estimate-approval-2",
                            businessId: "EP/2022-23/11/000160",
                            action: "CREATE",
                            moduleName: "estimate-service",
                            state: {
                                auditDetails: null,
                                uuid: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                tenantId: "pb",
                                businessServiceId: "52e2c4e0-f12c-4c75-aef3-1535bc8edac0",
                                sla: null,
                                state: "CREATED",
                                applicationStatus: "CREATED",
                                docUploadRequired: false,
                                isStartState: true,
                                isTerminateState: false,
                                isStateUpdatable: null,
                                actions: [
                                    {
                                        auditDetails: null,
                                        uuid: "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                                        tenantId: "pb",
                                        currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                        action: "APPROVE",
                                        nextState: "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                        roles: ["EST_CHECKER"],
                                        active: null,
                                    },
                                    {
                                        auditDetails: null,
                                        uuid: "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                        tenantId: "pb",
                                        currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                        action: "REJECT",
                                        nextState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                        roles: ["EST_CHECKER"],
                                        active: null,
                                    },
                                ],
                            },
                            comment: "",
                            documents: null,
                            assigner: {
                                id: 109,
                                userName: "Nipsyyyy",
                                name: "Nipun ",
                                type: "EMPLOYEE",
                                mobileNumber: "9667076655",
                                emailId: "",
                                roles: [
                                    {
                                        id: null,
                                        name: "Employee",
                                        code: "EMPLOYEE",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "EST CREATOR",
                                        code: "EST_CREATOR",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "EST_CHECKER",
                                        code: "EST_CHECKER",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "LOI APPROVER",
                                        code: "LOI_APPROVER",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "EST TECH SANC",
                                        code: "EST_TECH_SANC",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "EST FIN SANC",
                                        code: "EST_FIN_SANC",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "LOI CREATOR",
                                        code: "LOI_CREATOR",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "SUPER USER",
                                        code: "SUPERUSER",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "EST TECH SANC",
                                        code: "EST_ADMIN_SANC",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "LOI CHECKER",
                                        code: "LOI_CHECKER",
                                        tenantId: "pb.amritsar",
                                    },
                                    {
                                        id: null,
                                        name: "HRMS Admin",
                                        code: "HRMS_ADMIN",
                                        tenantId: "pb.amritsar",
                                    },
                                ],
                                tenantId: "pb.amritsar",
                                uuid: "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                            },
                            assignes: [
                                {
                                    id: 111,
                                    userName: "EMP-107-000011",
                                    name: "Estimate Checker",
                                    type: "EMPLOYEE",
                                    mobileNumber: "8877665544",
                                    emailId: null,
                                    roles: [
                                        {
                                            id: null,
                                            name: "EST_CHECKER",
                                            code: "EST_CHECKER",
                                            tenantId: "pb.amritsar",
                                        },
                                        {
                                            id: null,
                                            name: "Employee",
                                            code: "EMPLOYEE",
                                            tenantId: "pb.amritsar",
                                        },
                                    ],
                                    tenantId: "pb.amritsar",
                                    uuid: "88bd1b70-dd6d-45f7-bcf7-5aa7a6fae7d9",
                                },
                            ],
                            nextActions: [
                                {
                                    auditDetails: null,
                                    uuid: "568b7e7d-d88f-4079-bb02-3dc9a37c56ea",
                                    tenantId: "pb",
                                    currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                    action: "APPROVE",
                                    nextState: "e970bdf2-a968-4be5-b0fe-bc6584e62829",
                                    roles: ["EST_CHECKER"],
                                    active: null,
                                },
                                {
                                    auditDetails: null,
                                    uuid: "1a6d9f29-893d-49d9-870f-6e007a6820e8",
                                    tenantId: "pb",
                                    currentState: "67d17040-0c49-40a1-b932-a7b5a5266557",
                                    action: "REJECT",
                                    nextState: "af66155b-f5ac-447f-947b-f56539c4d671",
                                    roles: ["EST_CHECKER"],
                                    active: null,
                                },
                            ],
                            stateSla: null,
                            businesssServiceSla: 431977852,
                            previousStatus: null,
                            entity: null,
                            auditDetails: {
                                createdBy: "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                                lastModifiedBy: "be99b2c2-5780-4b1c-8e41-e3f8a972ebda",
                                createdTime: 1669175470551,
                                lastModifiedTime: 1669175470551,
                            },
                            rating: 0,
                            escalated: false,
                        },
                    ],
                },
            },
            CollapseConfig: {
                collapseAll: true,
                groupHeader: "",
                headerLabel: "Bill 1- ID(CTR/2022-23/08/0004) - Type(Work Order)- Date(20-09-2022)",
                headerValue: "₹ 19,08,500"
            },
        }
        return result;
    },
    getValueHelper:(questionType)=>{
        switch (questionType) {
            case "MULTIPLE_ANSWER_TYPE":
                return "A.  Yes"
            case "DATE_ANSWER_TYPE":
                return "A.  20/11/1992"
            case "UPLOAD_ANSWER_TYPE":
                return "A.  Yes"
            default:
                return ""
        }
    },
    viewProjectClosureScreenFieldSurvey:(tenantId,questions,t) => {
        const tenant = Digit.ULBService.getStateId();
        const applicationDetails = [
            {
                "title": " ",
                "asSectionHeader": true,
                "tab":"fieldSurvey",
                "values":questions.map((question,index)=> {
                    return {
                        "title": `${index+1}.  ${t(question.code)}`,
                        "value": WorksSearch.getValueHelper(question.type),
                        "isImages": question.type ==="UPLOAD_ANSWER_TYPE" ? true : false,
                        "fileStoreIds": ["0db89173-6621-455e-b953-2286936040be"],
                        tenant
                    }
                }) 
            }
        ]

        const result = {
            applicationDetails
        }
        return result
        
    },
    viewProjectClosureScreenClosureChecklist: (tenantId,questions,t) => {
        
        const applicationDetails = [
            {
                "title": " ",
                "asSectionHeader": true,
                "tab": "fieldSurvey",
                "values": questions.map((question, index) => {
                    return {
                        "title": `${index + 1}.  ${t(question.code)}`,
                        "value": WorksSearch.getValueHelper(question.type)
                    }
                })
            }
        ]

        const result = {
            applicationDetails
        }
        return result
    },
}