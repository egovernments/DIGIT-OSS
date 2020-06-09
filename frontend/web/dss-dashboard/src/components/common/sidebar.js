import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  root: {}
});

class SideBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column" style={{ paddingTop: '4px' }}>
            <li className="nav-item">
              <NavLink exact className="nav-link" activeClassName="nav-link active" to="/">
                <span data-feather="file-text"></span>
                My Dashboard
              </NavLink>
            </li>
          </ul>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center  mt-4 mb-1 text-muted">
            <span>Saved reports</span>
            <a className="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul className="nav flex-column mb-2 text-justify">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fa fa-rupee fa-menu"></i>
                Revenue
                       </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fa fa-bars fa-menu" aria-hidden="true"></i>
                Services
                       </a>
            </li>
          </ul>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center mt-4 mb-1 text-muted">
            <span>Select Domains</span>
            <a className="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul className="nav flex-column mb-2 text-justify">
            <li className="nav-item">
              <NavLink exact className="nav-link" activeClassName="nav-link active" to="/propertytax">
                <span data-feather="file-text">
                  <i className="fa fa-home fa-menu"></i>
                  Property Tax
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact className="nav-link" activeClassName="nav-link active" to="/tradeLicense">
                <span data-feather="file-text"></span>
                <i className="fa fa-suitcase fa-menu" aria-hidden="true"></i>Trade License
               </NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="file-text"></span>
                <i className="fa fa-tint fa-menu" aria-hidden="true"></i>Water Sewerage
                       </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="file-text"></span>
                <i className="fa fa-arrows-alt fa-menu" aria-hidden="true"></i>PGR
                       </a>
            </li>
            {/* 
            {isLoaded &&
              dashboardConfigData.map((page, i) =>
                <li className="nav-item" key={i}>
                  <NavLink exact className="nav-link" activeClassName="nav-link active" to={page.name}>
                    <span data-feather="file-text"></span>{page.name}
                  </NavLink>
                </li>)
            } */}
          </ul>
        </div>
      </nav>);

  }
}
const mapStateToProps = (state) => {
  return {
    dashboardConfigData: state.firstReducer.dashboardConfigData,
  }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, null)(SideBar)));