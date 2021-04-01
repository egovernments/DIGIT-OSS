import React,{Component} from 'react';
import { mainListItems, secondaryListItems } from '../common/utils';
import SideBar from '../common/sidebar';
import ChartRow from '../Charts/chartrow';
import DateRange from '../common/DateRange/index';
import GlobalFilter from '../common/globalFilter/Index'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
  Switch,
  Route,
  Link,NavLink
} from "react-router-dom";
import PageLayout from '../Charts/pagelayout';
import Card from '../Charts/card';
import PerformanceChart from '../Charts/PerformanceChart';
import PropertyTax from '../PropertyTax/'

export default function Dashboard(props){
  return (
  <div>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3" >
            <span style={{fontSize: '20px', marginLeft: '-20px'}}> 
            <img src="/images/icons/collapse.svg" style={{width: '26px',height: '26px',position: 'relative',left: '-20px',bottom: '6px'}}/>My Dashboard</span>
            <div className="btn-toolbar mb-3 mb-md-0 pb-2">
              <button type="button" className="btn defaultButton"><i className="fa fa-download"></i>DOWNLOAD</button>
              <button type="button" className="btn defaultButton"><i className="fa fa-share"></i>SHARE</button>
            </div>
          </div>
          <div className="globalFilterWrap">
            <GlobalFilter />
          </div>
          {props.dashboardConfigData.map((page,i) =>{
                 return <Route key={i} path={"/"+page.name} component={() => <PageLayout chartRowData={page.visualizations} isPropertyPage={false}/>}/>
                })
               }
            <div className="row">
                {props.dashboardConfigData.map((page,i) =>
                   <PageLayout chartRowData={page.visualizations} isPropertyPage={false}/>
                    )
                   }
            </div>
          </div>

  );

}
