import React, { useEffect, useMemo } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../utils";

const SelectULB = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const selectedTenat = useMemo(() => {
    if (formData?.defaultTenantId) {
      return ulbs?.find(ulb => ulb?.code === formData?.defaultTenantId);
    }
    if (tenantId && ulbs) {
      const filtered = ulbs?.filter((item) => item.code === tenantId)
      return filtered;
    }
    return userUlbs?.length === 1 ? userUlbs?.[0] : null
  }, [tenantId, ulbs])
  
    const userInfo = Digit.SessionStorage.get("citizen.userRequestObject")
    const userUlbs = ulbs.filter(ulb => userInfo?.info?.roles?.some(role => role?.tenantId === ulb?.code)).sort(alphabeticalSortFunctionForTenantsBasedOnName)
    
    const dropDownData = Digit.ULBService.getUserUlbs("SUPERUSER").sort(alphabeticalSortFunctionForTenantsBasedOnName);
  return (
    <React.Fragment>
      <LabelFieldPair
        style={{ alignItems: 'start' }}
      >
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_ULB") + " *"}</CardLabel>
        <div className="field">
          <Controller
            name={config.key}
            control={control}
            defaultValue={selectedTenat?.[0]}
            rules={{ required: true }}
            render={(props) => (
              <Dropdown
                allowMultiselect={true}
                optionKey={"i18nKey"}
                //option={userUlbs}
                option={dropDownData}
                select={(e) => {
                  props.onChange([...(formData?.[config?.key]?.filter?.((f) => e.code != f?.code) || []), e]);
                }}
                keepNull={true}
                selected={props.value}
                disable={ulbs?.length === 1}
                t={t}
              />
            )}
          />
          <div className="tag-container">
            {formData && formData[config?.key]?.length > 0 && formData?.[config.key]?.map((ulb, index) => {
              return (
                <RemoveableTag
                  key={index}
                  text={t(ulb?.i18nKey)}
                  onClick={() => {
                    // if(isInEditFormMode) return;             
                    setValue(
                      config.key,
                      formData?.[config.key]?.filter((e) => e.i18nKey != ulb.i18nKey)
                    )
                  }}
                />
              );
            })}
          </div>
          {errors && errors[config.key] && <CardLabelError>{t(`EVENTS_TENANT_ERROR_REQUIRED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SelectULB;
