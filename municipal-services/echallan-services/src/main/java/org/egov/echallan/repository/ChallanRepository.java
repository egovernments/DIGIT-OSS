package org.egov.echallan.repository;

import lombok.extern.slf4j.Slf4j;

import java.io.ObjectInputStream.GetField;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.model.Challan;
import org.egov.echallan.model.ChallanRequest;
import org.egov.echallan.model.SearchCriteria;
import org.egov.echallan.producer.Producer;
import org.egov.echallan.repository.builder.ChallanQueryBuilder;
import org.egov.echallan.repository.rowmapper.ChallanCountRowMapper;
import org.egov.echallan.repository.rowmapper.ChallanRowMapper;
import org.egov.echallan.util.CommonUtils;
import org.egov.echallan.web.models.collection.Bill;
import org.egov.echallan.web.models.collection.PaymentDetail;
import org.egov.echallan.web.models.collection.PaymentRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.MDC;

import org.egov.echallan.util.ChallanConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.egov.echallan.util.ChallanConstants.*;
import static org.egov.echallan.repository.builder.ChallanQueryBuilder.*;


@Slf4j
@Repository
public class ChallanRepository {

    private Producer producer;
    
    private ChallanConfiguration config;

    private JdbcTemplate jdbcTemplate;

    private ChallanQueryBuilder queryBuilder;

    private ChallanRowMapper rowMapper;
    
    private RestTemplate restTemplate;

    @Value("${egov.filestore.host}")
    private String fileStoreHost;

    @Value("${egov.filestore.setinactivepath}")
	private String fileStoreInactivePath;

    @Autowired
	private ObjectMapper mapper;

    @Autowired
    private ChallanCountRowMapper countRowMapper;

    @Autowired
    private MultiStateInstanceUtil centralInstanceutil;

    @Autowired
    public ChallanRepository(Producer producer, ChallanConfiguration config,ChallanQueryBuilder queryBuilder,
    		JdbcTemplate jdbcTemplate,ChallanRowMapper rowMapper,RestTemplate restTemplate) {
        this.producer = producer;
        this.config = config;
        this.jdbcTemplate = jdbcTemplate;
        this.queryBuilder = queryBuilder ; 
        this.rowMapper = rowMapper;
        this.restTemplate = restTemplate;
    }



    /**
     * Pushes the request on save topic
     *
     * @param challanRequest The challan create request
     */
    public void save(ChallanRequest challanRequest) {
    	
        producer.push(challanRequest.getChallan().getTenantId(),config.getSaveChallanTopic(), challanRequest);
    }
    
    /**
     * Pushes the request on update topic
     *
     * @param challanRequest The challan create request
     */
    public void update(ChallanRequest challanRequest) {
    	
        producer.push(challanRequest.getChallan().getTenantId(),config.getUpdateChallanTopic(), challanRequest);
    }
    
    
    public List<Challan> getChallans(SearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getChallanSearchQuery(criteria, preparedStmtList, false);
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, criteria.getTenantId());
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }

        List<Challan> challans =  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        return challans;
    }

    /**
     * gets the total count for a search request
     *
     * @param criteria The challan search criteria
     */
    public int getChallanSearchCount(SearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getChallanSearchQuery(criteria, preparedStmtList,true);
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, criteria.getTenantId());
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }
        int count = jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
        return count;
    }


	public void updateFileStoreId(List<Challan> challans) {
		List<Object[]> rows = new ArrayList<>();

        challans.forEach(challan -> {
        	rows.add(new Object[] {challan.getFilestoreid(),
        			challan.getId()}
        	        );
        });

        String query = FILESTOREID_UPDATE_SQL;
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, challans.get(0).getTenantId());
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }

        jdbcTemplate.batchUpdate(query,rows);
		
	}
	
	 public void setInactiveFileStoreId(String tenantId, List<String> fileStoreIds)  {
			String idLIst = fileStoreIds.toString().substring(1, fileStoreIds.toString().length() - 1).replace(", ", ",");
			String Url = fileStoreHost + fileStoreInactivePath + "?tenantId=" + tenantId + "&fileStoreIds=" + idLIst;
			try {
				  restTemplate.postForObject(Url, null, String.class) ;
			} catch (Exception e) {
				log.error("Error in calling fileStore "+e.getMessage());
			}
			 
		}



	public void updateChallanOnCancelReceipt(HashMap<String, Object> record) {
		// TODO Auto-generated method stub

		PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
		RequestInfo requestInfo = paymentRequest.getRequestInfo();

		List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
		String tenantId = paymentRequest.getPayment().getTenantId();

        // Adding in MDC so that tracer can add it in header
        MDC.put(TENANTID_MDC_STRING, tenantId);

		List<Object[]> rows = new ArrayList<>();
		for (PaymentDetail paymentDetail : paymentDetails) {
			Bill bill = paymentDetail.getBill();
			rows.add(new Object[] {bill.getConsumerCode(),
        			bill.getBusinessService()}
        	        );
		}
        String query = CANCEL_RECEIPT_UPDATE_SQL;
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, tenantId);
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }
        jdbcTemplate.batchUpdate(query,rows);
		
	}

    /**
     * DB Repository that makes jdbc calls to the db and fetches challan count.
     *
     * @param tenantId
     * @return
     */
    public Map<String,String> fetchChallanCount(String tenantId){
        Map<String,String> response = new HashMap<>();
        List<Object> preparedStmtList = new ArrayList<>();

        String query = queryBuilder.getChallanCountQuery(tenantId, preparedStmtList);

        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, tenantId);
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }

        try {
            response=jdbcTemplate.query(query, preparedStmtList.toArray(),countRowMapper);
        }catch(Exception e) {
            log.error("Exception while making the db call: ",e);
            log.error("query; "+query);
        }
        return response;
    }



	public Map<String,Integer> fetchDynamicData(String tenantId) {

		List<Object> preparedStmtListTotalCollection = new ArrayList<>();
		String query = queryBuilder.getTotalCollectionQuery(tenantId, preparedStmtListTotalCollection);
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, tenantId);
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }

		Integer totalCollection = jdbcTemplate.queryForObject(query,preparedStmtListTotalCollection.toArray(),Integer.class);

		List<Object> preparedStmtListTotalServices = new ArrayList<>();
		query = queryBuilder.getTotalServicesQuery(tenantId, preparedStmtListTotalServices);
        try {
            query = centralInstanceutil.replaceSchemaPlaceholder(query, tenantId);
        } catch (InvalidTenantIdException e) {
            throw new CustomException("ECHALLAN_AS_TENANTID_ERROR",
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }

		int totalServices = jdbcTemplate.queryForObject(query,preparedStmtListTotalServices.toArray(),Integer.class);

		Map<String, Integer> dynamicData = new HashMap<String,Integer>();

        if(totalCollection!=null)
        {
            dynamicData.put(ChallanConstants.TOTAL_COLLECTION, totalCollection);
        }
        else {
            dynamicData.put(ChallanConstants.TOTAL_COLLECTION, 0);
        }

		dynamicData.put(ChallanConstants.TOTAL_SERVICES, totalServices);

		return dynamicData;

	}

}
