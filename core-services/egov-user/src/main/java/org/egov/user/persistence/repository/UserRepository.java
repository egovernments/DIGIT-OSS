package org.egov.user.persistence.repository;

import lombok.extern.slf4j.Slf4j;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.BloodGroup;
import org.egov.user.domain.model.enums.Gender;
import org.egov.user.domain.model.enums.GuardianRelation;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.persistence.dto.FailedLoginAttempt;
import org.egov.user.repository.builder.RoleQueryBuilder;
import org.egov.user.repository.builder.UserTypeQueryBuilder;
import org.egov.user.repository.rowmapper.UserResultSetExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.egov.user.repository.builder.UserTypeQueryBuilder.SELECT_FAILED_ATTEMPTS_BY_USER_SQL;
import static org.egov.user.repository.builder.UserTypeQueryBuilder.SELECT_NEXT_SEQUENCE_USER;
import static org.springframework.util.StringUtils.isEmpty;

@Repository
@Slf4j
public class UserRepository {

    private AddressRepository addressRepository;
    private AuditRepository auditRepository;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private JdbcTemplate jdbcTemplate;
    private UserTypeQueryBuilder userTypeQueryBuilder;
    private RoleRepository roleRepository;
    private UserResultSetExtractor userResultSetExtractor;

    @Autowired
    UserRepository(RoleRepository roleRepository, UserTypeQueryBuilder userTypeQueryBuilder,
                   AddressRepository addressRepository, UserResultSetExtractor userResultSetExtractor,
                   JdbcTemplate jdbcTemplate,
                   NamedParameterJdbcTemplate namedParameterJdbcTemplate, AuditRepository auditRepository) {
        this.addressRepository = addressRepository;
        this.roleRepository = roleRepository;
        this.userTypeQueryBuilder = userTypeQueryBuilder;
        this.userResultSetExtractor = userResultSetExtractor;
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.auditRepository = auditRepository;
    }

