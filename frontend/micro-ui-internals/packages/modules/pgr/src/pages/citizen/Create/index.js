import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormStep, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";

import { newComplaintSteps } from "./config";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch } from "react-router-dom";

import SelectComplaintType from "./Steps/SelectComplaintType";
import SelectSubType from "./Steps/SelectSubType";
import SelectPincode from "./Steps/SelectPincode";

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
    updateParams("complaintType", subType);
    history.push(`${path}/pincode`);
  };

  const selectPincode = (pincode) => {
    updateParams("pincode", pincode);
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
      <Route>
        <Redirect to={`${url}/complaint-type`} />
      </Route>
    </Switch>
  );
};
