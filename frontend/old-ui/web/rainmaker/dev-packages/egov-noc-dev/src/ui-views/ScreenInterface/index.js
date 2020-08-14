import React from "react";
import { screenHoc } from "egov-ui-framework/ui-hocs";
import CommonView from "egov-ui-framework/ui-molecules/CommonView";

class ScreenInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: null };
  }
  componentDidMount() {
    this.initInterface(this.props);
  }

  initInterface = props => {
    const { match} = props;
    const { params } = match;
    const { path, screenKey, hasRemoteConfig } = params;
    if (path && screenKey) {
      this.setState({
        view: screenHoc({ path, screenKey, hasRemoteConfig })(CommonView)
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    const { match:nextMatch } = nextProps;
    const { match:currentMatch } = this.props;
    const { params:nextParams } = nextMatch;
    const { params:currentParams } = currentMatch;
    const { path:nextPath, screenKey:nextScreenKey } = nextParams;
    const { path:currentPath, screenKey:currentScreenKey} = currentParams;
    if ((nextPath!==currentPath)||(nextScreenKey!==currentScreenKey)) {
      this.initInterface(nextProps);
    }
  }

  render() {
    const { view: View } = this.state; // Assigning to new variable names @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    return View && <View />;
  }
}

export default ScreenInterface;
