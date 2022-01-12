import React from 'react';
import { getCheckBoxLabelData } from "../../../../utils";

export const configTermsAndConditions = ({ t, applicationData }) => {

  const data = getCheckBoxLabelData(t, applicationData);
  return {
    label: {
      heading: ``,
      submit: null,
      cancel: null,
      hideSubmit: true
    },
    data: [data]
  };
}