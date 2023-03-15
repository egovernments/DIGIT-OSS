import React from "react";
import { screenHoc } from "../../ui-hocs";
import CommonView from "../../ui-molecules/CommonView";

class ScreenInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: null };
  }
  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const {path,screenKey,hasRemoteConfig} = params;
    if (path && screenKey) {
      this.setState({ view: screenHoc({ path, screenKey,hasRemoteConfig })(CommonView) });
    }
  }

  render() {
    const { view: View } = this.state; // Assigning to new variable names @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    return View && <View />;
  }
}

export default ScreenInterface;
