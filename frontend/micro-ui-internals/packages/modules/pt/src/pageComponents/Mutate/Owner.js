import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";

const createOwnerDetails = () => ({
  name: "",
  mobileNumber: "",
  fatherOrHusbandName: "",
  emailId: "",
  permanentAddress: "",
  relationship: "",
  ownerType: "",
  gender: "",
  isCorrespondenceAddress: false,
  documents: {},
  key: Date.now(),
});

const config = [
  // {
  //   type: "component",
  //   route: "inistitution-details",
  //   isMandatory: true,
  //   component: "SelectInistitutionOwnerDetails",
  //   texts: {
  //     headerCaption: "",
  //     header: "PT_INSTITUTION_DETAILS_HEADER",
  //     cardText: "PT_FORM3_HEADER_MESSAGE",
  //     submitBarLabel: "PT_COMMON_NEXT",
  //   },
  //   key: "owners",
  //   withoutLabel: true,
  //   nextStep: "institutional-owner-address",
  //   hideInEmployee: true,
  // },
  {
    isMandatory: true,
    type: "component",
    route: "owner-details",
    key: "owners",
    component: "SelectOwnerDetails",
    texts: {
      headerCaption: "PT_MUTATION_TRANSFEREE_DETAILS_HEADER",
      header: "PT_OWNERSHIP_INFO_SUB_HEADER",
      cardText: "PT_FORM3_HEADER_MESSAGE",
      submitBarLabel: "PT_COMMON_NEXT",
    },
    withoutLabel: true,
    nextStep: "special-owner-category",
    hideInEmployee: true,
  },
  {
    type: "component",
    route: "special-owner-category",
    isMandatory: true,
    component: "SelectSpecialOwnerCategoryType",
    texts: {
      headerCaption: "PT_OWNERS_DETAILS",
      header: "PT_SPECIAL_OWNER_CATEGORY",
      cardText: "PT_FORM3_HEADER_MESSAGE",
      submitBarLabel: "PT_COMMON_NEXT",
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "owner-address",
    hideInEmployee: true,
  },
  {
    type: "component",
    route: "owner-address",
    isMandatory: true,
    component: "SelectOwnerAddress",
    texts: {
      headerCaption: "PT_OWNERS_DETAILS",
      header: "PT_OWNERS_ADDRESS",
      cardText: "",
      submitBarLabel: "PT_COMMON_NEXT",
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "special-owner-category-proof",
    hideInEmployee: true,
  },
  {
    type: "component",
    component: "SelectAltContactNumber",
    key: "owners",
    withoutLabel: true,
    hideInEmployee: true,
  },
  {
    type: "component",
    route: "special-owner-category-proof",
    isMandatory: true,
    component: "SelectSpecialProofIdentity",
    texts: {
      headerCaption: "PT_OWNERS_DETAILS",
      header: "PT_SPECIAL_OWNER_CATEGORY_PROOF_HEADER",
      cardText: "",
      submitBarLabel: "PT_COMMON_NEXT",
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "proof-of-identity",
    hideInEmployee: true,
  },
  {
    type: "component",
    route: "proof-of-identity",
    isMandatory: true,
    component: "SelectProofIdentity",
    texts: {
      headerCaption: "PT_OWNERS_DETAILS",
      header: "PT_PROOF_IDENTITY_HEADER",
      cardText: "",
      submitBarLabel: "PT_COMMON_NEXT",
      addMultipleText: "PT_COMMON_ADD_APPLICANT_LABEL",
    },
    key: "owners",
    withoutLabel: true,
    nextStep: null,
    hideInEmployee: true,
  },
];

const OwnerCitizen = (props) => {
  const { onSelect, onSkip, formData, config: propsConfig } = props;
  const { pathname } = useLocation();
  const [owners, setOwners] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS", [createOwnerDetails()]);

  const [lastPath, setLastPath] = Digit.Hooks.useSessionStorage("PT_MUTATE_MULTIPLE_OWNERS_LAST_PATH", `/0/${config[0].route}`);
  const { path, url } = useRouteMatch();

  const allowMultipleOwners = formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS";
  const history = useHistory();

  useEffect(() => {
    if (!owners.length) setOwners([createOwnerDetails()]);
  }, []);

  useEffect(() => {
    if (!allowMultipleOwners && owners.length > 1) {
      setOwners([owners[0]]);
      onSelect(propsConfig.key, [owners[0]]);
      history.replace(`${path}/0/${config[0].route}`);
    }
  }, [allowMultipleOwners]);

  useEffect(() => {
    if (lastPath !== pathname.split(path)[1]) {
      setLastPath(pathname.split(path)[1]);
    }
  }, [pathname]);


  const prevOwnerCount = useRef();
  useEffect(() => {
    prevOwnerCount.current = [...owners].length;
  });
  const prevOwnerLength = prevOwnerCount.current;

  const addNewOwner = () => {
    const newOwner = createOwnerDetails();
    if (allowMultipleOwners) setOwners((prev) => [...prev, newOwner]);
  };

  useEffect(() => {
    if (owners.length > prevOwnerLength) history.push(`${path}/${owners.length - 1}/${config[0].route}`);
  }, [owners]);

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  const commonProps = { addNewOwner, removeOwner, setOwners, owners, ...props, propsConfig };

  return (
    <React.Fragment>
      {/* <p>this is multi owner page</p> */}
      <Switch>
        {owners.map((owner, index) => {
          return (
            <Route key={owner.key} path={`${path}/${index}`}>
              <OwnerSteps owner={owner} ownerIndex={index} {...commonProps} />
            </Route>
          );
        })}
        <Route>{pathname != `${path}${lastPath}` && lastPath != "" ? <Redirect to={`${path}${lastPath}`}></Redirect> : null}</Route>
      </Switch>
      {/* <Route>
        <Redirect to={`${path}/${lastPath ? lastPath : "0"}`} />
     
      </Route> */}
    </React.Fragment>
  );
};

const OwnerSteps = ({ owner, addNewOwner, removeOwner, setOwners, owners, ownerIndex, propsConfig, ...props }) => {
  const { t } = useTranslation();

  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const addOwner = (data) => {
    // handle submission of prev on click of add Owner
    setOwners((prev) => prev.map((o, index) => (o.key === owner.key ? { ...o, ...data } : o)));
    addNewOwner();
  };

  const handleSelectForOwner = (key, data, skipStep, index, isAddMultiple = false, queryParams, configObj) => {
    setOwners((prev) => prev.map((o, index) => (o.key === owner.key ? { ...o, ...data } : o)));
    let pathArray = pathname.split("/");
    let currentPath = pathArray.pop();
    let activeRouteObj = config.filter((e) => e.route === currentPath)[0];

    let queryString = queryParams
      ? `?${Object.keys(queryParams)
          .map((_key) => `${_key}=${queryParams[_key]}`)
          .join("&")}`
      : "";

    const goToNext = skipStep ? history.replace : history.push;

    if (!activeRouteObj.nextStep) {
      if (ownerIndex !== owners.length - 1) {
        pathArray.pop();
        pathArray.push(ownerIndex + 1);
        goToNext(`${pathArray.join("/")}/${config[0].route}`);
      } else {
        props.onSelect(propsConfig.key, owners, "", "", "", { nesting: 2 });
      }
    } else if (typeof activeRouteObj.nextStep === "string") {
      goToNext(`${pathArray.join("/")}/${activeRouteObj.nextStep}${queryString}`);
    } else if (typeof activeRouteObj.nextStep === "object" && activeRouteObj.nextStep) {
      let nextStep = activeRouteObj.nextStep[configObj.routeKey];
      goToNext(`${pathArray.join("/")}/${nextStep}${queryString}`);
    }
  };

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route key={index} path={`${path}/${routeObj.route}`}>
            {
              <Component
                config={routeObj}
                onSelect={handleSelectForOwner}
                onSkip={() => {}}
                t={t}
                formData={{ ...props.formData, owners }}
                ownerIndex={ownerIndex}
                addNewOwner={addOwner}
              />
            }
          </Route>
        );
      })}
      {/* <Route>
        <Redirect to={`${path}/${config[0].route}`} />
      </Route> */}
    </Switch>
  );
};

export default OwnerCitizen;
