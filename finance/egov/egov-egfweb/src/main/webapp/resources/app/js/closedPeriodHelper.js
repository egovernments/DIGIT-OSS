/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */




$(document).ready(function(){
	console.log("Browser Language ",navigator.language);
	$.i18n.properties({ 
		name: 'message', 
		path: '/services/EGF/resources/app/messages/', 
		mode: 'both',
		async: true,
	    cache: true,
		language: getLocale("locale"),
		callback: function() {
			console.log('File loaded successfully');
		}
	});
	
});
	


function getCookie(name){
	let cookies = document.cookie;
	if(cookies.search(name) != -1){
		var keyValue = cookies.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return keyValue ? keyValue[2] : null;
	}
}

function getLocale(paramName){
	return getCookie(paramName) ? getCookie(paramName) : navigator.language;
}
jQuery('#btnsearch').click(function(e) {

	callAjaxSearch();
});
function getFormData($form) {
	var unindexed_array = $form.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i) {
		indexed_array[n['name']] = n['value'];
	});

	return indexed_array;
}

function callAjaxSearch() {
	drillDowntableContainer = jQuery("#resultTable");
	jQuery('.report-section').removeClass('display-hide');
	reportdatatable = drillDowntableContainer
			.dataTable({
				ajax : {
					url : "/services/EGF/closedperiod/ajaxsearch/" + $('#mode').val(),
					type : "POST",
					"data" : getFormData(jQuery('form'))
				},
				"fnRowCallback" : function(row, data, index) {
					$(row).on(
							'click',
							function() {
								console.log(data.id);
								window.open('/services/EGF/closedperiod/'
										+ $('#mode').val() + '/' + data.id, '',
										'width=800, height=600');
							});
				},
				"bDestroy" : true,
				dom: "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-3  col-xs-6'l><'col-md-3 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
				buttons: [
						  {
						    extend: 'print',
						    title: 'Closed Period',
						    filename: 'Closed Period'
						},{
						    extend: 'pdf',
						    title: 'Closed Period',
						    filename: 'Closed Period'
						},{
						    extend: 'excel',
						    message : 'Closed Period',
						    filename: 'Closed Period'
						}
						],
				aaSorting : [],
				columns : [ {
					"data" : "Financial Year",
					"sClass" : "text-left"
				}, {
					"data" : "startingDate",
					"sClass" : "text-left"
				},
				{
					"data" : "endingDate",
					"sClass" : "text-left"
				},
				{
					"data" : "closeType",
					"sClass" : "text-left"
				}]
			});
}

function compareDate(dt1, dt2){			
	/*******		Return Values [0 if dt1=dt2], [1 if dt1<dt2],  [-1 if dt1>dt2]     *******/
	var d1, m1, y1, d2, m2, y2, ret;
	dt1 = dt1.split('/');
	dt2 = dt2.split('/');
	ret = (dt2[2]>dt1[2]) ? 1 : (dt2[2]<dt1[2]) ? -1 : (dt2[1]>dt1[1]) ? 1 : (dt2[1]<dt1[1]) ? -1 : (dt2[0]>dt1[0]) ? 1 : (dt2[0]<dt1[0]) ? -1 : 0 ;										
	return ret;
}

/*function validateStartDate() {
	var startDate = document.getElementById('startingDate').value;
	var finYearStartDate = document.getElementById('finYearStartDate').value;
	var currDate = new Date();
	var currentDate = currDate.getDate() + "/" + (currDate.getMonth()+1) + "/" + currDate.getFullYear() ;
	To check whether Start Date is Greater than End Date
	if(startDate!=finYearStartDate){
		if( compareDate(formatDate6(finYearStartDate),formatDate6(startDate)) == -1 )
		{
			bootbox.alert('Enter valid Start Date');
			document.getElementById('endingDate').value='';
			document.getElementById('endingDate').focus();
			return false;
		}
	}
	return true;
}*/

function validateEndDate(event) {
	var fromdate = parseInt(document.getElementById('startingDate').value);
	var todate = parseInt(document.getElementById('endingDate').value);
	//var targetId = this.id
	var endofmonth= 3;
	if(fromdate <= endofmonth ){
		if(fromdate > todate){
			//bootbox.alert("From period should be prior or same as that of till period.");
			bootbox.alert($.i18n.prop('msg.from.period.should.be.prior.or.same'));
			document.getElementById('startingDate').value=0;
			document.getElementById('endingDate').value=0;
		}else if(todate>endofmonth){
			//bootbox.alert(" From period should be prior or same as that of till period.");
			bootbox.alert($.i18n.prop('msg.from.period.should.be.prior.or.same'));
			document.getElementById('startingDate').value=0;
			document.getElementById('endingDate').value=0;

		}
	}else{
		if(endofmonth < todate && todate < fromdate){
			//bootbox.alert("From period should be prior or same as that of till period.");
			bootbox.alert($.i18n.prop('msg.from.period.should.be.prior.or.same'));
			document.getElementById('startingDate').value=0;
			document.getElementById('endingDate').value=0;
		}
	}
}

$('#addnewcloseperiod').click(function() {
	var url = '/services/EGF/closedperiod/new';
	$('#closedPeriodsearchform').attr('method', 'get');
	$('#closedPeriodsearchform').attr('action', url);
	window.location = url;
 
});


$('#buttonSubmit').click(function(e) {
	if ($('form').valid()) {
		if(validate()){
			return true;
		}else{
			e.preventDefault();
			}
		
	} else {
		e.preventDefault();
	}
});

function validate(){
	var fromdate = parseInt(document.getElementById('startingDate').value);
	var todate = parseInt(document.getElementById('endingDate').value);

	if(fromdate == 0 ){
		//bootbox.alert("Please select From Month");
		bootbox.alert($.i18n.prop('msg.please.select.from.month'));
		return false;
	}
	
	if(todate == 0 ){
		//bootbox.alert("Please select Till Month");
		bootbox.alert($.i18n.prop('msg.please.select.till.month'));
		return false;
	}
	
	return true;
}

/*function formatDate6(dt){
	if(dt==null || dt==''  || dt=="" )return '';
	var array = dt.split("/");
	var mon=array[1];
	var day=array[0];
	var year=array[2].substring(0,4);			
	dt = day+"/"+mon+"/"+year;			
	return dt;	
}*/