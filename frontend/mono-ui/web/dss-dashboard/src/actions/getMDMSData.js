import _ from 'lodash';
import { getTenantId } from '../utils/commons';

export default function getMDMSData(tenants){
let tempDRRsObj = {},tempDDRs=[],tempULBS=[],tenantId = "",tenantLogo ={},tenantName='',corpName = '';
_.each(tenants,(v,k) => {

    if(v.code){
        tenantLogo[v.code] = v.logoId;
        tempULBS.push(v.code);
    }
    if(v.code === getTenantId())
        tenantName = v.code;
    if(v.city.ddrName){     
        tenantId = v.code;
        if(!_.isEmpty(tempDRRsObj,true) && typeof tempDRRsObj[v.city.districtTenantCode] != 'undefined'){
            tempDRRsObj[v.city.districtTenantCode].push(tenantId);
        }else{
            tempDRRsObj[v.city.districtTenantCode] = [tenantId]
            tempDDRs.push(v.city.districtTenantCode);
        }
    }
})


let localVal = JSON.parse(localStorage.getItem("localization_"+localStorage.getItem("locale") ) );
for(var i=0; i<localVal.length;i++){    
     if(localVal[i].code === "ULBGRADE_MC1"){ 
        corpName = localVal[i]['message'];
        break;        
    } 
}
return {
    label: "DDRs",
    type: "dropdown",
    values : tempDDRs,
    master : tempDRRsObj,
    tentantLogo : tenantLogo,
    tenantName : tenantName,
    corpName : corpName,
    ULBS :{
        label: "ULBS",
        label_locale: "DSS_ULBS",
        type: "dropdown",
        values : tempULBS
    }
}
};