import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfigMutate } from "../../../config/Mutate/config";

import { useTranslation } from "react-i18next";
import CheckPage from "./CheckPage";

const MutationCitizen = (props) => {
  const { t } = useTranslation();
  const match = useRouteMatch();
  const { pathname } = useLocation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_MUTATE_PROPERTY", {});
  const history = useHistory();
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState(null);

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: mutationDocs, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "PropertyTax", "MutationDocuments");

  const selectParams = (key, data) => {
    setParams((prev) => ({ ...prev, [key]: data }));
  };
  let config = [];

  newConfigMutate.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });

  function handleSelect(key, data, skipStep, index, isAddMultiple = false, configObj) {
    let pathArray = pathname.split("/");
    let currentPath = pathArray.pop();
    if (configObj?.nesting) {
      for (let i = 0; i < configObj?.nesting; i++) {
        currentPath = pathArray.pop();
      }
    }

    let activeRouteObj = config.filter((e) => e.route === currentPath)[0];
    selectParams(key, data);
    let { queryParams } = configObj || {};
    let queryString = queryParams
      ? `?${Object.keys(queryParams)
          .map((_key) => `${_key}=${queryParams[_key]}`)
          .join("&")}`
      : "";

    if (!activeRouteObj.nextStep) {
      setSubmit(true);
    } else if (typeof activeRouteObj.nextStep === "string") {
      if (skipStep) history.replace(`${pathArray.join("/")}/${activeRouteObj.nextStep}${queryString}`);
      else history.push(`${pathArray.join("/")}/${activeRouteObj.nextStep}${queryString}`);
    } else if (typeof activeRouteObj.nextStep === "object") {
      let nextStep = activeRouteObj.nextStep[configObj?.routeKey];
      if (skipStep) history.replace(`${pathArray.join("/")}/${nextStep}${queryString}`);
      else history.push(`${pathArray.join("/")}/${nextStep}${queryString}`);
    }
  }

  useEffect(() => {
    if (submit) {
      handleSubmit();
    }
  }, [submit]);

  const handleSubmit = () => {
    const originalProperty = params.searchResult.property;
    const { additionalDetails, ownershipCategory, addressProof, transferReasonProof } = params;
    const ownersArray = ownershipCategory?.code.includes("INDIVIDUAL") ? params.Owners : params.owners;
    const ownerDocs = ownersArray
      .map((owner) => {
        return Object.keys(owner.documents).map((key) => {
          const { documentType, fileStoreId } = owner.documents[key];
          return { documentType: documentType.code, fileStoreId };
        });
      })
      .flat();

    const otherDocs = [addressProof, transferReasonProof].map((e, index) => {
      const { documentType, fileStoreId } = e;
      return { documentType: index === 1 ? documentType.code.split(".")[2] : documentType.code, fileStoreId };
    });

    const newDocs = [...ownerDocs, ...otherDocs];
    originalProperty.owners = originalProperty?.owners.filter((owner) => owner.status == "ACTIVE");
    const data = {
      Property: {
        ...params.searchResult.property,
        creationReason: "MUTATION",
        owners: [
          ...originalProperty.owners?.map((e) => ({ ...e, status: "INACTIVE" })),
          ...ownersArray.map((owner) => ({
            ...owner,
            documents: Object.keys(owner.documents).map((key) => {
              const { documentType, fileStoreId } = owner.documents[key];
              return { documentType: documentType.code, fileStoreId };
            }),
            gender: owner.gender?.code,
            ownerType: owner.ownerType?.code || "NONE",
            relationship: owner.relationship?.code,
            inistitutetype: owner?.inistitutetype?.value,
            landlineNumber: owner?.altContactNumber,
            status: "ACTIVE",
          })),
        ],
        additionalDetails: {
          ...additionalDetails,
          isMutationInCourt: additionalDetails.isMutationInCourt?.code,
          reasonForTransfer: additionalDetails?.reasonForTransfer.code,
          isPropertyUnderGovtPossession: additionalDetails.isPropertyUnderGovtPossession.code,
          documentDate: new Date(additionalDetails?.documentDate).getTime(),
          marketValue: Number(additionalDetails?.marketValue),
        },
        ownershipCategory: ownershipCategory.code,
        documents:  [
           ...(originalProperty?.documents && originalProperty?.documents?.length > 0 ? originalProperty?.documents?.map((oldDoc) => {
            if (mutationDocs?.PropertyTax?.MutationDocuments.some((mut) => oldDoc.documentType.includes(mut.code))) {
              return { ...oldDoc, status: "INACTIVE" };
            } else return oldDoc;
          }):[]) ,
          ...newDocs,
        ],
        workflow: { action: "OPEN", businessService: "PT.MUTATION", moduleName: "PT", tenantId: originalProperty.tenantId },
      },
    };

    if (!ownershipCategory?.code.includes("INDIVIDUAL")) {
      data.Property.institution = {
        nameOfAuthorizedPerson: ownersArray[0].name,
        name: ownersArray[0].inistitutionName,
        designation: ownersArray[0].designation,
        tenantId: data?.Property?.address.tenantId,
        type: ownersArray[0].inistitutetype?.value,
      };

      data.Property.owners = data.Property.owners?.map((owner) =>
        owner.status === "INACTIVE" ? { ...owner, altContactNumber: ownersArray[0].altContactNumber } : owner
      );
    } else {
      delete data.Property.institution;
    }
    setFormData(data);
  };

  useEffect(() => {
    if (formData) history.push(`${match.path}/check`);
  }, [formData]);

  const mutateProperty = () => {
    history.push(`${match.path}/acknowledgement`);
  };

  const handleSkip = () => {};
  config.indexRoute = "search-property";
  const PTAcknowledgement = Digit?.ComponentRegistryService?.getComponent("PTAcknowledgement");
  return (
    <React.Fragment>
      <Switch>
        {config.map((routeObj, index) => {
          const { component } = routeObj;
          const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
          return (
            <Route path={`${match.path}/${routeObj.route}`} key={index}>
              {Component ? (
                <Component config={routeObj} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} clearParams={() => clearParams()} />
              ) : (
                <div>Component not found</div>
              )}
            </Route>
          );
        })}
        <Route path={`${match.path}/check`}>
          <CheckPage onSubmit={mutateProperty} value={params} />
        </Route>
        <Route path={`${match.path}/acknowledgement`}>
          <PTAcknowledgement
            data={formData}
            onSuccess={() => {
              clearParams();
              setFormData(null);
            }}
          />
        </Route>
        <Route>
          <Redirect to={`${match.path}/${config.indexRoute}`} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default MutationCitizen;
