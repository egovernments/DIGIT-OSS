import React, { useState, useEffect } from "react";

import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BackButton } from "@egovernments/digit-ui-react-components";
// import UserOnboarding from "../UserOnboarding/index";
import SubType from "./SubType";
import LocationSearch from "./LocationSearch";
import Pincode from "./Pincode";
import Address from "./Address";
import Landmark from "./Landmark";
import UploadPhotos from "./UploadPhotos";
import Details from "./Details";
import Response from "../Response";
import { createComplaint } from "../../redux/actions/index";
import ComplaintType from "./ComplaintType";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const CreateComplaint = ({ match, history }) => {
  const SessionStorage = Digit.SessionStorage;
  const dispatch = useDispatch();
  const appState = useSelector((state) => state);
  const [pincode, setPincode] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState(null);
  const [landmark, setLandmark] = useState(null);
  const [details, setDetails] = useState("");
  const [complaintType, setComplaintType] = useState(null);
  const [uploadedImageIds, setUploadedImageIds] = useState([]);

  const complaintParams = {
    cityCode: appState.cityCode,
    complaintType: complaintType,
    description: details,
    landmark: landmark !== null ? landmark : "",
    city: city,
    district: city,
    region: city,
    state: appState.stateInfo.name,
    pincode: pincode,
    localityCode: locality !== null ? locality.code : "",
    localityName: locality !== null ? locality.name : "",
    uploadedImages: uploadedImageIds.map((url) => {
      return {
        documentType: "PHOTO",
        fileStore: url,
        documentUid: "",
        additionalDetails: {},
      };
    }),
  };

  // const [createComplaintParams, setComplaintParams] = useState(complaintParams);

  useEffect(() => {
    if (appState.complaints && appState.complaints.responseInfo) {
      history.push("/create-complaint/response");
    }
  }, [appState.complaints]);

  useEffect(() => {
    (async () => {
      if (details) {
        await dispatch(createComplaint(complaintParams));
      }
    })();
  }, [details]);

  const savePincode = (val) => {
    setPincode(val);
  };

  const saveAddress = (city, locality) => {
    setCity(city);
    setLocality(locality);
  };

  const saveLandmark = (landmark) => {
    setLandmark(landmark);
  };

  const submitComplaint = async (details) => {
    setDetails(details);
  };

  const saveComplaintType = (type) => {
    setComplaintType(type);
  };

  const saveImagesUrl = (imageUrls) => {
    imageUrls === null ? setUploadedImageIds([]) : setUploadedImageIds(imageUrls);
  };
  return (
    <Switch>
      {/* <Route
        path={match.url + "/onboarding"}
        component={(props) => <UserOnboarding />}
      /> */}
      <Route
        exact
        path={getRoute(match, PgrRoutes.CreateComplaintStart)}
        component={(props) => <ComplaintType save={saveComplaintType} />}
        // component={(props) => <ComplaintTypeConfig />}
      />
      <Route path={getRoute(match, PgrRoutes.SubType)} component={(props) => <SubType save={saveComplaintType} />} />
      <Route path={getRoute(match, PgrRoutes.LocationSearch)} component={(props) => <LocationSearch skip={true} />} />
      <Route path={getRoute(match, PgrRoutes.Pincode)} component={(props) => <Pincode save={(val) => savePincode(val)} skip={true} />} />
      <Route path={getRoute(match, PgrRoutes.Address)} component={(props) => <Address save={saveAddress} />} />
      <Route path={getRoute(match, PgrRoutes.Landmark)} component={(props) => <Landmark save={saveLandmark} />} />
      <Route path={getRoute(match, PgrRoutes.UploadPhotos)} component={(props) => <UploadPhotos save={saveImagesUrl} skip={true} />} />
      <Route path={getRoute(match, PgrRoutes.Details)} component={(props) => <Details submitComplaint={submitComplaint} skip={true} />} />
      <Route path={getRoute(match, PgrRoutes.CreateComplaintResponse)} component={(props) => <Response />} />
      <Route path={getRoute(match, PgrRoutes.DynamicConfig)} component={(props) => <DynamicConfig />} />
    </Switch>
  );
};

export { CreateComplaint };
