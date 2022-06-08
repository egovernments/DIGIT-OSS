import { MDMS } from "egov-ui-kit/utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
import commonConfig from "config/common.js";

export const getDocumentTypes = async () => {
  try {
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "OwnerTypeDocument"
              }
            ]
          }
        ]
      }
    };
    const payload = await httpRequest(
      MDMS.GET.URL,
      MDMS.GET.ACTION,
      [],
      requestBody
    );
    return payload;
  } catch (e) {
    //TODO:
  }
};
