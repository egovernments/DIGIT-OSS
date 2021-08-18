import { CardLabel, Dropdown, FormStep, LabelFieldPair, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { cardBodyStyle } from "../utils";

const PTSelectAddress = ({ t, config, onSelect, userType, formData }) => {
  const allCities = Digit.Hooks.pt.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();
  let isEditProperty = formData?.isEditProperty || false;
  if (formData?.isUpdateProperty) isEditProperty = true;
  const { pincode, city } = formData?.address || "";
  const cities =
    userType === "employee"
      ? allCities.filter((city) => city.code === tenantId)
      : pincode
      ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
      : allCities;

  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city || null);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  const [localities, setLocalities] = useState();

  const [selectedLocality, setSelectedLocality] = useState();

  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }

      if (userType === "employee") {
        onSelect(config.key, { ...formData[config.key], city: selectedCity });
      }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, { ...formData[config.key], locality: filteredLocalityList[0] });
        }
      }
    }
  }, [selectedCity, formData?.address?.pincode, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    if (formData?.address?.locality) {
      formData.address["locality"] = locality;
    }
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  function onSubmit() {
    onSelect(config.key, { city: selectedCity, locality: selectedLocality });
  }

  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("MYCITY_CODE_LABEL")}</CardLabel>
          <Dropdown
            className="form-field"
            selected={cities?.length === 1 ? cities[0] : selectedCity}
            disable={isEditProperty ? isEditProperty : cities?.length === 1}
            option={cities}
            select={selectCity}
            optionKey="code"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("PT_LOCALITY_LABEL")}</CardLabel>
          <Dropdown
            className="form-field"
            selected={selectedLocality}
            option={localities}
            select={selectLocality}
            optionKey="i18nkey"
            t={t}
            disable={isEditProperty ? isEditProperty : false}
          />
        </LabelFieldPair>
      </div>
    );
  }
  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <div style={{ ...cardBodyStyle, maxHeight: "calc(100vh - 26em)" }}>
        <CardLabel>{`${t("MYCITY_CODE_LABEL")} `}</CardLabel>
        <RadioOrSelect
          options={cities.sort((a, b) => a.name.localeCompare(b.name))}
          selectedOption={selectedCity}
          optionKey="code"
          onSelect={selectCity}
          t={t}
          isDependent={true}
          labelKey="TENANT_TENANTS"
          disabled={isEditProperty}
        />
        {selectedCity && localities && <CardLabel>{`${t("PT_LOCALITY_LABEL")} `}</CardLabel>}
        {selectedCity && localities && (
          <span className={"form-pt-dropdown-only"}>
            <RadioOrSelect
              dropdownStyle={{ paddingBottom: "20px" }}
              isMandatory={config.isMandatory}
              options={localities.sort((a, b) => a.name.localeCompare(b.name))}
              selectedOption={selectedLocality}
              optionKey="i18nkey"
              onSelect={selectLocality}
              t={t}
              isDependent={true}
              labelKey=""
              disabled={isEditProperty}
            />
          </span>
        )}
      </div>
    </FormStep>
  );
};

export default PTSelectAddress;
