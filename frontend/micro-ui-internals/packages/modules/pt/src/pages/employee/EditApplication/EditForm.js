import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { newConfig } from "../../../config/Create/config";

const EditForm = ({ applicationData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  const { isLoading: floorsIsLoading, data: FloorData = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Floor") || {};
  const floors = FloorData?.PropertyTax?.Floor || [];
  const positiveFloors = floors?.filter((floor) => floor?.code > 0) || [];

  const { isLoading: ownerTypeLoading, data: ownerTypeData } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");

  const { isLoading: ownerShipCategoryLoading, data: ownerShipCategoryData } = Digit.Hooks.pt.usePropertyMDMS(
    stateId,
    "PropertyTax",
    "OwnerShipCategory"
  );

  const usageCategoryArray = applicationData?.usageCategory?.split(".");

  const selfOccupiedData = [
    {
      i18nKey: "PT_YES_IT_IS_SELFOCCUPIED",
      code: "SELFOCCUPIED",
    },
    {
      i18nKey: "PT_PARTIALLY_RENTED_OUT",
      code: "RENTED",
    },
    {
      i18nKey: "PT_FULLY_RENTED_OUT",
      code: "RENTED",
    },
  ];

  const ownershipCategory = ownerShipCategoryData?.filter((item) => item?.code === applicationData?.ownershipCategory)[0];

  const defaultValues = {
    address: {
      pincode: applicationData.address.pincode || "",
      locality: {
        ...applicationData.address.locality,
        i18nkey: `${applicationData.tenantId.toUpperCase().split(".").join("_")}_REVENUE_${applicationData.address.locality.code}`,
      },
      street: applicationData.address.street || "",
      doorNo: applicationData.address.doorNo || "",
    },
    landarea: {
      floorarea: applicationData?.landArea,
    },
    PropertyType: { i18nKey: `COMMON_PROPTYPE_${applicationData?.propertyType?.replaceAll(".", "_")}`, code: applicationData?.propertyType },
    usageCategoryMajor: {
      i18nKey: applicationData?.usageCategoryMajor
        ? `PROPERTYTAX_BILLING_SLAB_${applicationData?.usageCategoryMajor}`
        : `PROPERTYTAX_BILLING_SLAB_${usageCategoryArray[1]}`,
      code: applicationData?.usageCategoryMajor ? `NONRESIDENTIAL.${applicationData?.usageCategoryMajor}` : `NONRESIDENTIAL.${usageCategoryArray[1]}`,
    },
    subusagetype: {
      SubUsageType: {
        i18nKey: applicationData?.usageCategoryMinor
          ? `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${applicationData?.usageCategoryMinor}`
          : `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${usageCategoryArray[1]}_${usageCategoryArray[3]}`,
      },
      subuagecode: applicationData?.usageCategory,
    },
    noOfFloors: positiveFloors?.filter((floor) => floor?.code == applicationData?.noOfFloors)[0],
    units: applicationData?.units?.map((unit, index) => ({
      key: index,
      builtUpArea: unit?.constructionDetail?.builtUpArea,
      floorNo: floors
        ?.filter((floor) => floor?.code == unit?.floorNo)
        .map((item) => ({ i18nKey: "PROPERTYTAX_FLOOR_" + item?.code.replaceAll("-", "_"), code: item?.code }))[0],
      occupancyType: selfOccupiedData?.filter((item) => item?.code === unit?.occupancyType)[0],
      tenantId: unit?.tenantId || tenantId,
      usageCategory: "NONRESIDENTIAL.COMMERCIAL.RETAIL.SHOWROOM",
      usageCategory: {
        code: unit?.usageCategory,
        i18nKey: `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${unit?.usageCategory?.split(".")[1]}_${unit?.usageCategory?.split(".")[3]}`,
      },
    })),
    ownershipCategory: {
      ...ownershipCategory,
      i18nKey: `PT_OWNERSHIP_${ownershipCategory?.i18nKey?.split(".")[1]}`,
    },
    documents: {
      documents: applicationData?.documents,
      propertyTaxDocumentsLength: applicationData?.documents?.length,
    },
    owners: {
      altContactNumber: applicationData?.owners[0]?.altContactNumber,
      emailId: applicationData?.owners[0]?.emailId,
      fatherOrHusbandName: applicationData?.owners[0]?.fatherOrHusbandName,
      gender: { code: applicationData?.owners[0]?.gender },
      mobileNumber: applicationData?.owners[0]?.mobileNumber,
      name: applicationData?.owners[0]?.name,
      ownerType: ownerTypeData?.filter((item) => item?.code === applicationData?.owners[0]?.ownerType)[0],
      permanentAddress: applicationData?.owners[0]?.permanentAddress,
      relationship: { code: applicationData?.owners[0]?.relationship, i18nKey: `PT_RELATION_${applicationData?.owners[0]?.relationship}` },
    },
  };

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
      ...applicationData,
      id: applicationData?.id,
      propertyId: applicationData?.propertyId,
      accountId: applicationData?.accountId,
      acknowldgementNumber: applicationData?.acknowldgementNumber,
      surveyId: applicationData?.surveyId || null,
      linkedProperties: applicationData?.linkedProperties || null,
      tenantId: applicationData?.tenantId || tenantId,
      oldPropertyId: applicationData?.oldPropertyId || null,
      status: applicationData?.status,
      address: {
        ...applicationData?.address,
        ...data?.address,
        city: data?.address?.city?.name,
      },
      propertyType: data?.PropertyType?.code,
      ownershipCategory: data?.ownershipCategory?.code,
      owners: [
        {
          ...data?.owners,
          ownerType: data?.owners?.ownerType.code,
          gender: data?.owners?.gender.code,
          relationship: data?.owners?.relationship.code,
        },
      ],
      creationReason: "UPDATE", // required
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      usageCategoryMinor: data?.usageCategoryMinor?.subuagecode,
      usageCategoryMajor: data?.usageCategoryMajor?.code,
      noOfFloors: Number(data?.noOfFloors?.code),
      landArea: data?.landarea?.floorarea,
      superBuiltUpArea: applicationData?.superBuiltUpArea || null,
      source: "MUNICIPAL_RECORDS", // required
      channel: "CFC_COUNTER", // required
      documents: data?.documents?.documents,
      units: data?.units[0]?.usageCategory ? data?.units : [],
      additionalDetails: applicationData?.additionalDetails || null,
      auditDetails: applicationData?.auditDetails,
      workflow: {
        businessService: "PT.UPDATE",
        action: "OPEN",
        moduleName: "PT",
      },
      occupancyDate: applicationData?.occupancyDate || null,
      usage: applicationData?.usage || null,
      financialYear: applicationData?.financialYear || null,
      assessmentNumber: applicationData?.assessmentNumber || null,
      assessmentDate: applicationData?.assessmentDate || "0",
      adhocExemption: applicationData?.adhocExemption || null,
      adhocPenalty: applicationData?.adhocPenalty || null,
      adhocExemptionReason: applicationData?.adhocExemptionReason || null,
      adhocPenaltyReason: applicationData?.adhocPenaltyReason || null,
      calculation: applicationData?.calculation || null,
      applicationStatus: "UPDATE",
    };

    history.push("/digit-ui/employee/pt/response", { Property: formData, key: "UPDATE", action: "SUBMIT" });
  };

  const configs = newConfig;

  if (floorsIsLoading || ownerTypeLoading || ownerShipCategoryLoading) {
    return <Loader />;
  }

  return (
    <FormComposer
      heading={t("ES_TITLE_MODIFY_DESULDGING_APPLICATION")}
      isDisabled={!canSubmit}
      label={t("ES_FSM_APPLICATION_UPDATE")}
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

export default EditForm;
