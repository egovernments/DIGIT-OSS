import axios from 'axios';
import { API_URL } from '../constants';
import { checkStatus, processElasticResponse } from '../utils/es-utils/responseProcessor';
import { buildFilterQuery, buildDashboardQuery } from '../utils/es-utils/queryBuilder';
import { fetchGeoJsonData, fetchGraphData } from './gisActions';
import { DASHBOARD_QUERIES, FILTER_QUERIES } from '../constants/queries';

export const REQUEST_DASHBOARD_DATA = 'REQUEST_DASHBOARD_DATA';
export const RECEIVE_DASHBOARD_DATA = 'RECEIVE_DASHBOARD_DATA';
export const REQUEST_FILTER_DATA = 'REQUEST_FILTER_DATA';
export const RECEIVE_FILTER_DATA = 'RECEIVE_FILTER_DATA';
export const INPUT_CHANGE = 'INPUT_CHANGE';
export const ADD_CONSTRAINT = 'ADD_CONSTRAINT';
export const DEL_CONSTRAINT = 'DEL_CONSTRAINT';

export const inputChange = (name, value) => ({
  type: INPUT_CHANGE,
  payload: {
    name,
    value,
  },
});

export const addConstraint = (name, value) => ({
  type: ADD_CONSTRAINT,
  payload: {
    name,
    value,
  },
});

export const delConstraint = (name, value) => ({
  type: DEL_CONSTRAINT,
  payload: {
    name,
    value,
  },
});

const requestDashboardData = () => ({
  type: REQUEST_DASHBOARD_DATA,
});

const receiveDashboardData = json => ({
  type: RECEIVE_DASHBOARD_DATA,
  data: json,
  receivedAt: Date.now(),
});

const requestFilterData = () => ({
  type: REQUEST_FILTER_DATA,
});

const receiveFilterData = json => ({
  type: RECEIVE_FILTER_DATA,
  data: json,
  receivedAt: Date.now(),
});

export const fetchFilterData = url => (dispatch) => {
  const finalQuery = buildFilterQuery(FILTER_QUERIES);
  const finalUrl = `${API_URL}/${url}/_msearch`;

  dispatch(requestFilterData());
  axios({
    method: 'post',
    url: finalUrl,
    data: finalQuery,
  })
    .then(checkStatus)
    .then(res => processElasticResponse(res, FILTER_QUERIES))
    // .then(processFilterData)
    .then(data => dispatch(receiveFilterData(data)))
    .catch(console.err);
};

const fetchDashboardData = (url, constraints) => (dispatch) => {
  const finalQuery = buildDashboardQuery(DASHBOARD_QUERIES, constraints);
  dispatch(requestDashboardData());
  axios({
    method: 'post',
    url,
    data: finalQuery,
  })
    .then(checkStatus)
    .then(res => processElasticResponse(res, DASHBOARD_QUERIES))
    // .then(processDashboardData)
    .then(data => dispatch(receiveDashboardData(data)))
    .catch(console.err);
};

export const refreshDashboardData = url => (dispatch, getState) => {
  const finalUrl = `${API_URL}/${url}`;
  const constraints = getState().pgrReducer.query;

  dispatch(fetchDashboardData(`${finalUrl}/_msearch`, constraints));
  dispatch(fetchGeoJsonData(`${finalUrl}/_search`, constraints));
  dispatch(fetchGraphData(`${finalUrl}/_search`, constraints));
};
