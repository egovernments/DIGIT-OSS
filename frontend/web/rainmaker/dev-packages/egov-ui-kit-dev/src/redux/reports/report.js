import _ from "lodash";

const defaultState = {
  showTable: false,
  metaData: {},
  reportResult: {},
  flag: 0,
  searchParams: [],
  tableSelectionData: [],
  reportHistory: [],
  reportIndex: 0,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_SEARCH_PARAMS":
      return {
        ...state,
        searchParams: action.searchParams,
      };

    case "PUSH_REPORT_HISTORY":
      var current = { ...state };
      if (
        _.findIndex(current.reportHistory, {
          reportName: action.reportData.reportName,
        }) != -1
      ) {
        let index = _.findIndex(current.reportHistory, {
          reportName: action.reportData.reportName,
        });
        current.reportHistory[index] = action.reportData;
        current.reportIndex = current.reportHistory.length;
      } else {
        current.reportHistory.push(action.reportData);
        current.reportIndex = current.reportIndex + 1;
      }
      return current;

    case "CLEAR_REPORT_HISTORY":
      return {
        ...state,
        reportHistory: [],
        reportIndex: 0,
      };

    case "INCREASE_REPORT_INDEX":
      return {
        ...state,
        reportIndex: state.reportIndex + 1,
      };

    case "DECREASE_REPORT_INDEX":
      return {
        ...state,
        reportIndex: state.reportIndex - 1,
      };

    case "SET_META_DATA":
      return {
        ...state,
        metaData: {
          ...state.metaData,
          ...action.metaData,
        },
        // Object.assign(state.metaData,action.metaData)
      };

    case "SET_REPORT_RESULT":
      return {
        ...state,
        reportResult: action.reportResult,
      };

    case "SHOW_TABLE":
      return {
        ...state,
        showTable: action.state,
      };

    case "SET_FLAG":
      return {
        ...state,
        flag: action.flag,
      };

    case "SET_TABLE_SELECTION_DATA":
      return {
        ...state,
        tableSelectionData: action.tableSelectionData,
      };

    default:
      return state;
  }
};
