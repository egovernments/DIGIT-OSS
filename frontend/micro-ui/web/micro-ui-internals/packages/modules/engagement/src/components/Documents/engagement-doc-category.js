import React, { useEffect, useState } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";

const SelectCategory = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const stateId = Digit.ULBService.getStateId();

  const [ulbs, setUlbs] = useState(() => {
    return [];
  });

  const currrentUlb = Digit.ULBService.getCurrentUlb() || "pb.amritsar" ;
  const { data: categoryData, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
    select: (d) => {
     
      const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => e.ulb === currrentUlb.code);
      return data[0].categoryList.map((name)=>({name}));
    },
  });

 
  useEffect(() => {
   formData?.ULB?.length  ? setUlbs(formData?.ULB?.map((e) => e?.code)): null;
  }, [formData?.ULB]);

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_DOC_CATEGORY") + "*"}</CardLabel>
        <Controller
          name={config.key}
          control={control}
          render={(props) => (
            <div className="field">
              <Dropdown option={categoryData} select={props.onChange} selected={props.value} t={t} optionKey="name" />
            </div>
          )}
        />
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SelectCategory;
