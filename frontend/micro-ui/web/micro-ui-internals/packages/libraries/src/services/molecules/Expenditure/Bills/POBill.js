const transformViewDataToApplicationDetails = {
    genericPropertyDetails: () => {
      const BillDetails = {
        title: "EXP_BILL_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "EXP_BILL_ID", value: "Bill/2021-22/09/0001" },
          { title: "EXP_CREATED_BY", value: "A Manjunath" },
          { title: "EXP_CREATED_DATE", value: "28-09-2022" },
          { title: "EXP_STATUS", value: "To Approve" },
        ],
      };
      const ViewVendorBill = {
        title: "EXP_VIEW_VENDOR_BILLS",
        asSectionHeader: true,
        values: [
          { title: "EXP_VENDOR", value: "Sri Ganesha Enterprises" },
          { title: "EXP_VENDOR_ID", value: "VDR/2021-22/09/0001" },
          { title: "EXP_BILL_AMOUNT", value: "5,500" },
        ],
        additionalDetails : {
          statusWithRadio : {
            customClass : "border-none",
            radioConfig : {
              label : "EXP_WHO_SHOULD_THIS_BILL_AMT_PAID_TO",
              options : [
                {
                  name : "BillAmount",
                  value : "SHG",
                  key : "SHG",
                  code : "EXP_SHG"
                },
                {
                  name : "BillAmount",
                  value : "Vendor",
                  key : "Vendor",
                  code : "EXP_VENDOR"
                }
              ]
            },
          },
          documentsWithUrl : [
              {
                  title : "EXP_UPLOAD_FILES",
                  values : [
                      {
                          url : "",
                          title : "Document 1",
                          documentType : "pdf",
                      },
                      {
                          url : "",
                          title : "Document 2",
                          documentType : "pdf",
                      },
                      {
                          url : "",
                          title : "Document 3",
                          documentType : "pdf",
                      }
                  ]
              }
          ],
      }
      };
      const TotalVendorBill = {
        additionalDetails : {
          showTotal : {
            bottomBreakLine : true,
            label : "EXP_TOTAL_VENDOR_BILL",
            value : "₹ 1,20,000"
          }
        }
      };
      const workflowDetails = {
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
      };
      const applicationDetails = { applicationDetails: [BillDetails, ViewVendorBill, TotalVendorBill] };
      return {
        applicationDetails,
        applicationData: { regNo: 111, HosName: "Name", DOR: "10-10-2020" }, //dummy data
        workflowDetails
      };
    },
  };

export const fetchPOBillRecords = () => {
    return transformViewDataToApplicationDetails.genericPropertyDetails();
};