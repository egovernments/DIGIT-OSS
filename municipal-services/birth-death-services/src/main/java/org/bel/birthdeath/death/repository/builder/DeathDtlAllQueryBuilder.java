package org.bel.birthdeath.death.repository.builder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.bel.birthdeath.death.model.SearchCriteria;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DeathDtlAllQueryBuilder {
	
	@Autowired
	private BirthDeathConfiguration config;

	private static String QUERY_MASTER_FULL_ALL = "SELECT bdtl.id deathdtlid,bfat.id bfatid,bmot.id bmotid,bpmad.id bpmadid,bpsad.id bpsadid, bsps.id bspsid," +
			"bdtl.tenantid tenantid, registrationno, dateofdeath, counter, gender ,  " + 
			"CASE WHEN gender = '1' THEN 'Male' WHEN gender = '2' THEN 'Female' WHEN gender = '3' THEN 'Transgender'  END AS genderstr , " +
			"(select bh.hospitalname from eg_birth_death_hospitals bh where bh.id=hospitalid)  AS hospitalname, placeofdeath, dateofreport, remarks, " + 
			"hospitalid , informantsname , informantsaddress , age,  eidno , icdcode, islegacyrecord, bdtl.nationality bdtlnationality, bdtl.religion bdtlreligion ," +
			"bfat.firstname bfatfn ,bmot.firstname bmotfn , bdtl.firstname bdtlfn , bsps.firstname bspsfn ," + 
			"bfat.middlename bfatmn ,bmot.middlename bmotmn , bdtl.middlename bdtlmn , bsps.middlename bspsmn ," + 
			"bfat.lastname bfatln ,bmot.lastname bmotln , bdtl.lastname bdtlln , bsps.lastname bspsln ," + 
			"bfat.aadharno bfataadharno ,bmot.aadharno bmotaadharno ,bsps.aadharno bspsaadharno , bdtl.aadharno bdtlaadharno," + 
			"bfat.emailid bfatemailid ,bmot.emailid bmotemailid ,bsps.emailid bspsemailid , " + 
			"bfat.mobileno bfatmobileno ,bmot.mobileno bmotmobileno ,bsps.mobileno bspsmobileno , " + 
			"bpmad.houseno pmhouseno,bpmad.buildingno pmbuildingno,bpmad.streetname pmstreetname,bpmad.locality pmlocality,bpmad.tehsil pmtehsil, " + 
			"bpmad.district pmdistrict,bpmad.city pmcity ,bpmad.state pmstate,bpmad.pinno pmpinno,bpmad.country pmcountry, " + 
			"bpsad.houseno pshouseno,bpsad.buildingno psbuildingno,bpsad.streetname psstreetname,bpsad.locality pslocality,bpsad.tehsil pstehsil, " + 
			"bpsad.district psdistrict,bpsad.city pscity ,bpsad.state psstate,bpsad.pinno pspinno,bpsad.country pscountry  " + 
			"FROM {schema}.eg_death_dtls bdtl  " +
			"left join {schema}.eg_death_father_info bfat on bfat.deathdtlid = bdtl.id    " +
			"left join {schema}.eg_death_mother_info bmot on bmot.deathdtlid = bdtl.id  " +
			"left join {schema}.eg_death_spouse_info bsps on bsps.deathdtlid = bdtl.id  " +
			"left join {schema}.eg_death_permaddr bpmad on bpmad.deathdtlid = bdtl.id    " +
			"left join {schema}.eg_death_presentaddr bpsad on bpsad.deathdtlid = bdtl.id";
	
    private static String QUERY_MASTER_ALL = "SELECT bdtl.id deathdtlid, bdtl.tenantid tenantid, registrationno, dateofdeath, counter, gender , age , "
    		+ "CASE WHEN gender = '1' THEN 'Male' WHEN gender = '2' THEN 'Female' WHEN gender = '3' THEN 'Transgender'  END AS genderstr ,"
    		+ " (select bh.hospitalname from eg_birth_death_hospitals bh where bh.id=hospitalid)  AS hospitalname, placeofdeath, dateofreport, remarks, "
    		+ "bfat.firstname bfatfn ,bmot.firstname bmotfn , bdtl.firstname bdtlfn ,bsps.firstname bspsfn , "
    		+ "bfat.middlename bfatmn ,bmot.middlename bmotmn , bdtl.middlename bdtlmn ,bsps.middlename bspsmn , "
    		+ "bfat.lastname bfatln ,bmot.lastname bmotln , bdtl.lastname bdtlln ,bsps.lastname bspsln , "
    		+ "bpmad.houseno pmhouseno,bpmad.buildingno pmbuildingno,bpmad.streetname pmstreetname,bpmad.locality pmlocality,bpmad.tehsil pmtehsil,"
    		+ "bpmad.district pmdistrict,bpmad.city pmcity ,bpmad.state pmstate,bpmad.pinno pmpinno,bpmad.country pmcountry,"
    		+ "bpsad.houseno pshouseno,bpsad.buildingno psbuildingno,bpsad.streetname psstreetname,bpsad.locality pslocality,bpsad.tehsil pstehsil,"
    		+ "bpsad.district psdistrict,bpsad.city pscity ,bpsad.state psstate,bpsad.pinno pspinno,bpsad.country pscountry,"
    		+ "bdtl.aadharno bdtlaadharno ,bfat.aadharno bfataadharno ,bmot.aadharno bmotaadharno , bsps.aadharno bspsaadharno "+
    		"FROM {schema}.eg_death_dtls bdtl " +
    		"left join {schema}.eg_death_father_info bfat on bfat.deathdtlid = bdtl.id " +
    		"left join {schema}.eg_death_mother_info bmot on bmot.deathdtlid = bdtl.id " +
    		"left join {schema}.eg_death_permaddr bpmad on bpmad.deathdtlid = bdtl.id " +
    		"left join {schema}.eg_death_presentaddr bpsad on bpsad.deathdtlid = bdtl.id "+
    		"left join {schema}.eg_death_spouse_info bsps on bsps.deathdtlid = bdtl.id " ;
    
    private static final String QUERY_MASTER = "SELECT bdtl.id deathdtlid, tenantid, registrationno, dateofdeath, counter, gender, hospitalname, "+
    		"CASE WHEN gender = '1' THEN 'Male' WHEN gender = '2' THEN 'Female' WHEN gender = '3' THEN 'Transgender'  END AS genderstr ," +
    		"(select bh.hospitalname from eg_birth_death_hospitals bh where bh.id=hospitalid)  AS hospitalname ,"+
    		"bfat.firstname bfatfn ,bmot.firstname bmotfn , bdtl.firstname bdtlfn ,bsps.firstname bspsfn , "+
    		"bfat.middlename bfatmn ,bmot.middlename bmotmn , bdtl.middlename bdtlmn ,bsps.middlename bspsmn , "+
    		"bfat.lastname bfatln ,bmot.lastname bmotln , bdtl.lastname bdtlln ,bsps.lastname bspsln "+
    		"FROM {schema}.eg_death_dtls bdtl " +
    		"left join {schema}.eg_death_father_info bfat on bfat.deathdtlid = bdtl.id " +
    		"left join {schema}.eg_death_mother_info bmot on bmot.deathdtlid = bdtl.id " +
    		"left join {schema}.eg_death_spouse_info bsps on bsps.deathdtlid = bdtl.id " ;
    
    private static String APPLSQUERY ="select breq.deathCertificateNo, breq.createdtime, breq.status, bdtl.registrationno, bdtl.tenantid, "
    		+ "concat(COALESCE(bdtl.firstname,'') , ' ', COALESCE(bdtl.middlename,'') ,' ', COALESCE(bdtl.lastname,'')) as name, "
    		+ "CASE WHEN breq.lastmodifiedtime/1000 < (extract(epoch from NOW())-?*24*60*60) THEN 'EXPIRED' ELSE breq.filestoreid END as filestoreid "
    		+ "from {schema}.eg_death_cert_request breq left join {schema}.eg_death_dtls bdtl on bdtl.id=breq.deathDtlId where  "
    		+ "breq.createdby=? order by breq.createdtime DESC ";
    
    private final String PAGINATIONWRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY dateofdeath DESC , deathdtlid) offset_ FROM " +
            "({})" +
            " result) result_offset " +
            "WHERE offset_ > ? AND offset_ <= ?";
    
    private static void addClauseIfRequired(List<Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }


	public String getDeathCertReq(String consumerCode, RequestInfo requestInfo, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder("select req.*,(select tenantid from {schema}.eg_death_dtls dtl where req.deathdtlid=dtl.id) from {schema}.eg_death_cert_request req");
		if (consumerCode != null && !consumerCode.isEmpty()) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" deathcertificateno=? ");
			preparedStmtList.add(consumerCode);
		}
		if(null!=requestInfo && null!= requestInfo.getUserInfo() && requestInfo.getUserInfo().getType().equalsIgnoreCase("CITIZEN")) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" createdby=? ");
			preparedStmtList.add(requestInfo.getUserInfo().getUuid());
		}
		return builder.toString();
	}

	public String getDeathDtlsAll(SearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(QUERY_MASTER_ALL);

		if (criteria.getTenantId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.TENANTID_PREPARED_STMT);
			preparedStmtList.add(criteria.getTenantId());
		}
		if (criteria.getId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.ID_PREPARED_STMT);
			preparedStmtList.add(criteria.getId());
		}
		return builder.toString();
	}


	public String searchApplications(String tenantId, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(APPLSQUERY);
		preparedStmtList.add(config.getDownloadBufferDays());
		preparedStmtList.add(tenantId);
		return builder.toString();
	}
	
	public String getDeathDtls(SearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(QUERY_MASTER);

		if (criteria.getTenantId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.TENANTID_PREPARED_STMT);
			preparedStmtList.add(criteria.getTenantId());
		}
		if (criteria.getRegistrationNo() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.REGNO_PREPARED_STMT);
			preparedStmtList.add(criteria.getRegistrationNo());
		}
		if (criteria.getGender() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.GENDER_PREPARED_STMT);
			preparedStmtList.add(criteria.getGender());
		}
		if (criteria.getHospitalId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" hospitalname=? ");
			preparedStmtList.add(criteria.getHospitalId());
		}
		if (criteria.getMotherName() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" ( bmot.firstname ilike ? or bmot.middlename ilike ? or bmot.lastname ilike ? ) ");
			preparedStmtList.add("%"+criteria.getMotherName()+"%");
			preparedStmtList.add("%"+criteria.getMotherName()+"%");
			preparedStmtList.add("%"+criteria.getMotherName()+"%");
		}
		if (criteria.getFatherName() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" ( bfat.firstname ilike ? or bfat.middlename ilike ? or bfat.lastname ilike ? ) ");
			preparedStmtList.add("%"+criteria.getFatherName()+"%");
			preparedStmtList.add("%"+criteria.getFatherName()+"%");
			preparedStmtList.add("%"+criteria.getFatherName()+"%");
		}
		if (criteria.getSpouseName() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" ( bsps.firstname ilike ? or bsps.middlename ilike ? or bsps.lastname ilike ? ) ");
			preparedStmtList.add("%"+criteria.getSpouseName()+"%");
			preparedStmtList.add("%"+criteria.getSpouseName()+"%");
			preparedStmtList.add("%"+criteria.getSpouseName()+"%");
		}
		if (criteria.getId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.ID_PREPARED_STMT);
			preparedStmtList.add(criteria.getId());
		}
		if (criteria.getDateOfDeath() != null) {
			SimpleDateFormat sdf= new SimpleDateFormat("dd-MM-yyyy");
			try {
				Date dob = sdf.parse(criteria.getDateOfDeath());
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" CAST(bdtl.dateofdeath as DATE)=?");
				preparedStmtList.add(dob);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (criteria.getFromDate() != null) {
			SimpleDateFormat sdf= new SimpleDateFormat("dd-MM-yyyy");
			try {
				Date dob = sdf.parse(criteria.getFromDate());
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" CAST(bdtl.dateofdeath as DATE) >= ?");
				preparedStmtList.add(dob);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (criteria.getToDate() != null) {
			SimpleDateFormat sdf= new SimpleDateFormat("dd-MM-yyyy");
			try {
				Date dob = sdf.parse(criteria.getToDate());
				addClauseIfRequired(preparedStmtList, builder);
				builder.append(" CAST(bdtl.dateofdeath as DATE) <= ?");
				preparedStmtList.add(dob);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if(criteria.getName() !=null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(" ( bdtl.firstname ilike ? or bdtl.middlename ilike ? or bdtl.lastname ilike ? )");
			preparedStmtList.add("%"+criteria.getName()+"%");
			preparedStmtList.add("%"+criteria.getName()+"%");
			preparedStmtList.add("%"+criteria.getName()+"%");
		}
		return addPaginationWrapper(builder.toString(),preparedStmtList,criteria);
	}
	
	public String getDeathCertMasterDtl(SearchCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(QUERY_MASTER_FULL_ALL);

		if (criteria.getTenantId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.TENANTID_PREPARED_STMT);
			preparedStmtList.add(criteria.getTenantId());
		}
		if (criteria.getId() != null) {
			addClauseIfRequired(preparedStmtList, builder);
			builder.append(BirthDeathConstants.ID_PREPARED_STMT);
			preparedStmtList.add(criteria.getId());
		}
		return builder.toString();
	}

	private String addPaginationWrapper(String query, List<Object> preparedStmtList, SearchCriteria criteria) {
		int limit = config.getDefaultBndLimit();
		int offset = config.getDefaultOffset();
		String finalQuery = PAGINATIONWRAPPER.replace("{}", query);

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			limit = config.getMaxSearchLimit();

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		preparedStmtList.add(offset);
		preparedStmtList.add(limit + offset);

		return finalQuery;
	}
}
