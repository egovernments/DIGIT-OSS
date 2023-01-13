
package org.egov.pt.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.EncryptionCount;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.user.User;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.repository.builder.PropertyQueryBuilder;
import org.egov.pt.repository.rowmapper.EncryptionCountRowMapper;
import org.egov.pt.repository.rowmapper.OpenPropertyRowMapper;
import org.egov.pt.repository.rowmapper.PropertyAuditRowMapper;
import org.egov.pt.repository.rowmapper.PropertyRowMapper;
import org.egov.pt.service.UserService;
import org.egov.pt.util.PropertyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.google.common.collect.Sets;

@Slf4j
@Repository
public class PropertyRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private PropertyQueryBuilder queryBuilder;

	@Autowired
	private PropertyRowMapper rowMapper;
	
	@Autowired
	private OpenPropertyRowMapper openRowMapper;
	
	@Autowired
	private PropertyAuditRowMapper auditRowMapper;
	
	@Autowired
	private PropertyUtil util;
	
    @Autowired
    private UserService userService;

	@Autowired
	private EncryptionCountRowMapper encryptionCountRowMapper;
    
	public List<String> getPropertyIds(Set<String> ownerIds, String tenantId) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyIdsQuery(ownerIds, tenantId, preparedStmtList);
		return jdbcTemplate.queryForList(query, preparedStmtList.toArray(), String.class);
	}

	public List<Property> getProperties(PropertyCriteria criteria, Boolean isApiOpen, Boolean isPlainSearch) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertySearchQuery(criteria, preparedStmtList, isPlainSearch, false);
		if (isApiOpen)
			return jdbcTemplate.query(query, preparedStmtList.toArray(), openRowMapper);
		else
			return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}

	public List<String> getPropertyIds(PropertyCriteria criteria) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertySearchQuery(criteria, preparedStmtList, false, true);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), new SingleColumnRowMapper<>());
	}

	public List<Property> getPropertiesForBulkSearch(PropertyCriteria criteria, Boolean isPlainSearch) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getPropertyQueryForBulkSearch(criteria, preparedStmtList, isPlainSearch);
		return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}

	private String createQuery(Set<String> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}

	public List<String> fetchIds(PropertyCriteria criteria, Boolean isPlainSearch) {
		
		List<Object> preparedStmtList = new ArrayList<>();
		String basequery = "select id from eg_pt_property";
		StringBuilder builder = new StringBuilder(basequery);
		if(isPlainSearch)
		{
			Set<String> tenantIds = criteria.getTenantIds();
			if(!ObjectUtils.isEmpty(tenantIds))
			{
				builder.append(" where tenantid IN (").append(createQuery(tenantIds)).append(")");
				addToPreparedStatement(preparedStmtList, tenantIds);
			}
		}
		else
		{
			if(!ObjectUtils.isEmpty(criteria.getTenantId()))
			{
				builder.append(" where tenantid=?");
				preparedStmtList.add(criteria.getTenantId());
			}
		}
		String orderbyClause = " order by lastmodifiedtime,id offset ? limit ?";
		builder.append(orderbyClause);
		preparedStmtList.add(criteria.getOffset());
		preparedStmtList.add(criteria.getLimit());
		return jdbcTemplate.query(builder.toString(), preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
	}
	/**
	 * Returns list of properties based on the given propertyCriteria with owner
	 * fields populated from user service
	 *
	 * @param criteria    PropertyCriteria on which to search properties
	 * @param requestInfo RequestInfo object of the request
	 * @return properties with owner information added from user service
	 */
	public List<Property> getPropertiesWithOwnerInfo(PropertyCriteria criteria, RequestInfo requestInfo, Boolean isInternal) {

		List<Property> properties;
		
		Boolean isOpenSearch = isInternal ? false : util.isPropertySearchOpen(requestInfo.getUserInfo());

		if (criteria.isAudit() && !isOpenSearch) {
			properties = getPropertyAudit(criteria);
		} else {

			properties = getProperties(criteria, isOpenSearch, false);
		}
		if (CollectionUtils.isEmpty(properties))
			return Collections.emptyList();

		Set<String> ownerIds = properties.stream().map(Property::getOwners).flatMap(List::stream)
				.map(OwnerInfo::getUuid).collect(Collectors.toSet());

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(criteria.getTenantId(), requestInfo);
		userSearchRequest.setUuid(ownerIds);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		util.enrichOwner(userDetailResponse, properties, isOpenSearch);
		return properties;
	}
	
	private List<Property> getPropertyAudit(PropertyCriteria criteria) {

		String query = queryBuilder.getpropertyAuditQuery();
		return jdbcTemplate.query(query, criteria.getPropertyIds().toArray(), auditRowMapper);
	}


	/**
	 * 
	 * Method to enrich property search criteria with user based criteria info
	 * 
	 * If no info found based on user criteria boolean true will be returned so that empty list can be returned 
	 * 
	 * else returns false to continue the normal flow
	 * 
	 * The enrichment of object is done this way(instead of directly applying in the search query) to fetch multiple owners related to property at once
	 * 
	 * @param criteria
	 * @param requestInfo
	 * @return
	 */
	public Boolean enrichCriteriaFromUser(PropertyCriteria criteria, RequestInfo requestInfo) {
		
		Set<String> ownerIds = new HashSet<String>();
		
		if(!CollectionUtils.isEmpty(criteria.getOwnerIds()))
			ownerIds.addAll(criteria.getOwnerIds());
		criteria.setOwnerIds(null);
		
		String userTenant = criteria.getTenantId();
		if(criteria.getTenantId() == null)
			userTenant = requestInfo.getUserInfo().getTenantId();

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(userTenant, requestInfo);
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setName(criteria.getName());
		userSearchRequest.setUuid(ownerIds);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		if (CollectionUtils.isEmpty(userDetailResponse.getUser()))
			return true;

		// fetching property id from owner table and enriching criteria
		ownerIds.addAll(userDetailResponse.getUser().stream().map(User::getUuid).collect(Collectors.toSet()));
		
		if (criteria.getIsCitizen()!=null && criteria.getMobileNumber()!=null) {
			for (OwnerInfo user : userDetailResponse.getUser()) {
				if (user.getAlternatemobilenumber()!=null && user.getAlternatemobilenumber().equalsIgnoreCase(criteria.getMobileNumber())) {
					ownerIds.remove(user.getUuid());
				}
				
			}
		}
		

		// only used to eliminate property-ids which does not have the owner
		List<String> propertyIds = getPropertyIds(ownerIds, userTenant);

		// returning empty list if no property id found for user criteria
		if (CollectionUtils.isEmpty(propertyIds)) {

			return true;
		} else if (!CollectionUtils.isEmpty(criteria.getPropertyIds())) {

			// eliminating property Ids not matching with Ids found using user data

			Set<String> givenIds = criteria.getPropertyIds();

			givenIds.forEach(id -> {

				if (!propertyIds.contains(id))
					givenIds.remove(id);
			});

			if (CollectionUtils.isEmpty(givenIds))
				return true;
		} else {

			criteria.setPropertyIds(Sets.newHashSet(propertyIds));
		}
		criteria.setOwnerIds(ownerIds);
		return false;
	}

	public Integer getCount(PropertyCriteria propertyCriteria, RequestInfo requestInfo) {
		
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getPropertySearchQuery(propertyCriteria, preparedStmtList, false, false);
        Integer count =  jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
        return count;
    }

	/** Method to find the total count of applications present in dB */
	public Integer getTotalApplications(PropertyCriteria criteria) {
		List<Object> preparedStatement = new ArrayList<>();
		String query = queryBuilder.getTotalApplicationsCountQueryString(criteria, preparedStatement);
		if (query == null)
			return 0;
		Integer count = jdbcTemplate.queryForObject(query, preparedStatement.toArray(), Integer.class);
		return count;
	}
	
	private void addToPreparedStatement(List<Object> preparedStmtList, Set<String> ids) {
		ids.forEach(id -> {
			preparedStmtList.add(id);
		});
	}

	/* Method to find the last execution details in dB */
	public EncryptionCount getLastExecutionDetail(PropertyCriteria criteria) {

		List<Object> preparedStatement = new ArrayList<>();
		String query = queryBuilder.getLastExecutionDetail(criteria, preparedStatement);

		log.info("\nQuery executed:" + query);
		if (query == null)
			return null;
		EncryptionCount encryptionCount = jdbcTemplate.query(query, preparedStatement.toArray(), encryptionCountRowMapper);
		return encryptionCount;
	}

}
