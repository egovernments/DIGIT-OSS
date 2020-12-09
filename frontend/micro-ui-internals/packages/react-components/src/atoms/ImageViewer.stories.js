import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import ImageViewer from "./ImageViewer";

export default {
  title: "Atom/ImageViewer",
  component: ImageViewer,
};

const Template = (args) => (
  <Router>
    <ImageViewer {...args} />
  </Router>
);

export const Default = Template.bind({});

Default.args = {
  imageSrc: "http://lorempixel.com/640/480/cats",
};
