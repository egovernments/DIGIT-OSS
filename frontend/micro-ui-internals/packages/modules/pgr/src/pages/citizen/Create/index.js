import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormStep, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";

import { newComplaintSteps } from "./config";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch } from "react-router-dom";

import SelectComplaintType from "./Steps/SelectComplaintType";

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

  const onSubmit = (details) => {
    setParams({ ...params, ...details });
    setSubmitForm(true);
  };

  const selectComplaintType = (complaintType) => {
    setParams({ ...params, complaintType });
    history.push(`${path}/step2`);
  };

  const step2Submit = (description) => {
    setParams({ ...params, ...description });
    history.push(`${path}/submit`);
  };

  const updateParams = (param, value) => {
    setParams({ ...params, [param]: value });
  };

  return (
    <Switch>
      <Route path={`${path}/step1`}>
        <SelectComplaintType config={stepItems[0]} onSelect={selectComplaintType} />
      </Route>
      <Route path={`${path}/step2`}>
        <Step2 config={stepItems[1]} onSelect={step2Submit} />
      </Route>
      <Route path={`${path}/submit`}>
        <Step3 config={stepItems[2]} onSelect={onSubmit} />
      </Route>
      <Route>
        <Redirect to={`${url}/step1`} />
      </Route>
    </Switch>
  );
};
