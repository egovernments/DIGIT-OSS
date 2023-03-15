import React, { Component } from "react";

class Home extends Component {
  componentDidMount() {
    this.props.history.push("/inbox");
  }
  render() {
    return (
      <div className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8">
        <p>No Activity yet!!!</p>
      </div>
    );
  }
}

export default Home;
