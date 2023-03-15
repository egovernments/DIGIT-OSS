import _ from 'lodash';
import { getTenantId } from '../utils/commons';
export default function getPDFHeaderDetails(mdmsData) {
  let returnObj = {logo: '',headerText: ''};
  if(!_.isEmpty(mdmsData,true)){
    returnObj.logo = mdmsData['tentantLogo'][`${getTenantId()}`];
    returnObj.headerText= mdmsData['tenantName'].toUpperCase() +" "+ mdmsData['corpName'].toUpperCase();    
  }
  return returnObj;
}