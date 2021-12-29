package org.egov.common.utils;

import java.util.regex.Pattern;

import org.egov.common.exception.InvalidTenantIdException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Configuration
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MultiStateInstanceUtil {

    // central-instance configs
	public static String SCHEMA_REPLACE_STRING = "{schema}";
    /*
     * Represents the length of the tenantId array when it's split by "."
     * 
     * if the array length is equal or lesser than, then the tennatId belong to state level
     * 
     * else it's tenant level
     */
    @Value("${state.level.tenantid.length:1}")
    private Integer stateLevelTenantIdLength;
    
    /*
     * Boolean field informing whether the deployed server is a multi-state/central-instance 
     * 
     */
    @Value("${is.environment.central.instance:false}")
    private Boolean isEnvironmentCentralInstance;
    
    /*
     * Index in which to find the schema name in a tenantId split by "."
     */
    @Value("${state.schema.index.position.tenantid:1}")
    private Integer stateSchemaIndexPositionInTenantId;
    
	/**
	 * Method to fetch the state name from the tenantId
	 * 
	 * @param query
	 * @param tenantId
	 * @return
	 */
	public String replaceSchemaPlaceholder(String query, String tenantId) throws InvalidTenantIdException {

		String finalQuery = null;
		if (tenantId.contains(".") && getIsEnvironmentCentralInstance()) {

			if (stateSchemaIndexPositionInTenantId >= tenantId.length()) {
				throw new InvalidTenantIdException(
						"The tenantId length is smaller than the defined schema index in tenantId for central instance");
			}
			String schemaName = tenantId.split("\\.")[getStateSchemaIndexPositionInTenantId()];
			finalQuery = query.replaceAll("(?i)" + Pattern.quote(SCHEMA_REPLACE_STRING), schemaName);
		} else {
			finalQuery = query.replaceAll("(?i)" + Pattern.quote(SCHEMA_REPLACE_STRING.concat(".")), "");
		}
		return finalQuery;
	}
	
	/**
	 * Method to determine if the given tenantId belong to tenant or state level in
	 * the current environment
	 * 
	 * @param tenantId
	 * @return
	 */
	public Boolean isTenantIdStateLevel(String tenantId) {

		if (getIsEnvironmentCentralInstance()) {

			int tenantLevel = tenantId.split("\\.").length;
			return tenantLevel <= stateLevelTenantIdLength;
		} else {
			/*
			 * if the instance is not multi-state/central-instance then tenant is always
			 * two level
			 * 
			 * if tenantId contains "." then it is tenant level
			 */
			return !tenantId.contains(".");
		}
	}
	
	/**
	 * For central instance if the tenantId size is lesser than state level
	 * length the same will be returned without splitting
	 * 
	 * if the tenant-id is longer than the given stateTenantlength then the length of tenant-id
	 * till state-level index will be returned 
	 * (for example if statetenantlength is 1 and tenant-id is 'in.statea.tenantx'. the returned tenant-id will be in.statea)
	 * 
	 * @param tenantId
	 * @return
	 */
	public String getStateLevelTenant(String tenantId) {

		String[] tenantArray = tenantId.split("\\.");
		String stateTenant = tenantArray[0];

		if (getIsEnvironmentCentralInstance()) {
			if (getStateLevelTenantIdLength() < tenantArray.length) {
				for (int i = 1; i < getStateLevelTenantIdLength(); i++)
					stateTenant = stateTenant.concat(".").concat(tenantArray[i]);
			} else {
				stateTenant = tenantId;
			}
		}
		return stateTenant;
	}
	
	/**
	 * method to prefix the state specific tag to the topic names
	 * 
	 * @param tenantId
	 * @param topic
	 * @return
	 */
	public String getStateSpecificTopicName(String tenantId, String topic) {
		
		String updatedTopic = topic;
		if (getIsEnvironmentCentralInstance()) {

			String[] tenants = tenantId.split("\\.");
			if (tenants.length > 1)
				updatedTopic = tenants[stateSchemaIndexPositionInTenantId].concat("-").concat(topic);
		}
		return updatedTopic;
	}
}
