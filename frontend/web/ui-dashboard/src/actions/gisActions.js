import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import camelCase from 'lodash/camelCase';
import { STATE, API_URL_LOC } from '../constants';
import { GIS_GRAPH_DATA_QUERY } from '../constants/queries';
import { checkStatus } from '../utils/es-utils/responseProcessor';
import ES_MAP from '../constants/esMapping';

export const REQUEST_GEO_JSON_DATA = 'REQUEST_GEO_JSON_DATA';
export const RECEIVE_GEO_JSON_DATA = 'RECEIVE_GEO_JSON_DATA';
export const REQUEST_GRAPH_DATA = 'REQUEST_GRAPH_DATA';
export const RECEIVE_GRAPH_DATA = 'RECEIVE_GRAPH_DATA';

const requestGeoJsonData = () => ({
  type: REQUEST_GEO_JSON_DATA,
});

const receiveGeoJsonData = json => ({
  type: RECEIVE_GEO_JSON_DATA,
  geoJson: json,
  receivedAt: Date.now(),
});

const requestGraphData = () => ({
  type: REQUEST_GRAPH_DATA,
});

const receiveGraphData = json => ({
  type: RECEIVE_GRAPH_DATA,
  graphData: json,
  receivedAt: Date.now(),
});

export const fetchGeoJsonData = (url, constraints) => (dispatch) => {
  const finalUrl = `${API_URL_LOC}/location/v11/geography/_search`;
  let tenantId = camelCase(STATE);
  if (
    Object.prototype.hasOwnProperty.call(constraints, ES_MAP.DISTRICT) &&
    constraints[ES_MAP.DISTRICT]
  ) {
    tenantId = `${tenantId}.${camelCase(constraints[ES_MAP.DISTRICT]).toLowerCase()}`;
    // dispatch(requestGeoJsonData());
    // if (Object.prototype.hasOwnProperty.call(GIS_DATA_BY_DISTRICT, tenantId.toUpperCase())) {
    //   dispatch(receiveGeoJsonData(GIS_DATA_BY_DISTRICT[tenantId.toUpperCase()]));
  }
  // else {
  //   dispatch(requestGeoJsonData());
  //   dispatch(receiveGeoJsonData(GEO_JSON_AP));
  // }
  dispatch(requestGeoJsonData());
  const data = {
    RequestInfo: {
      apiId: 'asset-services',
    },
  };

  axios({
    method: 'post',
    url: `${finalUrl}?tenantId=${tenantId}`,
    data,
  })
    .then(checkStatus)
    .then(res => dispatch(receiveGeoJsonData(res.data.Geography[0])))
    .catch(console.err);
};

export const fetchGraphData = (url, constraints) => (dispatch) => {
  let finalQuery = '';
  if (
    Object.prototype.hasOwnProperty.call(constraints, ES_MAP.DISTRICT) &&
    constraints[ES_MAP.DISTRICT]
  ) {
    finalQuery = cloneDeep(GIS_GRAPH_DATA_QUERY[ES_MAP.DISTRICT]);
  } else {
    finalQuery = cloneDeep(GIS_GRAPH_DATA_QUERY.state);
  }

  Object.keys(constraints).forEach((item) => {
    if (constraints[item]) {
      finalQuery.query.bool.must.push({
        match: {
          [item]: constraints[item],
        },
      });
    }
  });

  if (!finalQuery) return;

  dispatch(requestGraphData());
  axios({
    method: 'post',
    url,
    data: finalQuery,
  })
    .then(checkStatus)
    .then(res => dispatch(receiveGraphData(res.data.aggregations.placeholder.buckets)))
    .catch(console.err);
};
