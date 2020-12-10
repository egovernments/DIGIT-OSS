import React from "react";

import FormStep from "./FormStep";

export default {
  title: "Molecule/FormStep",
  component: FormStep,
};

const Template = (args) => <FormStep {...args} />;

export const Default = Template.bind({});

Default.args = {
  config: {
    inputs: [{ type: "text", name: "firstName", label: "First Name", error: "This field is required", validation: null }],
  },
};
