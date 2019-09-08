/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.demand.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.repository.BusinessServiceDetailRepository;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.BusinessServiceDetailRequest;
import org.egov.demand.web.contract.BusinessServiceDetailResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class BusinessServDetailService {

    public static final Logger LOGGER = LoggerFactory.getLogger(BusinessServDetailService.class);

    @Autowired
    private BusinessServiceDetailRepository businessServiceDetailRepository;

    @Autowired
    private ResponseFactory responseInfoFactory;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private SequenceGenService sequenceGenService;

    @Autowired
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	public BusinessServiceDetailResponse searchBusinessServiceDetails(
			final BusinessServiceDetailCriteria businessServiceDetailCriteria, final RequestInfo requestInfo) {
		
		final List<BusinessServiceDetail> businessServiceDetails = businessServiceDetailRepository
				.getBussinessServiceDetail(requestInfo,businessServiceDetailCriteria);
		return getBusinessServiceDetailResponse(businessServiceDetails, requestInfo);
	}

    public BusinessServiceDetailResponse create(BusinessServiceDetailRequest businessServiceDetailRequest) {

        List<BusinessServiceDetail> businessServiceDetailList = businessServiceDetailRepository.create(businessServiceDetailRequest);
        return getBusinessServiceDetailResponse(businessServiceDetailList, businessServiceDetailRequest.getRequestInfo());
    }

    public BusinessServiceDetailResponse createAsync(BusinessServiceDetailRequest businessServiceDetailRequest) {
        List<BusinessServiceDetail> businessServiceDetailList = businessServiceDetailRequest.getBusinessServiceDetails();

        List<String> bizServDetailIds = sequenceGenService.getIds(businessServiceDetailList.size(), applicationProperties.getBusinessServiceDetailSeqName());
        for (int i = 0; i < businessServiceDetailList.size(); i++)
            businessServiceDetailList.get(i).setId(bizServDetailIds.get(i));

        businessServiceDetailRequest.setBusinessServiceDetails(businessServiceDetailList);

       /* kafkaTemplate.send(applicationProperties.getCreateBusinessServiceDetailTopicName(), applicationProperties.getCreateBusinessServiceDetailTopicKey(),
                businessServiceDetailRequest);*/
        create(businessServiceDetailRequest);
        return getBusinessServiceDetailResponse(businessServiceDetailList, businessServiceDetailRequest.getRequestInfo());
    }

    public BusinessServiceDetailResponse updateAsync(BusinessServiceDetailRequest businessServiceDetailRequest) {

    	List<BusinessServiceDetail> businessServiceDetailList = businessServiceDetailRequest.getBusinessServiceDetails();
        /*for (BusinessServiceDetail businessServiceDetail : businessServiceDetailList) {
            auditDetail = businessServiceDetail.getAuditDetails();
            auditDetail.setLastModifiedBy(userId);
            auditDetail.setLastModifiedTime(currEpochDate);
        }*/
        kafkaTemplate.send(applicationProperties.getUpdateBusinessServiceDetailTopicName(), businessServiceDetailRequest);
        return getBusinessServiceDetailResponse(businessServiceDetailList, businessServiceDetailRequest.getRequestInfo());
    }

    public BusinessServiceDetailResponse update(BusinessServiceDetailRequest businessServiceDetailRequest) {
        List<BusinessServiceDetail> businessServiceDetailList = businessServiceDetailRepository.update(businessServiceDetailRequest);
        return getBusinessServiceDetailResponse(businessServiceDetailList, businessServiceDetailRequest.getRequestInfo());
    }

    private BusinessServiceDetailResponse getBusinessServiceDetailResponse(final List<BusinessServiceDetail> businessServiceDetails, final RequestInfo requestInfo) {
        final BusinessServiceDetailResponse businessServiceDetailResponse = new BusinessServiceDetailResponse();
        businessServiceDetailResponse.setBusinessServiceDetails(businessServiceDetails);
        businessServiceDetailResponse.setResponseInfo(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK));
        return businessServiceDetailResponse;
    }
}
