import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../../../config/Create/config";

const NewApplication = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenants = Digit.Hooks.pt.useTenants();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = { };
  const history = useHistory();
  // delete
  // const [_formData, setFormData,_clear] = Digit.Hooks.useSessionStorage("store-data",null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", { });
  const { data: commonFields, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "PropertyTax", "CommonFieldsConfig");
  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const onFormValueChange = (setValue, formData, formState) => {
    setSubmitValve(!Object.keys(formState.errors).length);
    if (Object.keys(formState.errors).length === 1 && formState.errors?.units?.message === "arv") {
      setSubmitValve(!formData?.units.some((unit) => unit.occupancyType === "RENTED" && !unit.arv));
    }
    if (formData?.ownershipCategory?.code?.includes("MULTIPLEOWNERS") && formData?.owners?.length < 2) {
      setSubmitValve(false);
    }
    let pincode = formData?.address?.pincode;
    if (pincode) {
      if (!Digit.Utils.getPattern("Pincode").test(pincode)) setSubmitValve(false);
      const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item.toString() === pincode));
      if (!foundValue) {
        setSubmitValve(false);
      }
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
      superBuiltUpArea: Number(data?.landarea),
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

        if (!__owner?.correspondenceAddress) __owner.correspondenceAddress = "";

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
          _owner.documents = [data?.documents?.documents?.find((e) => e.documentType?.includes("OWNER.IDENTITYPROOF"))];
        }
        return _owner;
      }),

      channel: "CFC_COUNTER", // required
      creationReason: "CREATE", // required
      source: "MUNICIPAL_RECORDS", // required
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

    history.replace("/digit-ui/employee/pt/response", { Property: formData }); //current wala

  };
  if (isLoading) {
    return <Loader />;
  }

  /* use newConfig instead of commonFields for local development in case needed */

  const configs = commonFields?commonFields:newConfig;

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
