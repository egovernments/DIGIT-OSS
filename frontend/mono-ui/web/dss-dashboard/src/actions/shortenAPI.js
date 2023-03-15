import axios from 'axios';
import CONFIGS from '../config/configs';
export default function shortenAPI( url,callback ) {
  const reqHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'                
            };
  const reqUrl = CONFIGS.SHORTEN_URL;
  const reqBody = { url : url}  
  const request = axios.post(reqUrl,reqBody,reqHeaders)
    .then( response => {
      callback("",response);
    } ).catch( ( error ) => {
      callback(error,"");
    } );
}