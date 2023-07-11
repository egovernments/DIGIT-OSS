import axios from "axios";

export const getDocShareholding = async (documentId, setLoader, needURL = false) => {
  setLoader(true);
  try {
    const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
    const FILDATA = response.data?.fileStoreIds[0]?.url;
    // setDocShareHoldingUrl(FILDATA)
    setLoader(false);
    if(needURL){
      return FILDATA;
    }
    window.open(FILDATA);
  } catch (error) {
    setLoader(false);
    return error;
  }
};
