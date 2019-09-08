package org.egov.user.persistence.repository;

import static org.springframework.util.CollectionUtils.isEmpty;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.enums.AddressType;
import org.egov.user.repository.rowmapper.AddressRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AddressRepository {

	public static final String GET_ADDRESS_BY_USERID = "select * from eg_user_address where userid=:userId and tenantid =:tenantId";
	public static final String INSERT_ADDRESS_BYUSERID = "insert into eg_user_address (id,type,address,city,pincode,userid,tenantid,createddate,lastmodifieddate,createdby,lastmodifiedby) "
			+ "values(:id,:type,:address,:city,:pincode,:userid,:tenantid,:createddate,:lastmodifieddate,:createdby,:lastmodifiedby)";
	public static final String SELECT_NEXT_SEQUENCE = "select nextval('seq_eg_user_address')";
	public static final String DELETE_ADDRESSES = "delete from eg_user_address where id IN (:id)";
	public static final String DELETE_ADDRESS = "delete from eg_user_address where id=:id";
	public static final String UPDATE_ADDRESS_BYIDAND_TENANTID = "update eg_user_address set address=:address,city=:city,pincode=:pincode,lastmodifiedby=:lastmodifiedby,lastmodifieddate=:lastmodifieddate where userid=:userid and tenantid=:tenantid and type=:type";

	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	private JdbcTemplate jdbcTemplate;

	public AddressRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, JdbcTemplate jdbcTemplate) {
		this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * api will create the address for particular userId and tenantId.
	 * @param address
	 * @param userId
	 * @param tenantId
	 * @return
	 */
	public Address create(Address address, Long userId, String tenantId) {
		Map<String, Object> addressInputs = new HashMap<String, Object>();

		addressInputs.put("id", getNextSequence());
		addressInputs.put("type", address.getType().toString());
		addressInputs.put("address", address.getAddress());
		addressInputs.put("city", address.getCity());
		addressInputs.put("pincode", address.getPinCode());
		addressInputs.put("userid", userId);
		addressInputs.put("tenantid", tenantId);
		addressInputs.put("createddate", new Date());
		addressInputs.put("lastmodifieddate", new Date());
		addressInputs.put("createdby", userId);
		addressInputs.put("lastmodifiedby", address.getUserId());

		namedParameterJdbcTemplate.update(INSERT_ADDRESS_BYUSERID, addressInputs);
		return address;
	}

	/**
	 * api will give the next sequence generator for user-address.
	 * @return
	 */
	private Long getNextSequence() {
		return jdbcTemplate.queryForObject(SELECT_NEXT_SEQUENCE, Long.class);
	}

	/**
	 * api will update the address based on userId and tenantId
	 * @param domainAddresses
	 * @param userId
	 * @param tenantId
	 */
	public void update(List<Address> domainAddresses, Long userId, String tenantId) {

		final Map<String, Object> Map = new HashMap<String, Object>();
		Map.put("userId", userId);
		Map.put("tenantId", tenantId);

		List<Address> entityAddresses = namedParameterJdbcTemplate.query(GET_ADDRESS_BY_USERID, Map,
				new AddressRowMapper());

		if (isEmpty(domainAddresses) && isEmpty(entityAddresses)) {
			return;
		}

		conditionallyDeleteAllAddresses(domainAddresses, entityAddresses);
		deleteRemovedAddresses(domainAddresses, entityAddresses);
		createNewAddresses(domainAddresses, entityAddresses, userId, tenantId);
		updateAddresses(domainAddresses, entityAddresses, userId);
	}

	/**
	 * api will fetch the user address by userId And tenantId
	 * @param userId
	 * @param tenantId
	 * @return
	 */
	public List<Address> find(Long userId, String tenantId) {

		final Map<String, Object> Map = new HashMap<String, Object>();
		Map.put("userId", userId);
		Map.put("tenantId", tenantId);

		List<Address> addressList = namedParameterJdbcTemplate.query(GET_ADDRESS_BY_USERID, Map,
				new AddressRowMapper());
		return addressList;
	}

	/**
	 * api will update the user addresses.
	 * @param domainAddresses
	 * @param entityAddresses
	 * @param userId
	 */
	private void updateAddresses(List<Address> domainAddresses, List<Address> entityAddresses, Long userId) {
		Map<String, Address> typeToEntityAddressMap = toMap(entityAddresses);
		domainAddresses.forEach(address -> updateAddress(typeToEntityAddressMap, address, userId));
	}

	
	/**
	 * update the address for particular userId
	 * @param typeToEntityAddressMap
	 * @param address
	 * @param userId
	 */
	private void updateAddress(Map<String, Address> typeToEntityAddressMap, Address address, Long userId) {
		final Address matchingEntityAddress = typeToEntityAddressMap.getOrDefault(address.getType().name(), null);

		if (matchingEntityAddress == null) {
			return;
		}
		Map<String, Object> addressInputs = new HashMap<String, Object>();

		addressInputs.put("address", address.getAddress());
		addressInputs.put("type", address.getType().toString());
		addressInputs.put("city", address.getCity());
		addressInputs.put("pincode", address.getPinCode());
		addressInputs.put("userid", userId);
		addressInputs.put("tenantid", matchingEntityAddress.getTenantId());
		addressInputs.put("lastmodifieddate", new Date());
		addressInputs.put("lastmodifiedby", userId);

		namedParameterJdbcTemplate.update(UPDATE_ADDRESS_BYIDAND_TENANTID, addressInputs);
	}

	private Map<String, Address> toMap(List<Address> entityAddresses) {
		return entityAddresses.stream().collect(Collectors.toMap(Address::getAddressType, address -> address));
	}

	private void conditionallyDeleteAllAddresses(List<Address> domainAddresses, List<Address> entityAddresses) {
		if (domainAddresses == null) {
			deleteEntityAddresses(entityAddresses);
		}
	}

	private void deleteEntityAddresses(List<Address> entityAddresses) {

		List<Long> ids = entityAddresses.parallelStream().map(Address::getId).collect(Collectors.toList());
		final Map<String, Object> adressInputs = new HashMap<String, Object>();
		adressInputs.put("id", ids);
		if (ids != null && !ids.isEmpty()) {
			namedParameterJdbcTemplate.update(DELETE_ADDRESSES, adressInputs);
		}
	}

	private void deleteEntityAddress(Address adress) {

		final Map<String, Object> adressInputs = new HashMap<String, Object>();
		adressInputs.put("id", adress.getId());
		namedParameterJdbcTemplate.update(DELETE_ADDRESS, adressInputs);
	}

	private void deleteRemovedAddresses(List<Address> domainAddresses,
			List<Address> entityAddresses) {
		final List<String> addressTypesToRetain = getAddressTypesToRetain(domainAddresses);
		entityAddresses.stream().filter(address -> !addressTypesToRetain.contains(address.getType().name()))
				.forEach(address -> deleteEntityAddress(address));
	}

	private void createNewAddresses(List<Address> domainAddresses, List<Address> entityAddresses, Long userId,
			String tenantId) {
		final List<AddressType> addressTypesToCreate = getAddressTypesToCreate(domainAddresses, entityAddresses);
		domainAddresses.stream().filter(address -> addressTypesToCreate.contains(address.getType()))
				.forEach(address -> create(address, userId, tenantId));
	}

	private List<String> getAddressTypesToRetain(List<Address> domainAddresses) {
		return domainAddresses.stream().map(address -> address.getType().name()).collect(Collectors.toList());
	}

	private List<AddressType> getAddressTypesToCreate(List<Address> domainAddresses, List<Address> entityAddresses) {
		final List<String> entityAddressTypes = entityAddresses.stream().map(Address::getAddressType)
				.collect(Collectors.toList());

		return domainAddresses.stream().filter(address -> !entityAddressTypes.contains(address.getType().name()))
				.map(Address::getType).collect(Collectors.toList());
	}

}
