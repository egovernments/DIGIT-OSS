import React, { useState, useEffect } from "react";

import { Route } from "react-router-dom";
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
// import { SessionStorage } from "@egovernments/digit-ui-libraries";
// // import ComplaintTypeConfig from "./ComplaintTypeConfig";
import ComplaintType from "./ComplaintType";

const CreateComplaint = ({ match: { path }, history }) => {
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

  // const citAuth = "c54c09cd-56c5-4193-a59d-76c3867500c8";
  // SessionStorage.set("citizen.token", citAuth);
  // window.sessionStorage.setItem("citizen.token", citAuth);

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
      history.push("/create-complaint/submission");
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
    <React.Fragment>
      {/* <Route
        path={match.url + "/onboarding"}
        component={(props) => <UserOnboarding />}
      /> */}
      <Route exact path={`${path}/`} component={(props) => <ComplaintType save={saveComplaintType} />} />
      <Route path={`${path}/subtype`} component={(props) => <SubType save={saveComplaintType} />} />
      <Route path={`${path}/location`} component={(props) => <LocationSearch skip={true} />} />
      <Route path={`${path}/pincode`} component={(props) => <Pincode save={(val) => savePincode(val)} skip={true} />} />
      <Route path={`${path}/address`} component={(props) => <Address save={saveAddress} />} />
      <Route path={`${path}/landmark`} component={(props) => <Landmark save={saveLandmark} />} />
      <Route path={`${path}/upload-photos`} component={(props) => <UploadPhotos save={saveImagesUrl} skip={true} />} />
      <Route path={`${path}/details`} component={(props) => <Details submitComplaint={submitComplaint} skip={true} />} />
      <Route path={`${path}/submission`} component={(props) => <Response />} />
      <Route path={`${path}/dynamic-config`} component={(props) => <DynamicConfig />} />
    </React.Fragment>
  );
};

export { CreateComplaint };
