import React from "react";

import DisplayPhotos from "./DisplayPhotos";

export default {
  title: "Atom/DisplayPhotos",
  component: DisplayPhotos,
};

const Template = (args) => <DisplayPhotos {...args} />;

export const Default = Template.bind({});

Default.args = {
  srcs: ["http://lorempixel.com/640/480/cats", "http://lorempixel.com/640/480/people", "http://lorempixel.com/640/480/cats"],
};
