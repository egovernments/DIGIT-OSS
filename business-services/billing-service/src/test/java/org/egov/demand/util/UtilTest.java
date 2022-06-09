package org.egov.demand.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.qos.logback.core.util.COWArrayList;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.MissingNode;
import com.jayway.jsonpath.DocumentContext;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.demand.amendment.model.ProcessInstance;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGInterval;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class UtilTest {
    @MockBean
    private Boolean aBoolean;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private Util util;


    @Test
    void testPrepareMdMsRequest() {


        Util util = new Util();
        ArrayList<String> stringList = new ArrayList<>();
        RequestInfo requestInfo = new RequestInfo();
        MdmsCriteriaReq actualPrepareMdMsRequestResult = util.prepareMdMsRequest("42", "Module Name", stringList, "Filter",
                requestInfo);
        assertSame(requestInfo, actualPrepareMdMsRequestResult.getRequestInfo());
        MdmsCriteria mdmsCriteria = actualPrepareMdMsRequestResult.getMdmsCriteria();
        assertEquals("42", mdmsCriteria.getTenantId());
        List<ModuleDetail> moduleDetails = mdmsCriteria.getModuleDetails();
        assertEquals(1, moduleDetails.size());
        ModuleDetail getResult = moduleDetails.get(0);
        assertEquals(stringList, getResult.getMasterDetails());
        assertEquals("Module Name", getResult.getModuleName());
    }


    @Test
    void testPrepareMdMsRequest2() {

        Util util = new Util();

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        RequestInfo requestInfo = new RequestInfo();
        MdmsCriteriaReq actualPrepareMdMsRequestResult = util.prepareMdMsRequest("42", "Module Name", stringList, "Filter",
                requestInfo);
        assertSame(requestInfo, actualPrepareMdMsRequestResult.getRequestInfo());
        MdmsCriteria mdmsCriteria = actualPrepareMdMsRequestResult.getMdmsCriteria();
        assertEquals("42", mdmsCriteria.getTenantId());
        List<ModuleDetail> moduleDetails = mdmsCriteria.getModuleDetails();
        assertEquals(1, moduleDetails.size());
        ModuleDetail getResult = moduleDetails.get(0);
        List<MasterDetail> masterDetails = getResult.getMasterDetails();
        assertEquals(1, masterDetails.size());
        assertEquals("Module Name", getResult.getModuleName());
        MasterDetail getResult1 = masterDetails.get(0);
        assertNull(getResult1.getFilter());
        assertEquals("foo", getResult1.getName());
    }


    @Test
    void testPrepareMdMsRequest3() {


        Util util = new Util();

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("foo");
        stringList.add("foo");
        RequestInfo requestInfo = new RequestInfo();
        MdmsCriteriaReq actualPrepareMdMsRequestResult = util.prepareMdMsRequest("42", "Module Name", stringList, "Filter",
                requestInfo);
        assertSame(requestInfo, actualPrepareMdMsRequestResult.getRequestInfo());
        MdmsCriteria mdmsCriteria = actualPrepareMdMsRequestResult.getMdmsCriteria();
        assertEquals("42", mdmsCriteria.getTenantId());
        List<ModuleDetail> moduleDetails = mdmsCriteria.getModuleDetails();
        assertEquals(1, moduleDetails.size());
        ModuleDetail getResult = moduleDetails.get(0);
        List<MasterDetail> masterDetails = getResult.getMasterDetails();
        assertEquals(2, masterDetails.size());
        assertEquals("Module Name", getResult.getModuleName());
        MasterDetail getResult1 = masterDetails.get(1);
        assertEquals("foo", getResult1.getName());
        MasterDetail getResult2 = masterDetails.get(0);
        assertEquals("foo", getResult2.getName());
        assertNull(getResult2.getFilter());
        assertNull(getResult1.getFilter());
    }




    @Test
    void testGetAuditDetail2() {


        Util util = new Util();

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(new User());
        AuditDetails actualAuditDetail = util.getAuditDetail(requestInfo);
        assertNull(actualAuditDetail.getCreatedBy());
        assertNull(actualAuditDetail.getLastModifiedBy());
    }

    @Test
    void testGetAuditDetail4() {

        Util util = new Util();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getUserInfo()).thenReturn(new User());
        AuditDetails actualAuditDetail = util.getAuditDetail(requestInfo);
        assertNull(actualAuditDetail.getCreatedBy());
        assertNull(actualAuditDetail.getLastModifiedBy());
        verify(requestInfo).getUserInfo();
    }


    @Test
    void testGetStringVal() {


        Util util = new Util();
        assertEquals("", util.getStringVal(new HashSet<>()));
    }


    @Test
    void testGetStringVal2() {


        Util util = new Util();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        assertEquals("foo", util.getStringVal(stringSet));
    }

    @Test
    void testGetStringVal3() {


        Util util = new Util();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("42");
        stringSet.add("foo");
        assertEquals("foo,42", util.getStringVal(stringSet));
    }




    @Test
    void testGetJsonValue() {


        Util util = new Util();
        assertNull(util.getJsonValue(new PGobject()));
    }


    @Test
    void testGetJsonValue2() {

        Util util = new Util();
        assertThrows(CustomException.class, () -> util.getJsonValue(new PGInterval()));
    }


    @Test
    void testGetJsonValue3() {

        assertNull((new Util()).getJsonValue(null));
    }


    @Test
    void testGetJsonValue4() {

        Util util = new Util();
        PGInterval pgInterval = mock(PGInterval.class);
        when(pgInterval.getValue()).thenReturn("42");
        assertThrows(CustomException.class, () -> util.getJsonValue(pgInterval));
        verify(pgInterval, atLeast(1)).getValue();
    }


    @Test
    void testGetJsonValue5() {


        Util util = new Util();
        PGInterval pgInterval = mock(PGInterval.class);
        when(pgInterval.getValue()).thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class, () -> util.getJsonValue(pgInterval));
        verify(pgInterval).getValue();
    }




    @Test
    void testGetIsAdvanceAllowed2() {

        Util util = new Util();
        DocumentContext documentContext = mock(DocumentContext.class);
        when(documentContext.read((String) any(), (com.jayway.jsonpath.Predicate[]) any())).thenReturn(new ArrayList<>());
        assertThrows(CustomException.class, () -> util.getIsAdvanceAllowed("Business Service", documentContext));
        verify(documentContext).read((String) any(), (com.jayway.jsonpath.Predicate[]) any());
    }



    @Test
    void testUpdateDemandPaymentStatus() {

        Util util = new Util();
        Demand demand = new Demand();
        util.updateDemandPaymentStatus(demand, true);
        assertTrue(demand.getIsPaymentCompleted());
    }




    @Test
    void testUpdateDemandPaymentStatus4() {


        Util util = new Util();
        Demand demand = mock(Demand.class);
        when(demand.getDemandDetails()).thenReturn(new ArrayList<>());
        doNothing().when(demand).setIsPaymentCompleted((Boolean) any());
        util.updateDemandPaymentStatus(demand, true);
        verify(demand, atLeast(1)).getDemandDetails();
        verify(demand).setIsPaymentCompleted((Boolean) any());
    }


    @Test
    void testUpdateDemandPaymentStatus5() {


        Util util = new Util();
        Demand demand = mock(Demand.class);
        when(demand.getDemandDetails()).thenReturn(new ArrayList<>());
        doNothing().when(demand).setIsPaymentCompleted((Boolean) any());
        util.updateDemandPaymentStatus(demand, false);
        verify(demand, atLeast(1)).getDemandDetails();
    }


    @Test
    void testUpdateDemandPaymentStatus6() {

        Util util = new Util();

        DemandDetail demandDetail = new DemandDetail();
        demandDetail.setTaxAmount(BigDecimal.valueOf(42L));
        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(demandDetail);
        Demand demand = mock(Demand.class);
        when(demand.getDemandDetails()).thenReturn(demandDetailList);
        doNothing().when(demand).setIsPaymentCompleted((Boolean) any());
        util.updateDemandPaymentStatus(demand, true);
        verify(demand, atLeast(1)).getDemandDetails();
        verify(demand).setIsPaymentCompleted((Boolean) any());
    }


    @Test
    void testValidateTenantIdForUserType3() {
        Util util = new Util();
        User user = new User();
        user.setRoles(new ArrayList<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        util.validateTenantIdForUserType("42", requestInfo);
        assertSame(user, requestInfo.getUserInfo());
    }


    @Test
    void testValidateTenantIdForUserType4() {
        Util util = new Util();
        User user = mock(User.class);
        when(user.getType()).thenReturn("Type");
        when(user.getRoles()).thenReturn(new ArrayList<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        util.validateTenantIdForUserType("42", requestInfo);
        verify(user).getType();
        verify(user).getRoles();
    }


    @Test
    void testValidateTenantIdForUserType5() {

        Util util = new Util();
        User user = mock(User.class);
        when(user.getType()).thenReturn(Constants.EMPLOYEE_TYPE_CODE);
        when(user.getRoles()).thenReturn(new ArrayList<>());

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        util.validateTenantIdForUserType("42", requestInfo);
        verify(user).getType();
        verify(user).getRoles();
    }


    @Test
    void testValidateTenantIdForUserType6() {

        Util util = new Util();

        ArrayList<Role> roleList = new ArrayList<>();
        roleList.add(new Role());
        User user = mock(User.class);
        when(user.getType()).thenReturn("Type");
        when(user.getRoles()).thenReturn(roleList);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        util.validateTenantIdForUserType("42", requestInfo);
        verify(user).getType();
        verify(user).getRoles();
    }




    @Test
    void testJsonMerge() {


        Util util = new Util();
        MissingNode mainNode = MissingNode.getInstance();
        MissingNode instance = MissingNode.getInstance();
        assertSame(instance, util.jsonMerge(mainNode, instance));
    }


    @Test
    void testJsonMerge2() {


        Util util = new Util();
        MissingNode instance = MissingNode.getInstance();
        assertSame(instance, util.jsonMerge(null, instance));
    }

    @Test
    void testJsonMerge3() {

        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        util.jsonMerge(arrayNode, MissingNode.getInstance());
        verify(arrayNode).getNodeType();
    }


    @Test
    void testJsonMerge4() {

        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        util.jsonMerge(arrayNode, null);
        verify(arrayNode).getNodeType();
    }

    @Test
    void testJsonMerge5() {

        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenReturn(MissingNode.getInstance());
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(new Scanner("Source"));
        util.jsonMerge(arrayNode, arrayNode1);
        verify(arrayNode).get((String) any());
        verify(arrayNode).getNodeType();
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }


    @Test
    void testJsonMerge6() {

        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenThrow(new CustomException("Code", "An error occurred"));
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(new Scanner("Source"));
        assertThrows(CustomException.class, () -> util.jsonMerge(arrayNode, arrayNode1));
        verify(arrayNode).get((String) any());
        verify(arrayNode).getNodeType();
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }


    @Test
    void testJsonMerge7() {

        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenReturn(null);
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(new Scanner("Source"));
        util.jsonMerge(arrayNode, arrayNode1);
        verify(arrayNode).get((String) any());
        verify(arrayNode).getNodeType();
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }


    @Test
    void testJsonMerge8() {


        Util util = new Util();
        JsonNode jsonNode = mock(JsonNode.class);
        when(jsonNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(jsonNode.isObject()).thenReturn(true);
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenReturn(jsonNode);
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.get((String) any())).thenReturn(MissingNode.getInstance());
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(new Scanner("Source"));
        util.jsonMerge(arrayNode, arrayNode1);
        verify(arrayNode).get((String) any());
        verify(arrayNode).getNodeType();
        verify(jsonNode).getNodeType();
        verify(jsonNode).isObject();
        verify(arrayNode1).get((String) any());
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }

    @Test
    void testJsonMerge9() {

        Util util = new Util();
        JsonNode jsonNode = mock(JsonNode.class);
        when(jsonNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(jsonNode.isObject()).thenReturn(true);
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenReturn(jsonNode);
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.get((String) any())).thenThrow(new CustomException("Code", "An error occurred"));
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(new Scanner("Source"));
        assertThrows(CustomException.class, () -> util.jsonMerge(arrayNode, arrayNode1));
        verify(arrayNode).get((String) any());
        verify(arrayNode).getNodeType();
        verify(jsonNode).isObject();
        verify(arrayNode1).get((String) any());
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }

    @Test
    void testJsonMerge10() {


        Util util = new Util();
        ArrayNode arrayNode = mock(ArrayNode.class);
        when(arrayNode.get((String) any())).thenReturn(mock(JsonNode.class));
        when(arrayNode.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        ArrayNode arrayNode1 = mock(ArrayNode.class);
        when(arrayNode1.get((String) any())).thenReturn(MissingNode.getInstance());
        when(arrayNode1.getNodeType()).thenReturn(JsonNodeType.ARRAY);
        when(arrayNode1.fieldNames()).thenReturn(MappingIterator.emptyIterator());
        util.jsonMerge(arrayNode, arrayNode1);
        verify(arrayNode).getNodeType();
        verify(arrayNode1).getNodeType();
        verify(arrayNode1).fieldNames();
    }



    @Test
    void testGetIdsQueryForList() {

        Util util = new Util();
        HashSet<String> ownerIds = new HashSet<>();
        assertEquals("()", util.getIdsQueryForList(ownerIds, new ArrayList<>()));
    }

    @Test
    void testGetIdsQueryForList2() {

        Util util = new Util();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("(");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("( ?)", util.getIdsQueryForList(stringSet, objectList));
        assertEquals(1, objectList.size());
    }

    @Test
    void testGetIdsQueryForList3() {

        Util util = new Util();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet.add("(");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("( ?, ?)", util.getIdsQueryForList(stringSet, objectList));
        assertEquals(2, objectList.size());
    }
}

