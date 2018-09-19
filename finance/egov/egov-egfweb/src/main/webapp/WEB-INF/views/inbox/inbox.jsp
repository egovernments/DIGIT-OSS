<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="/WEB-INF/tags/cdn.tld" prefix="cdn" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<link rel="stylesheet" href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/jquery.dataTables.min.css' context='/services/EGF'/>"/>
<link rel="stylesheet" href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/dataTables.bootstrap.min.css' context='/services/EGF'/>">
<link rel="stylesheet" href="<cdn:url value='/resources/global/js/jquery/plugins/datatables/responsive/css/datatables.responsive.css' context='/services/EGF'/>"/>

<div>

		<table class="table table-bordered datatable" id="official_inbox">
                        <thead>
                        <tr>
                            <th><spring:message code="lbl.created.date"/></th>
                            <th><spring:message code="lbl.sender"/></th>
                            <th><spring:message code="lbl.natureoftask"/></th>
                            <th><spring:message code="lbl.status"/></th>
                            <th><spring:message code="lbl.details"/></th>
                            <th><spring:message code="lbl.elapsed.days"/></th>
                            <th></th>
                        </tr>
                        </thead>
                    </table>
</div>
<script src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/jquery.dataTables.min.js' context='/services/EGF'/>"></script>
<script src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/dataTables.bootstrap.js' context='/services/EGF'/>"></script>
<script src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/responsive/js/datatables.responsive.js' context='/services/EGF'/>"></script>
<script src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/moment.min.js' context='/services/EGF'/>"></script>
<script src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/datetime-moment.js' context='/services/EGF'/>"></script>
<script type="text/javascript" src="<cdn:url value='/resources/app/js/inbox/inbox.js?rnd=${app_release_no}' context='/services/EGF'/>"></script>
