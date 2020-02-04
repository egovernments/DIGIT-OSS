import { httpRequest } from "../../../../../ui-utils/api";

// Mdms API call
export const getMdmsResults = async mdmsBody => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
