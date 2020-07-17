<%--
  ~    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
  ~    accountability and the service delivery of the government  organizations.
  ~
  ~     Copyright (C) 2017  eGovernments Foundation
  ~
  ~     The updated version of eGov suite of products as by eGovernments Foundation
  ~     is available at http://www.egovernments.org
  ~
  ~     This program is free software: you can redistribute it and/or modify
  ~     it under the terms of the GNU General Public License as published by
  ~     the Free Software Foundation, either version 3 of the License, or
  ~     any later version.
  ~
  ~     This program is distributed in the hope that it will be useful,
  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~     GNU General Public License for more details.
  ~
  ~     You should have received a copy of the GNU General Public License
  ~     along with this program. If not, see http://www.gnu.org/licenses/ or
  ~     http://www.gnu.org/licenses/gpl.html .
  ~
  ~     In addition to the terms of the GPL license to be adhered to in using this
  ~     program, the following additional terms are to be complied with:
  ~
  ~         1) All versions of this program, verbatim or modified must carry this
  ~            Legal Notice.
  ~            Further, all user interfaces, including but not limited to citizen facing interfaces,
  ~            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
  ~            derived works should carry eGovernments Foundation logo on the top right corner.
  ~
  ~            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
  ~            For any further queries on attribution, including queries on brand guidelines,
  ~            please contact contact@egovernments.org
  ~
  ~         2) Any misrepresentation of the origin of the material is prohibited. It
  ~            is required that all modified versions of this material be marked in
  ~            reasonable ways as different from the original version.
  ~
  ~         3) This license does not grant any rights to any user of the program
  ~            with regards to rights under trademark law for use of the trade names
  ~            or trademarks of eGovernments Foundation.
  ~
  ~   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
  ~
  --%>

<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%>

<div class="panel-heading custom_form_panel_heading">
	<div class="panel-title"></div>
</div>
<div class="panel-body">
	<div class="form-group">
		<label class="col-sm-3 control-label text-right"><spring:message
				code="lbl.upload.edcr" /><span class="mandatory"></span></label>
		<div class="col-sm-4 add-margin">
			<div class="fileSection col-md77-4">
				<input type="file" required="required" name="dxfFile" id="myfile"
					style="display: none;">
				<p class="hide">
					<i class="fa fa-file-text"></i>&nbsp;&nbsp;<span id="fileName"></span>
				</p>
				<button type="button" id="fileTrigger"
					class="btn btn-primary fullWidth">
					<span class="glyphicon glyphicon glyphicon-cloud-upload"></span>
					&nbsp;
					<spring:message code="lbl.choose.file" />
				</button>
				<div class="row hide fileActions">
					<div class="col-md-6">
						<button type="button" id="fileDelete"
							class="btn btn-danger btn-sm">
							<i class="fa fa-trash-o"></i> &nbsp;
							<spring:message code="lbl.delete" />
						</button>
					</div>
				</div>
			</div>
			<small class="text-info view-content"><spring:message
					code="lbl.dcr.upload.help" /></small>
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-3 control-label text-right"><spring:message
				code="lbl.applicationnumber" /> <span class="mandatory"></span></label>
		<div class="col-sm-3 add-margin">
			<input type="hidden" name="id" id="edcrApplnId"
				value="${edcrApplication.id}"> <input type="hidden"
				name="edcrApplication" id="edcrApplication"
				value="${edcrApplication.id}"> <input type="text"
				class="form-control resetValues" name="applicationNumber"
				placeholder="Enter plan scrutiny application number"
				id="applicationNumber" value="${edcrApplication.applicationNumber}"
				required="required">
		</div>
		<label class="col-sm-2 control-label text-right"><spring:message
				code="lbl.permit.no" /> </label>
		<div class="col-sm-3 add-margin">
			<input type="hidden" name="applicationType" id="applnType"
				value="${edcrApplication.applicationType}"> <input
				type="hidden" id="applicationType"
				value="${edcrApplication.applicationType.applicationTypeVal}">
			<input type="text" name="planPermitNumber"
				class="form-control resetValues" id="planPermitNumber"
				value="${edcrApplication.planPermitNumber}" readonly="readonly">
		</div>
	</div>
	<div class="form-group">
		<label class="col-sm-3 control-label text-right"><spring:message
				code="lbl.applicantname" /> </label>
		<div class="col-sm-3 add-margin">
			<input type="text" name="applicantName"
				class="form-control resetValues" id="applicantName"
				value="${edcrApplication.applicantName}" readonly="readonly">
		</div>
		<label class="col-sm-2 control-label text-right"><spring:message
				code="lbl.service.type" /> </label>
		<div class="col-sm-3 add-margin">
			<input type="text" name="serviceType"
				class="form-control resetValues" id="serviceType"
				value="${edcrApplication.serviceType}" readonly="readonly">
		</div>
	</div>
	<%--<div class="form-group">
        <label class="col-sm-3 control-label text-right"><spring:message code="lbl.occupancy" />
        </label>
        <div class="col-sm-3 add-margin">
            <textarea name="occupancy" class="form-control resetValues" rows="4" id="occupancy" value="${edcrApplication.occupancy}" readonly="readonly"></textarea>
        </div>

            <label class="col-sm-2 control-label text-right"><spring:message code="lbl.amenity.type" />
            </label>
        <div class="col-sm-3 add-margin">
            <textarea name="amenities" class="form-control resetValues" rows="4" id="amenities" value="${edcrApplication.amenities}" readonly="readonly"></textarea>
        </div>
    </div>--%>

</div>

<link rel="stylesheet"
	href="<c:url value='/resources/app/css/edcr-style.css?rnd=${app_release_no}'/>">
<script
	src="<cdn:url value='/resources/global/js/egov/inbox.js?rnd=${app_release_no}' context='/egi'/>"></script>