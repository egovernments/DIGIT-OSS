import React, { Component } from "react";
import disableBrowserBackButton from 'disable-browser-back-navigation';


class DisabledComponent extends Component{
    componentDidMount(){
        disableBrowserBackButton(); 
    }

  render(){
    return <div/>
  }  
}
export default DisabledComponent;
