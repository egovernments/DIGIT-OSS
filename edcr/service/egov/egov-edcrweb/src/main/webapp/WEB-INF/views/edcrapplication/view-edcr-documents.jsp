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

<div class="panel-heading custom_form_panel_heading">
    <div class="panel-title">
        <spring:message code="lbl.doc.details"/>
    </div>
</div>
<table class="table">
    <thead>
    <tr>
        <th class="text-center"><spring:message code="lbl.srl.no"/></th>
        <th><spring:message code="lbl.dcrnumber"/></th>
        <th><spring:message code="lbl.dxf.doc"/></th>
        <th><spring:message code="lbl.dcr.report.ouput"/></th>
        <th><spring:message code="lbl.created.date"/></th>
        <th><spring:message code="lbl.status"/></th>
       <%-- <th><spring:message code="lbl.layererror.count"/></th>
        <th><spring:message code="lbl.print.pdf"/></th>--%>
    </tr>
    </thead>
    <tbody>
    <c:choose>
        <c:when test="${not empty edcrApplication.edcrApplicationDetails}">
            <c:forEach items="${edcrApplication.edcrApplicationDetails}" var="docs"
                       varStatus="status">
                <tr>
                    <td class="text-center">${status.index+1}</td>
                    <td><c:out value="${docs.dcrNumber}" default="N/A"></c:out>
                    </td>
                    <td><c:set value="false" var="isDocFound"></c:set>
                        <c:if test="${docs.dxfFileId.fileStoreId ne null}">
                            <c:set value="true" var="isDocFound"></c:set>
                            <a href="/egi/downloadfile?fileStoreId=${docs.dxfFileId.fileStoreId}&moduleName=Digit DCR&toSave=true">
                                    ${docs.dxfFileId.fileName}<br>
                            </a>
                            <c:if test="${!loop.last}"></c:if>&nbsp;
                        </c:if>
                        <c:if test="${!isDocFound}">
                            N/A
                        </c:if></td>
                    <td><c:set value="false" var="isDocFound"></c:set>
                        <c:if test="${docs.reportOutputId.fileStoreId ne null}">
                            <c:set value="true" var="isDocFound"></c:set>
                            <a
                                    href="/egi/downloadfile?fileStoreId=${docs.reportOutputId.fileStoreId}&moduleName=Digit DCR&toSave=true">
                                    ${docs.reportOutputId.fileName}<br>
                            </a>
                            <c:if test="${!loop.last}"></c:if>&nbsp;
                        </c:if>
                        <c:if test="${!isDocFound}">
                            N/A
                        </c:if></td>
                    <td><fmt:formatDate value="${docs.createdDate}" pattern="dd/MM/yyyy HH:mm:ss" var="createdDate" />
                        <c:out value="${createdDate}" default="N/A"></c:out></td>
                    <td><c:out value="${docs.status}" default="N/A"></c:out> </td>
                    <%--<td><c:out value="${docs.noOfErrors}" default="0"></c:out> </td>
                    <td>
                        <a href="/edcr/edcrapplication/get-convertedpdf/${docs.id}"
                           target="popup" class="btn btn-primary"
                           onclick="window.open('/edcr/edcrapplication/get-convertedpdf/${docs.id}','popup','width=1100,height=700'); return false;">
                            View
                        </a>
                    </td>--%>
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