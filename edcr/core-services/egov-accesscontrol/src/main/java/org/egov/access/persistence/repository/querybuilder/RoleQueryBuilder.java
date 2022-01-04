package org.egov.access.persistence.repository.querybuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RoleQueryBuilder {

	private static final Logger logger = LoggerFactory.getLogger(RoleQueryBuilder.class);

	public static String insertRoleQuery() {

		logger.info("RoleQueryBuilder : InsertRoleQuery");
		return "INSERT INTO eg_ms_role(name,code,description,createdby,createddate,lastmodifiedby,lastmodifieddate) values "
				+ "(:name,:code,:description,:createdby,:createddate,:lastmodifiedby,:lastmodifieddate)";
	}

	public static String updateRoleQuery() {
		logger.info("RoleQueryBuilder : updateRoleQuery");
		return "update eg_ms_role set code=:code,description=:description,lastmodifiedby=:lastmodifiedby,lastmodifieddate=:lastmodifieddate where name=:name";
	}

	public static String checkRoleNameDuplicationValidationErrors() {

		return "select code from eg_ms_role where name=:name";

	}

}
