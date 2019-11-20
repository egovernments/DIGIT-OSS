import React from "react";
import PropTypes from "prop-types";
import Label from "egov-ui-kit/utils/translationNode";

class ReadMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charLimit: props.charLimit,
    };
    this.initialState = this.state;
  }

  getReadMoreContent() {
    const { charLimit } = this.state;
    const { children, readMoreText, readLessText, containerStyle } = this.props;
    if (children.length > charLimit) {
      return (
        <span className="short-text" style={containerStyle}>
          {children.substr(0, charLimit)}...
          <div onClick={this.showLongText.bind(this)}>
            <Label label={readMoreText} labelStyle={{ color: "#007bff", cursor: "pointer" }} />
          </div>
        </span>
      );
    } else if (children.length < charLimit) {
      return (
        <span className="short-text" style={containerStyle}>
          {children}
        </span>
      );
    }
    return (
      <span className="short-text" style={containerStyle}>
        {children}
        <div onClick={this.showShortText.bind(this)}>
          <Label label={readLessText} labelStyle={{ color: "#007bff", cursor: "pointer" }} />
        </div>
      </span>
    );
  }

  showLongText() {
    const { children } = this.props;
    this.setState({ charLimit: children.length });
    this.getReadMoreContent();
  }

  showShortText() {
    this.setState(this.initialState);
    this.getReadMoreContent();
  }

  render() {
    return <div>{this.getReadMoreContent()}</div>;
  }
}

ReadMore.propTypes = {
  charLimit: PropTypes.number,
  readMoreText: PropTypes.string,
  readLessText: PropTypes.string,
  children: PropTypes.string.isRequired,
};
ReadMore.defaultProps = {
  charLimit: 150,
  readMoreText: "Read more",
  readLessText: "Read less",
};
export default ReadMore;
