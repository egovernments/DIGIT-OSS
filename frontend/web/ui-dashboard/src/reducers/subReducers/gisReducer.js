import {
  REQUEST_GEO_JSON_DATA,
  RECEIVE_GEO_JSON_DATA,
  REQUEST_GRAPH_DATA,
  RECEIVE_GRAPH_DATA,
} from '../../actions/gisActions';

export const geoJson = (
  state = {
    isFetching: false,
  },
  action,
) => {
  switch (action.type) {
    case REQUEST_GEO_JSON_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_GEO_JSON_DATA:
      return {
        ...state,
        isFetching: false,
        boundary: action.geoJson,
      };
    default:
      return state;
  }
};

export const graphData = (
  state = {
    isFetching: false,
  },
  action,
) => {
  switch (action.type) {
    case REQUEST_GRAPH_DATA:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_GRAPH_DATA:
      return {
        ...state,
        isFetching: false,
        data: action.graphData,
        receivedAt: action.receivedAt,
      };
    default:
      return state;
  }
};
