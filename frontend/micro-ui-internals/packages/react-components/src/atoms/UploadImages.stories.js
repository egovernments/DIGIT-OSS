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
  thumbnails: ["http://lorempixel.com/640/480/nightlife", "http://lorempixel.com/640/480/city"],
};