    /**
     * api will get the all users by userSearchCriteria.After that roles and
     * address are set in to the user object.
     *
     * @param userSearch
     * @return
     */
    public List<User> findAll(UserSearchCriteria userSearch) {
        final List<Object> preparedStatementValues = new ArrayList<>();
        boolean RoleSearchHappend = false;
        List<Long> userIds = new ArrayList<>();
        if (!isEmpty(userSearch.getRoleCodes()) && userSearch.getTenantId() != null) {
            userIds = findUsersWithRole(userSearch);
            RoleSearchHappend = true;
        }
        List<User> users = new ArrayList<>();
        if (RoleSearchHappend) {
            if (!CollectionUtils.isEmpty(userIds)) {
                if (CollectionUtils.isEmpty(userSearch.getId()))
                    userSearch.setId(userIds);
                else {
                    userSearch.setId(userSearch.getId().stream().filter(userIds::contains).collect(Collectors.toList()));
                    if (CollectionUtils.isEmpty(userSearch.getId()))
                        return users;
                }
                userSearch.setTenantId(null);
                userSearch.setRoleCodes(null);
            } else {
                return users;
            }
        }
        String queryStr = userTypeQueryBuilder.getQuery(userSearch, preparedStatementValues);
        log.debug(queryStr);

        users = jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), userResultSetExtractor);
        enrichRoles(users);

        return users;
    }


    /**
     * get list of all userids with role in given tenant
     *
     * @param userSearch
     * @return
     */
    public List<Long> findUsersWithRole(UserSearchCriteria userSearch) {
        final List<Object> preparedStatementValues = new ArrayList<>();
        List<Long> usersIds = new ArrayList<>();
        String queryStr = userTypeQueryBuilder.getQueryUserRoleSearch(userSearch, preparedStatementValues);
        log.debug(queryStr);

        usersIds = jdbcTemplate.queryForList(queryStr, preparedStatementValues.toArray(), Long.class);

        return usersIds;
    }


    /**
     * Api will check user is present or not with userName And tenantId
     *
     * @param userName
     * @param tenantId
     * @return
     */
    public boolean isUserPresent(String userName, String tenantId, UserType userType) {

        String query = userTypeQueryBuilder.getUserPresentByUserNameAndTenant();

        final Map<String, Object> parametersMap = new HashMap<String, Object>();
        parametersMap.put("userName", userName);
        parametersMap.put("tenantId", tenantId);
        parametersMap.put("userType", userType.toString());

        int count = namedParameterJdbcTemplate.queryForObject(query, parametersMap, Integer.class);

        return count > 0;
    }

    /**
     * this api will create the user.
     *
     * @param user
     * @return
     */
    public User create(User user) {
        validateAndEnrichRoles(Collections.singletonList(user));
        final Long newId = getNextSequence();
        user.setId(newId);
        user.setUuid(UUID.randomUUID().toString());
        user.setCreatedDate(new Date());
        user.setLastModifiedDate(new Date());
        user.setCreatedBy(user.getLoggedInUserId());
        user.setLastModifiedBy(user.getLoggedInUserId());
        final User savedUser = save(user);
        if (user.getRoles().size() > 0) {
            saveUserRoles(user);
        }
        final Address savedCorrespondenceAddress = saveAddress(user.getCorrespondenceAddress(), savedUser.getId(),
                savedUser.getTenantId());
        final Address savedPermanentAddress = saveAddress(user.getPermanentAddress(), savedUser.getId(),
                savedUser.getTenantId());
        savedUser.setPermanentAddress(savedPermanentAddress);
        savedUser.setCorrespondenceAddress(savedCorrespondenceAddress);
        return savedUser;
    }

    /**
     * api will update the user details.
     *
     * @param user
     * @param uuid 
     * @param  
     * @return
     */
    public void update(final User user, User oldUser, long userId, String uuid) {


        Map<String, Object> updateuserInputs = new HashMap<>();

        updateuserInputs.put("username", oldUser.getUsername());
        updateuserInputs.put("type", oldUser.getType().toString());
        updateuserInputs.put("tenantid", oldUser.getTenantId());
        updateuserInputs.put("AadhaarNumber", user.getAadhaarNumber());

        if (isNull(user.getAccountLocked()))
            updateuserInputs.put("AccountLocked", oldUser.getAccountLocked());
        else
            updateuserInputs.put("AccountLocked", user.getAccountLocked());

        if (isNull(user.getAccountLockedDate()))
            updateuserInputs.put("AccountLockedDate", oldUser.getAccountLockedDate());
        else
            updateuserInputs.put("AccountLockedDate", user.getAccountLockedDate());

        updateuserInputs.put("Active", user.getActive());
        updateuserInputs.put("AltContactNumber", user.getAltContactNumber());

        List<Enum> bloodGroupEnumValues = Arrays.asList(BloodGroup.values());
        if (user.getBloodGroup() != null) {
            if (bloodGroupEnumValues.contains(user.getBloodGroup()))
                updateuserInputs.put("BloodGroup", user.getBloodGroup().toString());
            else
                updateuserInputs.put("BloodGroup", "");
        }
        else if (oldUser != null && oldUser.getBloodGroup() != null) {
            if (bloodGroupEnumValues.contains(oldUser.getBloodGroup()))
                updateuserInputs.put("BloodGroup", oldUser.getBloodGroup().toString());
            else
                updateuserInputs.put("BloodGroup", "");
        }
        else {
            updateuserInputs.put("BloodGroup", "");
        }

        if (user.getDob() != null) {
            updateuserInputs.put("Dob", user.getDob());
        } else {
            updateuserInputs.put("Dob", oldUser.getDob());
        }
        updateuserInputs.put("EmailId", user.getEmailId());

        if (user.getGender() != null) {
            if (Gender.FEMALE.toString().equals(user.getGender().toString())) {
                updateuserInputs.put("Gender", 1);
            } else if (Gender.MALE.toString().equals(user.getGender().toString())) {
                updateuserInputs.put("Gender", 2);
            } else if (Gender.OTHERS.toString().equals(user.getGender().toString())) {
                updateuserInputs.put("Gender", 3);
            } else if (Gender.TRANSGENDER.toString().equals(user.getGender().toString())) {
                updateuserInputs.put("Gender", 4); 
            } else {
                updateuserInputs.put("Gender", 0);
            }
        } else {
            updateuserInputs.put("Gender", 0);
        }
        updateuserInputs.put("Guardian", user.getGuardian());

        List<Enum> enumValues = Arrays.asList(GuardianRelation.values());
        if (user.getGuardianRelation() != null) {
            if(enumValues.contains(user.getGuardianRelation()))
                updateuserInputs.put("GuardianRelation", user.getGuardianRelation().toString());
            else {
                updateuserInputs.put("GuardianRelation", "");
            }
            
        } else {
            updateuserInputs.put("GuardianRelation", "");
        }
        updateuserInputs.put("IdentificationMark", user.getIdentificationMark());
        updateuserInputs.put("Locale", user.getLocale());
        if (null != user.getMobileNumber())
            updateuserInputs.put("MobileNumber", user.getMobileNumber());
        else
            updateuserInputs.put("MobileNumber", oldUser.getMobileNumber());
        updateuserInputs.put("Name", user.getName());
        updateuserInputs.put("Pan", user.getPan());

        if (!isEmpty(user.getPassword()))
            updateuserInputs.put("Password", user.getPassword());
        else
            updateuserInputs.put("Password", oldUser.getPassword());

        if (oldUser != null && user.getPhoto() != null && user.getPhoto().contains("http"))
            updateuserInputs.put("Photo", oldUser.getPhoto());
        else
            updateuserInputs.put("Photo", user.getPhoto());

        if (null != user.getPasswordExpiryDate())
            updateuserInputs.put("PasswordExpiryDate", user.getPasswordExpiryDate());
        else
            updateuserInputs.put("PasswordExpiryDate", oldUser.getPasswordExpiryDate());
        updateuserInputs.put("Salutation", user.getSalutation());
        updateuserInputs.put("Signature", user.getSignature());
        updateuserInputs.put("Title", user.getTitle());


        List<Enum> userTypeEnumValues = Arrays.asList(UserType.values());
        if (user.getType() != null) {
            if (userTypeEnumValues.contains(user.getType()))
                updateuserInputs.put("Type", user.getType().toString());
            else {
                updateuserInputs.put("Type", "");
            }
        }
        else {
            updateuserInputs.put("Type", oldUser.getType().toString());
        }

        updateuserInputs.put("alternatemobilenumber", user.getAlternateMobileNumber());

        updateuserInputs.put("LastModifiedDate", new Date());
        updateuserInputs.put("LastModifiedBy", userId );
        
        updateAuditDetails(oldUser, userId, uuid);

        namedParameterJdbcTemplate.update(userTypeQueryBuilder.getUpdateUserQuery(), updateuserInputs);
        if (user.getRoles() != null && !CollectionUtils.isEmpty(user.getRoles()) && !oldUser.getRoles().equals(user.getRoles())) {
            validateAndEnrichRoles(Collections.singletonList(user));
            updateRoles(user);
        }
        if (user.getPermanentAndCorrespondenceAddresses() != null) {
            addressRepository.update(user.getPermanentAndCorrespondenceAddresses(), user.getId(), user.getTenantId());
        }
    }

	public void fetchFailedLoginAttemptsByUser(String uuid) {
        fetchFailedAttemptsByUserAndTime(uuid, 0L);
    }

    public List<FailedLoginAttempt> fetchFailedAttemptsByUserAndTime(String uuid, long attemptStartDate) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("user_uuid", uuid);
        params.put("attempt_date", attemptStartDate);

