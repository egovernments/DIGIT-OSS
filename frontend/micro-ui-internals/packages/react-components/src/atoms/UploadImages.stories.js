import React from "react";

import UploadImages from "./UploadImages";

export default {
  title: "Atom/UploadImages",
  component: UploadImages,
};

const Template = (args) => <UploadImages {...args} />;

export const NoImages = Template.bind({});
NoImages.args = {};

export const Images = Template.bind({});
Images.args = {
  thumbnails: [
    "https://randomwordgenerator.com/img/picture-generator/5ee6d1454b53b10ff3d8992cc12c30771037dbf85254794e722679d49445_640.jpg",
    "https://randomwordgenerator.com/img/picture-generator/57e0d1444250a414f1dc8460962e33791c3ad6e04e50744077297bd59445c2_640.jpg",
  ],
};
