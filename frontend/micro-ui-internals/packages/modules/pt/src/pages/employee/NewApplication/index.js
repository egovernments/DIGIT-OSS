import React, { useEffect, useState } from "react";
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
  // delete
  // const [_formData, setFormData,_clear] = Digit.Hooks.useSessionStorage("store-data",null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const onFormValueChange = (setValue, formData, formState) => {
    console.log(formData, formState.errors, "in new application");
    setSubmitValve(!Object.keys(formState.errors).length);
    if (Object.keys(formState.errors).length === 1 && formState.errors?.units?.message === "arv") {
      setSubmitValve(!formData?.units.some((unit) => unit.occupancyType === "RENTED" && !unit.arv));
    }
    if (formData?.ownershipCategory?.code?.includes("MULTIPLEOWNERS") && formData?.owners?.length < 2) {
      setSubmitValve(false);
    }
  };

  const onSubmit = (data) => {
    const formData = {
      tenantId,
      address: {
        ...data?.address,
        city: data?.address?.city?.name,
        locality: { code: data?.address?.locality?.code, area: data?.address?.locality?.area },
      },
      usageCategory: data?.usageCategoryMajor.code,
      usageCategoryMajor: data?.usageCategoryMajor?.code.split(".")[0],
      usageCategoryMinor: data?.usageCategoryMajor?.code.split(".")[1] || null,
      landArea: Number(data?.landarea),
      propertyType: data?.PropertyType?.code,
      noOfFloors: Number(data?.noOfFloors),
      ownershipCategory: data?.ownershipCategory?.code,
      owners: data?.owners.map((owner) => {
        let {
          name,
          mobileNumber,
          designation,
          altContactNumber,
          emailId,
          correspondenceAddress,
          isCorrespondenceAddress,
          ownerType,
          fatherOrHusbandName,
        } = owner;
        let __owner;

        if (!data?.ownershipCategory?.code.includes("INDIVIDUAL")) {
          __owner = { name, mobileNumber, designation, altContactNumber, emailId, correspondenceAddress, isCorrespondenceAddress, ownerType };
        } else {
          __owner = {
            name,
            mobileNumber,
            correspondenceAddress,
            permanentAddress: data?.address?.locality?.name,
            relationship: owner?.relationship.code,
            fatherOrHusbandName,
            gender: owner?.gender.code,
            emailId,
          };
        }
        const _owner = {
          ...__owner,
          ownerType: owner?.ownerType?.code,
        };
        if (_owner.ownerType !== "NONE") {
          const { documentType, documentUid } = owner?.documents;
          _owner.documents = [
            { documentUid: documentUid, documentType: documentType.code, fileStoreId: documentUid },
            data?.documents?.documents?.find((e) => e.documentType?.includes("OWNER.IDENTITYPROOF")),
          ];
        } else {
          // console.log("owner docs setted");
          _owner.documents = [data?.documents?.documents?.find((e) => e.documentType?.includes("OWNER.IDENTITYPROOF"))];
        }
        return _owner;
      }),

      channel: "CFC_COUNTER", // required
      creationReason: "CREATE", // required
      source: "MUNICIPAL_RECORDS", // required
      superBuiltUpArea: null,
      units: data?.PropertyType?.code !== "VACANT" ? data?.units : [],
      documents: data?.documents?.documents,
      applicationStatus: "CREATE",
    };

    if (!data?.ownershipCategory?.code.includes("INDIVIDUAL")) {
      formData.institution = {
        name: data.owners?.[0].institution.name,
        type: data.owners?.[0].institution.type?.code?.split(".")[1],
        designation: data.owners?.[0].designation,
        nameOfAuthorizedPerson: data.owners?.[0].name,
        tenantId: Digit.ULBService.getCurrentTenantId(),
      };
    }

    // console.log(
    //   data,
    //   data?.documents?.documents?.find((e) => e.documentType?.includes("OWNER.IDENTITYPROOF")),
    //   formData,
    //   "hot fixes"
    // );

    // console.log(formData, "new application created");
    // setFormData(formData)

    history.replace("/digit-ui/employee/pt/response", { Property: formData }); //current wala

    // history.push("/digit-ui/employee/pt/response", { Property: formData });
    // history.push("/digit-ui/employee/pt/response", { Property: _formData });
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
