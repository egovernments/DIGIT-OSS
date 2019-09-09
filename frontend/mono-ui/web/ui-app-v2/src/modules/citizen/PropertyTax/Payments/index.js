import React from "react";
import SearchService from "modules/citizen/Home/components/SearchService";
import ServiceList from "modules/citizen/Home/components/ServiceList";

const Payments = () => {
  return (
    <div className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8 home-page-content">
      <div className="row">
        <SearchService />
        <ServiceList />
      </div>
    </div>
  );
};

export default Payments;
