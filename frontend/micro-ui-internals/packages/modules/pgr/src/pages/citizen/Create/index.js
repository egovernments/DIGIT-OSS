import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormStep, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";

import { newComplaintSteps } from "./config";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch } from "react-router-dom";

import SelectComplaintType from "./Steps/SelectComplaintType";
import SelectSubType from "./Steps/SelectSubType";
import SelectPincode from "./Steps/SelectPincode";
import SelectAddress from "./Steps/SelectAddress";
import SelectLandmark from "./Steps/SelectLandmark";
import SelectImages from "./Steps/SelectImages";
import SelectDetails from "./Steps/SelectDetails";

const Step2 = ({ config, onSelect }) => <FormStep config={config} onSelect={onSelect} />;
const Step3 = ({ config, onSelect }) => <FormStep config={config} onSelect={onSelect} />;

// steps type: radio, map location, input, city-mohalla, textarea, upload photo
export const CreateComplaint = () => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [params, setParams] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  const stepItems = useMemo(
    () =>
      newComplaintSteps.map((step, index) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      }),
    [newComplaintSteps]
  );

  useEffect(() => {
    console.log("submitForm", params);
  }, [submitForm]);

  const selectComplaintType = (complaintType) => {
    // updateParams("complaintType", complaintType);
    history.push(`${path}/sub-type`);
  };

  const selectSubType = (subType) => {
    setParams({ ...params, subType });
    history.push(`${path}/pincode`);
  };

  const selectPincode = (pincode) => {
    setParams({ ...params, pincode });
    console.log("index --->", pincode);
    history.push(`${path}/address`);
  };

  const selectAddress = (address) => {
    setParams({ ...params, address });
    history.push(`${path}/landmark`);
  };

  const saveLandmark = (landmark) => {
    setParams({ ...params, landmark });
    history.push(`${path}/upload-photos`);
  };

  const saveImagesUrl = (imageUrls) => {
    setParams({ ...params, imageUrls });
    history.push(`${path}/additional-details`);
  };

  const submitComplaint = (details) => {
    details && details !== "" ? setDetails(details) : null;
    // setToSubmitComplaint(true);
  };

  const updateParams = (param, value) => {
    setParams({ ...params, [param]: value });
  };

  // setSubmitForm(true); USE TO SUBMIT FORM

  return (
    <Switch>
      <Route path={`${path}/complaint-type`}>
        <SelectComplaintType config={stepItems[0]} onSelect={selectComplaintType} />
      </Route>
      <Route path={`${path}/sub-type`}>
        <SelectSubType config={stepItems[1]} onSelect={selectSubType} />
      </Route>
      <Route path={`${path}/pincode`}>
        <SelectPincode config={stepItems[2]} onSelect={selectPincode} />
      </Route>
      <Route path={`${path}/address`}>
        <SelectAddress config={stepItems[3]} onSelect={selectAddress} />
      </Route>
      <Route path={`${path}/landmark`}>
        <SelectLandmark config={stepItems[4]} onSelect={saveLandmark} />
      </Route>
      <Route path={`${path}/upload-photos`}>
        <SelectImages config={stepItems[5]} onSelect={saveImagesUrl} />
      </Route>
      <Route path={`${path}/additional-details`}>
        <SelectDetails config={stepItems[6]} onSelect={submitComplaint} />
      </Route>
      {/* <Route path={`${path}/submission`}>
        <Submission config={stepItems[7]} />
      </Route> */}
      <Route>
        <Redirect to={`${url}/complaint-type`} />
      </Route>
    </Switch>
  );
};
