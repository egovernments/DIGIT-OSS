import {
  REQUEST_DASHBOARD_DATA,
  RECEIVE_DASHBOARD_DATA,
  REQUEST_FILTER_DATA,
  RECEIVE_FILTER_DATA,
  INPUT_CHANGE,
  ADD_CONSTRAINT,
  DEL_CONSTRAINT,
} from '../actions/pgrActions';
import {
  REQUEST_GEO_JSON_DATA,
  RECEIVE_GEO_JSON_DATA,
  REQUEST_GRAPH_DATA,
  RECEIVE_GRAPH_DATA,
} from '../actions/gisActions';
import { geoJson, graphData } from './subReducers/gisReducer';
import { INIT_VALUES } from '../constants/formConstants';

const values = (state = INIT_VALUES, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};

const query = (state = {}, action) => {
  switch (action.type) {
    case ADD_CONSTRAINT:
      if (action.payload.value === 'all') {
        return {
          ...state,
          [action.payload.name]: undefined,
        };
      }
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case DEL_CONSTRAINT:
      return {
        ...state,
        [action.payload.name]: undefined,
      };
    default:
      return state;
  }
};

const dashboardData = (
  state = {
    isFetching: false,
    data: {},
  },
  action,
) => {
  switch (action.type) {
    case REQUEST_DASHBOARD_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_DASHBOARD_DATA:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    default:
      return state;
  }
};

const filterData = (
  state = {
    isFetching: false,
    data: {},
  },
  action,
) => {
  switch (action.type) {
    case REQUEST_FILTER_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_FILTER_DATA:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    default:
      return state;
  }
};

const pgrReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_DASHBOARD_DATA:
    case RECEIVE_DASHBOARD_DATA:
      return {
        ...state,
        dashboard: dashboardData(state.dashboard, action),
      };
    case REQUEST_FILTER_DATA:
    case RECEIVE_FILTER_DATA:
      return {
        ...state,
        filter: filterData(state.filter, action),
      };
    case INPUT_CHANGE:
      return {
        ...state,
        form: values(state.form, action),
      };
    case ADD_CONSTRAINT:
    case DEL_CONSTRAINT:
      return {
        ...state,
        query: query(state.query, action),
      };
    case REQUEST_GEO_JSON_DATA:
    case RECEIVE_GEO_JSON_DATA:
      return {
        ...state,
        gis: {
          ...state.gis,
          geoJson: geoJson(state.gis.geoJson, action),
        },
      };
    case REQUEST_GRAPH_DATA:
    case RECEIVE_GRAPH_DATA:
      return {
        ...state,
        gis: {
          ...state.gis,
          plots: graphData(state.gis.plots, action),
        },
      };
    default:
      return {
        dashboard: dashboardData(state.dashboard, action),
        filter: filterData(state.filter, action),
        form: values(state.form, action),
        query: query(state.query, action),
        gis: {
          geoJson: geoJson(state.gis, action),
          plots: graphData(state.gis, action),
        },
      };
  }
};

export default pgrReducer;
