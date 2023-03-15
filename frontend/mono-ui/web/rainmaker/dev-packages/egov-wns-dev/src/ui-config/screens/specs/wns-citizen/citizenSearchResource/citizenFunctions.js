import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getWSMyResults, getSWMyResults } from '../../../../../ui-utils/commons';

export const fetchData = async (action, state, dispatch) => {
  let queryObject = [
    { 
      key: "mobileNumber", 
      value: JSON.parse(getUserInfo()).mobileNumber 
    },
    {
    key: "tenantId",
    value: JSON.parse(getUserInfo()).permanentCity ? JSON.parse(getUserInfo()).permanentCity : JSON.parse(getUserInfo()).roles[0].tenantId
    }
  ];
  let responseWater = [], responseSewerage = [];
  try { responseWater = await getWSMyResults(queryObject, 'CONNECTION', dispatch); } catch (error) { responseWater = [];   }
  try { responseSewerage = await getSWMyResults(queryObject, 'CONNECTION', dispatch); } catch (error) { responseSewerage = [];   }
  try {
    const water = (responseWater && responseWater.WaterConnection)?responseWater.WaterConnection:[]
    const sewerage = (responseSewerage && responseSewerage.SewerageConnections)?responseSewerage.SewerageConnections:[]
    const finalArray = water.concat(sewerage);
    if (finalArray !== undefined && finalArray !== null) {
      const myConnectionsResult=finalArray.filter(item => item.connectionNo !== "NA" && item.connectionNo !== null);  
      dispatch(prepareFinalObject("myApplicationsCount", myConnectionsResult.length));
      dispatch(
        handleField(
            "home",
            "components.div.children.listCard1.props",
              "Count",
              finalArray.length?finalArray.length:0
        )
    );

     }
  }
  catch (error) { }
}
