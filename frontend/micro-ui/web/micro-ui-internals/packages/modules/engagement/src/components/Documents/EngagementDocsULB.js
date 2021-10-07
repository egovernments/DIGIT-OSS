import React, { useEffect, useMemo } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";

const SelectULB = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const { data: ulbArray, isLoading } = Digit.Hooks.useTenants();
  const ulb = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const selectedTenat = useMemo(()=>{
    const filtered = ulb?.filter((item)=> item.code===tenantId)
    return filtered;
  },[tenantId, ulb])
  
  const location = useLocation()
  const isInEditFormMode = useMemo(()=>{
    if(location.pathname.includes('documents/inbox/update')) return true;
    return false;
  },[location.pathname])
  
  return (
    <React.Fragment>
      <LabelFieldPair 
      style={{alignItems:'start'}}
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
                option={ulbArray}
                select={(e) => {
                  props.onChange([...(formData?.[config?.key]?.filter?.((f) => e.code != f?.code) || []), e]);
                }}
                keepNull={true}
                selected={props.value}    
                disable={isInEditFormMode ? true : false}
                t={t}
              />
            )}
          />
          <div className="tag-container">
            {formData?.[config.key]?.map((ulb, index) => {
              return (
                <RemoveableTag
                  key={index}
                  text={t(ulb?.i18nKey)}
                  onClick={() =>
                    setValue(
                      config.key,
                      formData?.[config.key]?.filter((e) => e.i18nKey != ulb.i18nKey)
                    )
                  }
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
