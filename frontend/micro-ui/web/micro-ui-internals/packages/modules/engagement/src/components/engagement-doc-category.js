import React, { useEffect, useState } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";

const SelectCategory = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const stateId = Digit.ULBService.getStateId();

  const [ulbs, setUlbs] = useState(() => {
    return [];
  });

  const { data: categoryData, isLoading } = Digit.Hooks.engagement.useMDMS(stateId, "DocumentUploader", ["UlbLevelCategories"], {
    select: (d) => {
      const data = d?.DocumentUploader?.UlbLevelCategories?.filter?.((e) => ulbs?.includes(e.ulb)).reduce(
        (acc, el) => [...acc, ...el.categoryList],
        []
      );
      return data;
    },
  });

  useEffect(() => {
    setUlbs(formData?.ULB?.map((e) => e.code));
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
              <Dropdown option={categoryData} select={props.onChange} selected={props.value} t={t} />
            </div>
          )}
        />
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SelectCategory;
