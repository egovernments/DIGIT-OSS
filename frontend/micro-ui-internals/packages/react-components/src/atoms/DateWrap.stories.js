import React from "react";

import DateWrap from "./DateWrap";

export default {
  title: "Atom/DateWrap",
  component: DateWrap,
  argTypes: {
    date: { control: "date" },
  },
};

const Template = (args) => <DateWrap {...args} />;

export const Default = Template.bind({});

Default.args = {
  date: 1607498172995,
};
