import React from "react";

import DisplayPhotos from "./DisplayPhotos";

export default {
  title: "Atom/DisplayPhotos",
  component: DisplayPhotos,
};

const Template = (args) => <DisplayPhotos {...args} />;

export const Default = Template.bind({});

Default.args = {
  srcs: [
    "https://randomwordgenerator.com/img/picture-generator/5ee6d1454b53b10ff3d8992cc12c30771037dbf85254794e722679d49445_640.jpg",
    "https://randomwordgenerator.com/img/picture-generator/55e3d1404351ab14f1dc8460962e33791c3ad6e04e507440762a7cd49348cc_640.jpg",
    "https://randomwordgenerator.com/img/picture-generator/57e0d1444250a414f1dc8460962e33791c3ad6e04e50744077297bd59445c2_640.jpg",
  ],
};
