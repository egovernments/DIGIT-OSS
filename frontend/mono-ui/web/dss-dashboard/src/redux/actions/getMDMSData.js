import _ from 'lodash';
import { getTenantId } from '../../utils/commons';

export default function getMDMSData(tenants){
let tempDRRsObj = {},tempDDRs=[],tempULBS=[],tenantId = "",tenantLogo ={},tenantName='',corpName = '';
_.each(tenants,(v,k) => {

    if(v.code){
        tenantLogo[v.code] = v.logoId;
        tempULBS.push(v.name);
    }
    if(v.code === getTenantId())
        tenantName = v.name;
    if(v.city.ddrName){     
        tenantId = v.code;
        if(!_.isEmpty(tempDRRsObj,true) && typeof tempDRRsObj[v.city.ddrName] != 'undefined'){
            tempDRRsObj[v.city.ddrName].push(tenantId);
        }else{
            tempDRRsObj[v.city.ddrName] = [tenantId]
            tempDDRs.push(v.city.ddrName);
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