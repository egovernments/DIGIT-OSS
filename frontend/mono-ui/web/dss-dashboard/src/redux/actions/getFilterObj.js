import _ from 'lodash';
import { stateTenant } from '../../utils/commons';
import CONFIG from '../config/configs';
export default function getFilterObj(GFilterData, mdmsData, page) {
    let newGFilterData = _.cloneDeep(GFilterData);
    let MODULE_LEVEL=JSON.parse(sessionStorage.getItem('MODULE_LEVEL'))
    /* Filter Customization */
    let tempValue = [],
        filters = {};
    if (newGFilterData) {
        if (!_.isEmpty(mdmsData, true) &&  newGFilterData['DDRs'] && newGFilterData['DDRs'].length > 0) {
            let tvalue = newGFilterData['DDRs'];
            let tempDDR = []
            for (var i = 0; i < tvalue.length; i++) {
                tempDDR = mdmsData['master'][tvalue[i]];
                for (var j = 0; j < tempDDR.length; j++) {
                    tempValue.push(tempDDR[j]);
                }
            }
            filters['tenantId'] = tempValue;
        }
        if(newGFilterData['Wards'] && newGFilterData['Wards'].length > 0){
            filters['wardId'] = newGFilterData['Wards'];
        }
    }

    if (newGFilterData && newGFilterData['ULBS'] && newGFilterData['ULBS'].length > 0) {

        for (var i = 0; i < newGFilterData['ULBS'].length; i++) {
            let tenent =stateTenant() || '';
            tempValue.push(tenent + '.' + newGFilterData['ULBS'][i].toLowerCase());
        }
        filters['tenantId'] = tempValue;
    }

    if (newGFilterData && newGFilterData['duration'] && Object.keys(_.get(newGFilterData, 'duration.value')).length > 0) {
        filters['duration'] = newGFilterData['duration']['value'];
        let startDate = _.get(newGFilterData, 'duration.value.startDate') * 1000;
        let endDate = _.get(newGFilterData, 'duration.value.endDate') * 1000;
        let title = _.get(newGFilterData, 'duration.title');
        let interval = _.get(newGFilterData, 'duration.value.interval');
        _.set(filters, 'duration.endDate', endDate)
        _.set(filters, 'duration.startDate', startDate)
        _.set(filters, 'duration.title', title)
        _.set(filters, 'duration.interval', interval)
    }
    if(page){
        let dashKey ='';
        for(var i=0; i<MODULE_LEVEL.length;i++){
            dashKey = Object.keys(MODULE_LEVEL[i])[0];
            if(dashKey.toLowerCase() == page.toLowerCase() || 'ulb-'+dashKey == page.toLowerCase()){
                filters['modulelevel'] = MODULE_LEVEL[i][dashKey]['filterKey'];
                break;
            }else if(newGFilterData && newGFilterData['Services'] && newGFilterData['Services'].length > 0 && MODULE_LEVEL[i][dashKey] && MODULE_LEVEL[i][dashKey]['services_name'] == newGFilterData['Services'] ){
                filters['modulelevel'] = MODULE_LEVEL[i][dashKey]['filterKey'];
                break;
            }
        }
    }
    /*
    switch (_.toLower(page)) {
        case 'propertytax':
        case 'ulb-propertytax':
            filters['modulelevel'] = 'PT';
            break;
        case 'dashboard':
            filters['modulelevel'] = null;
            break;
        case 'tradelicense':
        case 'ulb-tradelicense':
            filters['modulelevel'] = 'TL';
            break;
        case 'pgr':
        case 'ulb-pgr':
            filters['modulelevel'] = 'PGR';
            break;
        case 'ws':
        case 'ulb-ws':
            filters['modulelevel'] = 'W&S';
            break;

    }
    if (newGFilterData && newGFilterData['Services'] && newGFilterData['Services'].length > 0) {        
        if (newGFilterData['Services'] === 'Property Tax') {
            filters['modulelevel'] = 'PT';
        } else if (newGFilterData['Services'] === 'Trade licence') {
            filters['modulelevel'] = 'TL';
        } else if (newGFilterData['Services'] === 'PGR') {
            filters['modulelevel'] = 'PGR';
        }         
    }*/
    return filters
}