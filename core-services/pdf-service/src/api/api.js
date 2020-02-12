import axios from 'axios';
import logger from "../config/logger";
// const instance = axios.create({
//     endPoint: "https://egov-micro-dev.egovernments.org/",
//     headers: {
//       "Content-Type": "application/json",
//     }
//   });

export const httpRequest= async(
    endPoint,    
    requestBody,
    headers=defaultheader
)=>{
    let instance=axios.create({
      endPoint:endPoint,
      requestBody:requestBody
      
    })
    if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers,
    });
    
try {
  //console.log(endPoint);
  const response =  await instance.post(endPoint,requestBody);
  const responseStatus = parseInt(response.status, 10);
  if (responseStatus === 200 || responseStatus === 201) {
     //console.log(response.data);
    return response.data;
    }
} catch (error) {
  var errorResponse = error.response;
  logger.error(error.stack || error) ; 
  throw {message:"error occured while making request to "+endPoint+": response returned by call :"+(errorResponse ? parseInt(errorResponse.status, 10):error.message)};  
}
    
}


  const defaultheader={
    "content-type": "application/json;charset=UTF-8",
    "accept":"application/json, text/plain, */*" 
   }



