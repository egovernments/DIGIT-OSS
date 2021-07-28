import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { newConfig } from "../../../config/Create/config";
import _ from "lodash";

const EditForm = ({ applicationData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state } = useLocation();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const defaultValues = {
    originalData: applicationData,
    address: applicationData?.address,
  };

  const onFormValueChange = (setValue, formData, formState) => {
    console.log(formData, formState.errors, "inside the edit value");
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  const onSubmit = (data) => {
    const formData = {
      ...applicationData,
      address: {
        ...applicationData?.address,
        ...data?.address,
        city: data?.address?.city?.name,
      },
      propertyType: data?.PropertyType?.code,
      creationReason: state.workflow?.businessService === "PT.UPDATE" ? "UPDATE" : applicationData?.creationReason,
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      usageCategoryMajor: data?.usageCategoryMajor?.code.split(".")[0],
      usageCategoryMinor: data?.usageCategoryMajor?.code.split(".")[1] || null,
      propertyType: data?.PropertyType?.code,
      noOfFloors: Number(data?.noOfFloors),
      landArea: Number(data?.landarea),
      superBuiltupArea: Number(data?.landarea),
      propertyType: data?.PropertyType?.code,
      source: "MUNICIPAL_RECORDS", // required
      channel: "CFC_COUNTER", // required
      documents: applicationData?.documents.map((old) => {
        let dt = old.documentType.split(".");
        let newDoc = data?.documents?.documents?.find((e) => e.documentType.includes(dt[0] + "." + dt[1]));
        return { ...old, ...newDoc };
      }),
      units: data?.units,
      workflow: state.workflow,
      applicationStatus: "UPDATE",
    };

    // console.log(formData, "in submit");
    history.push("/digit-ui/employee/pt/response", { Property: formData, key: "UPDATE", action: "SUBMIT" });
  };

  const configs = newConfig;

  return (
    <FormComposer
      heading={t("PT_UPDATE_PROPERTY")}
      isDisabled={!canSubmit}
      label={t("ES_COMMON_APPLICATION_SUBMIT")}
      config={configs.map((config) => {
        return {
          ...config,
          body: [
            ...config.body.filter((a) => !a.hideInEmployee),
            {
              withoutLabel: true,
              type: "custom",
              populators: {
                name: "originalData",
                component: (props, customProps) => <React.Fragment />,
              },
            },
          ],
        };
      })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default EditForm;
