import { CardLabel, FormStep, LinkButton, RadioOrSelect, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GIS from "./GIS";
import Timeline from "../components/Timeline";
import { stringReplaceAll } from "../utils";

const LocationDetails = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast }) => {
  let currCity = JSON.parse(sessionStorage.getItem("currentCity")) || { };
  let currPincode = sessionStorage.getItem("currentPincode");
  let currLocality = JSON.parse(sessionStorage.getItem("currentLocality")) || { };
  const allCities = Digit.Hooks.obps.useTenants();
  const { pathname: url } = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [Pinerror, setPinerror] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState(currPincode || formData?.address?.pincode || "");
  const [geoLocation, setgeoLocation] = useState(formData?.address?.geoLocation || "")
  const [tenantIdData, setTenantIdData] = useState(formData?.Scrutiny?.[0]?.tenantIdData);
  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city  || currCity || null);
  const [street, setStreet] = useState(formData?.address?.street || "");
  const [landmark, setLandmark] = useState(formData?.address?.landmark || formData?.address?.Landmark || "");
  const [placeName, setplaceName] = useState(formData?.address?.placeName || formData?.placeName || "");
  //const { isLoading, data: citymodules } = Digit.Hooks.obps.useMDMS(stateId, "tenant", ["citymodule"]);
  let [cities, setcitiesopetions] = useState(allCities);
  let validation = { };
  let cityCode = formData?.data?.edcrDetails?.tenantId;
  formData = { address: { ...formData?.address } };
  const isMobile = window.Digit.Utils.browser.isMobile();

  useEffect(() => {
    if (!selectedCity || !localities) {
      cities =
      userType && userType === "employee"
          ? allCities.filter((city) => city.code === tenantId)
          : pincode
            ? allCities.filter((city) => city?.pincode?.some((pin) => pin == Number(pincode)))
            : allCities;
      setcitiesopetions(cities);
      if (cities?.length == 0) {
        setPinerror("BPA_PIN_NOT_VALID_ERROR");
      } else if ( cities.length == 1) {
        let selectCity = selectedCity?.code ? selectedCity?.code : selectedCity ? selectedCity : "";
        if (cities?.[0].code != selectCity) {
          setPinerror("BPA_PIN_NOT_VALID_ERROR")
        }
      }
    }

  }, [pincode]);


  useEffect(() =>{

    cities.map((city,index) => {
      if(city.code === cityCode)
      {
        setSelectedCity(city);
        sessionStorage.setItem("currentCity", JSON.stringify(city));
      }
    })
  },[cities, formData?.data])

  useEffect(() => {
    if (cities) {
      if (cities.length === 1 && cities?.[0].code === selectedCity?.code) {
        setSelectedCity(cities[0]);
        sessionStorage.setItem("currentCity", JSON.stringify(cities[0]));
      }
    }
  }, [cities]);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  let isEditApplication = window.location.href.includes("editApplication");
  let isSendBackTOCitizen = window.location.href.includes("sendbacktocitizen");


  const [localities, setLocalities] = useState();

  const [selectedLocality, setSelectedLocality] = useState(formData.address.locality || null);

  useEffect(() => {
    if (selectedCity && fetchedLocalities  && !Pinerror) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality && formData?.address?.locality?.code === selectedLocality?.code) {
        setSelectedLocality(formData.address.locality);
      }

      if ((formData?.address?.pincode || pincode) && !Pinerror) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == pincode));
        if (!formData?.address?.locality && filteredLocalityList.length<=0) setSelectedLocality();
      }
      if(!localities || (filteredLocalityList.length > 0 && localities.length !== filteredLocalityList.length) || (filteredLocalityList.length <=0 && localities && localities.length !==__localityList.length))
      {
        setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));
      }
      if (filteredLocalityList.length === 1 && ((selectedLocality == null) || (selectedLocality && filteredLocalityList[0]?.code !== selectedLocality?.code))) {
        setSelectedLocality(filteredLocalityList[0]);
        sessionStorage.setItem("currLocality", JSON.stringify(filteredLocalityList[0]));
      }
    }
  }, [selectedCity, formData?.pincode, fetchedLocalities, pincode,geoLocation]);


  const handleGIS = () => {
    setIsOpen(!isOpen);
  }

  const handleRemove = () => {
    setIsOpen(!isOpen);
  }



  const handleSubmit = () => {
    const address = { }
    address.pincode = pincode;
    address.city = selectedCity;
    address.locality = selectedLocality;
    address.street = street;
    address.landmark = landmark;
    address.geoLocation = geoLocation;
    address.placeName = placeName;
    onSelect(config.key, address);
  };


  function onSave(geoLocation, pincode, placeName) {
    selectPincode(pincode);
    sessionStorage.setItem("currentPincode", pincode);
    setgeoLocation(geoLocation);
    setplaceName(placeName);
    setIsOpen(false);
    setPinerror(null);
  }
  function selectPincode(e) {
    setPinerror(null);
    if(((typeof e === 'object' && e !== null) ? e.target.value : e) !== "")
    if(!(((typeof e === 'object' && e !== null) ? e.target.value : e).match(/^[1-9][0-9]{5}$/)))
    {
      setPinerror("BPA_PIN_NOT_VALID_ERROR");
    }
    formData.address["pincode"] = (typeof e === 'object' && e !== null) ? e.target.value : e;
    setPincode((typeof e === 'object' && e !== null) ? e.target.value : e);
    sessionStorage.setItem("currentPincode", (typeof e === 'object' && e !== null) ? e.target.value : e);
    sessionStorage.setItem("currentCity", JSON.stringify({ }));
    sessionStorage.setItem("currLocality", JSON.stringify({ }));
    setSelectedLocality(null);
    setLocalities(null);
    //setSelectedCity(null);
  }

  function selectStreet(e) {
    setStreet(e.target.value)
  }

  function selectGeolocation(e) {
    formData.address["geoLocation"] = (typeof e === 'object' && e !== null) ? e.target.value : e;
    setgeoLocation((typeof e === 'object' && e !== null) ? e.target.value : e);
    setplaceName((typeof e === 'object' && e !== null) ? e.target.value : e);
    sessionStorage.setItem("currentPincode", "");
    sessionStorage.setItem("currentCity", JSON.stringify({ }));
    sessionStorage.setItem("currLocality", JSON.stringify({ }));
    setPincode("");
    setSelectedLocality(null);
    //setLocalities(null);
    //setSelectedCity(null);
  }

  function selectLandmark(e) {
    setLandmark(e.target.value);
  }

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    sessionStorage.setItem("currentCity", JSON.stringify(city));
    formData.address["city"] = city;
  }

  function selectLocality(locality) {
    if (formData?.address?.locality) {
      formData.address["locality"] = locality;
    }
    setSelectedLocality(locality);
    sessionStorage.setItem("currLocality", JSON.stringify(locality));
  }

  return (
    <div>
      {!isOpen && <Timeline />}
      {isOpen && <GIS t={t} onSelect={onSelect} formData={formData} handleRemove={handleRemove} onSave={onSave} />}   
    {!isOpen && <FormStep
      t={t}
      config={config}
      onSelect={handleSubmit}
      isDisabled={!selectedCity || !selectedLocality || Pinerror }
      isMultipleAllow={true}
      forcedError={t(Pinerror)}
    >
      <CardLabel>{`${t("BPA_GIS_LABEL")}`}</CardLabel>
      <div style={{/* position:"relative",height:"100px",width:"200px" */ }}>
        <TextInput
          style={{ }}
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="gis"
          //value={geoLocation && geoLocation.latitude && geoLocation.longitude?`${geoLocation.latitude},${geoLocation.longitude}`:""}
          value={isEditApplication || isSendBackTOCitizen?(geoLocation.latitude !== null?`${geoLocation.latitude}, ${geoLocation.longitude}`:""):placeName}
          onChange={selectGeolocation}
        />
        <LinkButton
          label={
            <div>
              <span>
                <svg 
                style={!isMobile ? {position: "relative", left: "515px", bottom: "35px", marginTop: "-20px"} : { float: "right", position: "relative", bottom: "35px", marginTop: "-20px", marginRight: "5px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 7C8.79 7 7 8.79 7 11C7 13.21 8.79 15 11 15C13.21 15 15 13.21 15 11C15 8.79 13.21 7 11 7ZM19.94 10C19.48 5.83 16.17 2.52 12 2.06V0H10V2.06C5.83 2.52 2.52 5.83 2.06 10H0V12H2.06C2.52 16.17 5.83 19.48 10 19.94V22H12V19.94C16.17 19.48 19.48 16.17 19.94 12H22V10H19.94ZM11 18C7.13 18 4 14.87 4 11C4 7.13 7.13 4 11 4C14.87 4 18 7.13 18 11C18 14.87 14.87 18 11 18Z" fill="#505A5F" />
                </svg>
              </span>
            </div>
          }
          style={{ }}
          onClick={(e) => handleGIS()}
        />
      </div>
      {/* {isOpen && <GIS t={t} onSelect={onSelect} formData={formData} handleRemove={handleRemove} onSave={onSave} />} */}
      <CardLabel>{`${t("BPA_DETAILS_PIN_LABEL")}`}</CardLabel>
      {!isOpen && <TextInput
        isMandatory={false}
        optionKey="i18nKey"
        type={"text"}
        t={t}
        name="pincode"
        onChange={selectPincode}
        value={pincode}
      />}
      <CardLabel>{`${t("BPA_CITY_LABEL")}*`}</CardLabel>
      {!isOpen && <RadioOrSelect
        options={cities.sort((a, b) => a.name.localeCompare(b.name))}
        selectedOption={selectedCity}
        optionKey="code"
        onSelect={selectCity}
        t={t}
        isDependent={true}
        //labelKey="TENANT_TENANTS"
        disabled={true}
      />}
      {!isOpen && selectedCity && localities && (
        <span className={"form-pt-dropdown-only"}>
          <CardLabel>{`${t("BPA_LOC_MOHALLA_LABEL")}*`}</CardLabel>
          <RadioOrSelect
            optionCardStyles={{ maxHeight:"20vmax", overflow:"scroll" }}
            isMandatory={config.isMandatory}
            options={localities.sort((a, b) => a.name.localeCompare(b.name))}
            selectedOption={selectedLocality}
            optionKey="i18nkey"
            onSelect={selectLocality}
            t={t}
            isDependent={true}
            labelKey={`${stringReplaceAll(selectedCity?.code,".","_").toUpperCase()}_REVENUE`}
          //disabled={isEdit}
          />
        </span>
      )}
      <CardLabel>{`${t("BPA_DETAILS_SRT_NAME_LABEL")}`}</CardLabel>
      {!isOpen && <TextInput
        style={{ }}
        isMandatory={false}
        optionKey="i18nKey"
        t={t}
        name="street"
        onChange={selectStreet}
        value={street}
      />}
      <CardLabel>{`${t("ES_NEW_APPLICATION_LOCATION_LANDMARK")}`}</CardLabel>
      {!isOpen && <TextInput
        style={{ }}
        isMandatory={false}
        optionKey="i18nKey"
        t={t}
        name="landmark"
        onChange={selectLandmark}
        value={landmark}
      // {...(validation = {
      //     isRequired: true,
      //     pattern: getPattern("Name"),
      //     title: t("BPA_INVALID_NAME"),
      // })}
      />}
    </FormStep>}
    </div>
  );
};

export default LocationDetails;