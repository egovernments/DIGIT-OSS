// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { AutoSuggest } from "../../ui-atoms-local";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

// // import "./index.scss";

// class AutoSuggestor extends Component {
//   onSelect = value => {
//     const { prepareFinalObject, jsonPath } = this.props;
//     // prepareFinalObject(jsonPath, value.value);
//   };

//   render() {
//     const { value, ...rest } = this.props;
//     return (
//       <div>
//         <AutoSuggest onSelect={this.onSelect} value={value} {...rest} />
//       </div>
//     );
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     prepareFinalObject: (path, value) =>
//       dispatch(prepareFinalObject(path, value))
//   };
// };

// export default connect(
//   null,
//   mapDispatchToProps
// )(AutoSuggestor);
