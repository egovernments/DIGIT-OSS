import React, { Component } from "react";
import disableBrowserBackButton from 'disable-browser-back-navigation';


class DisableBackComponent extends Component{
    componentDidMount(){
        disableBrowserBackButton(); 
    }

  render(){
    return <div/>
  }  
}
export default DisableBackComponent;
