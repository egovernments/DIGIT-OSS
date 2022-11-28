import axios from "axios";

export const getDocShareholding = async (documentId) => {
    // console.log("logDocumnentId",documentId)
    if ((documentId !== null || documentId !== undefined) ) {
        
        try {
            const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {

            });
            const FILDATA = response.data?.fileStoreIds[0]?.url;
            // setDocShareHoldingUrl(FILDATA)
            console.log("log123" , FILDATA,response );
            window.open(FILDATA)
        } catch (error) {
            console.log(error.message);
            
        }
        
    }
  }


  