package org.bel.birthdeath.birth.repository;


import java.text.SimpleDateFormat;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import org.bel.birthdeath.birth.certmodel.BirthCertAppln;
import org.bel.birthdeath.birth.certmodel.BirthCertRequest;
import org.bel.birthdeath.birth.certmodel.BirthCertificate;
import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.birth.model.EgBirthFatherInfo;
import org.bel.birthdeath.birth.model.EgBirthMotherInfo;
import org.bel.birthdeath.birth.model.SearchCriteria;
import org.bel.birthdeath.birth.repository.builder.BirthDtlAllQueryBuilder;
import org.bel.birthdeath.birth.repository.rowmapper.BirthCertApplnRowMapper;
import org.bel.birthdeath.birth.repository.rowmapper.BirthCertRowMapper;
import org.bel.birthdeath.birth.repository.rowmapper.BirthDtlsAllRowMapper;
import org.bel.birthdeath.birth.repository.rowmapper.BirthDtlsRowMapper;
import org.bel.birthdeath.birth.repository.rowmapper.BirthMasterDtlRowMapper;
import org.bel.birthdeath.common.Idgen.IdGenerationRequest;
import org.bel.birthdeath.common.Idgen.IdGenerationResponse;
import org.bel.birthdeath.common.contract.BirthPdfApplicationRequest;
import org.bel.birthdeath.common.contract.EgovPdfResp;
import org.bel.birthdeath.common.contract.EncryptionDecryptionUtil;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.common.producer.BndProducer;
import org.bel.birthdeath.common.repository.ServiceRequestRepository;
import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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
public class BirthRepository {

	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private BirthDtlAllQueryBuilder allqueryBuilder;
	
	@Autowired
	private BirthDtlsRowMapper rowMapper;
	
	@Autowired
	private BirthDtlsAllRowMapper allRowMapper;
	
	@Autowired
	private BirthMasterDtlRowMapper birthMasterDtlRowMapper;
	
	@Autowired
	private BirthCertRowMapper birthCertRowMapper;
	
	@Autowired
	private BirthCertApplnRowMapper certApplnRowMapper;
	
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
	
	@Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	@Value("${egov.bnd.freedownload.tenants}")
    private String freeDownloadTenants;
	
	public List<EgBirthDtl> getBirthDtls(SearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getBirtDtls(criteria, preparedStmtList);
        return  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
	}

	public List<BirthCertificate> getBirthCertificateForPlainSearch(SearchCriteria criteria) {
		List<BirthCertificate> birthCertificates = new ArrayList<>();
		int limit = config.getDefaultBndLimit();
		int offset = config.getDefaultOffset();

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			limit = config.getMaxSearchLimit();

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		String query = "SELECT * FROM eg_birth_cert_request OFFSET " + offset + " LIMIT " + limit;
		List<Map<String, Object>> list =  jdbcTemplate.queryForList(query);
		log.info("Size of list: " + list.size());
		for(Map<String, Object> map: list) {
			BirthCertificate birthCertificate = new BirthCertificate();
			EgBirthDtl birthDtl = getBirthDtlById((String) map.get("birthdtlid"));

			birthCertificate.setId((String) map.get("id"));
			birthCertificate.setBirthCertificateNo((String) map.get("birthcertificateno"));
			birthCertificate.setBirthDtlId((String) map.get("birthdtlid"));
			birthCertificate.setFilestoreid((String) map.get("filestoreid"));
			birthCertificate.setApplicationStatus(BirthCertificate.StatusEnum.valueOf((String) map.get("status")));
			birthCertificate.setAdditionalDetail(map.get("additionaldetail"));
			birthCertificate.setEmbeddedUrl((String) map.get("embeddedurl"));
			birthCertificate.setDateofissue(((Long) map.get("dateofissue")));
			birthCertificate.setSource((String) map.get("source"));
			birthCertificate.setBirthPlace(birthDtl.getPlaceofbirth());
			birthCertificate.setGender(birthDtl.getGenderStr());

			birthCertificate.setWard(birthDtl.getBirthPermaddr() != null ? birthDtl.getBirthPermaddr().getTehsil() : null);
			birthCertificate.setState(birthDtl.getBirthPermaddr() != null ? birthDtl.getBirthPermaddr().getState() : null);
			birthCertificate.setDistrict(birthDtl.getBirthPresentaddr() != null ? birthDtl.getBirthPresentaddr().getDistrict() : null);
			birthCertificate.setTenantId(birthDtl.getTenantid());
			birthCertificate.setDateofbirth(birthDtl.getDateofbirth());
			birthCertificate.setDateofreport(birthDtl.getDateofreport());

			AuditDetails auditDetails = new AuditDetails();
			auditDetails.setCreatedBy((String) map.get("createdby"));
			auditDetails.setCreatedTime(((Long) map.get("createdtime")));
			auditDetails.setLastModifiedTime(((Long) map.get("lastmodifiedtime")));
			auditDetails.setLastModifiedBy((String) map.get("lastmodifiedby"));
			birthCertificate.setAuditDetails(auditDetails);

			birthCertificates.add(birthCertificate);
		}
		return birthCertificates;
	}

