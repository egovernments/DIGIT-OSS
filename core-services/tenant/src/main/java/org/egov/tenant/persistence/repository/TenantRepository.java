package org.egov.tenant.persistence.repository;


import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.tenant.domain.model.City;
import org.egov.tenant.domain.model.TenantSearchCriteria;
import org.egov.tenant.persistence.entity.Tenant;
import org.egov.tenant.persistence.rowmapper.TenantRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Repository
public class TenantRepository {
    private static final String TENANT_BASE_QUERY = "SELECT distinct id, code, name, description, domainurl, logoid, imageid, type, createdby, createddate, lastmodifiedby, lastmodifieddate,twitterurl,facebookurl,emailid,address,contactnumber,helplinenumber from tenant ";
/*    private static final String ALL_TENANT_QUERY = "SELECT distinct id, code, description, domainurl, logoid, imageid, type, createdby, createddate, lastmodifiedby, lastmodifieddate, from tenant ORDER BY ID";*/

    private static final String INSERT_QUERY = "INSERT INTO tenant (id, code, name, description, domainurl, logoid, imageid, type, createdby, createddate, lastmodifiedby, lastmodifieddate,twitterurl,facebookurl,emailid,address,contactnumber,helplinenumber) " +
        "VALUES (nextval('seq_tenant'), :code, :name, :description, :domainurl, :logoid, :imageid, :type, :createdby, :createddate, :lastmodifiedby, :lastmodifieddate, :twitterurl, :facebookurl,:emailid,:address,:contactnumber,:helplinenumber)";

    
    private static final String UPDATE_QUERY = "update tenant set name = :name, description = :description ,  domainurl = :domainurl, logoid = :logoid, imageid = :imageid, type = :type, lastmodifiedby = :lastmodifiedby, lastmodifieddate = :lastmodifieddate,twitterurl = :twitterurl,facebookurl = :facebookurl ,emailid = :emailid,address = :address ,contactnumber = :contactnumber,helplinenumber=:helplinenumber " +
            " where code = :code"; 

    
    
    private static final String COUNT_WITH_TENANT_CODE_QUERY = "SELECT COUNT(id) as count FROM tenant WHERE code = :code";

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private CityRepository cityRepository;

    public TenantRepository(CityRepository cityRepository, NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.cityRepository = cityRepository;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }


    public List<org.egov.tenant.domain.model.Tenant> find(TenantSearchCriteria tenantSearchCriteria) {
        List<Tenant> tenants = Collections.emptyList();
        if(CollectionUtils.isEmpty(tenantSearchCriteria.getTenantCodes()))
            tenants = getAllTenants();
        else
            tenants = getTenantsForGivenCodes(tenantSearchCriteria);

        return tenants.stream()
            .map(Tenant::toDomain)
            .map(this::getCityForTenant)
            .collect(Collectors.toList());
    }

    private List<Tenant> getAllTenants(){
        return namedParameterJdbcTemplate.query(TENANT_BASE_QUERY, new TenantRowMapper());
    }

    private List<Tenant> getTenantsForGivenCodes(TenantSearchCriteria tenantSearchCriteria){
        final Map<String, Object> parametersMap = new HashMap<String, Object>() {{
            put("code", tenantSearchCriteria.getTenantCodes());
        }};
        return namedParameterJdbcTemplate.query(TENANT_BASE_QUERY+" WHERE code in (:code) ORDER BY ID", parametersMap, new TenantRowMapper());
    }

    private org.egov.tenant.domain.model.Tenant getCityForTenant(org.egov.tenant.domain.model.Tenant tenant) {
        City city = cityRepository.find(tenant.getCode());
        tenant.setCity(city);
        return tenant;
    }

    @Transactional
    public org.egov.tenant.domain.model.Tenant save(final org.egov.tenant.domain.model.Tenant tenant) {
        final Map<String, Object> parametersMap = new HashMap<String, Object>() {{
            put(Tenant.CODE, tenant.getCode());
            put(Tenant.NAME, tenant.getName());
            put(Tenant.DESCRIPTION, tenant.getDescription());
            put(Tenant.DOMAIN_URL, tenant.getDomainUrl());
            put(Tenant.LOGO_ID, tenant.getLogoId());
            put(Tenant.IMAGE_ID, tenant.getImageId());
            put(Tenant.TYPE, tenant.getType().toString());
            put(Tenant.CREATED_BY, 1L);
            put(Tenant.CREATED_DATE, new Date());
            put(Tenant.LAST_MODIFIED_BY, 1L);
            put(Tenant.LAST_MODIFIED_DATE, new Date());
            put(Tenant.TWITTER_URL,tenant.getTwitterUrl());
            put(Tenant.FACEBOOK_URL,tenant.getFacebookUrl());
            put(Tenant.ADDRESS, tenant.getAddress());
            put(Tenant.CONTACTNUMBER, tenant.getContactNumber());
            put(Tenant.HELPLINENUMBER,tenant.getHelpLineNumber());
            put(Tenant.EMAILID,tenant.getEmailId());
            
        }};

        namedParameterJdbcTemplate.update(INSERT_QUERY, parametersMap);
        cityRepository.save(tenant.getCity(), tenant.getCode());
        return tenant;
    }
    
    @Transactional
    public org.egov.tenant.domain.model.Tenant update(final org.egov.tenant.domain.model.Tenant tenant) {
        final Map<String, Object> parametersMap = new HashMap<String, Object>() {{
           
        	put(Tenant.NAME, tenant.getName());
        	put(Tenant.DESCRIPTION, tenant.getDescription());
        	put(Tenant.DOMAIN_URL, tenant.getDomainUrl());
        	put(Tenant.LOGO_ID, tenant.getLogoId());
        	put(Tenant.IMAGE_ID, tenant.getImageId());
        	put(Tenant.TYPE, tenant.getType().toString());
        	put(Tenant.LAST_MODIFIED_BY, 1L);
        	put(Tenant.LAST_MODIFIED_DATE, new Date());
        	put(Tenant.TWITTER_URL,tenant.getTwitterUrl());
        	put(Tenant.FACEBOOK_URL,tenant.getFacebookUrl());
        	put(Tenant.EMAILID,tenant.getEmailId());
        	put(Tenant.ADDRESS, tenant.getAddress());
        	put(Tenant.CONTACTNUMBER, tenant.getContactNumber());
        	put(Tenant.HELPLINENUMBER,tenant.getHelpLineNumber());
        	put(Tenant.CODE, tenant.getCode());
        }};

        namedParameterJdbcTemplate.update(UPDATE_QUERY, parametersMap);
        cityRepository.update(tenant.getCity(), tenant.getCode());
        return tenant;
    }
    
    

    public Long isTenantPresent(String tenantCode) {

        final Map<String, Object> parameterMap = new HashMap<String, Object>() {{
        	put(Tenant.CODE, tenantCode);
        }};

        SqlRowSet sqlRowSet = namedParameterJdbcTemplate.queryForRowSet(COUNT_WITH_TENANT_CODE_QUERY, parameterMap);
        sqlRowSet.next();
        return sqlRowSet.getLong("count");
    }
}
