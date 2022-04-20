import React, { Fragment, useMemo } from "react";
import { FilterFormField, RadioButtons, MultiSelectDropdown, Loader, Localities } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({ controlFilterForm, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant }) => {
  const { t } = useTranslation();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];

  const selectrole = (listOfSelections, props) => {
    const res = listOfSelections.map((propsData) => {
      const data = propsData[1];
      return data;
    });
    return props.onChange(res);
  };
  return (
    <React.Fragment>
      <FilterFormField>
        <Controller
          name="assignee"
          control={controlFilterForm}
          render={(props) => (
            <RadioButtons
              onSelect={(e) => {
                props.onChange(e.code);
              }}
              selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
              optionsKey="name"
              options={availableOptions}
            />
          )}
        />
      </FilterFormField>
      <FilterFormField>
        <Controller
          name="locality"
          control={controlFilterForm}
          render={(props) => {
            const renderRemovableTokens = useMemo(
              () =>
                props?.value?.map((locality, index) => {
                  return (
                    <RemoveableTag
                      key={index}
                      text={locality.i18nkey}
                      onClick={() => {
                        props.onChange(props?.value?.filter((loc) => loc.code !== locality.code));
                      }}
                    />
                  );
                }),
              [props?.value]
            );
            return loadingLocalitiesForEmployeesCurrentTenant ? (
              <Loader />
            ) : (
              <>
                <div className="filter-label sub-filter-label">{"Service"}</div>
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
                <div className="tag-container">{renderRemovableTokens}</div>
              </>
            );
          }}
        />
      </FilterFormField>
      <FilterFormField>
        <Controller
          name="locality"
          control={controlFilterForm}
          render={(props) => {
            const renderRemovableTokens = useMemo(
              () =>
                props?.value?.map((locality, index) => {
                  return (
                    <RemoveableTag
                      key={index}
                      text={locality.i18nkey}
                      onClick={() => {
                        props.onChange(props?.value?.filter((loc) => loc.code !== locality.code));
                      }}
                    />
                  );
                }),
              [props?.value]
            );
            return loadingLocalitiesForEmployeesCurrentTenant ? (
              <Loader />
            ) : (
              <>
                <div className="filter-label sub-filter-label">{t("ES_INBOX_LOCALITY")}</div>
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
                <div className="tag-container">{renderRemovableTokens}</div>
              </>
            );
          }}
        />
      </FilterFormField>
    </React.Fragment>
  );
};

export default FilterFormFieldsComponent;
