import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";

import { Card, CardTitle } from "../components";
import { Button } from "../components";

import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("Card", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[
        `import { Card, CardTitle } from "<Egov-Reusable-Components-Location>";`,
        `import { Button } from "<Egov-Reusable-Components-Location>";`,
      ]}
      component={`Card`}
      code={`<Card
        header={{
          title: "URL Avatar",
          subtitle: "Subtitle",
          avatar: "images/jsa-128.jpg"
        }}
        // media={{overlay:{{<CardTitle title="Overlay title" subtitle="Overlay subtitle" />)}}}}
        mediaChildren={
          <img src="images/nature-600-337.jpg" alt="" />
        }
        title={{
          title:"Card title",
          subtitle:"Card subtitle"
        }}
        textChildren={
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis
            pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate
            interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </div>
        }
        actionChildren={
          <div>
            <Button
              primary={true}
              label="Button with primary"
              onClick={action("clicked")}
            />
            <Button
              primary={true}
              label="Button with secondry"
              onClick={action("clicked")}
            />
          </div>
        }

      />`}
    >
      <Card
        header={{
          title: "URL Avatar",
          subtitle: "Subtitle",
          avatar: "images/jsa-128.jpg",
        }}
        mediaChildren={<img src="images/nature-600-337.jpg" alt="" />}
        title={{
          title: "Card title",
          subtitle: "Card subtitle",
        }}
        textChildren={
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec
            vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque
            lobortis odio.
          </div>
        }
        actionChildren={
          <div>
            <Button primary={true} label="Button with primary" onClick={action("clicked")} />
            <Button primary={true} label="Button with secondry" onClick={action("clicked")} />
          </div>
        }
      />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/card" target="_blank">
          Card
        </a>
      </div>
    </Wrapper>
  ));
