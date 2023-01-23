import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import HomeLink from "./HomeLink";

export default {
  title: "Atom/HomeLink",
  component: HomeLink,
};

const Template = (args) => (
  <Router>
    <HomeLink {...args} />
  </Router>
);

export const Default = Template.bind({});

Default.args = {
  to: "https://google.com",
  children: "Google",
};
