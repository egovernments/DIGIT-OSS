package org.egov.commons.repository;

import static java.util.Comparator.comparingLong;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toCollection;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.egov.commons.model.*;
import org.egov.commons.repository.builder.BusinessDetailsQueryBuilder;
import org.egov.commons.repository.rowmapper.BusinessAccountDetailsRowMapper;
import org.egov.commons.repository.rowmapper.BusinessAccountSubledgerDetailsRowMapper;
import org.egov.commons.repository.rowmapper.BusinessDetailsCombinedRowMapper;
import org.egov.commons.repository.rowmapper.BusinessDetailsRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class BusinessDetailsRepository {
	@Autowired
	JdbcTemplate jdbcTemplate;
	@Autowired
	BusinessAccountDetailsRowMapper businessAccountDetailsRowMapper;

    @Autowired
    BusinessDetailsCombinedRowMapper businessDetailsCombinedRowMapper;

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	BusinessDetailsRowMapper businessDetailsRowMapper;

	@Autowired
	BusinessAccountSubledgerDetailsRowMapper businessAccountSubledgerDetailsRowMapper;

	@Autowired
	BusinessDetailsQueryBuilder businessDetailsQueryBuilder;

	public static final String SEQUENCEFORSUBLEDGER = "SEQ_EG_BUSINESS_SUBLEDGERINFO";
	public static final String TENANT = "tenantId";

	public static final String GET_BUSINESS_ACCOUNTDETAILS_BY_BUSINESSDETAILS = "Select * from"
			+ " eg_business_accountdetails where businessDetails=? and" + " tenantId=?";

	public static final String GET_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS = "Select * from"
			+ " eg_business_subledgerinfo where businessAccountDetail IN (:id) and tenantId=:tenantId";

	public static final String DELETE_BUSINESS_ACCOUNT_DETAILS = "Delete from eg_business_accountdetails"
			+ " where id IN (:id) and tenantId=:tenantId";


	public static final String GET_BUSINESS_ACCOUNT_DETAILS_BY_ID_AND_TENANTID = "Select * from eg_business_"
			+ "accountdetails where id =? and tenantId=?";

	public static final String GET_BUSINESSDETAILS_BY_CODE_AND_TENANTID = "Select * from eg_businessdetails"
			+ " where code=? and tenantid=?";

	private static final String DELETE_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS = "Delete from eg_business_subledgerinfo"
			+ " where id IN (:id) and tenantId=:tenantId";

	private static final String GET_DETAILS_BY_NAME_AND_TENANTID = "Select * from eg_businessdetails"
			+ " where name=? and tenantId=?";
	private static final String GET_DETAILS_BY_NAME_TENANTID_AND_ID = "Select * from eg_businessdetails"
			+ " where name=? and tenantId=? and id != ?";
	private static final String GET_BUSINESSDETAILS_BY_CODE_AND_TENANTID_AND_ID = "Select * from eg_businessdetails"
			+ " where code=? and tenantId=? and id != ?";

	public void createBusinessDetails(List<BusinessDetails> businessDetails) {

        log.info("Create Business Details Repository::" + businessDetails);
        final String businessDetailsInsertQuery = businessDetailsQueryBuilder.insertBusinessDetailsQuery();
        final String accountDetailsInsertQuery = businessDetailsQueryBuilder.insertBusinessAccountDetailsQuery();
        final String accountSubLedgerDetailsInsertQuery = businessDetailsQueryBuilder.insertAccountSubLedgerDetails();

        List<Map<String, Object>> businessDetailsBatchValues = new ArrayList<>(businessDetails.size());
        List<Map<String, Object>> accountDetailsBatchValues = new ArrayList<>(businessDetails.size());

        int accountDetailsSize = 0;
        for (BusinessDetails businessdetail : businessDetails) {
            Long businessDetailsSequence = generateSequence("seq_eg_businessdetails");
            businessDetailsBatchValues.add(new MapSqlParameterSource("id", businessDetailsSequence).addValue("name", businessdetail.getName()).addValue("enabled", businessdetail.getIsEnabled())
                    .addValue("code", businessdetail.getCode()).addValue("businesstype", businessdetail.getBusinessType()).addValue("businessurl", businessdetail.getBusinessUrl())
                    .addValue("vouchercutoffdate", businessdetail.getVoucherCutoffDate()).addValue("ordernumber", businessdetail.getOrdernumber())
                    .addValue("vouchercreation", businessdetail.getVoucherCreation()).addValue("isVoucherApproved", businessdetail.getIsVoucherApproved())
                    .addValue("fund", businessdetail.getFund()).addValue("department", businessdetail.getDepartment()).addValue("fundSource", businessdetail.getFundSource())
                    .addValue("functionary", businessdetail.getFunctionary()).addValue("businessCategory", businessdetail.getBusinessCategory()).addValue("function", businessdetail.getFunction())
                    .addValue("callBackForApportioning", businessdetail.getCallBackForApportioning()).addValue("tenantId", businessdetail.getTenantId())
                    .addValue("createdBy", businessdetail.getCreatedBy()).addValue("createdDate", new Date().getTime())
                    .addValue("lastModifiedBy", businessdetail.getCreatedBy()).addValue("lastModifiedDate", new Date().getTime())
                    .getValues());

            for(BusinessAccountDetails businessAccountDetails : businessdetail.getAccountDetails()) {
                accountDetailsBatchValues.add(new MapSqlParameterSource().addValue("businessDetails", businessDetailsSequence)
                        .addValue("chartOfAccount", businessAccountDetails.getChartOfAccount()).addValue("amount", businessAccountDetails.getAmount())
                        .addValue("tenantId", businessAccountDetails.getTenantId()).getValues());
                accountDetailsSize++;
                //TO DO : When subledger is enabled on UI FIX IT
                /*for(BusinessAccountSubLedgerDetails subLedgerDetails : businessAccountDetails.getSubledgerDetails()) {
                    accountSubLedgerDetailsBatchValues.add(new MapSqlParameterSource("amount", subLedgerDetails.getAmount())
                            .addValue("businessAccountDetail", accountdetailsId).addValue("accountDetailKey", subLedgerDetails.getAccountDetailKey())
                            .addValue("accountDetailType",subLedgerDetails.getAccountDetailKey()).addValue("tenantId",subLedgerDetails.getTenantId())
                            .getValues());
                }*/
            }
        }

        namedParameterJdbcTemplate.batchUpdate(businessDetailsInsertQuery, businessDetailsBatchValues.toArray(new Map[businessDetails.size()]));
        namedParameterJdbcTemplate.batchUpdate(accountDetailsInsertQuery, accountDetailsBatchValues.toArray(new Map[accountDetailsSize]));

	}

	public Long generateSequence(String sequenceName) {
		return jdbcTemplate.queryForObject("SELECT nextval('" + sequenceName + "')", Long.class);
	}

	public void updateBusinessDetails(List<BusinessDetails> businessDetails) {

        log.info("Update Business Details Repository::" + businessDetails);
        final String businessDetailsInsertQuery = businessDetailsQueryBuilder.updateBusinessDetailsQuery();
        final String accountDetailsDeleteQuery = businessDetailsQueryBuilder.deleteBusinessAccountDetails();
        final String accountDetailsInsertQuery = businessDetailsQueryBuilder.insertBusinessAccountDetailsQuery();

        List<Map<String, Object>> businessDetailsBatchValues = new ArrayList<>(businessDetails.size());
        List<Map<String, Object>> accountDetailsBatchValues = new ArrayList<>(businessDetails.size());

        int accountDetailsSize = 0;
        for (BusinessDetails businessdetail : businessDetails) {
            businessDetailsBatchValues.add(new MapSqlParameterSource("id", businessdetail.getId()).addValue("name", businessdetail.getName()).addValue("enabled", businessdetail.getIsEnabled())
                    .addValue("code", businessdetail.getCode()).addValue("businesstype", businessdetail.getBusinessType()).addValue("businessurl", businessdetail.getBusinessUrl())
                    .addValue("vouchercutoffdate", businessdetail.getVoucherCutoffDate()).addValue("ordernumber", businessdetail.getOrdernumber())
                    .addValue("vouchercreation", businessdetail.getVoucherCreation()).addValue("isVoucherApproved", businessdetail.getIsVoucherApproved())
                    .addValue("fund", businessdetail.getFund()).addValue("department", businessdetail.getDepartment()).addValue("fundSource", businessdetail.getFundSource())
                    .addValue("functionary", businessdetail.getFunctionary()).addValue("businessCategory", businessdetail.getBusinessCategory()).addValue("function", businessdetail.getFunction())
                    .addValue("callBackForApportioning", businessdetail.getCallBackForApportioning()).addValue("tenantId", businessdetail.getTenantId())
                    .addValue("lastModifiedBy", businessdetail.getCreatedBy()).addValue("lastModifiedDate", new Date().getTime())
                    .getValues());
            for(BusinessAccountDetails businessAccountDetails : businessdetail.getAccountDetails()) {
                accountDetailsBatchValues.add(new MapSqlParameterSource().addValue("id", businessAccountDetails.getId()).addValue("businessDetails", businessdetail.getId())
                        .addValue("chartOfAccount", businessAccountDetails.getChartOfAccount()).addValue("amount", businessAccountDetails.getAmount())
                        .addValue("tenantId", businessAccountDetails.getTenantId()).getValues());
                accountDetailsSize++;
            }
        }
        namedParameterJdbcTemplate.batchUpdate(businessDetailsInsertQuery, businessDetailsBatchValues.toArray(new Map[businessDetails.size()]));
        namedParameterJdbcTemplate.batchUpdate(accountDetailsDeleteQuery, accountDetailsBatchValues.toArray(new Map[businessDetails.size()]));
        namedParameterJdbcTemplate.batchUpdate(accountDetailsInsertQuery, accountDetailsBatchValues.toArray(new Map[accountDetailsSize]));
    }

	private void deleteSubledgerDetails(List<Long> deleteSubledgerDetailsIds, String tenantId) {
		Map<String, Object> namedParameters = new HashMap<>();
		namedParameters.put("id", deleteSubledgerDetailsIds);
		namedParameters.put(TENANT, tenantId);
		namedParameterJdbcTemplate.update(DELETE_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS, namedParameters);
	}

	private List<BusinessAccountSubLedgerDetails> deleteSubledgerDetailsFromDBIfNotPresentInInput(
			List<BusinessAccountSubLedgerDetails> subledgerfromDB,
			List<BusinessAccountSubLedgerDetails> listModelAccountSubledger) {
		List<BusinessAccountSubLedgerDetails> subledgerDetailsToBeDeletedFromDB = new ArrayList<>();
		for (BusinessAccountSubLedgerDetails subledgerDB : subledgerfromDB) {
			boolean found = false;
			for (BusinessAccountSubLedgerDetails subledgerModel : listModelAccountSubledger) {
				if (subledgerDB.getId().equals(subledgerModel.getId())) {
					found = true;
					break;
				}
			}
			if (!found)
				subledgerDetailsToBeDeletedFromDB.add(subledgerDB);

		}
		return subledgerDetailsToBeDeletedFromDB;
	}

	private void updateSubledgerDetails(BusinessAccountSubLedgerDetails subledgerModel) {
		Object obj[] = new Object[] { subledgerModel.getAmount(), subledgerModel.getBusinessAccountDetail().getId(),
				subledgerModel.getAccountDetailKey(), subledgerModel.getAccountDetailType(),
				subledgerModel.getTenantId(), subledgerModel.getId() };
	//	jdbcTemplate.update(UPDATE_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS, obj);
	}

	private boolean subledgerNeedsUpdate(BusinessAccountSubLedgerDetails subledgerModel,
			List<BusinessAccountSubLedgerDetails> subledgerfromDB) {
		for (BusinessAccountSubLedgerDetails subledgeDB : subledgerfromDB) {
			if (subledgerModel.equals(subledgeDB))
				return false;
		}
		return true;
	}

	private void insertSubledgerDetails(BusinessAccountSubLedgerDetails subledgerModel,
			HashMap<Long, Long> mapOfInsertedIdsInModelAndInDB) {
		Long businessDetailsId;

		if (mapOfInsertedIdsInModelAndInDB.containsKey(subledgerModel.getBusinessAccountDetail().getId())) {
			for (Map.Entry<Long, Long> entry : mapOfInsertedIdsInModelAndInDB.entrySet()) {
				if (entry.getKey().equals(subledgerModel.getBusinessAccountDetail().getId())) {
					businessDetailsId = entry.getValue();

					Object obj[] = new Object[] { generateSequence(SEQUENCEFORSUBLEDGER), subledgerModel.getAmount(),
							businessDetailsId, subledgerModel.getAccountDetailKey(),
							subledgerModel.getAccountDetailType(), subledgerModel.getTenantId() };
					//jdbcTemplate.update(INSERT_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS, obj);

				}
			}
		}

		else {
			businessDetailsId = subledgerModel.getBusinessAccountDetail().getId();
			Object obj[] = new Object[] { generateSequence("SEQ_EG_BUSINESS_SUBLEDGERINFO"), subledgerModel.getAmount(),
					businessDetailsId, subledgerModel.getAccountDetailKey(), subledgerModel.getAccountDetailType(),
					subledgerModel.getTenantId() };
		//	jdbcTemplate.update(INSERT_BUSINESS_ACCOUNT_SUBLEDGER_DETAILS, obj);
		}
	}

	private boolean subledgerNeedsInsert(BusinessAccountSubLedgerDetails subledgerModel,
			List<BusinessAccountSubLedgerDetails> subledgerfromDB) {
		for (BusinessAccountSubLedgerDetails subledgerDB : subledgerfromDB) {
			if (subledgerModel.getId().equals(subledgerDB.getId()))
				return false;
		}
		return true;
	}

	private void deleteAccountDetails(List<Long> ids, String tenantId) {
		Map<String, Object> namedParameters = new HashMap<>();
		namedParameters.put("id", ids);
		namedParameters.put(TENANT, tenantId);
		namedParameterJdbcTemplate.update(DELETE_BUSINESS_ACCOUNT_DETAILS, namedParameters);

	}

	private List<BusinessAccountDetails> deleteAccountDetailsFromDBIfNotPresentInInput(
			List<BusinessAccountDetails> listModelAccountSubledger, List<BusinessAccountDetails> accountDetailsFromDB) {
		List<BusinessAccountDetails> accountDetailsToBeDeletedFromDB = new ArrayList<>();

		for (BusinessAccountDetails dbDetail : accountDetailsFromDB) {
			boolean found = false;
			for (BusinessAccountDetails modelDetail : listModelAccountSubledger) {

				if (dbDetail.getId().equals(modelDetail.getId())) {
					found = true;
					break;
				}
			}
			if (!found)
				accountDetailsToBeDeletedFromDB.add(dbDetail);

		}
		return accountDetailsToBeDeletedFromDB;
	}

	private void updateAccountDetails(BusinessAccountDetails accountdetail) {
		Object[] object = new Object[] { accountdetail.getBusinessDetails(), accountdetail.getChartOfAccount(),
				accountdetail.getAmount(), accountdetail.getTenantId(), accountdetail.getId() };
		//jdbcTemplate.update(UPDATE_BUSINESS_ACCOUNT_DETAILS, object);
	}

	private boolean needsUpdate(BusinessAccountDetails accountdetail,
			List<BusinessAccountDetails> accountDetailsFromDB) {
		for (BusinessAccountDetails accountDetailFromDB : accountDetailsFromDB) {
			if (accountDetailFromDB.equals(accountdetail))
				return false;
		}
		return true;
	}

	private boolean needsInsert(BusinessAccountDetails accountdetail,
			List<BusinessAccountDetails> accountDetailsFromDB) {
		for (BusinessAccountDetails dbAccountDetail : accountDetailsFromDB) {
			if (accountdetail.getId().equals(dbAccountDetail.getId()))
				return false;
		}
		return true;
	}

	public BusinessDetailsCommonModel getForCriteria(BusinessDetailsCriteria detailsCriteria) {
		List<Object> preparedStatementValues = new ArrayList<>();
		String qryString = businessDetailsQueryBuilder.getQuery(detailsCriteria, preparedStatementValues);
		List<BusinessDetails> details = jdbcTemplate.query(qryString, preparedStatementValues.toArray(),
				businessDetailsCombinedRowMapper);
		List<BusinessAccountDetails> accountDetails = new ArrayList<>();
		List<BusinessAccountSubLedgerDetails> subledgerDetails = new ArrayList<>();
		for (BusinessDetails detail : details) {
			accountDetails.add(detail.getAccountDetails().get(0));
		}
		for (BusinessAccountDetails accountDetail : accountDetails) {
			subledgerDetails.add(accountDetail.getSubledgerDetails().get(0));
		}
		List<BusinessDetails> uniqueBusinessDetails = details.stream().filter(distinctByKey(p -> p.getId()))
				.collect(Collectors.toList());
		List<BusinessAccountDetails> uniqueBusinessAccountDetails = accountDetails.stream()
				.filter(accountdetail -> accountdetail.getId() != null)
				.collect(collectingAndThen(
						toCollection(() -> new TreeSet<>(comparingLong(BusinessAccountDetails::getId))),
						ArrayList::new));
		List<BusinessAccountSubLedgerDetails> uniqueBusinessAccountSubledgerDetails = subledgerDetails.stream()
				.filter(subledgerdetail -> subledgerdetail.getId() != null)
				.collect(collectingAndThen(
						toCollection(() -> new TreeSet<>(comparingLong(BusinessAccountSubLedgerDetails::getId))),
						ArrayList::new));

		List<BusinessDetails> businessDetails = uniqueBusinessDetails.stream()
				.map(unqdetail -> unqdetail.toDomainModel()).collect(Collectors.toList());
		List<BusinessAccountDetails> businessAccountDetails = uniqueBusinessAccountDetails.stream()
				.map(unqAccDetail -> unqAccDetail.toDomainModel()).collect(Collectors.toList());
		List<BusinessAccountSubLedgerDetails> businessAccountSubledger = uniqueBusinessAccountSubledgerDetails.stream()
				.map(unqAccountDetail -> unqAccountDetail.toDomainModel()).collect(Collectors.toList());
		return new BusinessDetailsCommonModel(businessDetails, businessAccountDetails, businessAccountSubledger);
	}

	public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
		Map<Object, Boolean> map = new ConcurrentHashMap<>();
		return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
	}

	//TODO: these extra API's are not required to check if the data exists or not in the service class find by search API and validate
	public boolean checkDetailsByNameAndTenantIdExists(String name, String tenantId, Long id, Boolean isUpdate) {
		final List<Object> preparedStatementValue = new ArrayList<Object>();
		preparedStatementValue.add(name);
		preparedStatementValue.add(tenantId);
		List<BusinessDetails> detailsFromDb = new ArrayList<>();
		List<Object> preparedStatementValues = new ArrayList<Object>();
		preparedStatementValues.add(name);
		preparedStatementValues.add(tenantId);
		preparedStatementValues.add(id);

		if (isUpdate)
			detailsFromDb = jdbcTemplate.query(GET_DETAILS_BY_NAME_TENANTID_AND_ID, preparedStatementValues.toArray(),
					businessDetailsRowMapper);
		else
			detailsFromDb = jdbcTemplate.query(GET_DETAILS_BY_NAME_AND_TENANTID, preparedStatementValue.toArray(),
					businessDetailsRowMapper);
		if (!detailsFromDb.isEmpty())
			return false;
		else
			return true;

	}

	public boolean checkDetailsByCodeAndTenantIdExists(String code, String tenantId, Long id, Boolean isUpdate) {
		final List<Object> preparedStatementValue = new ArrayList<Object>();
		preparedStatementValue.add(code);
		preparedStatementValue.add(tenantId);
		List<BusinessDetails> detailsFromDb = new ArrayList<>();
		List<Object> preparedStatementValues = new ArrayList<Object>();
		preparedStatementValues.add(code);
		preparedStatementValues.add(tenantId);
		preparedStatementValues.add(id);

		if (isUpdate)
			detailsFromDb = jdbcTemplate.query(GET_BUSINESSDETAILS_BY_CODE_AND_TENANTID_AND_ID,
					preparedStatementValues.toArray(), businessDetailsRowMapper);
		else
			detailsFromDb = jdbcTemplate.query(GET_BUSINESSDETAILS_BY_CODE_AND_TENANTID,
					preparedStatementValue.toArray(), businessDetailsRowMapper);
		if (!detailsFromDb.isEmpty())
			return false;
		else
			return true;
	}
}