//		RowMapper<FailedLoginAttempt> rowMapper = (rs, rowNum) -> {
//			FailedLoginAttempt failedLoginAttempt = new FailedLoginAttempt();
//			failedLoginAttempt.setUserUuid(rs.getString("user_uuid"));
//			failedLoginAttempt.setIp(rs.getString("ip"));
//			failedLoginAttempt.setAttemptDate(rs.getLong("attempt_date"));
//			return failedLoginAttempt;
//		};

        return namedParameterJdbcTemplate.query(SELECT_FAILED_ATTEMPTS_BY_USER_SQL, params,
                new BeanPropertyRowMapper<>(FailedLoginAttempt.class));

    }

    public FailedLoginAttempt insertFailedLoginAttempt(FailedLoginAttempt failedLoginAttempt) {
        Map<String, Object> inputs = new HashMap<>();
        inputs.put("user_uuid", failedLoginAttempt.getUserUuid());
        inputs.put("ip", failedLoginAttempt.getIp());
        inputs.put("attempt_date", failedLoginAttempt.getAttemptDate());
        inputs.put("active", failedLoginAttempt.isActive());

        namedParameterJdbcTemplate.update(UserTypeQueryBuilder.INSERT_FAILED_ATTEMPTS_SQL, inputs);

        return failedLoginAttempt;
    }

    public void resetFailedLoginAttemptsForUser(String uuid) {

        namedParameterJdbcTemplate.update(UserTypeQueryBuilder.UPDATE_FAILED_ATTEMPTS_SQL,
                Collections.singletonMap("user_uuid", uuid));
    }


    /**
     * Fetch roles by role codes
     *
     * @param roleCodes role code for which roles need to be retrieved
     * @param tenantId  tenant id of the roles
     * @return enriched roles
     */
    private Set<Role> fetchRolesByCode(Set<String> roleCodes, String tenantId) {


        Set<Role> validatedRoles = roleRepository.findRolesByCode(roleCodes, tenantId);

        return validatedRoles;
    }

    private void validateAndEnrichRoles(List<User> users) {

        if (users.isEmpty())
            return;

        Map<String, Role> roleCodeMap = fetchRolesFromMdms(users);

        for (User user : users) {
            if (!isNull(user.getRoles())) {
                for (Role role : user.getRoles()) {
                    if (roleCodeMap.containsKey(role.getCode())) {
                        role.setDescription(roleCodeMap.get(role.getCode()).getDescription());
                        role.setName(roleCodeMap.get(role.getCode()).getName());
                        if (isNull(role.getTenantId()))
                            role.setTenantId(user.getTenantId());
                    } else {
                        log.error("Role : {} is invalid", role);
                        throw new CustomException("INVALID_ROLE", "Unable to validate role from MDMS");
                    }
                }
            }
        }
    }

    private void enrichRoles(List<User> users) {

        if (users.isEmpty())
            return;

        Map<String, Role> roleCodeMap = fetchRolesFromMdms(users);

        for (User user : users) {
            if (!isNull(user.getRoles())) {
                for (Role role : user.getRoles()) {
                    if (roleCodeMap.containsKey(role.getCode())) {
                        role.setDescription(roleCodeMap.get(role.getCode()).getDescription());
                        role.setName(roleCodeMap.get(role.getCode()).getName());
                    }
                }
            }
        }
    }

    private Map<String, Role> fetchRolesFromMdms(List<User> users) {

        Set<String> roleCodes = new HashSet<>();

        for (User user : users) {
            if (!isNull(user.getRoles()) && !user.getRoles().isEmpty()) {
                for (Role role : user.getRoles())
                    roleCodes.add(role.getCode());
            }
        }

        if (roleCodes.isEmpty())
            return Collections.emptyMap();

        Set<Role> validatedRoles = fetchRolesByCode(roleCodes, getStateLevelTenant(users.get(0).getTenantId()));

        Map<String, Role> roleCodeMap = new HashMap<>();

        for (Role validatedRole : validatedRoles)
            roleCodeMap.put(validatedRole.getCode(), validatedRole);

        return roleCodeMap;
    }


    /**
     * api will do the mapping between user and role.
     *
     * @param entityUser
     */
    private void saveUserRoles(User entityUser) {
        List<Map<String, Object>> batchValues = new ArrayList<>(entityUser.getRoles().size());

        for (Role role : entityUser.getRoles()) {
            batchValues.add(
                    new MapSqlParameterSource("role_code", role.getCode())
                            .addValue("role_tenantid", role.getTenantId())
                            .addValue("user_id", entityUser.getId())
                            .addValue("user_tenantid", entityUser.getTenantId())
                            .addValue("lastmodifieddate", new Date())
                            .getValues());
        }
        namedParameterJdbcTemplate.batchUpdate(RoleQueryBuilder.INSERT_USER_ROLES,
                batchValues.toArray(new Map[entityUser.getRoles().size()]));
    }

    /**
     * api will persist the user.
     *
     * @param entityUser
     * @return
     */
    private User save(User entityUser) {

        Map<String, Object> userInputs = new HashMap<String, Object>();

        userInputs.put("id", entityUser.getId());
        userInputs.put("uuid", entityUser.getUuid());
        userInputs.put("tenantid", entityUser.getTenantId());
        userInputs.put("salutation", entityUser.getSalutation());
        userInputs.put("dob", entityUser.getDob());
        userInputs.put("locale", entityUser.getLocale());
        userInputs.put("username", entityUser.getUsername());
        userInputs.put("password", entityUser.getPassword());
        userInputs.put("pwdexpirydate", entityUser.getPasswordExpiryDate());
        userInputs.put("mobilenumber", entityUser.getMobileNumber());
        userInputs.put("altcontactnumber", entityUser.getAltContactNumber());
        userInputs.put("emailid", entityUser.getEmailId());
        userInputs.put("active", entityUser.getActive());
        userInputs.put("name", entityUser.getName());

        if (Gender.FEMALE.equals(entityUser.getGender())) {
            userInputs.put("gender", 1);
        } else if (Gender.MALE.equals(entityUser.getGender())) {
            userInputs.put("gender", 2);
        } else if (Gender.OTHERS.equals(entityUser.getGender())) {
            userInputs.put("gender", 3);
        } else if (Gender.TRANSGENDER.equals(entityUser.getGender())) {
            userInputs.put("gender", 4);
        } else {
            userInputs.put("gender", 0);
        }

        userInputs.put("pan", entityUser.getPan());
        userInputs.put("aadhaarnumber", entityUser.getAadhaarNumber());

        List<Enum> userTypeEnumValues = Arrays.asList(UserType.values());
        if (entityUser.getType() != null) {
            if (userTypeEnumValues.contains(entityUser.getType()))
                userInputs.put("type", entityUser.getType().toString());
            else {
                userInputs.put("type", "");
            }
        }
        else {
            userInputs.put("type", "");
        }

        List<Enum> enumValues = Arrays.asList(GuardianRelation.values());
        userInputs.put("guardian", entityUser.getGuardian());
        if (entityUser.getGuardianRelation() != null) {
            if (enumValues.contains(entityUser.getGuardianRelation()))
                userInputs.put("guardianrelation", entityUser.getGuardianRelation().toString());
            else {
                userInputs.put("guardianrelation", "");
            }
        }
        else {
            userInputs.put("guardianrelation", "");
        }
        userInputs.put("signature", entityUser.getSignature());
        userInputs.put("accountlocked", entityUser.getAccountLocked());


        List<Enum> bloodGroupEnumValues = Arrays.asList(BloodGroup.values());
        if(entityUser.getBloodGroup() != null){
            if (bloodGroupEnumValues.contains(entityUser.getBloodGroup()))
                userInputs.put("bloodgroup", entityUser.getBloodGroup().toString());
            else {
                userInputs.put("bloodgroup", "");
            }
        }
        else {
            userInputs.put("bloodgroup", "");
        }

        userInputs.put("photo", entityUser.getPhoto());
        userInputs.put("identificationmark", entityUser.getIdentificationMark());
        userInputs.put("createddate", entityUser.getCreatedDate());
        userInputs.put("lastmodifieddate", entityUser.getLastModifiedDate());
        userInputs.put("createdby", entityUser.getLoggedInUserId());
        userInputs.put("lastmodifiedby", entityUser.getLoggedInUserId());
        userInputs.put("alternatemobilenumber", entityUser.getAlternateMobileNumber());

        namedParameterJdbcTemplate.update(userTypeQueryBuilder.getInsertUserQuery(), userInputs);
        return entityUser;
    }

    /**
     * This api will return the next generate sequence of eg_user
     *
     * @return
     */
    private Long getNextSequence() {
        return jdbcTemplate.queryForObject(SELECT_NEXT_SEQUENCE_USER, Long.class);
    }

    /**
     * This api will save addresses for particular user.
     *
     * @param address
     * @param userId
     * @param tenantId
     * @return
     */
    private Address saveAddress(Address address, Long userId, String tenantId) {
        if (address != null) {
            addressRepository.create(address, userId, tenantId);
            return address;
        }
        return null;
    }


    /**
     * api will update the user Roles.
     *
     * @param user
     */
    private void updateRoles(User user) {
        Map<String, Object> roleInputs = new HashMap<String, Object>();
        roleInputs.put("user_id", user.getId());
        roleInputs.put("user_tenantid", user.getTenantId());
        namedParameterJdbcTemplate.update(RoleQueryBuilder.DELETE_USER_ROLES, roleInputs);
        saveUserRoles(user);
    }

    private String getStateLevelTenant(String tenantId) {
        return tenantId.split("\\.")[0];
    }

	
	private void updateAuditDetails(User oldUser, long userId, String uuid) {
		auditRepository.auditUser(oldUser,userId,uuid);
		
	}

}
