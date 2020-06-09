import React,{Component} from 'react';
import {
  Switch,
  Route,
  Link,NavLink
} from "react-router-dom";
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';



export default class Filters extends React.Component{

  render() {
  	const dateoptions = [
		  {label: "FY 17-18", value: 1},
		  {label: "FY 18-19", value: 2},
		  {label: "FY 19-20", value: 3},
		];
	const districtoptions = [
		  {label: "Gurdaspur", value: 1},
		  {label: "Batala", value: 2},
		  {label: "Goniana", value: 3},
		  {label: "Bhuchomandi", value: 4},
		  {label: "Sangrur", value: 5},
		  {label: "Malerkotla", value: 5},
		];
	const ulboptions = [
		  {label: "Amritsar", value: 1},
		  {label: "Bhatinda", value: 2},
		  {label: "Patiala", value: 3},
		];
	const departoptions = [
		  {label: "Property Tax", value: 1},
		  {label: "Trade licence", value: 2},
		  {label: "PGR", value: 3},
		  {label: "Water & Sewarages", value: 4},
		  {label: "No Objection Certificate", value: 5},

		];
  return (
  	<div className="container-fluid">
  		<div className="row filter-content">
  			<div className="col-md-2 filterEach">
  				<label>Date Range</label>				
				<ReactMultiSelectCheckboxes value="FY 19-20" options={dateoptions} />
  			</div>
  			<div className="col-md-2 filterEach">
  				<label>Districts</label>				
				<ReactMultiSelectCheckboxes value="0" placeholderButtonLabel="All Districts" options={districtoptions} />	
  			</div>
  			<div className="col-md-2 filterEach">
  				<label>ULBS</label>				
				<ReactMultiSelectCheckboxes value="All ULBS" options={ulboptions} />
  			</div>
  			<div className="col-md-2 filterEach">
  				<label>Services</label>				
				<ReactMultiSelectCheckboxes value="All Departments" options={departoptions} />
  			</div>
  			<div className="col-md-2"></div>
  			<div className="col-md-2"></div>
  		</div>
  	</div>

  	);
}
}