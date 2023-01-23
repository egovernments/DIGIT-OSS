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
  imageSrc: "https://randomwordgenerator.com/img/picture-generator/5ee6d1454b53b10ff3d8992cc12c30771037dbf85254794e722679d49445_640.jpg",
};
