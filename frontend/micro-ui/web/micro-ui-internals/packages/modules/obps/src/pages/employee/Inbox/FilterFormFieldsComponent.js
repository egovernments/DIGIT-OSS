import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash/cloneDeep";

const FilterFormFieldsComponent = ({statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant }) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: applicationTypesOfBPA, isLoading: loadingApplicationTypesOfBPA } = Digit.Hooks.obps.SearchMdmsTypes.useApplicationTypes(tenantId);

  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];
  
  const selectedApplicationType = useWatch({control: controlFilterForm, name: "applicationType", defaultValue: filterFormState?.applicationType || null});
  const availableBusinessServicesOptions = Digit.Hooks.obps.useBusinessServiceBasedOnServiceType({applicationType: selectedApplicationType})
  const selectedBusinessService = useWatch({control: controlFilterForm, name: "businessService", defaultValue: filterFormState?.businessService || null});
  
  const selectrole = (listOfSelections, props) => {
    const res = listOfSelections.map( (propsData) => {
      const data = propsData[1]
        return data
     })
    return props.onChange(res);
  };

  function selectCheckbox({values, onChange, applicationType, e}){
    if(e.target.checked){
      onChange([...values, applicationType])
    } else{
      onChange(values.filter( item => item.code !== applicationType.code ))
    } 
  }

  function isChecked(selectedValues, currentValue ){
    return !!selectedValues.find(i => i.code === currentValue.code) 
  }

  return <>
    {!window.location.href.includes("/citizen") ? 
    <FilterFormField>
    <Controller
      name="assignee"
      control={controlFilterForm}
      render={(props) => {
      return <RadioButtons
        onSelect={(e) => {
          props.onChange(e.code)
        }}
        selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
        optionsKey="name"
        name="assignee"
        options={availableOptions}
      />
    }}
    />
  </FilterFormField>: null}
  {!window.location.href.includes("/citizen") ? <FilterFormField>
      <Controller
          name="locality"
          control={controlFilterForm}
          render={(props) => {
            const renderRemovableTokens = useMemo(()=>props?.value?.map((locality, index) => {
              return (
                <RemoveableTag
                key={index}
                text={locality.i18nkey}
                onClick={() => {
                  props.onChange(props?.value?.filter((loc) => loc.code !== locality.code))
                }}
                />
                );
              }),[props?.value])
            return loadingLocalitiesForEmployeesCurrentTenant ? <Loader/> : <>
              <div className="filter-label sub-filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("ES_INBOX_LOCALITY")}</div>
              <MultiSelectDropdown
              options={localitiesForEmployeesCurrentTenant ? localitiesForEmployeesCurrentTenant : []}
              optionsKey="i18nkey"
              props={props}
              isPropsNeeded={true}
              onSelect={selectrole}
              selected={props?.value}
              defaultLabel={t("ES_BPA_ALL_SELECTED")}
              defaultUnit={t("BPA_SELECTED_TEXT")}
              />
              <div className="tag-container">
                {renderRemovableTokens}
              </div>
            </>
          }
        }
        />
    </FilterFormField>: null}
    <FilterFormField>
      <Controller
        name="applicationType"
        control={controlFilterForm}
        render={(props) => {
          return loadingApplicationTypesOfBPA ? <Loader /> : <>
            <div className="filter-label sub-filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</div>
            <RadioButtons
              onSelect={(e) => {
                props.onChange(e.code);
                setFilterFormValue("applicationStatus", []);
                setFilterFormValue("businessService", []);
              }}
              selectedOption={applicationTypesOfBPA.filter((option) => option.code === props.value)[0]}
              optionsKey="i18nKey"
              name="applicationType"
              options={applicationTypesOfBPA}
            />
          </>
        }
        }
      />
    </FilterFormField>
    {(selectedApplicationType?.length > 0 && selectedApplicationType != "BUILDING_OC_PLAN_SCRUTINY") ? <FilterFormField>
      <Controller
          name="businessService"
          control={controlFilterForm}
          render={(props) => {
            return <>
              <div className="filter-label sub-filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("ES_INBOX_RISK_TYPE")}</div>
              <RadioButtons
                onSelect={(e) => {props.onChange(e.code);
                setFilterFormValue("applicationStatus",[])}}
                selectedOption={availableBusinessServicesOptions.filter((option) => option.code === props.value)[0]}
                optionsKey="i18nKey"
                name="businessService"
                options={availableBusinessServicesOptions}
              />
            </>
          }
        }
        />
    </FilterFormField> : null}
    {(selectedApplicationType == "BUILDING_OC_PLAN_SCRUTINY" || (selectedApplicationType?.length > 0 && selectedBusinessService?.length > 0)) ? <FilterFormField>
      <div className="filter-label sub-filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("ACTION_TEST_APPLICATION_STATUS")}</div>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value){
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(()=>statuses?.filter( e => {
              let value = cloneDeep(selectedBusinessService);
              if (selectedApplicationType == "BUILDING_OC_PLAN_SCRUTINY") {
                value = "BPA_OC"
              }
              return e.businessservice === value
            
          } )?.map( (status, index) => {
            return <CheckBox
              //style={{marginTop: "10px"}}
              key={index}
              onChange={(e) => 
                // e.target.checked ? changeItemCheckStatus([...props?.value, status?.statusid]) : changeItemCheckStatus(props?.value?.filter( id => id !== status?.statusid)) 
                {
                  if (e.target.checked && props?.value) {
                    changeItemCheckStatus([...props?.value, status?.statusid])
                  } else if (e.target.checked) {
                    changeItemCheckStatus([status?.statusid])
                  } else {
                    changeItemCheckStatus(props?.value?.filter( id => id !== status?.statusid))
                  }
                }
              }
              checked={props?.value?.includes(status?.statusid)}
              label={`${t(`WF_STATE_${status.businessservice}_${status.applicationstatus}`)} (${status.count})`}
              //Hidden due to RAIN-5010 percieved as wrong count here
              // (${status.count})`}
            />}),[props.value, statuses, selectedBusinessService, selectedApplicationType])
          return <>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField> : null}
  </>
}

export default FilterFormFieldsComponent