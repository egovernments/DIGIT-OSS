import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../../config/Create/config";
import { useHistory } from "react-router-dom";

const NewApplication = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();

  const onFormValueChange = (setValue, formData) => {
    if (
      formData?.address?.city?.code &&
      formData?.address?.locality?.code &&
      formData?.PropertyType?.code &&
      formData?.ownershipCategory?.code &&
      formData?.owners?.name &&
      formData?.owners?.mobileNumber &&
      formData?.usageCategoryMajor?.code &&
      formData?.usageCategoryMinor?.subuagecode &&
      formData?.owners?.ownerType?.code &&
      formData?.documents?.documents?.length === formData?.documents?.propertyTaxDocumentsLength &&
      formData?.landarea
    ) {
      if (formData?.ownershipCategory?.code !== "INDIVIDUAL.SINGLEOWNER" && formData?.owners?.altContactNumber) {
        const filteredUnitsArray = formData?.units?.filter(
          (unit) => unit?.constructionDetail?.builtUpArea && unit?.floorNo && unit?.occupancyType && unit?.usageCategory
        );
        if (formData?.PropertyType?.code === "VACANT") {
          setSubmitValve(true);
        } else if (formData?.PropertyType?.code !== "VACANT" && filteredUnitsArray?.length >= formData?.noOfFloors?.code) {
          setSubmitValve(true);
        } else {
          setSubmitValve(false);
        }
      } else {
        setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  const onSubmit = (data) => {
    const formData = {
      tenantId,
      address: {
        ...data?.address,
        city: data?.address?.city?.name,
      },
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      usageCategoryMinor: data?.usageCategoryMinor?.subuagecode,
      usageCategoryMajor: data?.usageCategoryMajor?.code,
      landArea: data?.landarea,
      propertyType: data?.PropertyType?.code,
      noOfFloors: Number(data?.noOfFloors?.code),
      ownershipCategory: data?.ownershipCategory?.code,
      owners: [
        {
          ...data?.owners,
          ownerType: data?.owners?.ownerType.code,
          gender: data?.owners?.gender.code,
          relationship: data?.owners?.relationship.code,
        },
      ],
      channel: "CFC_COUNTER", // required
      creationReason: "CREATE", // required
      source: "MUNICIPAL_RECORDS", // required
      superBuiltUpArea: null,
      units: data?.units[0]?.usageCategory ? data?.units : [],
      documents: data?.documents?.documents,
      applicationStatus: "CREATE",
    };

    history.push("/digit-ui/employee/pt/response", { Property: formData });
  };
  const configs = newConfig;

  return (
    <FormComposer
      heading={t("ES_TITLE_NEW_PROPERTY_APPLICATION")}
      isDisabled={!canSubmit}
      label={t("ES_COMMON_APPLICATION_SUBMIT")}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default NewApplication;
