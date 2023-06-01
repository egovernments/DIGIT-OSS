export const initialInboxState = {
    searchForm:{

    },
    filterForm:{

    },
    tableForm:{
        limit: 10,
        offset: 0,
    } 
};

const reducer = (state, action) => {
    switch (action.type) {
        case "searchForm":
            const {state:updatedSearchStateSearchForm} = action 
            return {...state, searchForm: {...state.searchForm,...updatedSearchStateSearchForm}};
        case "filterForm":
            const { state: updatedSearchStateFilterForm } = action
            return { ...state, filterForm: { ...state.filterForm, ...updatedSearchStateFilterForm } };
        case "tableForm":
            const updatedTableState = action.state
            return { ...state, tableForm: {...state.tableForm,...updatedTableState} };
        case "clearSearchForm":
            return {...state,searchForm:action.state}
        case "clearFilterForm":
            return {...state,filterForm:action.state}
        default:
            return state;
    }
}

export default reducer;
