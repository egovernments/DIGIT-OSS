package org.egov.tl.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.tl.web.models.*;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import static org.egov.tl.util.TLConstants.*;


@Component
public class TLRowMapper  implements ResultSetExtractor<List<TradeLicense>> {


    @Autowired
    private ObjectMapper mapper;



    public List<TradeLicense> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String, TradeLicense> tradeLicenseMap = new LinkedHashMap<>();

        while (rs.next()) {
            String id = rs.getString("tl_id");
            TradeLicense currentTradeLicense = tradeLicenseMap.get(id);
            String tenantId = rs.getString("tl_tenantId");

            if(currentTradeLicense == null){
                Long lastModifiedTime = rs.getLong("tl_lastModifiedTime");
                if(rs.wasNull()){lastModifiedTime = null;}

                Long commencementDate = (Long) rs.getObject("commencementdate");
                Long issuedDate = (Long) rs.getObject("issueddate");
                Long validFrom = (Long) rs.getObject("validfrom");
                Long validTo = (Long) rs.getObject("validto");
                Long applicationDate = (Long) rs.getObject("applicationdate");

                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("tl_createdBy"))
                        .createdTime(rs.getLong("tl_createdTime"))
                        .lastModifiedBy(rs.getString("tl_lastModifiedBy"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();

                currentTradeLicense = TradeLicense.builder().auditDetails(auditdetails)
                        .licenseNumber(rs.getString("licensenumber"))
                        .licenseType(TradeLicense.LicenseTypeEnum.fromValue(rs.getString("licensetype")))
                        .applicationType(TradeLicense.ApplicationTypeEnum.fromValue(rs.getString( "applicationType")))
                        .workflowCode(rs.getString("workflowCode"))
                        .oldLicenseNumber(rs.getString("oldlicensenumber"))
                        .applicationDate(applicationDate)
                        .applicationNumber(rs.getString("applicationnumber"))
                        .commencementDate(commencementDate)
                        .issuedDate(issuedDate)
                        .accountId(rs.getString("accountId"))
                        .financialYear(rs.getString("financialyear"))
                        .validFrom(validFrom)
                        .validTo(validTo)
                        .action(rs.getString("action"))
                        .status(rs.getString("status"))
                        .tenantId(tenantId)
                        .tradeName(rs.getString("tradeName"))
                        .propertyId(rs.getString("propertyid"))
                        .oldPropertyId(rs.getString("oldpropertyid"))
                        .businessService(rs.getString("businessservice"))
                        .fileStoreId(rs.getString("tl_fileStoreId"))
                        .id(id)
                        .build();

                tradeLicenseMap.put(id,currentTradeLicense);
            }
            addChildrenToProperty(rs, currentTradeLicense);

        }

        return new ArrayList<>(tradeLicenseMap.values());

    }



