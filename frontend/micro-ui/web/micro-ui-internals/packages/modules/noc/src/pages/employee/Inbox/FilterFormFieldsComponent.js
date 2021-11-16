import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
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

  return <>
    <FilterFormField>
              <Controller
                name="assignee"
                control={controlFilterForm}
                render={(props) => <RadioButtons
                  onSelect={(e) => {
                    props.onChange(e.code)
                  }}
                  selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
                  optionsKey="name"
                  options={availableOptions}
                />}
              />
            </FilterFormField>
            {/* <FilterFormField>
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
                        <Dropdown
                          option={localitiesForEmployeesCurrentTenant}
                          select={(e) => {props.onChange([e, ...props?.value])}}
                          optionCardStyles={{maxHeight:'350px'}}
                          optionKey="i18nkey"
                        />
                        <div className="tag-container">
                          {renderRemovableTokens}
                        </div>
                      </>
                  }
                }
                />
            </FilterFormField> */}
            <FilterFormField>
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
                      label={t(`WF_${status.businessservice}_${status.applicationstatus.split('_').pop()}`)}
                    />}),[props.value, statuses])
                  return <>
                    <div className="filter-label">{t("ACTION_TEST_APPLICATION_STATUS")}</div>
                    {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
                  </>
                }}
              />
            </FilterFormField>
  </>
}

export default FilterFormFieldsComponent