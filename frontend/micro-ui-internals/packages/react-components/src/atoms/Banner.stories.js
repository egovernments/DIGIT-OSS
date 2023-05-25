import React from "react";

import Banner from "./Banner";

export default {
  title: "Atom/Banner",
  component: Banner,
};

const Template = (args) => <Banner {...args} />;

export const Successful = Template.bind({});
Successful.args = {
  successful: true,
  message: "Your query is resolve.",
  complaintNumber: 5343,
};

export const Error = Template.bind({});
Error.args = {
  successful: false,
  message: "Your query is not resolve.",
};
