import React, { useState, useEffect } from "react";

import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { PgrRoutes } from "../../constants/Routes";

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

  const citAuth = "c54c09cd-56c5-4193-a59d-76c3867500c8";
  SessionStorage.set("citizen.token", citAuth);
  window.sessionStorage.setItem("citizen.token", citAuth);

  const complaintParams = {
    RequestInfo: {
      apiId: "Rainmaker",
      action: "",
      did: 1,
      key: "",
      msgId: "20170310130900|en_IN",
      requesterId: "",
      ts: Date.now(),
      ver: ".01",
      userInfo: {
        id: 23349,
        uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
        userName: "9404052047",
        name: "Aniket T",
        mobileNumber: "9404052047",
        emailId: "xc@gmail.com",
        locale: null,
        type: "CITIZEN",
        roles: [
          {
            name: "Citizen",
            code: "CITIZEN",
            tenantId: "pb",
          },
        ],
        active: true,
        tenantId: "pb",
      },
      authToken: citAuth,
    },
    service: {
      tenantId: appState.cityCode,
      serviceCode: complaintType,
      description: details,
      accountId: "7b2561e8-901b-40a2-98b7-7e627fc5b1d6",
      additionalDetail: {},
      applicationStatus: null,
      source: "whatsapp",
      rating: 4,
      address: {
        doorNo: "2",
        plotNo: "10",
        landmark: "Near City Hall",
        city: city,
        district: city,
        region: city,
        state: appState.stateInfo.name,
        country: "India",
        pincode: pincode,
        buildingName: "Safalya",
        street: "10th main",
        locality: {
          code: locality !== null ? locality.code : "",
          name: locality !== null ? locality.name : "",
        },
        geoLocation: {
          // latitude: 21,
          // longitude: 56,
          // additionalDetails: {},
        },
      },
    },
    workflow: {
      action: "APPLY",
      assignes: [],
      comments: "Street light is not working",
      verificationDocuments: uploadedImageIds.map((url) => {
        return {
          documentType: "PHOTO",
          fileStore: url,
          documentUid: "",
          additionalDetails: {},
        };
      }),
    },
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
    // <div><h2>create complaints</h2> <BackButton>Backs</BackButton></div>
    <React.Fragment>
      {/* {!details && <BackButton onClick={() => history.goBack()} />} */}
      {/* <Route
        path={match.url + "/onboarding"}
        component={(props) => <UserOnboarding />}
      /> */}
      <Route
        exact
        path={match.url + "/"}
        component={(props) => <ComplaintType save={saveComplaintType} />}
        // component={(props) => <ComplaintTypeConfig />}
      />
      <Route path={PgrRoutes.SubType} component={(props) => <SubType save={saveComplaintType} />} />
      <Route path={PgrRoutes.LocationSearch} component={(props) => <LocationSearch skip={true} />} />
      <Route path={PgrRoutes.Pincode} component={(props) => <Pincode save={(val) => savePincode(val)} skip={true} />} />
      <Route path={PgrRoutes.Address} component={(props) => <Address save={saveAddress} />} />
      <Route path={PgrRoutes.Landmark} component={(props) => <Landmark save={saveLandmark} />} />
      <Route path={PgrRoutes.UploadPhotos} component={(props) => <UploadPhotos save={saveImagesUrl} skip={true} />} />
      <Route path={PgrRoutes.Details} component={(props) => <Details submitComplaint={submitComplaint} skip={true} />} />
      <Route path={PgrRoutes.Response} component={(props) => <Response />} />
      <Route path={PgrRoutes.DynamicConfig} component={(props) => <DynamicConfig />} />
    </React.Fragment>
  );
};

export { CreateComplaint };
