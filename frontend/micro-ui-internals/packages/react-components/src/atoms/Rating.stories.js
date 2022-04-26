import React from "react";

import Rating from "./Rating";

export default {
  title: "Atom/Rating",
  component: Rating,
};

const Template = (args) => <Rating {...args} />;

export const Default = Template.bind({});

Default.args = {
  maxRating: 5,
  currentRating: 0,
  onFeedback: () => {},
};
