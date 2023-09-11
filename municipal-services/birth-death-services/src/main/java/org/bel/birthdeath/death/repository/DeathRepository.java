package org.bel.birthdeath.death.repository;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.bel.birthdeath.common.Idgen.IdGenerationResponse;
import org.bel.birthdeath.common.contract.BirthPdfApplicationRequest;
import org.bel.birthdeath.common.contract.DeathPdfApplicationRequest;
import org.bel.birthdeath.common.contract.EgovPdfResp;
import org.bel.birthdeath.common.contract.EncryptionDecryptionUtil;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.common.producer.BndProducer;
import org.bel.birthdeath.common.repository.ServiceRequestRepository;
import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.bel.birthdeath.death.certmodel.DeathCertAppln;
import org.bel.birthdeath.death.certmodel.DeathCertRequest;
import org.bel.birthdeath.death.certmodel.DeathCertificate;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.EgDeathFatherInfo;
import org.bel.birthdeath.death.model.EgDeathMotherInfo;
import org.bel.birthdeath.death.model.EgDeathSpouseInfo;
import org.bel.birthdeath.death.model.SearchCriteria;
import org.bel.birthdeath.death.repository.builder.DeathDtlAllQueryBuilder;
import org.bel.birthdeath.death.repository.rowmapper.DeathCertApplnRowMapper;
import org.bel.birthdeath.death.repository.rowmapper.DeathCertRowMapper;
import org.bel.birthdeath.death.repository.rowmapper.DeathDtlsAllRowMapper;
import org.bel.birthdeath.death.repository.rowmapper.DeathDtlsRowMapper;
import org.bel.birthdeath.death.repository.rowmapper.DeathMasterDtlRowMapper;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class DeathRepository {

	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private DeathDtlAllQueryBuilder allqueryBuilder;
	
	@Autowired
	private DeathDtlsRowMapper rowMapper;
	
	@Autowired
	private DeathDtlsAllRowMapper allRowMapper;
	
	@Autowired
	private DeathMasterDtlRowMapper deathMasterDtlRowMapper;
	
	@Autowired
	private DeathCertRowMapper deathCertRowMapper;
	
	@Autowired
	private DeathCertApplnRowMapper certApplnRowMapper;
	
	@Autowired
	private BndProducer bndProducer;
	
	@Autowired
	private BirthDeathConfiguration config;
	
	@Autowired
    private RestTemplate restTemplate;
	
	@Autowired
	private EncryptionDecryptionUtil encryptionDecryptionUtil;
	
	@Autowired
	private CommonUtils commonUtils;
	
	@Value("${egov.bnd.freedownload.tenants}")
    private String freeDownloadTenants;
	
	@Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	@Qualifier("objectMapperBnd")
	private ObjectMapper mapper;
	
	public List<EgDeathDtl> getDeathDtls(SearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getDeathDtls(criteria, preparedStmtList);
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("DEATHCERT_SEARCH_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}

	public List<DeathCertificate> getDeathDtlsForPlainSearch(SearchCriteria criteria) {
		List<DeathCertificate> deathCertificates = new ArrayList<>();
		int limit = config.getDefaultBndLimit();
		int offset = config.getDefaultOffset();

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			limit = config.getMaxSearchLimit();

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		String query = "SELECT * FROM {schema}.eg_death_cert_request OFFSET " + offset + " LIMIT " + limit;
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("DEATHCERT_PLAINSEARCH_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		List<Map<String, Object>> list =  jdbcTemplate.queryForList(query);

		for(Map<String, Object> map: list) {
			DeathCertificate deathCertificate = new DeathCertificate();
			log.info("Death Detail ID = " + map.get("deathdtlid"));
			EgDeathDtl deathDtl = getDeathDtlById((String) map.get("deathdtlid"), criteria.getTenantId());

			deathCertificate.setId((String) map.get("id"));
			deathCertificate.setDeathCertificateNo((String) map.get("deathcertificateno"));
			deathCertificate.setDeathDtlId((String) map.get("deathdtlid"));
			deathCertificate.setFilestoreid((String) map.get("filestoreid"));
			deathCertificate.setApplicationStatus(DeathCertificate.StatusEnum.valueOf((String) map.get("status")));
			deathCertificate.setAdditionalDetail(map.get("additionaldetail"));
			deathCertificate.setEmbeddedUrl((String) map.get("embeddedurl"));
			deathCertificate.setDateofissue(((Long) map.get("dateofissue")));
			deathCertificate.setSource((String) map.get("source"));
			deathCertificate.setGender(deathDtl.getGenderStr());
			deathCertificate.setAge(deathDtl.getAge());

			deathCertificate.setWard(deathDtl.getDeathPermaddr() != null ? deathDtl.getDeathPermaddr().getTehsil() : null);
			deathCertificate.setState(deathDtl.getDeathPermaddr() != null ? deathDtl.getDeathPermaddr().getState() : null);
			deathCertificate.setDistrict(deathDtl.getDeathPermaddr() != null ? deathDtl.getDeathPermaddr().getDistrict() : null);
			deathCertificate.setPlaceofdeath(deathDtl.getPlaceofdeath());
			deathCertificate.setTenantId(deathDtl.getTenantid());
			deathCertificate.setDateofdeath(deathDtl.getDateofdeath());
			deathCertificate.setDateofreport(deathDtl.getDateofreport());

			AuditDetails auditDetails = new AuditDetails();
			auditDetails.setCreatedBy((String) map.get("createdby"));
			auditDetails.setCreatedTime(((Long) map.get("createdtime")));
			auditDetails.setLastModifiedTime(((Long) map.get("lastmodifiedtime")));
			auditDetails.setLastModifiedBy((String) map.get("lastmodifiedby"));
			deathCertificate.setAuditDetails(auditDetails);

			deathCertificates.add(deathCertificate);
		}
		return deathCertificates;
	}

	public EgDeathDtl getDeathDtlById(String id, String tenantId) {
		String deathDtlQuery = "SELECT * FROM {schema}.eg_death_dtls WHERE id = ?";
		try {
			//TODO: Passing tenenantId as empty.Check with kavi
			deathDtlQuery = centralInstanceUtil.replaceSchemaPlaceholder(deathDtlQuery, tenantId);
		} catch (InvalidTenantIdException e) {
			throw new CustomException("DEATHCERT_SEARCH_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		return (EgDeathDtl) jdbcTemplate.queryForObject(deathDtlQuery, new Object[]{id}, new BeanPropertyRowMapper(EgDeathDtl.class));
	}

	public void save(DeathCertRequest deathCertRequest) {
		bndProducer.push(deathCertRequest.getDeathCertificate().getTenantId(), config.getSaveDeathTopic(), deathCertRequest);
	}

	public EgovPdfResp saveDeathCertPdf(DeathPdfApplicationRequest pdfApplicationRequest) {
		EgovPdfResp result= new EgovPdfResp();
		try {
			SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");	
			pdfApplicationRequest.getDeathCertificate().forEach(cert-> {
				String uiHost = config.getUiAppHost();
				String deathCertPath = config.getDeathCertLink();
				deathCertPath = deathCertPath.replace("$id",cert.getId());
				deathCertPath = deathCertPath.replace("$tenantId",cert.getTenantid());
				deathCertPath = deathCertPath.replace("$regNo",cert.getRegistrationno());
				deathCertPath = deathCertPath.replace("$dateofdeath",format.format(cert.getDateofdeath()));
				deathCertPath = deathCertPath.replace("$gender",cert.getGender().toString());
				deathCertPath = deathCertPath.replace("$deathcertificateno",cert.getDeathcertificateno());
				String finalPath = uiHost + deathCertPath;
				cert.setEmbeddedUrl(getShortenedUrl(finalPath));
	        });
		
		log.info(new Gson().toJson(pdfApplicationRequest));

			DeathPdfApplicationRequest req = DeathPdfApplicationRequest.builder().deathCertificate(pdfApplicationRequest.getDeathCertificate()).requestInfo(pdfApplicationRequest.getRequestInfo()).build();
			pdfApplicationRequest.getDeathCertificate().forEach(cert-> {
				String uiHost = config.getEgovPdfHost();
				String deathCertPath = config.getEgovPdfDeathEndPoint();
				/*String tenantId = cert.getTenantid().split("\\.")[0];*/
				String tenantId = centralInstanceUtil.getStateLevelTenant(cert.getTenantid());
				deathCertPath = deathCertPath.replace("$tenantId",tenantId);
				String pdfFinalPath = uiHost + deathCertPath;

				Object responseObject =  serviceRequestRepository.fetchResult(new StringBuilder(pdfFinalPath), req);
				EgovPdfResp response =  mapper.convertValue(responseObject,  EgovPdfResp.class);

				if (response != null && CollectionUtils.isEmpty(response.getFilestoreIds())) {
					throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
							"No file store id found from pdf service");
				}
				result.setFilestoreIds(response.getFilestoreIds());
			});
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING ERROR","Failed to parse response of PDF-Service");
		}catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("PDF_ERROR","Error in generating PDF");
		}
		return result;
		
	}

	public List<EgDeathDtl> getDeathDtlsAll(SearchCriteria criteria ,RequestInfo requestInfo) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getDeathDtlsAll(criteria, preparedStmtList);
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("DEATHCERT_SEARCH_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
        List<EgDeathDtl> deathDtls =  jdbcTemplate.query(query, preparedStmtList.toArray(), allRowMapper);
		if(deathDtls != null) {
			deathDtls.forEach(deathDtl -> {
				deathDtl.setDeathFatherInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathFatherInfo(), BirthDeathConstants.BND_DESCRYPT_KEY, EgDeathFatherInfo.class, requestInfo));
				deathDtl.setDeathMotherInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathMotherInfo(), BirthDeathConstants.BND_DESCRYPT_KEY, EgDeathMotherInfo.class, requestInfo));
				deathDtl.setDeathSpouseInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathSpouseInfo(), BirthDeathConstants.BND_DESCRYPT_KEY, EgDeathSpouseInfo.class, requestInfo));
				EgDeathDtl dec = encryptionDecryptionUtil.decryptObject(deathDtl, "BndDetail", EgDeathDtl.class, requestInfo);
				deathDtl.setAadharno(dec.getAadharno());
				deathDtl.setIcdcode(dec.getIcdcode());
				commonUtils.maskAndShowLast4Chars(deathDtl);
			});
		}
        return deathDtls;
	}

	public DeathCertificate getDeathCertReqByConsumerCode(String consumerCode, RequestInfo requestInfo, String tenantId) {
		try {
			List<Object> preparedStmtList = new ArrayList<>();
			SearchCriteria criteria = new SearchCriteria();
			String query = allqueryBuilder.getDeathCertReq(consumerCode, requestInfo, preparedStmtList);
			try {
				query = centralInstanceUtil.replaceSchemaPlaceholder(query, tenantId);
			} catch (InvalidTenantIdException e) {
				throw new CustomException("DEATHCERT_SEARCH_TENANTID_ERROR",
						"TenantId length is not sufficient to replace query schema in a multi state instance");
			}
			List<DeathCertificate> deathCerts = jdbcTemplate.query(query, preparedStmtList.toArray(), deathCertRowMapper);
			if (null != deathCerts && !deathCerts.isEmpty()) {
				criteria.setTenantId(deathCerts.get(0).getTenantId());
				criteria.setId(deathCerts.get(0).getDeathDtlId());
				List<EgDeathDtl> deathDtls = getDeathDtlsAll(criteria, requestInfo);
				deathCerts.get(0).setGender(deathDtls.get(0).getGenderStr());
				deathCerts.get(0).setAge(deathDtls.get(0).getAge());
				deathCerts.get(0).setWard(deathDtls.get(0).getDeathPermaddr().getTehsil());
				deathCerts.get(0).setState(deathDtls.get(0).getDeathPermaddr().getState());
				deathCerts.get(0).setDistrict(deathDtls.get(0).getDeathPermaddr().getDistrict());
				deathCerts.get(0).setDateofdeath(deathDtls.get(0).getDateofdeath());
				deathCerts.get(0).setDateofreport(deathDtls.get(0).getDateofreport());
				deathCerts.get(0).setPlaceofdeath(deathDtls.get(0).getPlaceofdeath());
				return deathCerts.get(0);
			}
		}catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("invalid_data","Invalid Data");
		}
		return null;
	}

	public void updateCounter(String deathDtlId, String tenantId) {
		try {
			String updateQry = "UPDATE {schema}.eg_death_dtls SET counter=counter+1 WHERE id=:id and tenantid not in (:tenantIds)";
			Map<String, Object> params = new HashMap<>();
			params.put("id", deathDtlId);
			params.put("tenantIds", Arrays.asList(freeDownloadTenants.split(",")));
			try {
				//TODO: Update is being called here. need to check with kavi if we need to call here to
				updateQry = centralInstanceUtil.replaceSchemaPlaceholder(updateQry, tenantId);
			} catch (InvalidTenantIdException e) {
				throw new CustomException("DEATHCERT_UPDATE_TENANTID_ERROR",
						"TenantId length is not sufficient to replace query schema in a multi state instance");
			}
			namedParameterJdbcTemplate.update(updateQry, params);
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("Invalid_data", "Error in updating");
		}
		
	}

	public List<DeathCertAppln> searchApplications( String uuid, String tenantId) {
		List<DeathCertAppln> deathCertAppls = new ArrayList<>();
		try {
			List<Object> preparedStmtList = new ArrayList<>();
			String applQuery=allqueryBuilder.searchApplications(uuid, preparedStmtList);
			try {
				//TODO:Passing empty tenantId as tenantId is not there.need to cjeck with kavi
				applQuery = centralInstanceUtil.replaceSchemaPlaceholder(applQuery, tenantId);
			} catch (InvalidTenantIdException e) {
				throw new CustomException("DEATHCERT_SEARCH_TENANTID_ERROR",
						"TenantId length is not sufficient to replace query schema in a multi state instance");
			}
			deathCertAppls = jdbcTemplate.query(applQuery, preparedStmtList.toArray(), certApplnRowMapper);
		}
		catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("Invalid_data","Error in updating");
		}
		return deathCertAppls;
		
	}

	public void update(DeathCertRequest certRequest) {
		bndProducer.push(certRequest.getDeathCertificate().getTenantId(), config.getUpdateDeathTopic(), certRequest);
	}
	
	public String getShortenedUrl(String url){
		HashMap<String,String> body = new HashMap<>();
		body.put("url",url);
		StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
		builder.append(config.getUrlShortnerEndpoint());

		String res = null;
		try {
			 res = restTemplate.postForObject(builder.toString(), body, String.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("PARSING ERROR", "Failed to parse response of URL Shortening");
		}

		if(StringUtils.isEmpty(res)){
			log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+url);
			return url;
		}
		else return res;
	}
	
	public List<EgDeathDtl> viewCertificateData(SearchCriteria criteria) {
		List<EgDeathDtl> certData = new ArrayList<>();
		DeathCertificate certificate = getDeathCertReqByConsumerCode(criteria.getDeathcertificateno(),null, criteria.getTenantId());
		criteria.setId(certificate.getDeathDtlId());
		criteria.setTenantId(certificate.getTenantId());
		certData= getDeathDtlsAll(criteria,null);
		certData.get(0).setDateofissue(certificate.getDateofissue());
		return certData;
	}
	
	public List<EgDeathDtl> viewfullCertMasterData(SearchCriteria criteria,RequestInfo requestInfo) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getDeathCertMasterDtl(criteria, preparedStmtList);
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("DEATHCERT_SEARCH_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
        List<EgDeathDtl> deathCertMasterDtl =  jdbcTemplate.query(query, preparedStmtList.toArray(), deathMasterDtlRowMapper);
		if(deathCertMasterDtl != null) {
			deathCertMasterDtl.forEach(deathDtl -> {
				deathDtl.setDeathFatherInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathFatherInfo(), "BndDetail", EgDeathFatherInfo.class, requestInfo));
				deathDtl.setDeathMotherInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathMotherInfo(), "BndDetail", EgDeathMotherInfo.class, requestInfo));
				deathDtl.setDeathSpouseInfo(encryptionDecryptionUtil.decryptObject(deathDtl.getDeathSpouseInfo(), "BndDetail", EgDeathSpouseInfo.class, requestInfo));
				EgDeathDtl dec = encryptionDecryptionUtil.decryptObject(deathDtl, "BndDetail", EgDeathDtl.class, requestInfo);
				deathDtl.setAadharno(dec.getAadharno());
				deathDtl.setIcdcode(dec.getIcdcode());
				if (!requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE"))
					commonUtils.maskAndShowLast4Chars(deathDtl);
			});
		}
        return deathCertMasterDtl;
	}
}
