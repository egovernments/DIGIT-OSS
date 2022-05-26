import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { newConfigMutate } from "../../../config/Mutate/config";
import { useHistory } from "react-router-dom";

const MutationForm = ({ applicationData, tenantId }) => {
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);

  const { data: mutationDocs, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "PropertyTax", "MutationDocuments");
  const defaultValues = {
    originalData: applicationData,
  };

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const history = useHistory();

  const onFormValueChange = (setValue, formData, formState) => {
    setSubmitValve(!Object.keys(formState.errors).length);
    if (!Object.keys(formState.errors).length) {
      let { additionalDetails } = formData;
      let {
        documentDate,
        documentNumber,
        documentValue,
        isMutationInCourt,
        isPropertyUnderGovtPossession,
        marketValue,
        reasonForTransfer,
      } = additionalDetails;
      setSubmitValve(
        !(
          !documentDate ||
          !documentNumber ||
          !documentValue ||
          !isMutationInCourt ||
          !isPropertyUnderGovtPossession ||
          !marketValue ||
          !reasonForTransfer
        )
      );
    }
    if (formData?.ownershipCategory?.code?.includes?.("MULTIPLE")) {
      if (formData?.owners?.length < 2) setSubmitValve(false);
    }
  };

  const onSubmit = (data) => {
    data.originalData.owners = data.originalData?.owners?.filter((owner) => owner.status == "ACTIVE");
    let { additionalDetails } = data;
    let prevDocs =
      data?.originalData?.documents?.filter(
        (oldDoc) => !mutationDocs?.PropertyTax?.MutationDocuments.some((mut) => oldDoc.documentType.includes(mut.code))
      ) || [];
    const submitData = {
      Property: {
        ...data.originalData,
        creationReason: "MUTATION",
        owners: [
          ...data.originalData?.owners?.map((e) => ({
            ...e,
            landlineNumber: data.owners[0].altContactNumber,
            altContactNumber: data.owners[0].altContactNumber,
            status: "INACTIVE",
          })),
          ...data.owners.map((owner) => {
            let obj = {};
            let gender = owner.gender.code;
            let ownerType = owner.ownerType.code;
            let relationship = owner.relationship.code;
            obj.documents = [data?.documents?.documents?.find((e) => e.documentType?.includes("OWNER.IDENTITYPROOF"))];
            if (owner.documents) {
              let { documentUid, documentType } = owner.documents;
              obj.documents = [...obj.documents, { documentUid, documentType: documentType.code, fileStoreId: documentUid }];
            }
            return {
              ...owner,
              gender,
              ownerType,
              relationship,
              inistitutetype: owner?.institution?.type?.code,
              landlineNumber: owner?.altContactNumber,
              ...obj,
              status: "ACTIVE",
            };
          }),
        ],
        additionalDetails: {
          ...additionalDetails,
          isMutationInCourt: additionalDetails.isMutationInCourt?.code,
          reasonForTransfer: additionalDetails?.reasonForTransfer.code,
          isPropertyUnderGovtPossession: additionalDetails.isPropertyUnderGovtPossession.code,
          documentDate: new Date(additionalDetails?.documentDate).getTime(),
          marketValue: Number(additionalDetails?.marketValue),
        },
        ownershipCategory: data.ownershipCategory.code,
        documents: [
          ...prevDocs,
          ...data?.documents?.documents.map((e) =>
            e.documentType.includes("OWNER.TRANSFERREASONDOCUMENT") ? { ...e, documentType: e.documentType.split(".")[2] } : e
          ),
        ],
        workflow: { action: "OPEN", businessService: "PT.MUTATION", moduleName: "PT", tenantId: data.originalData.tenantId },
      },
    };

    if (!submitData.Property.ownershipCategory.includes("INDIVIDUAL")) {
      submitData.Property.institution = {
        nameOfAuthorizedPerson: data.owners[0].name,
        name: data.owners[0].institution.name,
        designation: data.owners[0].designation,
        tenantId: data.originalData.tenantId,
        type: data.owners[0].institution.type.code,
      };
    }

    history.replace("/digit-ui/employee/pt/response", { Property: submitData.Property, key: "UPDATE", action: "SUBMIT" });
  };

  const configs = newConfigMutate;

  return (
    <FormComposer
      heading={t("ES_TITLE_MUTATE_PROPERTY")}
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

export default MutationForm;
