import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { FilePicker } from "../components";
import theme from "../config/theme";
import AddPhoto from "material-ui/svg-icons/image/add-a-photo";

const inputProps = {
  accept: "image/*",
  id: "i1",
  multiple: false, //for selecting single or multiple files
  style: {
    display: "none",
  },
};

const AddPhotoStyle = {
  height: "24px",
  width: "24px",
  borderRadius: "50%",
  padding: "12px",
  background: "limegreen",
};
const labelProps = <AddPhoto style={AddPhotoStyle} color={"#FFFFFF"} />;

storiesOf("FilePicker", module)
  .addDecorator(muiTheme([theme]))
  .add("filePicker", () => <FilePicker inputProps={inputProps} pickIcon={labelProps} handleimage={action("file")} />);
