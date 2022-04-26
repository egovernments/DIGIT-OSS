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
import org.bel.birthdeath.common.producer.BndProducer;
import org.bel.birthdeath.common.repository.ServiceRequestRepository;
import org.bel.birthdeath.config.BirthDeathConfiguration;
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
        List<EgBirthDtl> birthDtls =  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        return birthDtls;
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
		for(Map map: list) {
			BirthCertificate birthCertificate = new BirthCertificate();
			birthCertificate.getAuditDetails().setCreatedBy((String) map.get("createdby"));
			birthCertificate.getAuditDetails().setLastModifiedBy((String) map.get("lastmodifiedby"));
			birthCertificate.getAuditDetails().setCreatedTime(((Long) map.get("createdtime")).longValue());
			birthCertificate.getAuditDetails().setLastModifiedTime(((Long) map.get("lastmodifiedtime")).longValue());
			log.info("Created by : " + map.get("createdby"));
			log.info(birthCertificate.getAuditDetails().toString());
			birthCertificates.add(birthCertificate);
		}
		return birthCertificates;
	}

	public void save(BirthCertRequest birthCertRequest) {
		bndProducer.push(config.getSaveBirthTopic(), birthCertRequest);
	}

	public EgovPdfResp saveBirthCertPdf(BirthPdfApplicationRequest pdfApplicationRequest) {
		/*StringBuilder url = new StringBuilder(config.getPdfHost());
        url.append(config.getSaveBirthCertEndpoint());
        Object result = serviceRequestRepository.fetchResult(url,egBirthDtl);
        EgovPdfResp response = null;
        try{
            response = mapper.convertValue(result,EgovPdfResp.class);
        }
        catch(IllegalArgumentException e){
            throw new CustomException("PARSING ERROR","Failed to parse response of create demand");
        }
        return response;*/
		EgovPdfResp result= new EgovPdfResp();
		try {
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");	
		pdfApplicationRequest.getBirthCertificate().forEach(cert-> {
			String UIHost = config.getUiAppHost();
			String birthCertPath = config.getBirthCertLink();
			birthCertPath = birthCertPath.replace("$id",cert.getId());
			birthCertPath = birthCertPath.replace("$tenantId",cert.getTenantid());
			birthCertPath = birthCertPath.replace("$regNo",cert.getRegistrationno());
			birthCertPath = birthCertPath.replace("$dateofbirth",format.format(cert.getDateofbirth()));
			birthCertPath = birthCertPath.replace("$gender",cert.getGender().toString());
			birthCertPath = birthCertPath.replace("$birthcertificateno",cert.getBirthcertificateno());
			String finalPath = UIHost + birthCertPath;
			cert.setEmbeddedUrl(getShortenedUrl(finalPath));
        });
		log.info(new Gson().toJson(pdfApplicationRequest));
		//RestTemplate restTemplate = new RestTemplate();

			BirthPdfApplicationRequest req = BirthPdfApplicationRequest.builder().birthCertificate(pdfApplicationRequest.getBirthCertificate()).requestInfo(pdfApplicationRequest.getRequestInfo()).build();
			EgovPdfResp response = null;
			response = restTemplate.postForObject( config.getEgovPdfHost()+ config.getEgovPdfBirthEndPoint(), req, EgovPdfResp.class);
			if (CollectionUtils.isEmpty(response.getFilestoreIds())) {
				throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
						"No file store id found from pdf service");
			}
			result.setFilestoreIds(response.getFilestoreIds());

		/*HttpMethod requestMethod = HttpMethod.POST;
		HttpEntity<BirthPdfApplicationRequest> requestEntity = new HttpEntity<BirthPdfApplicationRequest>(pdfApplicationRequest);

		ResponseEntity<EgovPdfResp> response = restTemplate.exchange(url, requestMethod, requestEntity, EgovPdfResp.class);*/
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
        birthDtls.forEach(birthDtl -> {
        	birthDtl.setBirthFatherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthFatherInfo(), "BndDetail", EgBirthFatherInfo.class, requestInfo));
        	birthDtl.setBirthMotherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthMotherInfo(), "BndDetail", EgBirthMotherInfo.class, requestInfo));
        	commonUtils.maskAndShowLast4Chars(birthDtl);
        });
        return birthDtls;
	}

	public BirthCertificate getBirthCertReqByConsumerCode(String consumerCode, RequestInfo requestInfo) {
	try {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = allqueryBuilder.getBirthCertReq(consumerCode,requestInfo,preparedStmtList);
		List<BirthCertificate> birthCerts =  jdbcTemplate.query(query, preparedStmtList.toArray(), birthCertRowMapper);
		if(null!=birthCerts && !birthCerts.isEmpty()) {
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
		List<BirthCertAppln> birthCertAppls = new ArrayList<BirthCertAppln>();
		try {
			List<Object> preparedStmtList = new ArrayList<>();
			String applQuery=allqueryBuilder.searchApplications(uuid, preparedStmtList);
			birthCertAppls = jdbcTemplate.query(applQuery, preparedStmtList.toArray(), certApplnRowMapper);
			//log.info("searchApplications "+birthCertAppls.size());
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
			log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+url); ;
			return url;
		}
		else return res;
	}

	public List<EgBirthDtl> viewCertificateData(SearchCriteria criteria) {
		List<EgBirthDtl> certData = new ArrayList<EgBirthDtl>();
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
        birthCertMasterDtl.forEach(birthDtl -> {
        	birthDtl.setBirthFatherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthFatherInfo(), "BndDetail", EgBirthFatherInfo.class, requestInfo));
        	birthDtl.setBirthMotherInfo(encryptionDecryptionUtil.decryptObject(birthDtl.getBirthMotherInfo(), "BndDetail", EgBirthMotherInfo.class, requestInfo));
        	if(!requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE"))
        		commonUtils.maskAndShowLast4Chars(birthDtl);
        });
        return birthCertMasterDtl;
	}
}
