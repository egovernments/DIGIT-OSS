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

$(document)
    .ready(
        function() {

            /*$('#occupancy option').filter(function() {
                return ($(this).text() == 'Residential');
            }).prop('selected', true);

            $('#serviceType option').filter(function() {
                return ($(this).text() == 'New Construction');
            }).prop('selected', true);*/
            /*$(document).on('change',"#occupancy",function (){
                $('#planInfoOccupancy').val( $( "#occupancy option:selected" ).text());
            });
            $(document).on('change',"#serviceType",function (){
                $('#planInfoServiceType').val($( "#serviceType option:selected" ).text());
            });*/
        	
            function validateNewPlanScrutiny() {
                if (!$('#myfile').val()) {
                    bootbox.alert('Please upload plan file');
                    return false;
                } else if ($('#edcrApplicationform').valid()) {
                    return true;
                } else {
                    return false;
                }
            }

            function validateResubmitPlanScrutiny() {
                if (!$('#myfile').val()) {
                    bootbox.alert('Please upload plan file');
                    return false;
                } else if ($('#edcrReuploadform').valid()) {
                    return true;
                } else {
                    return false;
                }
            }

            function getValidationMessageOnSubmit() {
                var serviceType = $('#serviceType').val();
                if (serviceType === 'Addition or Extension')
                    return 'Please confirm, The submitted DXF file for service type addition or extension for building plan scrutiny shall be as per rules defined. Please click Yes to continue or No to cancel the scrutiny.';
                else
                    return 'Are you sure want to submit plan ?';
            }

            // New Upload EDCR Form Submit
            $('#buttonSubmit').click(function (e) {
                if (validateNewPlanScrutiny()) {
                    bootbox
                        .dialog({
                            message: getValidationMessageOnSubmit(),
                            buttons: {
                                'confirm': {
                                    label: 'Yes',
                                    className: 'btn-primary',
                                    callback: function (result) {
                                        $('#edcrApplicationform').trigger('submit');
                                    }
                                },
                                'cancel': {
                                    label: 'No',
                                    className: 'btn-danger',
                                    callback: function (result) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                }
                            },
                        });
                } else {
                    e.preventDefault();
                }
                return false;
            });

            // Re-Upload EDCR Form Submit
            $('#reUploadSubmit').click(function (e) {
                if (validateResubmitPlanScrutiny()) {
                    bootbox
                        .dialog({
                            message: getValidationMessageOnSubmit(),
                            buttons: {
                                'confirm': {
                                    label: 'Yes',
                                    className: 'btn-primary',
                                    callback: function (result) {
                                    	$('#edcrReuploadform').trigger('submit');
                                    }
                                },
                                'cancel': {
                                    label: 'No',
                                    className: 'btn-danger',
                                    callback: function (result) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }
                                }
                            }
                        });
                } else {
                    e.preventDefault();
                }
                return false;
            });

            $(document).on('change',"#applicationAmenity",function (){
                var amenities = [];
                $.each($("#applicationAmenity option:selected"), function(idx){
                    amenities.push($(this).text());
                });
                $('#amenities').val(amenities);
            });

            $(document).on('change',"#occupancies",function (){
                var occupancies = [];
                $.each($("#occupancies option:selected"), function(idx){
                    occupancies.push($(this).text());
                });
                $('#occupancy').val(occupancies);
            });

            $('#applicationNumber').blur(function() {
                $.ajax({
                    url : '/edcr/edcrapplication/get-information/'+$('#applicationNumber').val()+'/'+$('#applnType').val(),
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: "json",
                    success: function (response) {
                        if(response) {
                            if(response.status == 'Accepted') {
                                bootbox.alert("One of E-DCR plan is approved for the application with application number "+$('#applicationNumber').val()+", so using this application number you are not allowed resubmit plan. Please use new application to submit new plan.");
                                $('#applicationNumber').val('');
                            } else {
                                $('#edcrApplnId').val(response.id);
                                $('#edcrApplication').val(response.id);
                                $('#applicationNumber').val(response.applicationNumber);
                                $('#occupancy').val(response.occupancy);
                                $('#applicantName').val(response.applicantName);
                                $('#serviceType').val(response.serviceType);
                                $('#amenities').val(response.amenities);
                                $('#planPermitNumber').val(response.planPermitNumber);
                            }
                        } else {
                            $('.resetValues').val('');
                            bootbox.alert("Please check application number is correct, with entered application number for the application type "+$('#applicationType').val()+" data not found.");
                        }
                    },
                    error: function (response) {
                        $('.resetValues').val('');
                        bootbox.alert("Please check application number is correct, with entered application number for the application type "+$('#applicationType').val()+" data not found.");
                    }
                });
            });
            
            $('#planPermitNumber').blur(function() {
            	getBpaApplicationByPermitNo($('#planPermitNumber').val());
                getActiveOwnershipRenewalAppByPermitNo($('#planPermitNumber').val());
            });

     });

