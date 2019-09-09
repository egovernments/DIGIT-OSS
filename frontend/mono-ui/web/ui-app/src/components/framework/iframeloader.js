import React, { Component } from 'react';
import { connect } from 'react-redux';

const styles = {
  container: {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    paddingBottom: '75%',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
};

class IframeLoader extends Component {
  state = {
    url: '',
  };
  componentDidMount() {
    const token = window.localStorage.token;
    const tenantId = window.localStorage.tenantId;
    this.ifr.onload = () => {
      this.ifr.contentWindow.postMessage({ token, tenantId }, '*');
    };
    const url = this.getIframeUrl(this.props);
    this.setState({ url });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const url = this.getIframeUrl(nextProps);
      this.setState({ url });
    }
  }

  getIframeUrl = props => {
    const paramsString = props.location.search;
    const params = new URLSearchParams(paramsString);
    const url = params.get('url');
    return url;
  };

  render() {
    const { url } = this.state;

    return (
      <div id="container" style={styles.container} className="col-lg-12">
        <iframe
          key={url}
          style={styles.iframe}
          ref={f => {
            this.ifr = f;
          }}
          frameBorder="0"
          src={url}
          allowFullScreen
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  route: state.common.route,
});

export default connect(mapStateToProps, null)(IframeLoader);
