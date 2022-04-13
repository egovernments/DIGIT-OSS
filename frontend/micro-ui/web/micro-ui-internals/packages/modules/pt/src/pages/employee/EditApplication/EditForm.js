import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { newConfig } from "../../../config/Create/config";

const EditForm = ({ applicationData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state } = useLocation();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});
  const { data: commonFields, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "PropertyTax", "CommonFieldsConfig");

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const defaultValues = {
    originalData: applicationData,
    address: applicationData?.address,
    owners: applicationData?.owners.map((owner) => ({
      ...owner,
      ownerType: { code: owner.ownerType, i18nKey: owner.ownerType },
      relationship: { code: owner.relationship, i18nKey: `PT_FORM3_${owner.relationship}` },
      gender: {
        code: owner.gender,
        i18nKey: `PT_FORM3_${owner.gender}`,
        value: owner.gender,
      },
    })),
  };
  sessionStorage.setItem("PropertyInitials",JSON.stringify(defaultValues?.originalData));

  const onFormValueChange = (setValue, formData, formState) => {
    if(Object.keys(formState.errors).length==1 && formState.errors.documents)
    setSubmitValve(true);
    else 
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
      creationReason: state?.workflow?.businessService === "PT.UPDATE" || (applicationData?.documents == null )  ? "UPDATE" : applicationData?.creationReason,
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      usageCategoryMajor: data?.usageCategoryMajor?.code.split(".")[0],
      usageCategoryMinor: data?.usageCategoryMajor?.code.split(".")[1] || null,
      noOfFloors: Number(data?.noOfFloors),
      landArea: Number(data?.landarea),
      superBuiltUpArea: Number(data?.landarea),
      source: "MUNICIPAL_RECORDS", // required
      channel: "CFC_COUNTER", // required
      documents: applicationData?.documents ? applicationData?.documents.map((old) => {
        let dt = old.documentType.split(".");
        let newDoc = data?.documents?.documents?.find((e) => e.documentType.includes(dt[0] + "." + dt[1]));
        return { ...old, ...newDoc };
      }):data?.documents?.documents.length > 0 ? data?.documents?.documents : null,
      units: [
        ...(applicationData?.units?.map((old) => ({ ...old, active: false })) || []),
        ...(data?.units?.map((unit) => {
          return { ...unit, active: true };
        }) || []),
      ],
      workflow: state?.workflow,
      applicationStatus: "UPDATE",
    };
    if (state?.workflow?.action === "OPEN") {
      formData.units = formData.units.filter((unit) => unit.active);
    }
    history.push("/digit-ui/employee/pt/response", { Property: formData, key: "UPDATE", action: "SUBMIT" });
  };

  if (isLoading) {
    return <Loader />;
  }

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = commonFields ? commonFields : newConfig;

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