function getPermitApplicationByPermitNo(permitNumber) {
	$.ajax({
        url : '/bpa/application/findby-permit-number?permitNumber='+permitNumber,
        type: "GET",
        cache: false,
        async: false,
        dataType: "json",
        success: function (response) {
            if(Object.keys(response).length > 0 ) {
            	if(response.isOcRequire === false) {
            		bootbox.alert("Sorry for inconvienence, for the service type of entered plan permission number occupancy certificate is not applicable.");
            		$('.resetValues').val('');
            		return false;
            	} else if(response.ocExists === 'true') {
            		bootbox.alert(response.ocExistsMessage);
            		$('.resetValues').val('');
            		return false;
            	} else if($('#isCitizen').val() === 'true' && !response.isSingleFamily) {
            		bootbox.alert("Dear Citizen, you are not allowed to submit plan, as per permit application do not comply these conditions such as a single family residential and floor area is less then or equal to 150 m² and Maximum Ground+1 floors can be submitted.");
            		$('.resetValues').val('');
            		return false;
            	} else if(response.applicationWF != true) {
            		bootbox.alert("Building permit application "+permitNumber+" still under process, you are not allowed to submit plan. ");
            		$('.resetValues').val('');
            		return false;
            	}else if(response.applicationRevoke == true){
            		bootbox.alert("Building permit application "+permitNumber+" is revocated, you cannot proceed further with this permit.");
            		$('.resetValues').val('');
            		return false;
            	}

                $('#occupancy').val(response.occupancy);
                $('#applicantName').val(response.applicantName);
                $('#permitApplicationDate').val(response.applicationDate);
                $('#serviceType').val(response.serviceTypeDesc);
                $('#stakeholderId').val(response.stakeholderId);
                                
                // If entered permit number is valid, then need to validate is using permit number
                // any other dcr plan application is submitted.
                //validatePermitNoIsUsedWithOtherDcrAppln(permitNumber);
            }
            else {
                $('.resetValues').val('');
                bootbox.alert("Please check plan permission number is valid, with entered plan permission number data is not found.");
            }
        },
        error: function (response) {
            $('.resetValues').val('');
            console.log("Error occurred, when retrieving information for given details."+permitNumber);
        }
    });
}

