import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";

import { TimeLine } from "../components";

import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("TimeLine", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[`import { TimeLine } from "<Egov-Reusable-Components-Location>";`]}
      component={`TimeLine`}
      code={`<TimeLine
        header={{
          title: "URL Avatar",
          subtitle: "Subtitle",
          avatar: "images/jsa-128.jpg"
        }}
        // media={{overlay:{{<TimeLineTitle title="Overlay title" subtitle="Overlay subtitle" />)}}}}
        mediaChildren={
          <img src="images/nature-600-337.jpg" alt="" />
        }
        title={{
          title:"TimeLine title",
          subtitle:"TimeLine subtitle"
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
      <TimeLine
        divStyle={{ maxWidth: 380, maxHeight: 400, margin: "auto" }}
        stepperProps={{
          activeStep: 0,
          orientation: "vertical",
        }}
        steps={[
          {
            labelChildren: "Select campaign settings 1",
            contentChildren: (
              <p>
                For each ad campaign that you create, you can control how much youre willing to spend on clicks and conversions, which networks and
                geographical locations you want your ads to show on, and more.
              </p>
            ),
          },
          {
            labelChildren: "Select campaign settings 2",
            contentChildren: (
              <p>
                For each ad campaign that you create, you can control how much youre willing to spend on clicks and conversions, which networks and
                geographical locations you want your ads to show on, and more.
              </p>
            ),
          },
          {
            labelChildren: "Select campaign settings 3",
            contentChildren: (
              <p>
                For each ad campaign that you create, you can control how much youre willing to spend on clicks and conversions, which networks and
                geographical locations you want your ads to show on, and more.
              </p>
            ),
          },
        ]}
        // header={{
        //   title: "URL Avatar",
        //   subtitle: "Subtitle",
        //   avatar: "images/jsa-128.jpg"
        // }}
        // mediaChildren={<img src="images/nature-600-337.jpg" alt="" />}
        // title={{
        //   title: "TimeLine title",
        //   subtitle: "TimeLine subtitle"
        // }}
        // textChildren={
        //   <div>
        //     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
        //     mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec
        //     vulputate interdum sollicitudin. Nunc lacinia auctor quam sed
        //     pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque
        //     lobortis odio.
        //   </div>
        // }
        // actionChildren={
        //   <div>
        //     <Button
        //       primary={true}
        //       label="Button with primary"
        //       onClick={action("clicked")}
        //     />
        //     <Button
        //       primary={true}
        //       label="Button with secondry"
        //       onClick={action("clicked")}
        //     />
        //   </div>
        // }
      />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/stepper" target="_blank" rel="noopener noreferrer">
          Stepper
        </a>
      </div>
    </Wrapper>
  ));
