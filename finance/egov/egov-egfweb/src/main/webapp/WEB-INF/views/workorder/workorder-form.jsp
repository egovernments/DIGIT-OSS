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
  
  
<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="orderNumber"> <spring:message code="workorder.number" text="Order No."/><span class="mandatory"></span> 
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="orderNumber" id="orderNumber" maxlength="50" cssClass="form-control patternvalidation" data-pattern="alphaNumericwithspecialcharForContraWOAndSupplierName" required="required"/>
		<form:errors path="orderNumber" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="orderDate"> <spring:message code="workorder.date" text="Order Date"/><span class="mandatory"></span>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="orderDate" class="form-control datepicker" required="required" id="orderDate"  data-date-end-date="0d" data-inputmask="'mask': 'd/m/y'"/>
		<form:errors path="orderDate" cssClass="add-margin error-msg" />
	</div>
</div>


<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="name"> <spring:message code="workorder.name" text="Order Name"/><span class="mandatory"></span>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="name" id="name" maxlength="100" cssClass="form-control patternvalidation" data-pattern="alphabetWithSpecialCharForContraWOAndSupplierName" required="required"/>
		<form:errors path="name" cssClass="add-margin error-msg" />
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="description" > <spring:message code="workorder.description"   text="Description"/></label>
	<div class="col-sm-3 add-margin">
		<form:textarea path="description" id="description" cols="35" cssClass="form-control textfieldsvalidate patternvalidation"  maxlength = "250" />
		<form:errors path="description" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="active"> <spring:message code="workorder.active" text="Active Y/N"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:checkbox path="active" checked="checked" />
		<form:errors path="active" cssClass="add-margin error-msg" />
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="contractor"> <spring:message code="workorder.contractor" text="Contractor Name"/><span class="mandatory"></span> 
	</label>
	<div class="col-sm-3 add-margin contactPerson"> 
		<form:hidden path="" name="contractorId" id="contractorId" value="${workOrder.contractor.id }"/>
		<form:select path="contractor" data-first-option="false" id="contractor" class="form-control" required="required" value="${workOrder.contractor.id}" >
			<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
			<c:forEach var="contractor" items="${contractors}">
				<form:option  value="${contractor.id}" >
					<c:out value="${contractor.name} - ${contractor.code}"/>
				</form:option>
			</c:forEach>
		</form:select>
		<form:errors path="contractor" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="contractorcode"> <spring:message code="workorder.contractorcode" text="Contractor Code"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="" id="contractorcode" maxlength="100" disabled="true" cssClass="form-control"/>
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="orderValue"> <spring:message code="workorder.ordervalue" text="Total/Order Value"/><span class="mandatory"></span> 
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="orderValue" id="orderValue" cssClass="form-control patternvalidation" data-pattern="decimalvalue" required="required" />
		<form:errors path="orderValue" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="advancePayable"> <spring:message code="workorder.advancepayable" text="Advance Payable"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="advancePayable" id="advancePayable" cssClass="form-control patternvalidation" data-pattern="decimalvalue" />
		<form:errors path="advancePayable" cssClass="add-margin error-msg" />
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="fund"> <spring:message code="workorder.fund" text="Fund"/><span class="mandatory"></span> 
	</label>
	<div class="col-sm-3 add-margin">
		<form:select path="fund.id" data-first-option="false" id="fund" class="form-control" required="required" >
			<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
			<form:options items="${funds}" itemValue="id" itemLabel="name" />
		</form:select>
		<form:errors path="fund.id" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="department"> <spring:message code="workorder.department" text="Department"/><span class="mandatory"></span> 
	</label>
	<div class="col-sm-3 add-margin">
		<form:select path="department" data-first-option="false" id="department" class="form-control"  required="required">
			<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
			<form:options items="${departments}" itemValue="code" itemLabel="name" />
		</form:select>
		<form:errors path="department" cssClass="add-margin error-msg" />
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="scheme"> <spring:message code="workorder.scheme" text="Scheme"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:hidden path="" name="schemeId" id="schemeId" value="${workOrder.scheme.id }"/>
		<form:select path="scheme.id" data-first-option="false" id="scheme" class="form-control"  value="${workOrder.scheme.id}">
			<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
		</form:select>
		<form:errors path="scheme.id" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="subScheme"> <spring:message code="workorder.subscheme" text="Sub Scheme"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:hidden path="" name="subSchemeId" id="subSchemeId" value="${workOrder.subScheme.id }"/>
		<form:select path="subScheme.id" data-first-option="false" id="subScheme" class="form-control" value="${workOrder.subScheme.id}">
			<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
		</form:select>
		<form:errors path="subScheme.id" cssClass="add-margin error-msg" />
	</div>
</div>

<div class="form-group">
	<label class="col-sm-2 control-label text-right" for="sanctionNumber"> <spring:message code="workorder.sanctionnumber" text="Sanction No."/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="sanctionNumber" id="sanctionNumber" maxlength="50" cssClass="form-control patternvalidation" data-pattern="alphanumericwithspace" />
		<form:errors path="sanctionNumber" cssClass="add-margin error-msg" />
	</div>
	<label class="col-sm-2 control-label text-right" for="sanctionDate"> <spring:message code="workorder.sanctiondate" text="Sanction Date"/>
	</label>
	<div class="col-sm-3 add-margin">
		<form:input path="sanctionDate" class="form-control datepicker" id="sanctionDate"  data-date-end-date="0d" data-inputmask="'mask': 'd/m/y'"/>
		<form:errors path="sanctionDate" cssClass="add-margin error-msg" />
	</div>
</div> 

<input type="hidden" name="workOrder" value="${workOrder.id}" />