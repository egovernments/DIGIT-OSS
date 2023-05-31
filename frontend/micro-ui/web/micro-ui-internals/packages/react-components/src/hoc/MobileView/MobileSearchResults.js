import React, { useMemo, useContext, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { Details } from "../../molecules/DetailsCard";
import { Link } from "react-router-dom";
import NoResultsFound from "../../atoms/NoResultsFound";
import { Loader } from "../../atoms/Loader";
import _ from "lodash";
import { InboxContext } from '../InboxSearchComposerContext';
import Table from "../../atoms/Table";

const MobileSearchResults = ({ config, data, isLoading, isFetching,fullConfig }) => {
    const {apiDetails} = fullConfig
    const { t } = useTranslation();
    const resultsKey = config.resultsJsonPath
    //let searchResult = data?.[resultsKey]?.length>0 ? data?.[resultsKey] : []
    //searchResult = searchResult.reverse()
    //const tenantId =  Digit.ULBService.getCurrentTenantId();

    let searchResult = _.get(data,resultsKey,[])
    searchResult = searchResult?.length>0 ? searchResult : []
    searchResult = searchResult.reverse();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
    //reversing reason -> for some reason if we enable sorting on columns results from the api are reversed and shown, for now -> reversing the results(max size 50 so not a performance issue)
    
    // if (fullConfig?.postProcessResult){
    //     var { isPostProcessFetching,
    //         isPostProcessLoading,
    //         combinedResponse }  =  Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.postProcess(searchResult) 

    //     if(combinedResponse?.length > 0){
    //         searchResult = combinedResponse
    //     } 
    // }

    const {state,dispatch} = useContext(InboxContext)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    control,
    formState,
    errors,
    setError,
    clearErrors,
    unregister,
} = useForm({
    defaultValues: {
        offset: 0,
        limit: 10, 
    },
});

    useEffect(() => {
      register("offset", 0);
      register("limit", 10);
  }, [register]);

    function onPageSizeChange(e) {
      setValue("limit", Number(e.target.value));
      handleSubmit(onSubmit)();
    }

    function nextPage() {
      setValue("offset", getValues("offset") + getValues("limit"));
      handleSubmit(onSubmit)();
    }
  
    function previousPage() {
      const offsetValue = getValues("offset") - getValues("limit")
      setValue("offset", offsetValue>0 ? offsetValue : 0);
      handleSubmit(onSubmit)();
    }

    const onSubmit = (data) => {
      //here update the reducer state
      //call a dispatch to update table's part of the state and update offset, limit
      // this will in turn make the api call and give search results and table will be rendered acc to the new data      
      dispatch({
          type:"tableForm",
          state:{...data}
      })
      
    }

    const columns = [
      {
        Header: "",
        accessor: "_searchResults",
        id : "_searchResults"
      }
    ]
    
    const propsMobileInboxCards = useMemo(() => {
      if (isLoading) {
        return [];
      }
      let cardData =  searchResult.map((details) => {
          let mapping = {};
          let additionalCustomization = {};
          let cols = config?.columns;
          for(let columnIndex = 0; columnIndex<cols?.length; columnIndex++) {
              mapping[cols[columnIndex]?.label] = _.get(details, cols[columnIndex]?.jsonPath, null)
              additionalCustomization[cols[columnIndex]?.label] = cols[columnIndex]?.additionalCustomization || false;
            }
          return {mapping, details, additionalCustomization};
      })
      return cardData;
    }, [data]);

    const rows = propsMobileInboxCards.map((row) => {
      return {
        _searchResults : <Link to={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.MobileDetailsOnClick(row.mapping, tenantId)}>
        <div className="details-container">
          {Object.keys(row.mapping).map(key => {
            let toRender;
              if(row.additionalCustomization[key]){
                toRender = (
                <Details label={t(key)} 
                  name={Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalCustomizations(row.details, key, {}, row.mapping[key], t, searchResult)} 
                  onClick={() =>{}} 
                  row={row.mapping} />)
              }
              else {
                toRender = row.mapping[key]? ( 
                <Details 
                  label={t(key)} 
                  name={row.mapping[key]} 
                  onClick={() =>{}} 
                  row={row.mapping} /> 
                ) : ( 
                <Details 
                  label={t(key)} 
                  name={t("NA")} 
                  onClick={() =>{}} 
                  row={row.mapping} /> )
              }
              return toRender
            })}
        </div></Link>
      }
    })

  function RenderResult() {
    if (searchResult?.length === 0) {
       return ( <NoResultsFound/> );
    } 
  
    if (isLoading || isFetching ) return <Loader />
    if(!data) return <></>
    return <div>
       <Table 
          t={t}
          data={rows}
          totalRecords={data?.count || data?.TotalCount || data?.totalCount}
          columns={columns}
          isPaginationRequired={true}
          onPageSizeChange={onPageSizeChange}
          currentPage={getValues("offset") / getValues("limit")}
          onNextPage={nextPage}
          onPrevPage={previousPage}
          canPreviousPage={true}
          canNextPage={true}
          pageSizeLimit={getValues("limit")}
          getCellProps={(cellInfo) => {
            return {
              style: {width : "200vw"},
            };
          }}
          disableSort={config?.enableColumnSort ? false : true}
          autoSort={config?.enableColumnSort ? true : false}
          // globalSearch={config?.enableGlobalSearch ? filterValue : undefined}
          // onSearch={config?.enableGlobalSearch ? searchQuery : undefined}
        />
     </div>
    }

    if (isLoading) 
    {   return <Loader /> }
    return (
        <React.Fragment>
          <RenderResult/>
        </React.Fragment>
    );
};

export default MobileSearchResults;
