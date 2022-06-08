import React, { Component } from "react";
import { Tabs, Label, List, Icon } from "components";
import Screen from "modules/common/common/Screen";
import YearDialogue from "./components/YearDialogue";

const tabStyle = {
  letterSpacing: "0.6px",
};

class PaymentStepOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogueOpen: false,
    };
  }

  getYearList = () => {
    let today = new Date();
    let month = today.getMonth() + 1;
    let yearRange = [];
    var counter = 0;
    if (month <= 3) {
      return this.getLastFourYear(yearRange, today.getFullYear() - 1, counter);
    } else {
      return this.getLastFourYear(yearRange, today.getFullYear(), counter);
    }
  };

  getLastFourYear(yearRange, currentYear, counter) {
    if (counter < 4) {
      counter++;
      yearRange.push(`${currentYear}-${currentYear + 1}`);
      this.getLastFourYear(yearRange, currentYear - 1, counter);
    }
    return yearRange;
  }

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  render() {
    return (
      <Screen>
        <List
          onItemClick={() => {
            this.setState({ dialogueOpen: true });
          }}
          listContainerStyle={{ marginTop: "16px" }}
          listItemStyle={{ borderBottom: "1px solid #e0e0e0", paddingTop: "8px", paddingBottom: "8px" }}
          nestedListStyle={{ padding: "0px", background: "#f2f2f2" }}
          autoGenerateNestedIndicator={false}
          primaryTogglesNestedList={true}
          items={[
            {
              primaryText: <Label label="PT_HOME_PAY" />,
              leftIcon: <Icon action="action" name="credit-card" />,
              rightIcon: <Icon action="hardware" name="keyboard-arrow-right" />,
            },
            {
              primaryText: <Label label="PT_PAYMENT_DRAFTS" />,
              leftIcon: <Icon action="image" name="edit" />,
              rightIcon: <Icon action="hardware" name="keyboard-arrow-right" />,
            },
            {
              primaryText: <Label label="PT_MY_RECEIPTS" />,
              leftIcon: <Icon action="action" name="receipt" />,
              rightIcon: <Icon action="hardware" name="keyboard-arrow-right" />,
            },
            {
              primaryText: <Label label="PT_EXAMPLES" />,
              leftIcon: <Icon action="action" name="check-circle" />,
              rightIcon: <Icon action="hardware" name="keyboard-arrow-right" />,
            },
            {
              primaryText: <Label label="PT_HOW_IT_WORKS" />,
              leftIcon: <Icon action="action" name="help" />,
              rightIcon: <Icon action="hardware" name="keyboard-arrow-right" />,
            },
          ]}
        />
        <YearDialogue open={this.state.dialogueOpen} yearList={this.getYearList()} closeDialogue={this.closeYearRangeDialogue} />
      </Screen>
    );
  }
}

export default PaymentStepOne;
