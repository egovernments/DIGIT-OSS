import { CoreService } from "@egovernments/digit-ui-libraries";

class Complaint extends CoreService {
  constructor() {
    super("PGR");
    this.employeeTenantId = () => window.Digit?.SessionStorage.get("Employee.tenantId");
    this._userType = () => window.Digit?.SessionStorage.get("user_type") === "employee";
  }

  create = async ({
    cityCode,
    complaintType,
    description,
    landmark,
    city,
    district,
    region,
    state,
    pincode,
    localityCode,
    localityName,
    uploadedImages,
    mobileNumber,
    name,
  }) => {
    var data = this._userType()
      ? {
          service: {
            citizen: {
              name: name,
              type: "CITIZEN",
              mobileNumber: mobileNumber,
              roles: [
                {
                  id: null,
                  name: "Citizen",
                  code: "CITIZEN",
                  tenantId: this.employeeTenantId(),
                },
              ],
              tenantId: this.employeeTenantId,
            },
            tenantId: cityCode,
            serviceCode: complaintType,
            description: description,
            additionalDetail: {},
            source: "whatsapp",
            address: {
              landmark: landmark,
              city: city,
              district: district,
              region: region,
              state: state,
              pincode: pincode,
              locality: {
                code: localityCode,
                name: localityName,
              },
              geoLocation: {},
            },
          },
          workflow: {
            action: "APPLY",
            verificationDocuments: uploadedImages,
          },
        }
      : {
          service: {
            tenantId: cityCode,
            serviceCode: complaintType,
            description: description,
            additionalDetail: {},
            source: "whatsapp",
            address: {
              landmark: landmark,
              city: city,
              district: district,
              region: region,
              state: state,
              pincode: pincode,
              locality: {
                code: localityCode,
                name: localityName,
              },
              geoLocation: {},
            },
          },
          workflow: {
            action: "APPLY",
            verificationDocuments: uploadedImages,
          },
        };
    const response = await this._module.create(data, cityCode);

    return response;
  };

  assign = async (complaintDetails, action, employeeData, comments, uploadedDocument) => {
    console.log("assign complaint srvice acall", action, employeeData, comments, uploadedDocument);
    debugger;
    complaintDetails.workflow.action = action;
    complaintDetails.workflow.assignes = employeeData ? [employeeData.uuid] : null;
    complaintDetails.workflow.comments = comments;
    uploadedDocument
      ? complaintDetails.workflow.verificationDocuments.push({
          documentType: "PHOTO",
          fileStore: uploadedDocument,
          documentUid: "",
          additionalDetails: {},
        })
      : null;

    console.log("assign complaintg whole call", complaintDetails);
    debugger;
    const response = await this._module.update(complaintDetails, this.employeeTenantId());
    console.log(response);
    return response;
  };
}

const ComplaintObject = new Complaint();

export const getComplaint = () => ComplaintObject;
