package org.egov.user.persistence.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.egov.user.domain.model.AuditAlternateNumber;
import org.egov.user.domain.model.AuditMobileNumber;
import org.egov.user.domain.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AlternateNumberRepository {
	
	public static final String INSERT_ALTERNATE_AUDIT_DETAILS = "insert into eg_user_alternate_audit (uuid,createdby,createdtime,lastmodifiedby,lastmodifiedtime,mobilenumber) "
            + "values(:uuid,:createdby,:createdtime,:lastmodifiedby,:lastmodifiedtime,:mobilenumber)";
	
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private JdbcTemplate jdbcTemplate;

    public AlternateNumberRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public void create(User user ) {
    	Map<String, Object> auditInputs = new HashMap<String, Object>();
    	
    	auditInputs.put("uuid", user.getUuid());
    	auditInputs.put("createdby", user.getLoggedInUserId());
    	auditInputs.put("createdtime", new Date());
    	auditInputs.put("lastmodifiedby", user.getLoggedInUserId());
    	auditInputs.put("lastmodifiedtime", new Date());
    	auditInputs.put("mobilenumber", user.getAlternateMobileNumber());
    	
    	namedParameterJdbcTemplate.update(INSERT_ALTERNATE_AUDIT_DETAILS, auditInputs); 
    	
    }

	public void update(User user, User existingUser) {
		// TODO Auto-generated method stub
		if (existingUser.getAlternateMobileNumber()!=null &&  user.getAlternateMobileNumber()!=null && existingUser.getAlternateMobileNumber().equalsIgnoreCase(user.getAlternateMobileNumber())) {
    		return;
    	}
    	
    	Set <AuditAlternateNumber> existingAudit = existingUser.getAuditAlternatetrail();
    	List <AuditAlternateNumber> auditlist = new ArrayList<AuditAlternateNumber>();
    	
    	for(AuditAlternateNumber entry : existingAudit) {
    		auditlist.add(entry);
    	}
    	
    	if(existingAudit==null || existingAudit.size()==0) {
    		create(user);
    	}
    	
    	else {
    		Map<String, Object> auditInputs = new HashMap<String, Object>();
        	
        	auditInputs.put("uuid", user.getUuid());
        	auditInputs.put("createdby", Integer.valueOf(auditlist.get(0).getCreatedby()));
        	auditInputs.put("createdtime", auditlist.get(0).getCreatedtime());
        	auditInputs.put("lastmodifiedby",user.getLoggedInUserId() );
        	auditInputs.put("lastmodifiedtime", new Date());
        	auditInputs.put("mobilenumber", user.getAlternateMobileNumber());
        	
        	namedParameterJdbcTemplate.update(INSERT_ALTERNATE_AUDIT_DETAILS, auditInputs); 
    		
    	}
		
		
	}

}
