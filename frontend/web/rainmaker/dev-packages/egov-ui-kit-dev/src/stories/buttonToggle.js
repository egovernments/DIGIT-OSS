import React, { Component } from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { ButtonGroup } from "../components";
import theme from "../config/theme";

storiesOf("ButtonToggle", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => <ButtonToggle />);

export default class ButtonToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          label: "Button1",
          style: {
            border: "1px solid red",
            borderRadius: "3px",
            marginRight: "5px",
            background: "transparent",
          },
        },
        {
          label: "Button2",
          style: {
            border: "1px solid red",
            borderRadius: "3px",
            marginRight: "5px",
            background: "transparent",
          },
        },
        {
          label: "Button3",
          style: {
            border: "1px solid red",
            borderRadius: "3px",
            marginRight: "5px",
            background: "transparent",
          },
        },
      ],
    };
  }

  handleClick = (index) => {
    let { items } = this.state;
    let _items = [...items];
    for (var i = 0; i < items.length; i++) {
      _items[i].style["background"] = "transparent";
    }
    _items[index].style["background"] = "orange";
    this.setState({ items: _items });
  };

  renderButtonGroups = () => {
    let { items } = this.state;
    return items.map((item, index) => {
      return (
        <ButtonGroup
          key={index}
          item={item}
          onClick={() => {
            this.handleClick(index);
          }}
        />
      );
    });
  };

  render() {
    return <div>{this.renderButtonGroups()}</div>;
  }
}
