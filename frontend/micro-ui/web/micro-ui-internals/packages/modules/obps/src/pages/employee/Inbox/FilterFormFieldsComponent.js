import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, applicationTypesOfBPA, loadingApplicationTypesOfBPA,  localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant}) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getStateId();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];

  applicationTypesOfBPA?.forEach(type => {
    type.name = t(`WF_BPA_${type.code}`);
    type.i18nKey = t(`WF_BPA_${type.code}`);
  });
  
  const selectedApplicationType = useWatch({control: controlFilterForm, name: "applicationType", defaultValue: null});
  const availableBusinessServicesOptions = Digit.Hooks.obps.useBusinessServiceBasedOnServiceType({applicationType: selectedApplicationType})
  const selectedBusinessService = useWatch({control: controlFilterForm, name: "businessService", defaultValue: null});
  
  const selectrole = (e, data, props) => {
    const index = props?.value.filter((ele) => ele.code == data.code);
    let res = null;
    if (index.length) {
      props?.value.splice(props?.value.indexOf(index[0]), 1);
      res = [...props?.value];
    } else {
      res = [...props?.value, {...data}];
    }
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
    </FilterFormField>
    <FilterFormField>
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
              <div className="filter-label">{t("ES_INBOX_LOCALITY")}</div>
              {/* Done: know that it is rerendering once in mobile view this is due to the fact that controlled components can not react to async calls inside the components ie controlled caomponent can only entertain PURE components hence this molecule needs to be removed and dropdown is to be placed, with this localities should be fetched at the top of the inbox/index.js and memoized functions should be handled accordingly */}
              {/* <Localities selectLocality={ (e) => {props.onChange([e, ...props?.value])}} tenantId={tenantId} optionCardStyles={{maxHeight:'350px'}} boundaryType="revenue" /> */}
              {/* <Dropdown
                option={localitiesForEmployeesCurrentTenant}
                select={(e) => {props.onChange([e, ...props?.value])}}
                optionCardStyles={{maxHeight:'350px'}}
                optionKey="i18nkey"
              /> */}
              <MultiSelectDropdown
              options={localitiesForEmployeesCurrentTenant ? localitiesForEmployeesCurrentTenant : []}
              optionsKey="i18nkey"
              props={props}
              isPropsNeeded={true}
              onSelect={selectrole}
              selected={props?.value}
              defaultUnit="Selected"
              />
              <div className="tag-container">
                {renderRemovableTokens}
              </div>
            </>
          }
        }
        />
    </FilterFormField>
    <FilterFormField>
      <Controller
          name="applicationType"
          control={controlFilterForm}
          render={(props) => {
            return loadingApplicationTypesOfBPA ? <Loader/> : <>
              <div className="filter-label">{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</div>
              {applicationTypesOfBPA.map(applicationType => {
                return <CheckBox
                  onChange={(e) => selectCheckbox({e, applicationType, onChange: props.onChange, values: props.value})}
                  checked={isChecked(props.value, applicationType)}
                  label={t(applicationType?.i18nKey)}
                />  
              })}
            </>
          }
        }
        />
    </FilterFormField>
    {selectedApplicationType?.length > 0 ? <FilterFormField>
      <Controller
          name="businessService"
          control={controlFilterForm}
          render={(props) => {
            return <>
              <div className="filter-label">{t("ES_INBOX_RISK_TYPE")}</div>
              <RadioButtons
                onSelect={(e) => {props.onChange(e.code)}}
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
    {selectedBusinessService?.length > 0 ? <FilterFormField>
      <div className="filter-label">{t("ACTION_TEST_APPLICATION_STATUS")}</div>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value){
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(()=>statuses?.filter( e => e.businessservice === selectedBusinessService )?.map( (status, index) => {
            return <CheckBox
              key={index}
              onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter( id => id !== status?.statusid)) }
              checked={props.value?.includes(status?.statusid)}
              label={t(`WF_${status.businessservice}_${status.applicationstatus}`)}
            />}),[props.value, statuses, selectedBusinessService])
          return <>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField> : null}
  </>
}

export default FilterFormFieldsComponent