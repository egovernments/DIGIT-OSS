import axios from "axios";

export const getDocShareholding = async (docId) => {
  // console.log("logDocumnentId",docId)
  if (docId !== null || docId !== undefined) {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${docId}`, {});
      const FILDATA = response.data?.fileStoreIds[0]?.url;
      // setDocShareHoldingUrl(FILDATA)
      console.log("log123", FILDATA, response);
      window.open(FILDATA);
    } catch (error) {
      console.log(error.message);
    }
  }
};
