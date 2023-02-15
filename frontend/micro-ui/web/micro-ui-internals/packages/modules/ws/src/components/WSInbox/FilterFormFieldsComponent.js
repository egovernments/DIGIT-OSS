import React, { Fragment, useMemo } from "react";
import { FilterFormField, Loader, RadioButtons, RemoveableTag, CheckBox, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({
  statuses,
  isInboxLoading,
  controlFilterForm,
  filterFormState,
  localitiesForEmployeesCurrentTenant,
  loadingLocalitiesForEmployeesCurrentTenant,
  checkPathName,
}) => {
  const { t } = useTranslation();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];

  const selectedApplicationType = useWatch({
    control: controlFilterForm,
    name: "applicationType",
    defaultValue: filterFormState?.applicationType || null,
  });

  let totalnewWSCount = 0, totalModifyWSCount = 0,  totalDisconnectionWSCount = 0, totalnewSWCOunt = 0, totalModifySWCount = 0, totalDisconnectionSWCount = 0;
  const totalnewWS = statuses?.filter((e) => e.businessservice === "NewWS1")?.forEach(data => totalnewWSCount = totalnewWSCount +  data?.count);
  const totalModifyWS = statuses?.filter((e) => e.businessservice === "ModifyWSConnection")?.forEach(data => totalModifyWSCount = totalModifyWSCount +  data?.count);;
  const totalDisconnectionWS = statuses?.filter((e) => e.businessservice === "DisconnectWSConnection")?.forEach(data => totalDisconnectionWSCount = totalDisconnectionWSCount +  data?.count);;
  const totalnewSW = statuses?.filter((e) => e.businessservice === "NewSW1")?.forEach(data => totalnewSWCOunt = totalnewSWCOunt +  data?.count);;
  const totalModifySW = statuses?.filter((e) => e.businessservice === "ModifySWConnection")?.forEach(data => totalModifySWCount = totalModifySWCount +  data?.count);;
  const totalDisconnectionSW = statuses?.filter((e) => e.businessservice === "DisconnectSWConnection")?.forEach(data => totalDisconnectionSWCount = totalDisconnectionSWCount +  data?.count);;

  const applicationTypeStatuses = checkPathName
    ? [
        {
          code: "NewWS1",
          name: `${t("CS_COMMON_INBOX_NEWWS1")} (${totalnewWSCount})`,
        },
        {
          code: "ModifyWSConnection",
          name: `${t("CS_COMMON_INBOX_MODIFYWSCONNECTION")} (${totalModifyWSCount})`,
        },
        {
          code: "DisconnectWSConnection",
          name: `${t("CS_COMMON_INBOX_DISCONNECTIONWS")} (${totalDisconnectionWSCount})`,
        },
      ]
    : [
        {
          code: "NewSW1",
          name: `${t("CS_COMMON_INBOX_NEWSW1")} (${totalnewSWCOunt})`,
        },
        {
          code: "ModifySWConnection",
          name: `${t("CS_COMMON_INBOX_MODIFYSWCONNECTION")} (${totalModifySWCount})`,
        },
        {
          code: "DisconnectSWConnection",
          name: `${t("CS_COMMON_INBOX_DISCONNECTIONSW")} (${totalDisconnectionSWCount})`,
        },
      ];

  const selectrole = (listOfSelections, props) => {
    const res = listOfSelections.map((propsData) => {
      const data = propsData[1];
      return data;
    });
    return props.onChange(res);
  };

  return (
    <>
      <FilterFormField>
        <Controller
          name="assignee"
          control={controlFilterForm}
          render={(props) => {
            return (
              <RadioButtons
                onSelect={(e) => {
                  props.onChange(e.code);
                }}
                selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
                optionsKey="name"
                name="assignee"
                options={availableOptions}
              />
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
                  defaultLabel={t("ES_WS_ALL_SELECTED")}
                  defaultUnit={t("WS_SELECTED_TEXT")}
                />
                <div className="tag-container">{renderRemovableTokens}</div>
              </>
            );
          }}
        />
      </FilterFormField>
      <FilterFormField>
        <Controller
          name="applicationType"
          control={controlFilterForm}
          render={(props) => {
            function changeItemCheckStatus(value) {
              props.onChange(value);
            }
            const renderStatusCheckBoxess = useMemo(
              () =>
                applicationTypeStatuses?.map((status, index) => {
                  return (
                    <CheckBox
                      onChange={(e) =>
                        e.target.checked
                          ? changeItemCheckStatus([...props.value, status?.code])
                          : changeItemCheckStatus(props.value?.filter((ele) => ele !== status?.code))
                      }
                      checked={props.value?.includes(status?.code)}
                      label={status?.name}
                      value={status.name}
                      key={index + 1}
                    />
                  );
                }),
              [props.value, statuses]
            );
            return (
              <>
                <div className="filter-label sub-filter-label">{t("WS_COMMON_TABLE_COL_APP_TYPE_LABEL")}</div>
                {isInboxLoading ? <Loader /> : <> {renderStatusCheckBoxess}</>}
              </>
            );
          }}
        />
      </FilterFormField>
      {selectedApplicationType?.length > 0 ? (
        <FilterFormField>
          <Controller
            name="applicationStatus"
            control={controlFilterForm}
            render={(props) => {
              function changeItemCheckStatus(value) {
                props.onChange(value);
              }
              const renderStatusCheckBoxes = useMemo(
                () =>
                  statuses
                    ?.filter((e) => {
                      const value = selectedApplicationType;
                      return value.includes(e.businessservice);
                    })
                    ?.map((status, index) => {
                      return (
                        <CheckBox
                          key={index + 1}
                          onChange={(e) =>
                            e.target.checked
                              ? changeItemCheckStatus([...props.value, status?.statusid])
                              : changeItemCheckStatus(props.value?.filter((id) => id !== status?.statusid))
                          }
                          checked={props.value?.includes(status?.statusid)}
                          label={`${t(`WF_${status.businessservice.toUpperCase()}_${status.applicationstatus.split("_").pop()}`)} (${status.count})`}
                        />
                      );
                    }),
                [props.value, statuses, selectedApplicationType]
              );
              return (
                <>
                  <div className="filter-label sub-filter-label">{t("WS_MYCONNECTIONS_STATUS")}</div>
                  {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
                </>
              );
            }}
          />
        </FilterFormField>
      ) : null}
    </>
  );
};

export default FilterFormFieldsComponent;
