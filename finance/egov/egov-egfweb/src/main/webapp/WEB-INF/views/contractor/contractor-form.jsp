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

<div class="main-content">
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-primary" data-collapsed="0">
				<div class="panel-heading">
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="code"> <spring:message code="contractor.code" /><span class="mandatory"></span> 
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="code" maxlength="50" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace" required="required"/>
						<form:errors path="code" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="name"> <spring:message code="contractor.name" /><span class="mandatory"></span>
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="name" id="name" size="40" maxlength="100" cssClass="form-control patternvalidation" data-pattern="alphabetwithspace" required="required"/>
						<form:errors path="name" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="correspondenceAddress" > <spring:message code="contractor.correspondenceAddress"   /><span class="mandatory"></span>
					</label>
					<div class="col-sm-3 add-margin">
						<form:textarea path="correspondenceAddress" cols="35" cssClass="form-control textfieldsvalidate patternvalidation" id="correspondenceAddress" data-pattern="address" maxlength = "250" required="required"/>
						<form:errors path="correspondenceAddress" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="paymentAddress"> <spring:message code="contractor.paymentAddress" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:textarea path="paymentAddress" cols="35" cssClass="form-control textfieldsvalidate patternvalidation" data-pattern="address"  id="paymentAddress" maxlength = "250" />
						<form:errors path="paymentAddress" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="contactPerson"> <spring:message code="contractor.contactPerson" /><span class="mandatory"></span> 
					</label>
					<div class="col-sm-3 add-margin contactPerson"> 
						<form:input path="contactPerson" id="contactPerson" size="40" maxlength="100" cssClass="form-control patternvalidation" data-pattern="alphabetwithspace" required="required" />
						<form:errors path="contactPerson" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="email"> <spring:message code="contractor.email" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="email" id="email" maxlength="100" cssClass="form-control"/>
						<form:errors path="email" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="narration"> <spring:message code="contractor.narration" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:textarea path="narration" cols="35" cssClass="form-control textfieldsvalidate" id="narration" maxlength = "250" />
						<form:errors path="narration" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="mobileNumber"> <spring:message code="lbl.mobile" /><span class="mandatory"></span> 
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="mobileNumber" id="mobileNumber" maxlength="10" cssClass="form-control patternvalidation" data-pattern="number" required="required" />
						<form:errors path="mobileNumber" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="panNumber"> <spring:message code="contractor.panNo" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="panNumber" id="panNumber" maxlength="10" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace"/>
						<form:errors path="panNumber" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="tinNumber"> <spring:message code="contractor.tinNo" /><span class="mandatory"></span> 
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="tinNumber" id="tinNumber" maxlength="14" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace" required="required"/>
						<form:errors path="tinNumber" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="bank"> <spring:message code="contractor.bank" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:select path="bank" data-first-option="false" id="bank" class="form-control"  >
							<form:option value=""><spring:message code="lbl.select" /></form:option>
							<form:options items="${banks}" itemValue="id" itemLabel="name" />
						</form:select>
						<form:errors path="bank" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="ifscCode"> <spring:message code="contractor.ifscCode" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="ifscCode" id="ifscCode" maxlength="15" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace" />
						<form:errors path="ifscCode" cssClass="add-margin error-msg" />
					</div>
				</div>
		
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="bankAccount"> <spring:message code="contractor.bankAccount" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="bankAccount" id="bankAccount" maxlength="22" size="24" cssClass="form-control" />
						<form:errors path="bankAccount" cssClass="add-margin error-msg" />
					</div>
					<label class="col-sm-2 control-label text-right" for="registrationNumber"> <spring:message code="contractor.registrationNo" />
					</label>
					<div class="col-sm-3 add-margin">
						<form:input path="registrationNumber" id="registrationNumber" maxlength="50" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace"/>
						<form:errors path="registrationNumber" cssClass="add-margin error-msg" />
					</div>
				</div>
				
				<div class="form-group">
					<label class="col-sm-2 control-label text-right" for="status"> <spring:message code="contractor.status" /><span class="mandatory"></span> 
					</label>
					<div class="col-sm-3 add-margin">
						<form:select path="status" data-first-option="false" id="status" class="form-control" required="required" >
							<form:option value=""><spring:message code="lbl.select" /></form:option>
							<form:options items="${statuses}" itemValue="id" itemLabel="description" />
						</form:select>
						<form:errors path="status" cssClass="add-margin error-msg" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<input type="hidden" name="contractor" value="${contractor.id}" />