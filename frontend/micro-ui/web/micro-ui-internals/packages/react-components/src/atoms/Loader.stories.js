import React from "react";

import { Loader } from "./Loader";

export default {
  title: "Atom/Loader",
  component: Loader,
};

const Template = (args) => <Loader {...args} />;

export const Module = Template.bind({});
Module.args = {
  page: false,
};

export const Page = Template.bind({});
Page.args = {
  page: true,
};
