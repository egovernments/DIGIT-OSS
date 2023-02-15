package org.egov.demand.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.HashSet;

import org.egov.demand.model.TaxHeadMasterCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;


class TaxHeadMasterQueryBuilderTest {

    @Test
    void testGetQuery() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria();
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  ORDER BY taxhead.validfrom,taxhead.code"
                        + " LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(searchTaxHead, objectList));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetQuery2() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        TaxHeadMasterCriteria taxHeadMasterCriteria = new TaxHeadMasterCriteria();
        taxHeadMasterCriteria.setTenantId("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  ORDER BY taxhead.validfrom,taxhead.code"
                        + " LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(taxHeadMasterCriteria, objectList));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetQuery4() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        HashSet<String> code = new HashSet<>();
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria("42",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                code, true, true, new HashSet<>());

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.service = ? AND"
                        + " taxhead.name like ? AND taxhead.category = ? AND taxhead.isActualDemand = ? AND taxhead.isDebit = ?"
                        + " ORDER BY taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(searchTaxHead, objectList));
        assertEquals(6, objectList.size());
    }


    @Test
    void testGetQuery5() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        TaxHeadMasterCriteria taxHeadMasterCriteria = new TaxHeadMasterCriteria();
        taxHeadMasterCriteria.setService(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.service = ? ORDER BY"
                        + " taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(taxHeadMasterCriteria, objectList));
        assertEquals(2, objectList.size());
    }

    @Test
    void testGetQuery6() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        TaxHeadMasterCriteria taxHeadMasterCriteria = new TaxHeadMasterCriteria();
        taxHeadMasterCriteria.setName(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.name like ? ORDER BY"
                        + " taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(taxHeadMasterCriteria, objectList));
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetQuery7() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet
                .add("SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ");
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria("42",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                stringSet, true, true, new HashSet<>());

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.service = ? AND"
                        + " taxhead.name like ? AND taxhead.code IN ('SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS"
                        + " taxheadTenantid, taxhead.service taxheadService, taxhead.createdby AS taxcreatedby, taxhead.createdtime"
                        + " AS taxcreatedtime, taxhead.lAStmodifiedby AS taxlAStmodifiedby, taxhead.lAStmodifiedtime AS"
                        + " taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid AS glCodeTenantId,glcode.service AS"
                        + " glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime AS glcreatedtime, glcode.lastmodifiedby"
                        + " AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime FROM egbs_taxheadmaster taxhead"
                        + " LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead and taxhead.tenantid=glcode"
                        + ".tenantid  WHERE taxhead.tenantId = ? ') AND taxhead.category = ? AND taxhead.isActualDemand = ? AND"
                        + " taxhead.isDebit = ? ORDER BY taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(searchTaxHead, objectList));
        assertEquals(6, objectList.size());
    }


    @Test
    void testGetQuery8() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        stringSet
                .add("SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ");
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria("42",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                stringSet, true, true, new HashSet<>());

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.service = ? AND"
                        + " taxhead.name like ? AND taxhead.code IN ('SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS"
                        + " taxheadTenantid, taxhead.service taxheadService, taxhead.createdby AS taxcreatedby, taxhead.createdtime"
                        + " AS taxcreatedtime, taxhead.lAStmodifiedby AS taxlAStmodifiedby, taxhead.lAStmodifiedtime AS"
                        + " taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid AS glCodeTenantId,glcode.service AS"
                        + " glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime AS glcreatedtime, glcode.lastmodifiedby"
                        + " AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime FROM egbs_taxheadmaster taxhead"
                        + " LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead and taxhead.tenantid=glcode"
                        + ".tenantid  WHERE taxhead.tenantId = ? ','foo') AND taxhead.category = ? AND taxhead.isActualDemand ="
                        + " ? AND taxhead.isDebit = ? ORDER BY taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(searchTaxHead, objectList));
        assertEquals(6, objectList.size());
    }


    @Test
    void testGetQuery9() {
        TaxHeadMasterQueryBuilder actualTaxHeadMasterQueryBuilder = new TaxHeadMasterQueryBuilder();
        HashSet<String> stringSet = new HashSet<>();
        stringSet
                .add("SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ");
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria("42",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ? ",
                new HashSet<>(), true, true, stringSet);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
                        + " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS"
                        + " taxlAStmodifiedby, taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid"
                        + " AS glCodeTenantId,glcode.service AS glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime"
                        + " AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime"
                        + " FROM egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead"
                        + " and taxhead.tenantid=glcode.tenantid  WHERE taxhead.tenantId = ?  AND taxhead.service = ? AND"
                        + " taxhead.name like ? AND taxhead.id IN ('SELECT *,taxhead.id AS taxheadId, taxhead.tenantid AS"
                        + " taxheadTenantid, taxhead.service taxheadService, taxhead.createdby AS taxcreatedby, taxhead.createdtime"
                        + " AS taxcreatedtime, taxhead.lAStmodifiedby AS taxlAStmodifiedby, taxhead.lAStmodifiedtime AS"
                        + " taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid AS glCodeTenantId,glcode.service AS"
                        + " glCodeService, glcode.createdby AS glcreatedby, glcode.createdtime AS glcreatedtime, glcode.lastmodifiedby"
                        + " AS gllastmodifiedby, glcode.lastmodifiedtime AS gllastmodifiedtime FROM egbs_taxheadmaster taxhead"
                        + " LEFT OUTER Join egbs_glcodemaster glcode  ON taxhead.code=glcode.taxhead and taxhead.tenantid=glcode"
                        + ".tenantid  WHERE taxhead.tenantId = ? ') AND taxhead.category = ? AND taxhead.isActualDemand = ? AND"
                        + " taxhead.isDebit = ? ORDER BY taxhead.validfrom,taxhead.code LIMIT ?",
                actualTaxHeadMasterQueryBuilder.getQuery(searchTaxHead, objectList));
        assertEquals(6, objectList.size());
    }
}

