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
<%@ include file="/includes/taglibs.jsp"%>
<form:form role="form" action="/services/EGF/closedperiod/update"
	modelAttribute="closedPeriod" id="closedPeriodform"
	cssClass="form-horizontal form-groups-bordered"
	enctype="multipart/form-data">
	<div class="main-content">
		<div class="row">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-heading">
						<div class="panel-title"><spring:message
									code="lbl.reopen.closed.period" /></div>
					</div>
					<spring:hasBindErrors name="closedPeriod">
						<div class="alert alert-danger"
							style="margin-top: 20px; margin-bottom: 10px;">
							<form:errors path="*" />
							<br />
						</div>
					</spring:hasBindErrors>
					<div class="panel-body">
						<div class="form-group">

							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.cfinancialyearid" /><span class="mandatory"></span>
							</label>
							<div class="col-sm-3 add-margin">
								<form:select path="financialYear" id="financialYear"
									cssClass="form-control" cssErrorClass="form-control error"
									style="pointer-events: none; cursor: default;"
									required="required">
									<form:option value="">
										<spring:message code="lbl.select" />
									</form:option>
									<form:options items="${cFinancialYears}" itemValue="id"
										itemLabel="finYearRange" />
								</form:select>
								<form:errors path="financialYear" cssClass="error-msg" />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.startingdate" /> <span class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">

								<form:input path="startingDate" required="required"
									class="form-control datepicker" readonly="true" />
								<form:errors path="startingDate" cssClass="error-msg" />

							</div>
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.endingdate" /> <span class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">

								<form:input path="endingDate" data-inputmask="'mask': 'd/m/y'"
									required="required" readonly="true"
									class="form-control datepicker" />
								<form:errors path="endingDate" cssClass="error-msg" />

							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.remarks" /> <span class="mandatory"></span> </label>

							<div class="col-sm-3 add-margin">
								<form:textarea path="remarks" type="text" placeholder=""
									autocomplete="off" class="form-control low-width"
									maxlength="250" required="required"
									cssErrorClass="form-control error" />
								<form:errors path="remarks" cssClass="error-msg" />
							</div>

			<%-- <input type="hidden" name="closedPeriod" value="${closedPeriod.financialYear.id}" />
			<input type="hidden" name="closedPeriod" value="${closedPeriod.isClosed}" />  --%>
			<input type="hidden" name="closedPeriod" value="${closedPeriod.id}" />
						</div>

					</div>
				</div>
			</div>
			<div class="form-group">
				<div class="text-center">
					<button type='submit' class='btn btn-primary' id="buttonSubmit">
						<spring:message code='lbl.reopen' />
					</button>
					<a href='javascript:void(0)' class='btn btn-default'
						onclick='self.close()'><spring:message code='lbl.close' /></a>
				</div>
			</div>
</form:form>
<script>
	$('#buttonSubmit').click(function(e) {
		if ($('form').valid()) {
		} else {
			e.preventDefault();
		}
	});
</script>