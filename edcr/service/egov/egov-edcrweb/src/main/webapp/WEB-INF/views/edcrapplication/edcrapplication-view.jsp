<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%>

<div class="row">
	<div class="col-md-12">
		<div class="panel panel-primary" data-collapsed="0">
			<div class="panel-heading">
				<div class="panel-title">
					<spring:message code="lbl.dcr.appln.details" />
				</div>
			</div>
			<div class="panel-body custom">
				<div class="row add-border">
					<div class="col-xs-3 add-margin">
						<spring:message code="lbl.applicationnumber" />
					</div>
					<div class="col-sm-3 add-margin view-content">
						<c:out value="${edcrApplication.applicationNumber}" default="N/A"></c:out>
					</div>
					<div class="col-xs-3 add-margin">
						<spring:message code="lbl.applicationdate" />
					</div>
					<div class="col-sm-3 add-margin view-content">
						<fmt:formatDate pattern="dd/MM/yyyyy"
							value="${edcrApplication.applicationDate}" />
					</div>
				</div>
				<div class="row add-border">
					<div class="col-xs-3 add-margin">
						<spring:message code="lbl.applicantname" />
					</div>
					<div class="col-sm-3 add-margin view-content">
						<c:out value="${edcrApplication.applicantName}" default="N/A"></c:out>
					</div>
					<div class="col-xs-3 add-margin">
						<spring:message code="lbl.service.type" />
					</div>
					<div class="col-sm-3 add-margin view-content">
						<c:out value="${edcrApplication.serviceType}" default="N/A"></c:out>
					</div>
				</div>
				<div class="row add-border">
					<div class="col-xs-3 add-margin">
						<spring:message code="lbl.appln.type" />
					</div>
					<div class="col-sm-3 add-margin view-content">
						<c:out
							value="${edcrApplication.applicationType.applicationTypeVal}"
							default="N/A"></c:out>
					</div>
					<c:if
						test="${edcrApplication.applicationType eq 'OCCUPANCY_CERTIFICATE'}">
						<div class="col-xs-3 add-margin">
							<spring:message code="lbl.permit.no" />
						</div>
						<div class="col-sm-3 add-margin view-content">
							<c:out value="${edcrApplication.planPermitNumber}" default="N/A"></c:out>
						</div>
					</c:if>
				</div>
				<%--  <div class="row add-border">
                    <div class="col-xs-3 add-margin"><spring:message code="lbl.project.type"/>
                    </div>
                    <div class="col-sm-3 add-margin view-content">
                        <c:out value="${edcrApplication.projectType}" default="N/A"></c:out>
                    </div>
                </div>--%>
				<%--<div class="row add-border">
                    <div class="col-xs-3 add-margin"><spring:message code="lbl.occupancy"/>
                    </div>
                    <div class="col-sm-3 add-margin view-content">
                        <c:out value="${edcrApplication.occupancy}" default="N/A"></c:out>
                    </div>
                    <div class="col-xs-3 add-margin"><spring:message code="lbl.amenity.type"/>
                    </div>
                    <div class="col-sm-3 add-margin view-content">
                        <c:out value="${edcrApplication.amenities}" default="N/A"></c:out>
                    </div>
                </div>--%>
			</div>
		</div>
		<div class="panel panel-primary" data-collapsed="0">
			<%@ include file="view-edcr-documents.jsp"%>
		</div>

		<div class="row text-center">
			<div class="add-margin">
				<a href="javascript:void(0)"
					class="btn
                            btn-default"
					onclick="self.close()">Close</a>
			</div>
		</div>
	</div>
</div>