import React, { Fragment, useEffect, useMemo, useState } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue}) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];

  const availableBusinessService = [
    {code: "BPA", name:t("BPA")},
    {code: "STAKEHOLDER", name:t("STAKEHOLDER")},
  ]
  useEffect(()=>{
    Object.keys(filterFormState)?.forEach( key => {
      setFilterFormValue(key, filterFormState[key])
    })
  }, [Object.values(filterFormState || {})])

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
          inputRef={registerRef({})}
          options={availableOptions}
        />
      }}
      />
    </FilterFormField>
    <FilterFormField>
      <Controller
          name="businessService"
          control={controlFilterForm}
          render={({ref, onChange, value}) => {
            return <>
              <div className="filter-label">{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</div>
              <Dropdown inputRef={ref} option={availableBusinessService} optionKey="name" t={t} select={ (e) => {
                  onChange(e)
                }} selected={value} />
            </>
          }
        }
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
            return <>
              <div className="filter-label">{t("ES_INBOX_LOCALITY")}</div>
              <Localities selectLocality={ (e) => {props.onChange([e, ...props?.value])}} tenantId={tenantId} optionCardStyles={{maxHeight:'350px'}} boundaryType="revenue" />
              <div className="tag-container">
                {renderRemovableTokens}
              </div>
            </>
          }
        }
        />
    </FilterFormField>
    <FilterFormField>
      <div className="filter-label">{t("ACTION_TEST_APPLICATION_STATUS")}</div>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value){
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(()=>statuses?.map( status => {
            return <CheckBox
              onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter( id => id !== status?.statusid)) }
              checked={props.value?.includes(status?.statusid)}
              label={t(`${status.businessservice}_${status.applicationstatus}`)}
            />}),[props.value, statuses])
          return <>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField>
  </>
}

export default FilterFormFieldsComponent