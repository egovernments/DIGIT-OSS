import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getMyConnectionResults, getSWMyConnectionResults } from '../../../../../ui-utils/commons';

export const fetchData = async (action, state, dispatch) => {
  let queryObject = [{ key: "mobileNumber", value: JSON.parse(getUserInfo()).mobileNumber }]
  let responseWater = [], responseSewerage = [];
  try { responseWater = await getMyConnectionResults(queryObject, dispatch); } catch (error) { responseWater = []; console.log(error) }
  try { responseSewerage = await getSWMyConnectionResults(queryObject, dispatch); } catch (error) { responseSewerage = []; console.log(error) }
  try {
    const water = responseWater.WaterConnection
    const sewerage = responseSewerage.SewerageConnections
    const finalArray = water.concat(sewerage);
    if (finalArray !== undefined && finalArray !== null) { dispatch(prepareFinalObject("myApplicationsCount", finalArray.length)); }
  }
  catch (error) { console.log(error); }
}
