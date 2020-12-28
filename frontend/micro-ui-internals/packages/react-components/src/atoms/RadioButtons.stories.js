import React from "react";

import RadioButtons from "./RadioButtons";

export default {
  title: "Atom/RadioButtons",
  component: RadioButtons,
};

const Template = (args) => <RadioButtons {...args} />;

export const Default = Template.bind({});

Default.args = {
  selectedOption: "first",
  onSelect: undefined,
  options: ["first", "second"],
  optionsKey: "",
};
