import React, { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardSubHeader,
  CardText,
  CardLabel,
  Dropdown,
  SubmitBar,
  CardLabelError,
  // RadioButtons,
} from "@egovernments/digit-ui-react-components";
import { useSelector, useDispatch } from "react-redux";

import { fetchLocalities } from "../../../redux/actions";
import { useTranslation } from "react-i18next";

import { CityMohalla } from "@egovernments/digit-ui-react-components";

import { LOCALIZATION_KEY } from "../../../constants/Localization";
import { PgrRoutes, getRoute } from "../../../constants/Routes";
import { useHistory } from "react-router-dom";

const Address = (props) => {
  const SessionStorage = Digit.SessionStorage;
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [rerender, setRerender] = useState(1);
  const appState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const history = useHistory();

  const [valid, setValid] = useState(true);

  const cities = [];
  var localities = [];

  useEffect(() => {
    // console.log("list", props.list);
    if (SessionStorage.get("city_complaint")) {
      setSelectedCity(SessionStorage.get("city_complaint"));
    }
  }, []);

  useEffect(() => {
    console.log("object keys", Object.keys(props.list).length > 0);
    if (Object.keys(props.list).length > 0) {
      cities.push(props.list.city);
      props.list.localities.map((locality) => localities.push(t(`admin.locality.${locality.code}`)));
    } else {
      appState.cities.map((city) => cities.push(city.name));
      if (appState.localities.localityList) {
        appState.localities.localityList.map((locality) => localities.push(t(`${locality.code}`)));
      }
    }
    // if (appState.localities.city) {
    //   setSelectedCity(appState.localities.city);
    // }
  }, [localities, cities]);

  async function selectCity(city) {
    setSelectedCity(city);
    const SessionStorage = Digit.SessionStorage;
    SessionStorage.set("city_complaint", city);
    // console.log("dispatch??");
    await dispatch(fetchLocalities(city));
  }
  function selectLocalities(locality) {
    // console.log("=================locality", locality);
    let localityDetails = appState.localities.localityList.find((o) => o.name === locality);
    // console.log("===================localitydetails===================", localityDetails, appState.localities);
    setSelectedLocality(localityDetails);
  }

  function save() {
    props.save(selectedCity, selectedLocality);
    SessionStorage.del("city_complaint");
    history.push("/create-complaint/landmark");
  }

  function onSkip() {
    history.push("/create-complaint/landmark");
    if (selectedLocality === null || selectedLocality === "") {
      setValid(false);
    } else {
      props.save(selectedCity, selectedLocality);
      SessionStorage.del("city_complaint");
      history.push(getRoute(props.match, PgrRoutes.Landmark));
    }
  }

  return (
    <Card>
      <CardSubHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_COMPLAINT_LOCATION`)}</CardSubHeader>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PROVIDE_COMPLAINT_ADDRESS`)}</CardHeader>
      <CardText>
        {/* Choose the locality/mohalla of the complaint from the list given below. */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_CITY_MOHALLA_TEXT`)}
      </CardText>
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_LOCATION_ERROR`)}</CardLabelError>}
      <CardLabel>{t("MYCITY_CODE_LABEL")} *</CardLabel>
      <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} />
      <CardLabel>{t(`${LOCALIZATION_KEY.CS_CREATECOMPLAINT}_MOHALLA`)} *</CardLabel>
      {/* <RadioButtons options={["Ajit Nagar", "Patel Nagar"]}/> */}
      {/* {console.log("localitiessdasd", localities)} */}
      <Dropdown isMandatory option={localities} select={selectLocalities} />
      <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} onSubmit={save} />
      {/* <p onClick={() =>console.log(selectedCity, selectedLocality)}>state display</p> */}
    </Card>
  );
};

export default Address;
