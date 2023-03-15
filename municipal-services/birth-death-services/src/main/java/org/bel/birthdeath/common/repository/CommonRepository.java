package org.bel.birthdeath.common.repository;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.birth.model.EgBirthFatherInfo;
import org.bel.birthdeath.birth.model.EgBirthMotherInfo;
import org.bel.birthdeath.birth.model.EgBirthPermaddr;
import org.bel.birthdeath.birth.model.EgBirthPresentaddr;
import org.bel.birthdeath.birth.model.ImportBirthWrapper;
import org.bel.birthdeath.birth.validator.BirthValidator;
import org.bel.birthdeath.common.contract.BirthResponse;
import org.bel.birthdeath.common.contract.DeathResponse;
import org.bel.birthdeath.common.contract.EncryptionDecryptionUtil;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.common.model.EgHospitalDtl;
import org.bel.birthdeath.common.repository.builder.CommonQueryBuilder;
import org.bel.birthdeath.common.repository.rowmapper.CommonRowMapper;
import org.bel.birthdeath.common.services.CommonService;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.EgDeathFatherInfo;
import org.bel.birthdeath.death.model.EgDeathMotherInfo;
import org.bel.birthdeath.death.model.EgDeathPermaddr;
import org.bel.birthdeath.death.model.EgDeathPresentaddr;
import org.bel.birthdeath.death.model.EgDeathSpouseInfo;
import org.bel.birthdeath.death.model.ImportDeathWrapper;
import org.bel.birthdeath.death.validator.DeathValidator;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class CommonRepository {
	
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private CommonQueryBuilder queryBuilder;
	
	@Autowired
	private CommonRowMapper rowMapper;
	
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Autowired
	private CommonUtils commUtils;
	
	@Autowired
	BirthValidator birthValidator;
	
	@Autowired
	DeathValidator deathValidator;

	private CommonService commonService;
	
	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	@Autowired
	@Lazy
	public CommonRepository(CommonService commonService) {
		this.commonService = commonService;
	}

	private static final String BIRTHDTLDELETEQRY="Delete from eg_birth_dtls where tenantid = :tenantid and registrationno = :registrationno; ";
	
	private static final String DEATHDTLDELETEQRY="Delete from eg_death_dtls where tenantid = :tenantid and registrationno = :registrationno; ";
	
	private static final String BIRTHDTLSAVEQRY="INSERT INTO public.eg_birth_dtls(id, registrationno, hospitalname, dateofreport, "
    		+ "dateofbirth, firstname, middlename, lastname, placeofbirth, informantsname, informantsaddress, "
    		+ "createdtime, createdby, lastmodifiedtime, lastmodifiedby, counter, tenantid, gender, remarks, hospitalid, islegacyrecord) "
    		+ "VALUES (:id, :registrationno, :hospitalname, :dateofreport, :dateofbirth, :firstname, :middlename, :lastname, "
    		+ ":placeofbirth, :informantsname, :informantsaddress, :createdtime, :createdby, :lastmodifiedtime, "
    		+ ":lastmodifiedby, :counter, :tenantid, :gender, :remarks, :hospitalid, :islegacyrecord); ";
	
	private static final String BIRTHFATHERINFOSAVEQRY="INSERT INTO public.eg_birth_father_info( id, firstname, middlename, lastname, aadharno, "
			+ "emailid, mobileno, education, proffession, nationality, religion, createdtime, createdby, lastmodifiedtime, lastmodifiedby, birthdtlid) "
			+ "VALUES (:id, :firstname, :middlename, :lastname, :aadharno, :emailid, :mobileno, :education, :proffession, :nationality,"
			+ " :religion, :createdtime, :createdby, :lastmodifiedtime, :lastmodifiedby, :birthdtlid);";
	
	private static final String BIRTHMOTHERINFOSAVEQRY="INSERT INTO public.eg_birth_mother_info(id, firstname, middlename, lastname, aadharno, "
			+ "emailid, mobileno, education, proffession, nationality, religion, createdtime, createdby, lastmodifiedtime, lastmodifiedby, birthdtlid) "
			+ "VALUES (:id, :firstname, :middlename, :lastname, :aadharno, :emailid, :mobileno, :education, :proffession, :nationality,"
			+ " :religion, :createdtime, :createdby, :lastmodifiedtime, :lastmodifiedby, :birthdtlid);";
	
	private static final String BIRTHPERMADDRSAVEQRY="INSERT INTO public.eg_birth_permaddr(id, buildingno, houseno, streetname, locality, tehsil, "
			+ "district, city, state, pinno, country, createdby, createdtime, lastmodifiedby, lastmodifiedtime, birthdtlid) "
			+ "VALUES (:id, :buildingno, :houseno, :streetname, :locality, :tehsil, :district, :city, :state, :pinno, :country,"
			+ " :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime, :birthdtlid);";
	
	private static final String BIRTHPRESENTADDRSAVEQRY="INSERT INTO public.eg_birth_presentaddr(id, buildingno, houseno, streetname, locality, tehsil, "
			+ "district, city, state, pinno, country, createdby, createdtime, lastmodifiedby, lastmodifiedtime, birthdtlid) "
			+ "VALUES (:id, :buildingno, :houseno, :streetname, :locality, :tehsil, :district, :city, :state, :pinno, :country, "
			+ ":createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime, :birthdtlid);";
	
	private static final String DEATHDTLSAVEQRY="INSERT INTO public.eg_death_dtls(id, registrationno, hospitalname, dateofreport, "
    		+ "dateofdeath, firstname, middlename, lastname, placeofdeath, informantsname, informantsaddress, "
    		+ "createdtime, createdby, lastmodifiedtime, lastmodifiedby, counter, tenantid, gender, remarks, hospitalid, age, eidno, aadharno, nationality, religion, icdcode, islegacyrecord) "
    		+ "VALUES (:id, :registrationno, :hospitalname, :dateofreport, :dateofdeath, :firstname, :middlename, :lastname, "
    		+ ":placeofdeath, :informantsname, :informantsaddress, :createdtime, :createdby, :lastmodifiedtime, "
    		+ ":lastmodifiedby, :counter, :tenantid, :gender, :remarks, :hospitalid, :age, :eidno, :aadharno, :nationality, :religion, :icdcode, :islegacyrecord); ";
	
	private static final String DEATHFATHERINFOSAVEQRY="INSERT INTO public.eg_death_father_info( id, firstname, middlename, lastname, aadharno, "
			+ "emailid, mobileno, createdtime, createdby, lastmodifiedtime, lastmodifiedby, deathdtlid) "
			+ "VALUES (:id, :firstname, :middlename, :lastname, :aadharno, :emailid, :mobileno, :createdtime, :createdby, :lastmodifiedtime, :lastmodifiedby, :deathdtlid);";
	
	private static final String DEATHMOTHERINFOSAVEQRY="INSERT INTO public.eg_death_mother_info(id, firstname, middlename, lastname, aadharno, "
			+ "emailid, mobileno, createdtime, createdby, lastmodifiedtime, lastmodifiedby, deathdtlid) "
			+ "VALUES (:id, :firstname, :middlename, :lastname, :aadharno, :emailid, :mobileno, :createdtime, :createdby, :lastmodifiedtime, :lastmodifiedby, :deathdtlid);";
	
	private static final String DEATHSPOUSEINFOSAVEQRY="INSERT INTO public.eg_death_spouse_info(id, firstname, middlename, lastname, aadharno, "
			+ "emailid, mobileno, createdtime, createdby, lastmodifiedtime, lastmodifiedby, deathdtlid) "
			+ "VALUES (:id, :firstname, :middlename, :lastname, :aadharno, :emailid, :mobileno, :createdtime, :createdby, :lastmodifiedtime, :lastmodifiedby, :deathdtlid);";
	
	private static final String DEATHPERMADDRSAVEQRY="INSERT INTO public.eg_death_permaddr(id, buildingno, houseno, streetname, locality, tehsil, "
			+ "district, city, state, pinno, country, createdby, createdtime, lastmodifiedby, lastmodifiedtime, deathdtlid) "
			+ "VALUES (:id, :buildingno, :houseno, :streetname, :locality, :tehsil, :district, :city, :state, :pinno, :country,"
			+ " :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime, :deathdtlid);";
	
	private static final String DEATHPRESENTADDRSAVEQRY="INSERT INTO public.eg_death_presentaddr(id, buildingno, houseno, streetname, locality, tehsil, "
			+ "district, city, state, pinno, country, createdby, createdtime, lastmodifiedby, lastmodifiedtime, deathdtlid) "
			+ "VALUES (:id, :buildingno, :houseno, :streetname, :locality, :tehsil, :district, :city, :state, :pinno, :country, "
			+ ":createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime, :deathdtlid);";
	
	private static final String HOSPITALINSERTSQL="INSERT INTO public.eg_birth_death_hospitals(id, hospitalname, tenantid) VALUES "
			+ " (?, ?, ?) ;";
	
	private static final String BIRTHDTLUPDATEQRY="UPDATE public.eg_birth_dtls SET registrationno = :registrationno, hospitalname = :hospitalname, dateofreport = :dateofreport, "
			+ "dateofbirth = :dateofbirth , firstname= :firstname, middlename = :middlename, lastname = :lastname, placeofbirth= :placeofbirth, informantsname = :informantsname, "
			+ "informantsaddress = :informantsaddress, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby= :lastmodifiedby, gender = :gender, remarks = :remarks, "
			+ "hospitalid = :hospitalid, islegacyrecord =:islegacyrecord WHERE id = :id;";
	
	private static final String BIRTHFATHERINFOUPDATEQRY="UPDATE public.eg_birth_father_info SET firstname = :firstname, middlename = :middlename, lastname = :lastname, "
			+ "aadharno = :aadharno, emailid = :emailid, mobileno = :mobileno, education = :education, proffession = :proffession, nationality = :nationality, "
			+ "religion = :religion, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby = :lastmodifiedby WHERE birthdtlid = :birthdtlid;";
	
	private static final String BIRTHMOTHERINFOUPDATEQRY="UPDATE public.eg_birth_mother_info SET firstname = :firstname, middlename = :middlename, lastname = :lastname, "
			+ "aadharno = :aadharno, emailid = :emailid, mobileno = :mobileno, education = :education, proffession = :proffession, nationality = :nationality, "
			+ "religion = :religion, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby = :lastmodifiedby WHERE birthdtlid = :birthdtlid;";
	
	private static final String BIRTHPERMADDRUPDATEQRY = "UPDATE public.eg_birth_permaddr SET buildingno = :buildingno, houseno = :houseno, streetname = :streetname, "
			+ "locality = :locality, tehsil = :tehsil, district = :district, city = :city, state = :state, pinno = :pinno, country = :country, "
			+ "lastmodifiedby = :lastmodifiedby, lastmodifiedtime = :lastmodifiedtime WHERE birthdtlid = :birthdtlid;";
	
	private static final String BIRTHPRESENTADDRUPDATEQRY="UPDATE public.eg_birth_presentaddr SET buildingno = :buildingno, houseno = :houseno, streetname = :streetname, "
			+ "locality = :locality, tehsil = :tehsil, district = :district, city = :city, state = :state, pinno = :pinno, country = :country, "
			+ "lastmodifiedby = :lastmodifiedby, lastmodifiedtime = :lastmodifiedtime WHERE birthdtlid = :birthdtlid;";
	
	
	private static final String DEATHDTLUPDATEQRY="UPDATE public.eg_death_dtls SET registrationno = :registrationno, hospitalname = :hospitalname, dateofreport = :dateofreport, "
			+ "dateofdeath = :dateofdeath , firstname= :firstname, middlename = :middlename, lastname = :lastname, placeofdeath= :placeofdeath, informantsname = :informantsname, "
			+ "informantsaddress = :informantsaddress, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby= :lastmodifiedby, gender = :gender, remarks = :remarks, "
			+ "hospitalid = :hospitalid , age = :age, eidno = :eidno, aadharno = :aadharno, nationality = :nationality, religion = :religion, icdcode = :icdcode, islegacyrecord =:islegacyrecord WHERE id = :id;";
	
	private static final String DEATHFATHERINFOUPDATEQRY="UPDATE public.eg_death_father_info SET firstname = :firstname, middlename = :middlename, lastname = :lastname, "
			+ "aadharno = :aadharno, emailid = :emailid, mobileno = :mobileno, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby = :lastmodifiedby WHERE deathdtlid = :deathdtlid;";
	
	private static final String DEATHMOTHERINFOUPDATEQRY="UPDATE public.eg_death_mother_info SET firstname = :firstname, middlename = :middlename, lastname = :lastname, "
			+ "aadharno = :aadharno, emailid = :emailid, mobileno = :mobileno, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby = :lastmodifiedby WHERE deathdtlid = :deathdtlid;";
	
	private static final String DEATHSPOUSEINFOUPDATEQRY="UPDATE public.eg_death_spouse_info SET firstname = :firstname, middlename = :middlename, lastname = :lastname, "
			+ "aadharno = :aadharno, emailid = :emailid, mobileno = :mobileno, lastmodifiedtime = :lastmodifiedtime, lastmodifiedby = :lastmodifiedby WHERE deathdtlid = :deathdtlid;";
	
	private static final String DEATHPERMADDRUPDATEQRY = "UPDATE public.eg_death_permaddr SET buildingno = :buildingno, houseno = :houseno, streetname = :streetname, "
			+ "locality = :locality, tehsil = :tehsil, district = :district, city = :city, state = :state, pinno = :pinno, country = :country, "
			+ "lastmodifiedby = :lastmodifiedby, lastmodifiedtime = :lastmodifiedtime WHERE deathdtlid = :deathdtlid;";
	
	private static final String DEATHPRESENTADDRUPDATEQRY="UPDATE public.eg_death_presentaddr SET buildingno = :buildingno, houseno = :houseno, streetname = :streetname, "
			+ "locality = :locality, tehsil = :tehsil, district = :district, city = :city, state = :state, pinno = :pinno, country = :country, "
			+ "lastmodifiedby = :lastmodifiedby, lastmodifiedtime = :lastmodifiedtime WHERE deathdtlid = :deathdtlid;";
	
	
	public List<EgHospitalDtl> getHospitalDtls(String tenantId) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getHospitalDtls(tenantId, preparedStmtList);
        List<EgHospitalDtl> hospitalDtls =  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        return hospitalDtls;
	}

	public ImportBirthWrapper saveBirthImport(BirthResponse response, RequestInfo requestInfo) {
		ImportBirthWrapper importBirthWrapper = new ImportBirthWrapper();
		try {
		Map<String,EgBirthDtl> uniqueList = new HashMap<String, EgBirthDtl>();
		Map<String, List<EgBirthDtl>> uniqueHospList = new HashMap<String, List<EgBirthDtl>>();
		Set<String> duplicates = new HashSet<String>();
		response.getBirthCerts().forEach(bdtl -> {
			if(null != bdtl.getRejectReason())
			{
				importBirthWrapper.updateMaps(BirthDeathConstants.EXCEL_DATA_ERROR, bdtl);
			}
			else
			{
				if (bdtl.getRegistrationno() != null) {
					if (uniqueList.get(bdtl.getRegistrationno()) == null)
					{
						birthValidator.removeSpaceChars(bdtl);
						uniqueList.put(bdtl.getRegistrationno(), bdtl);
						if (null != bdtl.getHospitalname() && !bdtl.getHospitalname().trim().isEmpty() )
						{
							if(bdtl.getHospitalname().length() >500) {
								importBirthWrapper.updateMaps(BirthDeathConstants.HOSPNAME_LARGE, bdtl);
								importBirthWrapper.setServiceError(BirthDeathConstants.HOSPNAME_LARGE);
								uniqueList.remove(bdtl.getRegistrationno());
							}
							else {
								bdtl.setHospitalname(bdtl.getHospitalname().trim());
								if(!uniqueHospList.containsKey(bdtl.getHospitalname()))
								{
									uniqueHospList.put(bdtl.getHospitalname(),new ArrayList<EgBirthDtl>());
								}
								uniqueHospList.get(bdtl.getHospitalname()).add(bdtl);
							}
						}
					}
					else {
						importBirthWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, bdtl);
						importBirthWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
						duplicates.add(bdtl.getRegistrationno());
					}
				}
				else
				{
					importBirthWrapper.updateMaps(BirthDeathConstants.REG_EMPTY, bdtl);
					importBirthWrapper.setServiceError(BirthDeathConstants.REG_EMPTY);
				}
			}
		});
		for (String regno : duplicates) {
			importBirthWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, uniqueList.get(regno));
			importBirthWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
			uniqueList.remove(regno);
		}
		modifyHospIdBirth(uniqueHospList , response.getBirthCerts().get(0).getTenantid());
		int finalCount=0;
			AuditDetails auditDetails;
		for (Entry<String, EgBirthDtl> entry : uniqueList.entrySet()) {
			EgBirthDtl birthDtl = entry.getValue();
			birthDtl.setGenderStr(birthDtl.getGenderStr()==null?"":birthDtl.getGenderStr().trim().toLowerCase());
			if(birthDtl.getIsLegacyRecord() != null && birthDtl.getIsLegacyRecord()) {
				auditDetails = commUtils.getAuditDetails("import-user", true);
			} else {
				auditDetails = commUtils.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			}
			switch (birthDtl.getGenderStr()) {
			case "male":
				birthDtl.setGender(1);
				break;
			case "female":
				birthDtl.setGender(2);
				break;
			case "others":
				birthDtl.setGender(3);
				break;
			default:
				birthDtl.setGender(0);
				break;
			}
			if(birthValidator.validateUniqueRegNo(birthDtl,importBirthWrapper) && birthValidator.validateImportFields(birthDtl,importBirthWrapper)){
				try {
					namedParameterJdbcTemplate.update(BIRTHDTLSAVEQRY, getParametersForBirthDtl(birthDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(BIRTHFATHERINFOSAVEQRY, getParametersForFatherInfo(birthDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(BIRTHMOTHERINFOSAVEQRY, getParametersForMotherInfo(birthDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(BIRTHPERMADDRSAVEQRY, getParametersForPermAddr(birthDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(BIRTHPRESENTADDRSAVEQRY, getParametersForPresentAddr(birthDtl, auditDetails, true));
					finalCount++;
				}
				catch (Exception e) {
					birthDtl.setRejectReason(BirthDeathConstants.DATA_ERROR);
					importBirthWrapper.updateMaps(BirthDeathConstants.DATA_ERROR, birthDtl);
					Map<String, String> params = new HashMap<>();
					params.put("tenantid", birthDtl.getTenantid());
					params.put("registrationno", birthDtl.getRegistrationno());
					namedParameterJdbcTemplate.update(BIRTHDTLDELETEQRY, params);
					e.printStackTrace();
				}
			}
		}
		
		log.info("completed " + finalCount);
		importBirthWrapper.finaliseStats(response.getBirthCerts().size(),finalCount);
		List<EgHospitalDtl> hospitaldtls = getHospitalDtls(response.getBirthCerts().get(0).getTenantid());
		List<String> hospitals = new ArrayList<String>();
		for(EgHospitalDtl hospitalDtl: hospitaldtls) {
			hospitals.add(hospitalDtl.getName());
		}
		importBirthWrapper.setHospitals(hospitals);
		}
		catch (Exception e) {
			importBirthWrapper.setServiceError("Service Error in importing");
			e.printStackTrace();
		}
		return importBirthWrapper;
	}

	private void modifyHospIdBirth(Map<String, List<EgBirthDtl>> uniqueHospList , String tenantid) {
		Map<String,String> dbHospNameIdMap = new HashMap<String, String>();
		List<EgHospitalDtl> hospitals = commonService.search(tenantid);
		for (EgHospitalDtl egHospitalDtl : hospitals) {
			dbHospNameIdMap.put(egHospitalDtl.getName(), egHospitalDtl.getId());
		}
		if(!uniqueHospList.keySet().isEmpty()) {
			
			for (String hospName : uniqueHospList.keySet()) {
				if(!dbHospNameIdMap.containsKey(hospName))
				{
					String id = tenantid.split("\\.")[1] + "_" + (dbHospNameIdMap.keySet().size() + 1);
					jdbcTemplate.update(HOSPITALINSERTSQL, id,hospName,tenantid);
					dbHospNameIdMap.put(hospName,id);
				}
				for (EgBirthDtl bdtl : uniqueHospList.get(hospName)) {
					bdtl.setHospitalid(dbHospNameIdMap.get(hospName));
				}
			}
		}
	}
	
	private void modifyHospIdDeath(Map<String, List<EgDeathDtl>> uniqueHospList , String tenantid) {
		Map<String,String> dbHospNameIdMap = new HashMap<String, String>();
		List<EgHospitalDtl> hospitals = commonService.search(tenantid);
		for (EgHospitalDtl egHospitalDtl : hospitals) {
			dbHospNameIdMap.put(egHospitalDtl.getName(), egHospitalDtl.getId());
		}
		if(!uniqueHospList.keySet().isEmpty()) {
			
			for (String hospName : uniqueHospList.keySet()) {
				if(!dbHospNameIdMap.containsKey(hospName))
				{
					String id = tenantid.split("\\.")[1] + "_" + (dbHospNameIdMap.keySet().size() + 1);
					jdbcTemplate.update(HOSPITALINSERTSQL, id,hospName,tenantid);
					dbHospNameIdMap.put(hospName,id);
				}
				for (EgDeathDtl bdtl : uniqueHospList.get(hospName)) {
					bdtl.setHospitalid(dbHospNameIdMap.get(hospName));
				}
			}
		}
	}
	
	private MapSqlParameterSource getParametersForPresentAddr(EgBirthDtl birthDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		EgBirthPresentaddr presentaddr = birthDtl.getBirthPresentaddr();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("buildingno", presentaddr.getBuildingno());
		sqlParameterSource.addValue("houseno", presentaddr.getHouseno());
		sqlParameterSource.addValue("streetname", presentaddr.getStreetname());
		sqlParameterSource.addValue("locality", presentaddr.getLocality());
		sqlParameterSource.addValue("tehsil", presentaddr.getTehsil());
		sqlParameterSource.addValue("district", presentaddr.getDistrict());
		sqlParameterSource.addValue("city", presentaddr.getCity());
		sqlParameterSource.addValue("state", presentaddr.getState());
		sqlParameterSource.addValue("pinno", presentaddr.getPinno());
		sqlParameterSource.addValue("country", presentaddr.getCountry());
		sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
		sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("birthdtlid", birthDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForPermAddr(EgBirthDtl birthDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		EgBirthPermaddr permaddr = birthDtl.getBirthPermaddr();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("buildingno", permaddr.getBuildingno());
		sqlParameterSource.addValue("houseno", permaddr.getHouseno());
		sqlParameterSource.addValue("streetname", permaddr.getStreetname());
		sqlParameterSource.addValue("locality", permaddr.getLocality());
		sqlParameterSource.addValue("tehsil", permaddr.getTehsil());
		sqlParameterSource.addValue("district", permaddr.getDistrict());
		sqlParameterSource.addValue("city", permaddr.getCity());
		sqlParameterSource.addValue("state", permaddr.getState());
		sqlParameterSource.addValue("pinno", permaddr.getPinno());
		sqlParameterSource.addValue("country", permaddr.getCountry());
		sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
		sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("birthdtlid", birthDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForMotherInfo(EgBirthDtl birthDtl, AuditDetails auditDetails, boolean isInsert) {
		EgBirthMotherInfo birthMotherInfo = encryptionDecryptionUtil.encryptObject(birthDtl.getBirthMotherInfo(), "BndDetail", EgBirthMotherInfo.class);
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("firstname", birthMotherInfo.getFirstname());
		sqlParameterSource.addValue("middlename", birthMotherInfo.getMiddlename());
		sqlParameterSource.addValue("lastname", birthMotherInfo.getLastname());
		sqlParameterSource.addValue("aadharno", birthMotherInfo.getAadharno());
		sqlParameterSource.addValue("emailid", birthMotherInfo.getEmailid());
		sqlParameterSource.addValue("mobileno", birthMotherInfo.getMobileno());
		sqlParameterSource.addValue("education", birthMotherInfo.getEducation());
		sqlParameterSource.addValue("proffession", birthMotherInfo.getProffession());
		sqlParameterSource.addValue("nationality", birthMotherInfo.getNationality());
		sqlParameterSource.addValue("religion", birthMotherInfo.getReligion());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("birthdtlid", birthDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForFatherInfo(EgBirthDtl birthDtl, AuditDetails auditDetails, boolean isInsert) {
		EgBirthFatherInfo birthFatherInfo = encryptionDecryptionUtil.encryptObject(birthDtl.getBirthFatherInfo(), "BndDetail", EgBirthFatherInfo.class);
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("firstname", birthFatherInfo.getFirstname());
		sqlParameterSource.addValue("middlename", birthFatherInfo.getMiddlename());
		sqlParameterSource.addValue("lastname", birthFatherInfo.getLastname());
		sqlParameterSource.addValue("aadharno", birthFatherInfo.getAadharno());
		sqlParameterSource.addValue("emailid", birthFatherInfo.getEmailid());
		sqlParameterSource.addValue("mobileno", birthFatherInfo.getMobileno());
		sqlParameterSource.addValue("education", birthFatherInfo.getEducation());
		sqlParameterSource.addValue("proffession", birthFatherInfo.getProffession());
		sqlParameterSource.addValue("nationality", birthFatherInfo.getNationality());
		sqlParameterSource.addValue("religion", birthFatherInfo.getReligion());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("birthdtlid", birthDtl.getId());
		
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForBirthDtl(EgBirthDtl birthDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		String id= "";
		if(isInsert)
			id= UUID.randomUUID().toString();
		else
			id=birthDtl.getId();
		sqlParameterSource.addValue("id", id);
		sqlParameterSource.addValue("registrationno", birthDtl.getRegistrationno());
		sqlParameterSource.addValue("hospitalname", birthDtl.getHospitalname());
		sqlParameterSource.addValue("dateofreport", birthDtl.getDateofreport());
		sqlParameterSource.addValue("dateofbirth", birthDtl.getDateofbirth());
		sqlParameterSource.addValue("firstname", birthDtl.getFirstname());
		sqlParameterSource.addValue("middlename", birthDtl.getMiddlename());
		sqlParameterSource.addValue("lastname", birthDtl.getLastname());
		sqlParameterSource.addValue("placeofbirth", birthDtl.getPlaceofbirth());
		sqlParameterSource.addValue("informantsname", birthDtl.getInformantsname());
		sqlParameterSource.addValue("informantsaddress", birthDtl.getInformantsaddress());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("counter", birthDtl.getCounter());
		sqlParameterSource.addValue("tenantid", birthDtl.getTenantid());
		sqlParameterSource.addValue("gender", birthDtl.getGender());
		sqlParameterSource.addValue("remarks", birthDtl.getRemarks());
		sqlParameterSource.addValue("hospitalid", birthDtl.getHospitalid());
		sqlParameterSource.addValue("islegacyrecord", birthDtl.getIsLegacyRecord());
		birthDtl.setId(id);
		return sqlParameterSource;

	}
	
	
	public ImportDeathWrapper saveDeathImport(DeathResponse response, RequestInfo requestInfo) {
		ImportDeathWrapper importDeathWrapper =  new ImportDeathWrapper();
		try {
		Map<String,EgDeathDtl> uniqueList = new HashMap<String, EgDeathDtl>();
		Map<String, List<EgDeathDtl>> uniqueHospList = new HashMap<String, List<EgDeathDtl>>();
		Set<String> duplicates = new HashSet<String>();
		response.getDeathCerts().forEach(deathtl -> {
			if (null != deathtl.getRejectReason()) {
				importDeathWrapper.updateMaps(BirthDeathConstants.EXCEL_DATA_ERROR, deathtl);
				importDeathWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
			} else {
				if (deathtl.getRegistrationno() != null) {
					if (uniqueList.get(deathtl.getRegistrationno()) == null) {
						deathValidator.removeSpaceChars(deathtl);
						uniqueList.put(deathtl.getRegistrationno(), deathtl);
						if (null != deathtl.getHospitalname() && !deathtl.getHospitalname().trim().isEmpty()) {
							if (deathtl.getHospitalname().length() > 500) {
								importDeathWrapper.updateMaps(BirthDeathConstants.HOSPNAME_LARGE, deathtl);
								importDeathWrapper.setServiceError(BirthDeathConstants.HOSPNAME_LARGE);
								uniqueList.remove(deathtl.getRegistrationno());
							} else {
								deathtl.setHospitalname(deathtl.getHospitalname().trim());
								if (!uniqueHospList.containsKey(deathtl.getHospitalname())) {
									uniqueHospList.put(deathtl.getHospitalname(), new ArrayList<EgDeathDtl>());
								}
								uniqueHospList.get(deathtl.getHospitalname()).add(deathtl);
							}
						}

					} else {
						importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, deathtl);
						importDeathWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
						duplicates.add(deathtl.getRegistrationno());
					}
				} else {
					importDeathWrapper.updateMaps(BirthDeathConstants.REG_EMPTY, deathtl);
					importDeathWrapper.setServiceError(BirthDeathConstants.REG_EMPTY);
				}
			}
		});
		for (String regno : duplicates) {
			importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, uniqueList.get(regno));
			importDeathWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
			uniqueList.remove(regno);
		}
		modifyHospIdDeath(uniqueHospList , response.getDeathCerts().get(0).getTenantid());
		int finalCount=0;
			AuditDetails auditDetails;
		for (Entry<String, EgDeathDtl> entry : uniqueList.entrySet()) {
			EgDeathDtl deathDtl = entry.getValue();
			if(deathDtl.getIsLegacyRecord() != null && deathDtl.getIsLegacyRecord()) {
				auditDetails = commUtils.getAuditDetails("import-user", true);
			} else {
				auditDetails = commUtils.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			}
			deathDtl.setGenderStr(deathDtl.getGenderStr()==null?"":deathDtl.getGenderStr().trim().toLowerCase());
			switch (deathDtl.getGenderStr()) {
			case "male":
				deathDtl.setGender(1);
				break;
			case "female":
				deathDtl.setGender(2);
				break;
			case "transgender":
				deathDtl.setGender(3);
				break;
			default:
				deathDtl.setGender(0);
				break;
			}
			if(deathValidator.validateUniqueRegNo(deathDtl,importDeathWrapper) && deathValidator.validateImportFields(deathDtl,importDeathWrapper)){
				try {
					namedParameterJdbcTemplate.update(DEATHDTLSAVEQRY, getParametersForDeathDtl(deathDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(DEATHFATHERINFOSAVEQRY, getParametersForFatherInfo(deathDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(DEATHMOTHERINFOSAVEQRY, getParametersForMotherInfo(deathDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(DEATHSPOUSEINFOSAVEQRY, getParametersForSpouseInfo(deathDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(DEATHPERMADDRSAVEQRY, getParametersForPermAddr(deathDtl, auditDetails, true));
					namedParameterJdbcTemplate.update(DEATHPRESENTADDRSAVEQRY, getParametersForPresentAddr(deathDtl, auditDetails, true));
					finalCount++;
				}
				catch (Exception e) {
					deathDtl.setRejectReason(BirthDeathConstants.DATA_ERROR);
					importDeathWrapper.updateMaps(BirthDeathConstants.DATA_ERROR, deathDtl);
					Map<String, String> params = new HashMap<>();
					params.put("tenantid", deathDtl.getTenantid());
					params.put("registrationno", deathDtl.getRegistrationno());
					namedParameterJdbcTemplate.update(DEATHDTLDELETEQRY, params);
					e.printStackTrace();
				}
			}
		}
		
		log.info("completed " + finalCount);
		importDeathWrapper.finaliseStats(response.getDeathCerts().size(),finalCount);
		List<EgHospitalDtl> hospitaldtls = getHospitalDtls(response.getDeathCerts().get(0).getTenantid());
		List<String> hospitals = new ArrayList<String>();
		for(EgHospitalDtl hospitalDtl: hospitaldtls) {
			hospitals.add(hospitalDtl.getName());
		}
		importDeathWrapper.setHospitals(hospitals);
		}
		catch (Exception e) {
			importDeathWrapper.setServiceError("Service Error in importing");
			e.printStackTrace();
		}
		return importDeathWrapper;
	}

	private MapSqlParameterSource getParametersForPresentAddr(EgDeathDtl deathDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		EgDeathPresentaddr presentaddr = deathDtl.getDeathPresentaddr();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("buildingno", presentaddr.getBuildingno());
		sqlParameterSource.addValue("houseno", presentaddr.getHouseno());
		sqlParameterSource.addValue("streetname", presentaddr.getStreetname());
		sqlParameterSource.addValue("locality", presentaddr.getLocality());
		sqlParameterSource.addValue("tehsil", presentaddr.getTehsil());
		sqlParameterSource.addValue("district", presentaddr.getDistrict());
		sqlParameterSource.addValue("city", presentaddr.getCity());
		sqlParameterSource.addValue("state", presentaddr.getState());
		sqlParameterSource.addValue("pinno", presentaddr.getPinno());
		sqlParameterSource.addValue("country", presentaddr.getCountry());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("deathdtlid", deathDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForPermAddr(EgDeathDtl deathDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		EgDeathPermaddr permaddr = deathDtl.getDeathPermaddr();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("buildingno", permaddr.getBuildingno());
		sqlParameterSource.addValue("houseno", permaddr.getHouseno());
		sqlParameterSource.addValue("streetname", permaddr.getStreetname());
		sqlParameterSource.addValue("locality", permaddr.getLocality());
		sqlParameterSource.addValue("tehsil", permaddr.getTehsil());
		sqlParameterSource.addValue("district", permaddr.getDistrict());
		sqlParameterSource.addValue("city", permaddr.getCity());
		sqlParameterSource.addValue("state", permaddr.getState());
		sqlParameterSource.addValue("pinno", permaddr.getPinno());
		sqlParameterSource.addValue("country", permaddr.getCountry());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("deathdtlid", deathDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForMotherInfo(EgDeathDtl deathDtl, AuditDetails auditDetails, boolean isInsert) {
		EgDeathMotherInfo deathMotherInfo = encryptionDecryptionUtil.encryptObject(deathDtl.getDeathMotherInfo(), "BndDetail", EgDeathMotherInfo.class);
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("firstname", deathMotherInfo.getFirstname());
		sqlParameterSource.addValue("middlename", deathMotherInfo.getMiddlename());
		sqlParameterSource.addValue("lastname", deathMotherInfo.getLastname());
		sqlParameterSource.addValue("aadharno", deathMotherInfo.getAadharno());
		sqlParameterSource.addValue("emailid", deathMotherInfo.getEmailid());
		sqlParameterSource.addValue("mobileno", deathMotherInfo.getMobileno());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("deathdtlid", deathDtl.getId());
		return sqlParameterSource;
	}
	
	private MapSqlParameterSource getParametersForSpouseInfo(EgDeathDtl deathDtl, AuditDetails auditDetails, boolean isInsert) {
		EgDeathSpouseInfo deathSpouseInfo = encryptionDecryptionUtil.encryptObject(deathDtl.getDeathSpouseInfo(), "BndDetail", EgDeathSpouseInfo.class);
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("firstname", deathSpouseInfo.getFirstname());
		sqlParameterSource.addValue("middlename", deathSpouseInfo.getMiddlename());
		sqlParameterSource.addValue("lastname", deathSpouseInfo.getLastname());
		sqlParameterSource.addValue("aadharno", deathSpouseInfo.getAadharno());
		sqlParameterSource.addValue("emailid", deathSpouseInfo.getEmailid());
		sqlParameterSource.addValue("mobileno", deathSpouseInfo.getMobileno());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("deathdtlid", deathDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForFatherInfo(EgDeathDtl deathDtl,
			AuditDetails auditDetails, boolean isInsert) {
		EgDeathFatherInfo deathFatherInfo = encryptionDecryptionUtil.encryptObject(deathDtl.getDeathFatherInfo(), "BndDetail", EgDeathFatherInfo.class);
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("id", UUID.randomUUID().toString());
		sqlParameterSource.addValue("firstname", deathFatherInfo.getFirstname());
		sqlParameterSource.addValue("middlename", deathFatherInfo.getMiddlename());
		sqlParameterSource.addValue("lastname", deathFatherInfo.getLastname());
		sqlParameterSource.addValue("aadharno", deathFatherInfo.getAadharno());
		sqlParameterSource.addValue("emailid", deathFatherInfo.getEmailid());
		sqlParameterSource.addValue("mobileno", deathFatherInfo.getMobileno());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("deathdtlid", deathDtl.getId());
		return sqlParameterSource;
	}

	private MapSqlParameterSource getParametersForDeathDtl(EgDeathDtl deathDtl, AuditDetails auditDetails, boolean isInsert) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		EgDeathDtl deathDtlEnc = encryptionDecryptionUtil.encryptObject(deathDtl, "BndDetail", EgDeathDtl.class);
		String id="";
		if(isInsert)
			id= UUID.randomUUID().toString();
		else
			id=deathDtl.getId();
		sqlParameterSource.addValue("id", id);
		sqlParameterSource.addValue("registrationno", deathDtl.getRegistrationno());
		sqlParameterSource.addValue("hospitalname", deathDtl.getHospitalname());
		sqlParameterSource.addValue("dateofreport", deathDtl.getDateofreport());
		sqlParameterSource.addValue("dateofdeath", deathDtl.getDateofdeath());
		sqlParameterSource.addValue("firstname", deathDtl.getFirstname());
		sqlParameterSource.addValue("middlename", deathDtl.getMiddlename());
		sqlParameterSource.addValue("lastname", deathDtl.getLastname());
		sqlParameterSource.addValue("placeofdeath", deathDtl.getPlaceofdeath());
		sqlParameterSource.addValue("informantsname", deathDtl.getInformantsname());
		sqlParameterSource.addValue("informantsaddress", deathDtl.getInformantsaddress());
		if(isInsert) {
			sqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
			sqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
			sqlParameterSource.addValue("lastmodifiedtime", null);
			sqlParameterSource.addValue("lastmodifiedby", null);
		}
		else{
			sqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			sqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		}
		sqlParameterSource.addValue("counter", deathDtl.getCounter());
		sqlParameterSource.addValue("tenantid", deathDtl.getTenantid());
		sqlParameterSource.addValue("gender", deathDtl.getGender());
		sqlParameterSource.addValue("remarks", deathDtl.getRemarks());
		sqlParameterSource.addValue("hospitalid", deathDtl.getHospitalid());
		sqlParameterSource.addValue("age", deathDtl.getAge() );
		sqlParameterSource.addValue("eidno", deathDtl.getEidno() );
		sqlParameterSource.addValue("aadharno", deathDtlEnc.getAadharno() );
		sqlParameterSource.addValue("nationality", deathDtl.getNationality() );
		sqlParameterSource.addValue("religion", deathDtl.getReligion() );
		sqlParameterSource.addValue("icdcode", deathDtlEnc.getIcdcode() );
		sqlParameterSource.addValue("islegacyrecord", deathDtl.getIsLegacyRecord());
		deathDtl.setId(id);
		return sqlParameterSource;

	}
	
	public ImportBirthWrapper updateBirthImport(BirthResponse response, RequestInfo requestInfo) {
		ImportBirthWrapper importBirthWrapper = new ImportBirthWrapper();
		try {
		Map<String,EgBirthDtl> uniqueList = new HashMap<String, EgBirthDtl>();
		Map<String, List<EgBirthDtl>> uniqueHospList = new HashMap<String, List<EgBirthDtl>>();
		Set<String> duplicates = new HashSet<String>();
		response.getBirthCerts().forEach(bdtl -> {
			if (null != bdtl.getRejectReason()) {
				importBirthWrapper.updateMaps(BirthDeathConstants.EXCEL_DATA_ERROR, bdtl);
				importBirthWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
			} else {
				if (bdtl.getId() != null) {
					if (bdtl.getRegistrationno() != null) {
						if (uniqueList.get(bdtl.getRegistrationno()) == null) {
							birthValidator.removeSpaceChars(bdtl);
							uniqueList.put(bdtl.getRegistrationno(), bdtl);
							if (null != bdtl.getHospitalname() && !bdtl.getHospitalname().trim().isEmpty()) {
								if (bdtl.getHospitalname().length() > 500) {
									importBirthWrapper.updateMaps(BirthDeathConstants.HOSPNAME_LARGE, bdtl);
									importBirthWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
									uniqueList.remove(bdtl.getRegistrationno());
								} else {
									bdtl.setHospitalname(bdtl.getHospitalname().trim());
									if (!uniqueHospList.containsKey(bdtl.getHospitalname())) {
										uniqueHospList.put(bdtl.getHospitalname(), new ArrayList<EgBirthDtl>());
									}
									uniqueHospList.get(bdtl.getHospitalname()).add(bdtl);
								}
							}
						} else {
							importBirthWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, bdtl);
							importBirthWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
							duplicates.add(bdtl.getRegistrationno());
						}
					} else {
						importBirthWrapper.updateMaps(BirthDeathConstants.REG_EMPTY, bdtl);
						importBirthWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
					}
				} else {
					importBirthWrapper.updateMaps(BirthDeathConstants.UPDATE_ERROR, bdtl);
					importBirthWrapper.setServiceError(BirthDeathConstants.EXCEL_DATA_ERROR);
				}
			}
			
		});
		for (String regno : duplicates) {
			importBirthWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, uniqueList.get(regno));
			uniqueList.remove(regno);
		}
		modifyHospIdBirth(uniqueHospList , response.getBirthCerts().get(0).getTenantid());
		AuditDetails auditDetails;
		int finalCount=0;
		for (Entry<String, EgBirthDtl> entry : uniqueList.entrySet()) {
			EgBirthDtl birthDtl = entry.getValue();
			if(birthDtl.getIsLegacyRecord() != null && birthDtl.getIsLegacyRecord()) {
				auditDetails = commUtils.getAuditDetails("import-user", true);
			} else {
				auditDetails = commUtils.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			}
			birthDtl.setGenderStr(birthDtl.getGenderStr()==null?"":birthDtl.getGenderStr().trim().toLowerCase());
			switch (birthDtl.getGenderStr()) {
			case "male":
				birthDtl.setGender(1);
				break;
			case "female":
				birthDtl.setGender(2);
				break;
			case "others":
				birthDtl.setGender(3);
				break;
			default:
				birthDtl.setGender(0);
				break;
			}
			if(birthValidator.validateImportFields(birthDtl,importBirthWrapper)){
				try {
					namedParameterJdbcTemplate.update(BIRTHDTLUPDATEQRY, getParametersForBirthDtl(birthDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(BIRTHFATHERINFOUPDATEQRY, getParametersForFatherInfo(birthDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(BIRTHMOTHERINFOUPDATEQRY, getParametersForMotherInfo(birthDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(BIRTHPERMADDRUPDATEQRY, getParametersForPermAddr(birthDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(BIRTHPRESENTADDRUPDATEQRY, getParametersForPresentAddr(birthDtl, auditDetails, false));
					finalCount++;
				}
				catch (Exception e) {
					birthDtl.setRejectReason(BirthDeathConstants.DATA_ERROR);
					importBirthWrapper.updateMaps(BirthDeathConstants.DATA_ERROR, birthDtl);
					importBirthWrapper.setServiceError(BirthDeathConstants.DATA_ERROR);
					e.printStackTrace();
				}
			}
		}
		
		log.info("completed " + finalCount);
		importBirthWrapper.finaliseStats(response.getBirthCerts().size(),finalCount);
		List<EgHospitalDtl> hospitaldtls = getHospitalDtls(response.getBirthCerts().get(0).getTenantid());
		List<String> hospitals = new ArrayList<String>();
		for(EgHospitalDtl hospitalDtl: hospitaldtls) {
			hospitals.add(hospitalDtl.getName());
		}
		importBirthWrapper.setHospitals(hospitals);
		}
		catch (Exception e) {
			importBirthWrapper.setServiceError("Service Error in Updating");
			e.printStackTrace();
		}
		return importBirthWrapper;
	}
	
	public ImportDeathWrapper updateDeathImport(DeathResponse response, RequestInfo requestInfo) {
		ImportDeathWrapper importDeathWrapper =  new ImportDeathWrapper();
		try {
		//DeathResponse response= mapper.convertValue(importJSon, DeathResponse.class);
		Map<String,EgDeathDtl> uniqueList = new HashMap<String, EgDeathDtl>();
		Map<String, List<EgDeathDtl>> uniqueHospList = new HashMap<String, List<EgDeathDtl>>();
		Set<String> duplicates = new HashSet<String>();
		response.getDeathCerts().forEach(deathtl -> {
			if (null != deathtl.getRejectReason()) {
				importDeathWrapper.updateMaps(BirthDeathConstants.EXCEL_DATA_ERROR, deathtl);
			} else {
				if (deathtl.getId() != null) {
					if (deathtl.getRegistrationno() != null) {
						if (uniqueList.get(deathtl.getRegistrationno()) == null) {
							deathValidator.removeSpaceChars(deathtl);
							uniqueList.put(deathtl.getRegistrationno(), deathtl);
							if (null != deathtl.getHospitalname() && !deathtl.getHospitalname().trim().isEmpty()) {
								if (deathtl.getHospitalname().length() > 500) {
									importDeathWrapper.updateMaps(BirthDeathConstants.HOSPNAME_LARGE, deathtl);
									importDeathWrapper.setServiceError(BirthDeathConstants.HOSPNAME_LARGE);
									uniqueList.remove(deathtl.getRegistrationno());
								} else {
									deathtl.setHospitalname(deathtl.getHospitalname().trim());
									if (!uniqueHospList.containsKey(deathtl.getHospitalname())) {
										uniqueHospList.put(deathtl.getHospitalname(), new ArrayList<EgDeathDtl>());
									}
									uniqueHospList.get(deathtl.getHospitalname()).add(deathtl);
								}
							}

						} else {
							importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, deathtl);
							importDeathWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
							duplicates.add(deathtl.getRegistrationno());
						}
					} else {
						importDeathWrapper.updateMaps(BirthDeathConstants.REG_EMPTY, deathtl);
						importDeathWrapper.setServiceError(BirthDeathConstants.REG_EMPTY);
					}
				} else {
					importDeathWrapper.updateMaps(BirthDeathConstants.UPDATE_ERROR, deathtl);
					importDeathWrapper.setServiceError(BirthDeathConstants.UPDATE_ERROR);
				}
			}
		});
		for (String regno : duplicates) {
			importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG_EXCEL, uniqueList.get(regno));
			importDeathWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG_EXCEL);
			uniqueList.remove(regno);
		}
		modifyHospIdDeath(uniqueHospList , response.getDeathCerts().get(0).getTenantid());
		AuditDetails auditDetails;
		int finalCount=0;
		for (Entry<String, EgDeathDtl> entry : uniqueList.entrySet()) {
			EgDeathDtl deathDtl = entry.getValue();
			if(deathDtl.getIsLegacyRecord() != null && deathDtl.getIsLegacyRecord()) {
				auditDetails = commUtils.getAuditDetails("import-user", true);
			} else {
				auditDetails = commUtils.getAuditDetails(requestInfo.getUserInfo().getUuid(), true);
			}
			deathDtl.setGenderStr(deathDtl.getGenderStr()==null?"":deathDtl.getGenderStr().trim().toLowerCase());
			switch (deathDtl.getGenderStr()) {
			case "male":
				deathDtl.setGender(1);
				break;
			case "female":
				deathDtl.setGender(2);
				break;
			case "transgender":
				deathDtl.setGender(3);
				break;
			default:
				deathDtl.setGender(0);
				break;
			}
			if(deathValidator.validateImportFields(deathDtl,importDeathWrapper)){
				try {
					namedParameterJdbcTemplate.update(DEATHDTLUPDATEQRY, getParametersForDeathDtl(deathDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(DEATHFATHERINFOUPDATEQRY, getParametersForFatherInfo(deathDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(DEATHMOTHERINFOUPDATEQRY, getParametersForMotherInfo(deathDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(DEATHSPOUSEINFOUPDATEQRY, getParametersForSpouseInfo(deathDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(DEATHPERMADDRUPDATEQRY, getParametersForPermAddr(deathDtl, auditDetails, false));
					namedParameterJdbcTemplate.update(DEATHPRESENTADDRUPDATEQRY, getParametersForPresentAddr(deathDtl, auditDetails, false));
					finalCount++;
				}
				catch (Exception e) {
					deathDtl.setRejectReason(BirthDeathConstants.DATA_ERROR);
					importDeathWrapper.updateMaps(BirthDeathConstants.DATA_ERROR, deathDtl);
					importDeathWrapper.setServiceError(BirthDeathConstants.DATA_ERROR);
					e.printStackTrace();
				}
			}
		}
		
		log.info("completed " + finalCount);
		importDeathWrapper.finaliseStats(response.getDeathCerts().size(),finalCount);
		List<EgHospitalDtl> hospitaldtls = getHospitalDtls(response.getDeathCerts().get(0).getTenantid());
		List<String> hospitals = new ArrayList<String>();
		for(EgHospitalDtl hospitalDtl: hospitaldtls) {
			hospitals.add(hospitalDtl.getName());
		}
		importDeathWrapper.setHospitals(hospitals);
		}
		catch (Exception e) {
			importDeathWrapper.setServiceError("Service Error in Updating");
			e.printStackTrace();
		}
		return importDeathWrapper;
	}

}