function getBpaApplicationByPermitNo(permitNumber) {
	$.ajax({
        url : '/bpa/application/findby-permit-number?permitNumber='+permitNumber,
        type: "GET",
        cache: false,
        async: false,
        dataType: "json",
        success: function (response) {
            if(Object.keys(response).length > 0 ) {
            	if(response.isOcRequire === false) {
            		bootbox.alert("Sorry for inconvienence, for the service type of entered plan permission number occupancy certificate is not applicable.");
            		$('.resetValues').val('');
            		return false;
            	} else if(response.ocExists === 'true') {
            		bootbox.alert(response.ocExistsMessage);
            		$('.resetValues').val('');
            		return false;
            	} else if($('#isCitizen').val() === 'true' && !response.isSingleFamily) {
            		bootbox.alert("Dear Citizen, you are not allowed to submit plan, as per permit application do not comply these conditions such as a single family residential and floor area is less then or equal to 150 m² and Maximum Ground+1 floors can be submitted.");
            		$('.resetValues').val('');
            		return false;
            	} else if(response.applicationWF != true) {
            		bootbox.alert("Building permit application "+permitNumber+" still under process, you are not allowed to submit plan. ");
            		$('.resetValues').val('');
            		return false;
            	}else if(response.applicationRevoke == true){
            		bootbox.alert("Building permit application "+permitNumber+" is revocated, you cannot proceed further with this permit.");
            		$('.resetValues').val('');
            		return false;
            	}

                $('#occupancy').val(response.occupancy);
                $('#applicantName').val(response.applicantName);
                $('#permitApplicationDate').val(response.applicationDate);
                $('#serviceType').val(response.serviceTypeDesc);
                $('#stakeholderId').val(response.stakeholderId);
                                
                // If entered permit number is valid, then need to validate is using permit number
                // any other dcr plan application is submitted.
                //validatePermitNoIsUsedWithOtherDcrAppln(permitNumber);
            }
        },
        error: function (response) {
            $('.resetValues').val('');
            console.log("Error occurred, when retrieving information for given details."+permitNumber);
        }
    });
}


function getActiveOwnershipRenewalAppByPermitNo(permitNumber) {
	$.ajax({
        url : '/bpa/application/getownerrenewalapplication?permitNumber='+permitNumber,
        type: "GET",
        cache: false,
        async: false,
        dataType: "json",
        success: function (response) {
            if(Object.keys(response).length > 0) {
                if(response.ownershipNumber != null && response.ownershipNumber != permitNumber){
            		$('.resetValues').val('');
        			bootbox.alert('For the entered plan permission number ownership is changed. Please enter '+response.ownershipNumber+
        					' to proceed');
        			return false;
            	} else if(response.isRenewal && response.inProgress){
            		$('.resetValues').val('');
        			bootbox.alert('For the entered plan permission number renewal workflow is in progress. Hence cannot proceed.'); 
        			return false;
        		} 
            	else if(response.inProgress) {
            		$('.resetValues').val('');
        			bootbox.alert('For the entered plan permission number ownership transfer workflow is in progress. Hence cannot proceed.'); 
                    return false;
            	} 
            	else if(response.isRenewal === false && response.inProgress === false){
                    $('#applicantName').val(response.applicantName);
                    $('#permitApplicationDate').val(response.planPermissionDate);
                    $('#serviceType').val(response.serviceTypeDesc);
                    $('#applicationNumber').val(response.applicationNumber);
            	}
            	else if(!response.applicationExists){
                        $('.resetValues').val('');
                        bootbox.alert("Please check plan permission number is valid, with entered plan permission number data is not found.");
            	}
            } 
        },
        error: function (response) {
            $('.resetValues').val('');
            console.log("Error occurred, when retrieving information for given details."+permitNumber);
        }
    });
}

function validatePermitNoIsUsedWithOtherDcrAppln(permitNo) {
	$.ajax({
        url : '/edcr/scrutinized-plan/findby-permitnumber/'+permitNo,
        type: "GET",
        cache: false,
        async: false,
        dataType: "json",
        success: function (response) {
            if(Object.keys(response).length > 0) {
            	$('.resetValues').val('');
                bootbox.alert("With entered plan permission number "+permitNo+" a plan is already submiited, please by using application number "+response.applicationNumber+" resubmit plan.");
            } 
        },
        error: function (response) {
        	$('.resetValues').val('');
            console.log("Error occurred, when retrieving information for given details.");
        }
    });
}

    // multi-select without pressing ctrl key
    $("select.tick-indicator").mousedown(function(e){
        e.preventDefault();

        var select = this;
        var scroll = select.scrollTop;

        e.target.selected = !e.target.selected;

        $(this).trigger('change');

        setTimeout(function(){select.scrollTop = scroll;}, 0);

        $(select).focus();

    }).mousemove(function(e){e.preventDefault()});

