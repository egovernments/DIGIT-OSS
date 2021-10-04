package org.egov.user.persistence.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.user.domain.model.AuditMobileNumber;
import org.egov.user.domain.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

// CRUD operations for the primary mobile number audit table.

@Repository
public class AuditRepository {
	
	public static final String INSERT_AUDIT_DETAILS = "insert into eg_user_audit (uuid,createdby,createdtime,lastmodifiedby,lastmodifiedtime,mobilenumber) "
            + "values(:uuid,:createdby,:createdtime,:lastmodifiedby,:lastmodifiedtime,:mobilenumber)";
	
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private JdbcTemplate jdbcTemplate;

    public AuditRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public void create(User dummyUser, User user ) {
    	Map<String, Object> auditInputs = new HashMap<String, Object>();
    	
    	auditInputs.put("uuid", user.getUuid());
    	auditInputs.put("createdby", user.getLoggedInUserId());
    	auditInputs.put("createdtime", new Date());
    	auditInputs.put("lastmodifiedby", user.getLoggedInUserId());
    	auditInputs.put("lastmodifiedtime", new Date());
    	auditInputs.put("mobilenumber", dummyUser.getMobileNumber());
    	
    	namedParameterJdbcTemplate.update(INSERT_AUDIT_DETAILS, auditInputs); 
    	
    }
    
    public void update(User dummyUser, User user, User existingUser) {
    	
    	if (existingUser.getMobileNumber().equalsIgnoreCase(dummyUser.getMobileNumber())) {
    		return;
    	}
    	
    	Set <AuditMobileNumber> existingAudit = existingUser.getAudittrail();
    	List <AuditMobileNumber> auditlist = new ArrayList<AuditMobileNumber>();
    	
    	for(AuditMobileNumber entry : existingAudit) {
    		auditlist.add(entry);
    	}
    	
    	if(existingAudit==null || existingAudit.size()==0) {
    		create(dummyUser,user);
    	}
    	
    	else {
    		Map<String, Object> auditInputs = new HashMap<String, Object>();
        	
        	auditInputs.put("uuid", user.getUuid());
        	auditInputs.put("createdby", Integer.valueOf(auditlist.get(0).getCreatedby()));
        	auditInputs.put("createdtime", auditlist.get(0).getCreatedtime());
        	auditInputs.put("lastmodifiedby",user.getLoggedInUserId() );
        	auditInputs.put("lastmodifiedtime", new Date());
        	auditInputs.put("mobilenumber", dummyUser.getMobileNumber());
        	
        	namedParameterJdbcTemplate.update(INSERT_AUDIT_DETAILS, auditInputs); 
    		
    	}
    	
    }

	
    
    
	

}
