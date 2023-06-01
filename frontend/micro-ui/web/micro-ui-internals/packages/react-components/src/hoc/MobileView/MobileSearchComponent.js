import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InboxContext } from "../InboxSearchComposerContext";
import { FilterIcon, SearchIcon, CloseSvg, RefreshIcon } from "../../atoms/svgindex";
import ActionBar from "../../atoms/ActionBar";
import SubmitBar from "../../atoms/SubmitBar";
import LinkLabel from "../../atoms/LinkLabel";
import ApplyFilterBar from "../../atoms/ApplyFilterBar";
import RenderFormFields from "../../molecules/RenderFormFields";
import Toast from "../../atoms/Toast"; 
import _ from "lodash";

const MobileSearchComponent = ({ uiConfig, modalType, header = "", screenType = "search", fullConfig, data, onClose, defaultValues }) => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(InboxContext)
  const [showToast,setShowToast] = useState(null)
  let updatedFields = [];
  const {apiDetails} = fullConfig

  if (fullConfig?.postProcessResult){
    //conditions can be added while calling postprocess function to pass different params
    Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.postProcess(data, uiConfig) 
  }

  //define session for modal form
  const mobileSearchSession = Digit.Hooks.useSessionStorage("MOBILE_SEARCH_MODAL_FORM", 
    defaultValues
  );
  const [sessionFormData, setSessionFormData, clearSessionFormData] = mobileSearchSession;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    control,
    formState,
    errors,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: sessionFormData,
  });
  const formData = watch();
  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    updatedFields = Object.values(formState?.dirtyFields)
  }, [formState]);


  //on form value change, update session data with form data
  useEffect(()=>{ 
    if (!_.isEqual(sessionFormData, formData)) {
      const difference = _.pickBy(sessionFormData, (v, k) => !_.isEqual(formData[k], v));
      setSessionFormData({ ...sessionFormData, ...formData });
    }
  },[formData]);

  useEffect(()=>{
    clearSessionFormData();
  },[]);

  const onSubmit = (data) => {
    onClose?.()
    if(updatedFields.length >= uiConfig?.minReqFields) {
     // here based on screenType call respective dispatch fn
      dispatch({
        type: modalType === "SEARCH" ? "searchForm" : "filterForm",
        state: {
          ...data
        }
      })
    } else {
      setShowToast({ warning: true, label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG") })
      setTimeout(closeToast, 3000);
    }
  }

  const clearSearch = () => {
    clearSessionFormData();
    reset(uiConfig?.defaultValues)
    dispatch({
      type: "clearSearchForm",
      state: { ...uiConfig?.defaultValues }
      //need to pass form with empty strings 
    })
  }
 
  const closeToast = () => {
    setShowToast(null);
  }

const renderHeader = () => {
  switch(uiConfig?.type) {
    case "filter" : {
      return (
        <div className="popup-label" style={{ display: "flex", paddingBottom: "20px" }}>
          <span className="header" style={{ display : "flex" }}>
            <span className="icon" style ={{ marginRight: "12px", marginTop: "5px",  paddingBottom: "3px" }}><FilterIcon/></span>
            <span style ={{ fontSize: "large" }}>{t("ES_COMMON_FILTER_BY")}:</span>
          </span>
          <span className="clear-search" onClick={clearSearch}><RefreshIcon/></span>
          <span onClick={onClose}>
            <CloseSvg />
          </span>       
        </div>
      )
      }
    case "search" : {
      return (
        <div className="popup-label" style={{ display: "flex", paddingBottom: "20px" }}>
        <span className="header" style={{ display : "flex" }}>
           <span className="icon" style ={{ marginRight: "12px", marginTop: "5px"}}><SearchIcon/></span>
           <span style ={{ fontSize: "large" }}>{t("ES_COMMON_SEARCH_BY")}</span>
       </span>
        <span onClick={onClose}>
           <CloseSvg />
        </span>        
     </div>
      )
    }
    default : {
      return (
        <div className="popup-label" style={{ display: "flex", paddingBottom: "20px" }}>
           <span className="header" style={{ display : "flex" }}>
              <span className="icon" style ={{ marginRight: "12px", marginTop: "5px"}}><SearchIcon/></span>
              <span style ={{ fontSize: "large" }}>{t("ES_COMMON_SEARCH_BY")}</span>
          </span>
           <span onClick={onClose}>
              <CloseSvg />
           </span>        
        </div>
      )
    }
  }
}

  return (
    <React.Fragment>
      <div className="search-wrapper">
        <div>{renderHeader()}</div>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}>
          <div className={`search-field-wrapper ${screenType} ${uiConfig?.type}`}>
            <RenderFormFields 
              fields={uiConfig?.fields} 
              control={control} 
              formData={formData}
              errors={errors}
              register={register}
              setValue={setValue}
              getValues={getValues}
              setError={setError}
              clearErrors={clearErrors}
              labelStyle={{fontSize: "16px"}}
              apiDetails={apiDetails}
            />  
            <ActionBar className="clear-search-container">
              <div className={`search-button-wrapper ${screenType} ${uiConfig?.type}`}>
                { uiConfig?.secondaryLabel && <LinkLabel style={{marginBottom: 0, whiteSpace: 'nowrap'}} onClick={clearSearch}>{t(uiConfig?.secondaryLabel)}</LinkLabel> }
                { uiConfig?.primaryLabel && <SubmitBar label={t(uiConfig?.primaryLabel)} submit="submit" disabled={false}/> }
              </div>
            </ActionBar>
          </div> 
        </form>
        { showToast && <Toast 
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          isDleteBtn={true}
          onClose={closeToast} />
        }
      </div>
    </React.Fragment>
  )
};

export default MobileSearchComponent;