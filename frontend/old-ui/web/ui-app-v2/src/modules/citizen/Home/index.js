import React, { Component } from "react";
import { connect } from "react-redux";
import Events from "modules/citizen/PropertyTax/Events/components/Event";
import Banner from "modules/common/common/Banner";
import Notifications from "./components/Notifications";
import SearchService from "./components/SearchService";
import ServiceList from "./components/ServiceList";
import ServicesNearby from "./components/ServicesNearby";
import "./index.css";

//
class Home extends Component {
  notifications = [
    {
      title: "Pay your water & sewerage tax",
      amountDue: "₹1,732",
      dueDate: "24th May 2018",
      date: "24-May-2018",
      status: "Resolved",
    },
  ];

  events = [
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
  ];

  render() {
    const { notifications, events } = this;
    return (
      <Banner className="homepage-banner">
        <div className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8 home-page-content">
          <div className="row">
            <SearchService />
            <ServiceList />
            <Notifications notifications={notifications} />
            <Events events={events} />
            <ServicesNearby />
          </div>
        </div>
      </Banner>
    );
  }
}

export default Home;
