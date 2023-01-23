import React from "react";

import KeyNote from "./KeyNote";

export default {
  title: "Atom/KeyNote",
  component: KeyNote,
};

const Template = (args) => <KeyNote {...args} />;

export const Default = Template.bind({});

Default.args = {
  keyValue: "note1",
  note: "My first note",
};
