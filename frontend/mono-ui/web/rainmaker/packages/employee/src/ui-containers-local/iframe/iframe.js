import React from "react";
import get from "lodash/get";
import "./index.css";


class Iframe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ifrmheight: "777px",
    }
  }

  getIframeheight = () => get(document.getElementById('menu-container'), "clientHeight", "777")

  updateFrame = () => this.setState({
    ifrmheight: `${this.getIframeheight()}px`,
  })

  componentDidMount() {
    window.addEventListener("resize", this.updateFrame)
    this.updateFrame()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateFrame)
  }

  render() {
    return (
      <iframe src={this.props.src} frameBorder="0" allowFullScreen className="iframe-style" {...this.props} height={this.state.ifrmheight}/>
    )
  }
}

export default Iframe;
