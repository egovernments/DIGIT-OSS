import React from "react";

import RatingCard from "./RatingCard";

export default {
  title: "Molecule/RatingCard",
  component: RatingCard,
};

const Template = (args) => <RatingCard {...args} />;

export const InputTypeRate = Template.bind({});

InputTypeRate.args = {
  config: {
    inputs: [{ type: "rate", label: "Label" }],
    texts: { header: "Header", submitBarLabel: "Submit" },
  },
};

export const InputTypeCheckbox = Template.bind({});

InputTypeCheckbox.args = {
  config: {
    inputs: [{ type: "checkbox", label: "Label", checkLabels: ["Check Label"] }],
    texts: { header: "Header", submitBarLabel: "Submit" },
  },
};

export const InputTypeTextArea = Template.bind({});

InputTypeTextArea.args = {
  config: {
    inputs: [{ type: "textarea", label: "Label", name: "name" }],
    texts: { header: "Header", submitBarLabel: "Submit" },
  },
};
