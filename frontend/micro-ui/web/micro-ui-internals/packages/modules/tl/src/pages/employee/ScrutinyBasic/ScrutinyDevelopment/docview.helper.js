import axios from "axios";

export const getDocShareholding = async (documentId) => {
  if (documentId !== null || documentId !== undefined) {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const FILDATA = response.data?.fileStoreIds[0]?.url;
      window.open(FILDATA);
    } catch (error) {
      console.log(error.message);
    }
  }
};