    private void addChildrenToProperty(ResultSet rs, TradeLicense tradeLicense) throws SQLException {

        String tenantId = tradeLicense.getTenantId();
        String tradeLicenseDetailId = rs.getString("tld_id");

        if(tradeLicense.getTradeLicenseDetail()==null){

            Boundary locality = Boundary.builder().code(rs.getString("locality"))
                    .build();

            Double latitude = (Double) rs.getObject("latitude");
            Double longitude = (Double) rs.getObject("longitude");

            Address address = Address.builder().addressId(rs.getString("addressId"))
                    .addressLine1(rs.getString("addressLine1"))
                    .addressLine2(rs.getString("addressLine2"))
                    .addressNumber(rs.getString("addressNumber"))
                    .buildingName(rs.getString("buildingName"))
                    .city(rs.getString("city"))
                    .detail(rs.getString("detail"))
                    .id(rs.getString("tl_ad_id"))
                    .landmark(rs.getString("landmark"))
                    .latitude(latitude)
                    .locality(locality)
                    .longitude(longitude)
                    .pincode(rs.getString("pincode"))
                    .doorNo(rs.getString("doorno"))
                    .street(rs.getString("street"))
                    .tenantId(tenantId)
                    .type(rs.getString("type"))
                    .build();

            Institution institution = null;
            if(rs.getString("instiid")!=null && rs.getBoolean("instiactive"))
            { institution = Institution.builder()
                    .id(rs.getString("instiid"))
                    .tenantId(rs.getString("institenantId"))
                    .name(rs.getString("name"))
                    .type(rs.getString("institutionType"))
                    .designation(rs.getString("designation"))
                    .active(rs.getBoolean("instiactive"))
                    .contactNo(rs.getString("insticontactno"))
                    .instituionName(rs.getString("instiinstituionname"))
                    .organisationRegistrationNo(rs.getString("instiorganisationregistrationno"))
                    .address(rs.getString("address"))
                    .build();
            }

            AuditDetails auditdetails = AuditDetails.builder()
                    .createdBy(rs.getString("tld_createdBy"))
                    .createdTime(rs.getLong("tld_createdTime"))
                    .lastModifiedBy(rs.getString("tld_lastModifiedBy"))
                    .lastModifiedTime(rs.getLong("tld_createdTime"))
                    .build();

            Double operationalArea = (Double) rs.getObject("operationalArea");
            Integer noOfEmployees = (Integer) rs.getObject("noOfEmployees");
            PGobject pgObj = (PGobject) rs.getObject("additionaldetail");
            try {
                TradeLicenseDetail tradeLicenseDetail = TradeLicenseDetail.builder()
                        .surveyNo(rs.getString("surveyno"))
                        .channel(TradeLicenseDetail.ChannelEnum.fromValue(rs.getString("channel")))
                        .subOwnerShipCategory(rs.getString("subownershipcategory"))
                        .id(tradeLicenseDetailId)
                        .address(address)
                        .auditDetails(auditdetails)
                        .structureType(rs.getString("structureType"))
                        .operationalArea(operationalArea)
                        .noOfEmployees(noOfEmployees)
                        .adhocExemption(rs.getBigDecimal("adhocExemption"))
                        .adhocPenalty(rs.getBigDecimal("adhocPenalty"))
                        .adhocExemptionReason(rs.getString("adhocExemptionReason"))
                        .adhocPenaltyReason(rs.getString("adhocPenaltyReason"))
                        .institution(institution)
                        .build();

                if(pgObj!=null){
                    JsonNode additionalDetail = mapper.readTree(pgObj.getValue());
                    tradeLicenseDetail.setAdditionalDetail(additionalDetail);
                }

                tradeLicense.setTradeLicenseDetail(tradeLicenseDetail);
            }
            catch (IOException e){
                throw new CustomException("PARSING ERROR","The additionalDetail json cannot be parsed");
            }
        }

        if(rs.getString("tl_un_id")!=null && rs.getBoolean("tl_un_active")){
            TradeUnit tradeUnit = TradeUnit.builder()
                    .tradeType(rs.getString("tl_un_tradeType"))
                    .uom(rs.getString("tl_un_uom"))
                    .id(rs.getString("tl_un_id"))
                    .uomValue(rs.getString("tl_un_uomvalue"))
                    .tenantId(tenantId)
                    .active(rs.getBoolean("tl_un_active"))
                    .build();
            tradeLicense.getTradeLicenseDetail().addTradeUnitsItem(tradeUnit);
        }

        if(rs.getString("tl_acc_id")!=null && rs.getBoolean("tl_acc_active")) {
            Integer count = rs.getInt("count");
            if(rs.wasNull()){count = null;}
            Accessory accessory = Accessory.builder()
                    .accessoryCategory(rs.getString("accessoryCategory"))
                    .uom(rs.getString("tl_acc_uom"))
                    .id(rs.getString("tl_acc_id"))
                    .uomValue(rs.getString("tl_acc_uomvalue"))
                    .tenantId(tenantId)
                    .active(rs.getBoolean("tl_acc_active"))
                    .count(count)
                    .build();
            tradeLicense.getTradeLicenseDetail().addAccessoriesItem(accessory);
        }


        Document ownerDocument = Document.builder().id(rs.getString("ownerdocid"))
                .documentType(rs.getString("ownerdocType"))
                .fileStoreId(rs.getString("ownerfileStoreId"))
                .documentUid(rs.getString("ownerdocuid"))
                .active(rs.getBoolean("ownerdocactive"))
                .build();



        Boolean isPrimaryOwner = (Boolean) rs.getObject("isprimaryowner");
        Double ownerShipPercentage = (Double) rs.getObject("ownershippercentage") ;

        if(rs.getBoolean("useractive") && rs.getString("tlowner_uuid")!=null)
        {   OwnerInfo owner = OwnerInfo.builder()
                    .uuid(rs.getString("tlowner_uuid"))
                    .isPrimaryOwner(isPrimaryOwner)
                    .ownerType(rs.getString("ownerType"))
                    .ownerShipPercentage(ownerShipPercentage)
                    .relationship(OwnerInfo.RelationshipEnum.fromValue(rs.getString("relationship")))
                    .userActive(rs.getBoolean("useractive"))
                    .institutionId(rs.getString("institutionid"))
                    .build();
            tradeLicense.getTradeLicenseDetail().addOwnersItem(owner);
        }

        // Add owner document to the specific tradeLicense for which it was used
        String docuserid = rs.getString("docuserid");
        String doctradeLicenseDetailId = rs.getString("doctradelicensedetailid");
        if(tradeLicenseDetailId.equalsIgnoreCase(doctradeLicenseDetailId) && docuserid!=null
                && rs.getBoolean("ownerdocactive") && rs.getBoolean("useractive")) {
            tradeLicense.getTradeLicenseDetail().getOwners().forEach(ownerInfo -> {
                if (docuserid.equalsIgnoreCase(ownerInfo.getUuid()))
                    ownerInfo.addDocumentsItem(ownerDocument);
            });
        }

        if(rs.getString("tl_ap_doc_id")!=null && rs.getBoolean("tl_ap_doc_active")) {
            Document applicationDocument = Document.builder()
                    .documentType(rs.getString("tl_ap_doc_documenttype"))
                    .fileStoreId(rs.getString("tl_ap_doc_filestoreid"))
                    .id(rs.getString("tl_ap_doc_id"))
                    .tenantId(tenantId)
                    .active(rs.getBoolean("tl_ap_doc_active"))
                    .build();
            tradeLicense.getTradeLicenseDetail().addApplicationDocumentsItem(applicationDocument);
        }

        if(rs.getString("tl_ver_doc_id")!=null && rs.getBoolean("tl_ver_doc_active")) {
            Document verificationDocument = Document.builder()
                    .documentType(rs.getString("tl_ver_doc_documenttype"))
                    .fileStoreId(rs.getString("tl_ver_doc_filestoreid"))
                    .id(rs.getString("tl_ver_doc_id"))
                    .tenantId(tenantId)
                    .active(rs.getBoolean("tl_ver_doc_active"))
                    .build();
            tradeLicense.getTradeLicenseDetail().addVerificationDocumentsItem(verificationDocument);
        }
    }




}