	public EgBirthDtl getBirthDtlById(String id) {
		String birthDtlQuery = "SELECT * FROM eg_birth_dtls WHERE id = ?";
		return (EgBirthDtl) jdbcTemplate.queryForObject(birthDtlQuery, new Object[]{id}, new BeanPropertyRowMapper(EgBirthDtl.class));
	}

	public void save(BirthCertRequest birthCertRequest) {
		bndProducer.push(config.getSaveBirthTopic(), birthCertRequest);
	}

	public EgovPdfResp saveBirthCertPdf(BirthPdfApplicationRequest pdfApplicationRequest) {
		EgovPdfResp result= new EgovPdfResp();
		try {
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");	
		pdfApplicationRequest.getBirthCertificate().forEach(cert-> {
			String uiHost = config.getUiAppHost();
			String birthCertPath = config.getBirthCertLink();
			birthCertPath = birthCertPath.replace("$id",cert.getId());
			birthCertPath = birthCertPath.replace("$tenantId",cert.getTenantid());
			birthCertPath = birthCertPath.replace("$regNo",cert.getRegistrationno());
			birthCertPath = birthCertPath.replace("$dateofbirth",format.format(cert.getDateofbirth()));
			birthCertPath = birthCertPath.replace("$gender",cert.getGender().toString());
			birthCertPath = birthCertPath.replace("$birthcertificateno",cert.getBirthcertificateno());
			String finalPath = uiHost + birthCertPath;
			cert.setEmbeddedUrl(getShortenedUrl(finalPath));
        });
		log.info(new Gson().toJson(pdfApplicationRequest));

			BirthPdfApplicationRequest req = BirthPdfApplicationRequest.builder().birthCertificate(pdfApplicationRequest.getBirthCertificate()).requestInfo(pdfApplicationRequest.getRequestInfo()).build();
			pdfApplicationRequest.getBirthCertificate().forEach(cert-> {
				String uiHost = config.getEgovPdfHost();
				String birthCertPath = config.getEgovPdfBirthEndPoint();
				String tenantId = cert.getTenantid().split("\\.")[0];
				birthCertPath = birthCertPath.replace("$tenantId",tenantId);
				String pdfFinalPath = uiHost + birthCertPath;
				EgovPdfResp response = restTemplate.postForObject(pdfFinalPath, req, EgovPdfResp.class);
				if (response != null && CollectionUtils.isEmpty(response.getFilestoreIds())) {
					throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
							"No file store id found from pdf service");
				}
				result.setFilestoreIds(response.getFilestoreIds());
			});
		}catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("PDF_ERROR","Error in generating PDF");
		}
		return result;
	}

	public List<EgBirthDtl> getBirthDtlsAll(SearchCriteria criteria ,RequestInfo requestInfo) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getBirtDtlsAll(criteria, preparedStmtList);
        List<EgBirthDtl> birthDtls =  jdbcTemplate.query(query, preparedStmtList.toArray(), allRowMapper);
		if(birthDtls != null) {
			birthDtls.forEach(birthDtl -> {
				birthDtl.setBirthFatherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthFatherInfo(), BirthDeathConstants.BND_DESCRYPT_KEY, EgBirthFatherInfo.class, requestInfo));
				birthDtl.setBirthMotherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthMotherInfo(), BirthDeathConstants.BND_DESCRYPT_KEY, EgBirthMotherInfo.class, requestInfo));
				commonUtils.maskAndShowLast4Chars(birthDtl);
			});
		}
        return birthDtls;
	}

	public BirthCertificate getBirthCertReqByConsumerCode(String consumerCode, RequestInfo requestInfo) {
	try {
		List<Object> preparedStmtList = new ArrayList<>();
		SearchCriteria criteria = new SearchCriteria();
		String query = allqueryBuilder.getBirthCertReq(consumerCode,requestInfo,preparedStmtList);
		List<BirthCertificate> birthCerts =  jdbcTemplate.query(query, preparedStmtList.toArray(), birthCertRowMapper);
		if(null!=birthCerts && !birthCerts.isEmpty()) {
			criteria.setTenantId(birthCerts.get(0).getTenantId());
			criteria.setId(birthCerts.get(0).getBirthDtlId());
			List<EgBirthDtl> birtDtls = getBirthDtlsAll(criteria, requestInfo);
			birthCerts.get(0).setBirthPlace(birtDtls.get(0).getPlaceofbirth());
			birthCerts.get(0).setGender(birtDtls.get(0).getGenderStr());
			birthCerts.get(0).setWard(birtDtls.get(0).getBirthPermaddr().getTehsil());
			birthCerts.get(0).setState(birtDtls.get(0).getBirthPermaddr().getState());
			birthCerts.get(0).setDistrict(birtDtls.get(0).getBirthPermaddr().getDistrict());
			birthCerts.get(0).setDateofbirth(birtDtls.get(0).getDateofbirth());
			birthCerts.get(0).setDateofreport(birtDtls.get(0).getDateofreport());
			return birthCerts.get(0);
		}
	}
	catch(Exception e) {
		e.printStackTrace();
		throw new CustomException("invalid_data","Invalid Data");
	}
	return null;
	}

	public void updateCounter(String birthDtlId) {
		try {
			String updateQry="UPDATE public.eg_birth_dtls SET counter=counter+1 WHERE id=:id and tenantid not in (:tenantIds)";
			Map<String, Object> params = new HashMap<>();
			params.put("id", birthDtlId);
			params.put("tenantIds",Arrays.asList(freeDownloadTenants.split(",")));
			namedParameterJdbcTemplate.update(updateQry ,params);
		}catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("Invalid_data","Error in updating");
		}
		
	}

	public List<BirthCertAppln> searchApplications( String uuid) {
		List<BirthCertAppln> birthCertAppls = new ArrayList<>();
		try {
			List<Object> preparedStmtList = new ArrayList<>();
			String applQuery=allqueryBuilder.searchApplications(uuid, preparedStmtList);
			birthCertAppls = jdbcTemplate.query(applQuery, preparedStmtList.toArray(), certApplnRowMapper);
		}
		catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("Invalid_data","Error in updating");
		}
		return birthCertAppls;
		
	}

	public void update(BirthCertRequest certRequest) {
		bndProducer.push(config.getUpdateBirthTopic(), certRequest);
	}
	
	public String getShortenedUrl(String url){
		HashMap<String,String> body = new HashMap<>();
		body.put("url",url);
		StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
		builder.append(config.getUrlShortnerEndpoint());
		String res = restTemplate.postForObject(builder.toString(), body, String.class);
		if(StringUtils.isEmpty(res)){
			log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+url);
			return url;
		}
		else return res;
	}

	public List<EgBirthDtl> viewCertificateData(SearchCriteria criteria) {
		List<EgBirthDtl> certData = new ArrayList<>();
		BirthCertificate certificate = getBirthCertReqByConsumerCode(criteria.getBirthcertificateno(),null);
		criteria.setId(certificate.getBirthDtlId());
		certData = getBirthDtlsAll(criteria,null);
		certData.get(0).setDateofissue(certificate.getDateofissue());
		return certData;
	}
	
	public List<EgBirthDtl> viewfullCertMasterData(SearchCriteria criteria,RequestInfo requestInfo) {
		List<Object> preparedStmtList = new ArrayList<>();
        String query = allqueryBuilder.getBirthCertMasterDtl(criteria, preparedStmtList);
        List<EgBirthDtl> birthCertMasterDtl =  jdbcTemplate.query(query, preparedStmtList.toArray(), birthMasterDtlRowMapper);
		if(birthCertMasterDtl != null) {
			birthCertMasterDtl.forEach(birthDtl -> {
				birthDtl.setBirthFatherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthFatherInfo(), "BndDetail", EgBirthFatherInfo.class, requestInfo));
				birthDtl.setBirthMotherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthMotherInfo(), "BndDetail", EgBirthMotherInfo.class, requestInfo));
				if (!requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE"))
					commonUtils.maskAndShowLast4Chars(birthDtl);
			});
		}
        return birthCertMasterDtl;
	}
}
