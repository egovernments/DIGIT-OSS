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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<table class="table">
    <thead>
    <tr>
        <th class="text-center"><spring:message code="lbl.srl.no"/></th>
        <th><spring:message code="lbl.pdf.layer"/></th>
        <th><spring:message code="lbl.pdf.convertedpdf"/></th>
        <th><spring:message code="lbl.pdf.failurereason"/></th>
        <th><spring:message code="lbl.pdf.standardviolations"/></th>
    </tr>
    </thead>
    <tbody>
    <c:choose>
        <c:when test="${not empty pdfDetails}">
            <c:forEach items="${pdfDetails}" var="docs"
                       varStatus="status">
                <tr>
                    <td class="text-center">${status.index+1}</td>
                    <td><c:out value="${docs.layer}" default="N/A"></c:out>
                    </td>
                    <td><c:set value="false" var="isDocFound"></c:set>
                        <c:if test="${docs.convertedPdf.fileStoreId ne null}">
                            <c:set value="true" var="isDocFound"></c:set>
                            <a href="/egi/downloadfile?fileStoreId=${docs.convertedPdf.fileStoreId}&moduleName=Digit DCR&toSave=true">
                                    ${docs.convertedPdf.fileName}<br>
                            </a>
                            <c:if test="${!loop.last}"></c:if>&nbsp;
                        </c:if>
                        <c:if test="${!isDocFound}">
                            N/A
                        </c:if></td>
                    <td><c:out value="${docs.failureReasons}" default="N/A"></c:out></td>
                    <td>
                        <c:choose>
                            <c:when test="${not empty docs.violations}">
                                <c:forEach items="${docs.violations}" var="stdViolation" varStatus="violation">
                                    <c:choose>
                                        <c:when test="${fn:length(docs.violations) eq 1}">
                                            <label><c:out value="${stdViolation}" default="N/A"></c:out></label>
                                        </c:when>
                                        <c:otherwise>
                                            <label>${violation.index+1}. <c:out value="${stdViolation}"
                                                                                default="N/A"></c:out></label>
                                        </c:otherwise>
                                    </c:choose>
                                </c:forEach>
                            </c:when>
                            <c:otherwise>
                                N/A
                            </c:otherwise>
                        </c:choose>
                    </td>
                </tr>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <div class="col-md-12 col-xs-6  panel-title">No documents
                found
            </div>
        </c:otherwise>
    </c:choose>
    </tbody>
</table>
<div class="panel-body">
    <div class="view-content">
    NOTE: If any "Standard Violation" is found kindly verify the generated Pdfs. If the print quality is not satisfactory, fix and re-submit.
    </div>
</div>