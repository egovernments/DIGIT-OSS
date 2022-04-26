import _ from 'lodash';
export default function getPDFHeaderDetails(mdmsData) {
  let returnObj = {logo: '',headerText: ''};
  if(!_.isEmpty(mdmsData,true)){
    returnObj.logo = mdmsData['tentantLogo'][`${localStorage.getItem('tenant-id')}`];
    returnObj.headerText= mdmsData['tenantName'].toUpperCase() +" "+ mdmsData['corpName'].toUpperCase();    
  }
  return returnObj;
}