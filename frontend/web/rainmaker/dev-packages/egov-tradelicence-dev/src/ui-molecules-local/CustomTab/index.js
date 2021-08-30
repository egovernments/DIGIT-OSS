import React from "react";
// nodejs library that concatenates classes

// nodejs library to set properties for components
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// core components
import GridContainer from "@material-ui/core/Grid";
import GridItem from "@material-ui/core/Grid";

import navPillsStyle from "./css.js";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";

class NavPills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active
    };
  }
  handleChange = (event, active) => {
    const { handleClick } = this.props;
    this.setState({ active });
    handleClick(active);
  };
  handleChangeIndex = index => {
    this.setState({ active: index });
  };
  render() {
    const { classes, tabs, direction, horizontal, alignCenter } = this.props;
    const tabButtons = (
      <Tabs
        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        value={this.state.active}
        onChange={this.handleChange}
        centered={alignCenter}
        scrollable
        scrollButtons="off"
      >
        {tabs.map((prop, key) => {
          return (
            <Tab
              label={
                <LabelContainer
                  labelName={prop.tabButton.labelName}
                  labelKey={prop.tabButton.labelKey}
                />
              }
              key={key}
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            />
          );
        })}
      </Tabs>
    );
    const tabContent = (
      <div className={classes.contentWrapper}>
        <SwipeableViews
          axis={direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.active}
          onChangeIndex={this.handleChangeIndex}
        >
          {tabs.map((prop, key) => {
            return (
              <div className={classes.tabContent} key={key}>
                {prop.tabContent}
              </div>
            );
          })}
        </SwipeableViews>
      </div>
    );
    return horizontal !== undefined ? (
      <div className={classes.root}>
        <GridContainer container>
          <GridItem item {...horizontal.tabsGrid}>
            {tabButtons}
          </GridItem>
          <GridItem item {...horizontal.contentGrid}>
            {tabContent}
          </GridItem>
        </GridContainer>
      </div>
    ) : (
      <div className={classes.root}>
        {tabButtons}
        {tabContent}
      </div>
    );
  }
}

NavPills.defaultProps = {
  active: 0,
  color: "primary"
};

NavPills.propTypes = {
  classes: PropTypes.object.isRequired,
  // index of the default active pill
  active: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabButton: PropTypes.string,
      tabIcon: PropTypes.func,
      tabContent: PropTypes.node
    })
  ).isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose"
  ]),
  direction: PropTypes.string,
  horizontal: PropTypes.shape({
    tabsGrid: PropTypes.object,
    contentGrid: PropTypes.object
  }),
  alignCenter: PropTypes.bool
};

export default withStyles(navPillsStyle)(NavPills);
