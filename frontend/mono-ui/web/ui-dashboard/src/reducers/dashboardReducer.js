import {
  REQUEST_DASHBOARD_DATA,
  RECEIVE_DASHBOARD_DATA,
  REQUEST_FILTER_DATA,
  RECEIVE_FILTER_DATA,
  INPUT_CHANGE,
  ADD_CONSTRAINT,
  DEL_CONSTRAINT,
} from '../actions/dashboardActions';
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
    responses: [],
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
          totalComplaints: action.data.totalComplaints,
          openComplaints: action.data.openComplaints,
          slaBreached: action.data.slaBreached,
          reopenedComplaints: action.data.reopenedComplaints,
          slaCount: action.data.slaCount,
          complaintSources: action.data.complaintSources,
          categories: action.data.categories,
          cities: action.data.cities,
          complaintStatusByMonth: action.data.complaintStatusByMonth,
          slaBreachedByDistrict: action.data.slaBreachedByDistrict,
        },
      };
    default:
      return state;
  }
};

const filterData = (
  state = {
    isFetching: false,
    responses: [],
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
          uniqDistricts: action.data.uniqDistricts,
          uniqCities: action.data.uniqCities,
          uniqSources: action.data.uniqSources,
        },
      };
    default:
      return state;
  }
};

const dashboardReducer = (state = {}, action) => {
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
    default:
      return {
        dashboard: dashboardData(state.dashboard, action),
        filter: dashboardData(state.filter, action),
        form: values(state.form, action),
        query: query(state.query, action),
      };
  }
};

export default dashboardReducer;
