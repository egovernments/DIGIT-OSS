import React from "react";
import formHoc from "egov-ui-kit/hocs/form";

class DynamicFormHoc extends React.Component {
  static Component = null;
  state = { Component: DynamicFormHoc.Component };

  componentDidMount()
  {
    const {formObject,componet:Form}=this.props;
    const Component=formHoc({ ...formObject })(Form);
    this.setState({
      Component
    });
  }

  render()
  {
    const {Component}=this.state;
    if (Component) {
      return <Component {...this.props.props}/>
    }
    return null
  }
}

export default DynamicFormHoc;
