package org.egov.waterconnection.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.web.models.MeterConnectionRequest;
import org.egov.waterconnection.web.models.MeterReading;
import org.egov.waterconnection.web.models.MeterReading.MeterStatusEnum;
import org.egov.waterconnection.web.models.MeterReadingResponse;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

@Service
@Slf4j
public class MeterReadingService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private WaterServicesUtil waterServiceUtil;
	
	@SuppressWarnings("unchecked")
	public void process(WaterConnectionRequest request, String topic) {
		try {
			BigDecimal initialMeterReading = BigDecimal.ZERO;
			if (!StringUtils.isEmpty(request.getWaterConnection().getAdditionalDetails())) {
				HashMap<String, Object> addDetail = mapper
						.convertValue(request.getWaterConnection().getAdditionalDetails(), HashMap.class);
				if (addDetail.getOrDefault(WCConstants.INITIAL_METER_READING_CONST, null) != null) {
					initialMeterReading = new BigDecimal(
							String.valueOf(addDetail.get(WCConstants.INITIAL_METER_READING_CONST)));
					MeterConnectionRequest req = MeterConnectionRequest.builder().meterReading(MeterReading.builder()
							.connectionNo(request.getWaterConnection().getConnectionNo())
							.currentReading(initialMeterReading.doubleValue())
							.currentReadingDate(request.getWaterConnection().getConnectionExecutionDate().longValue())
							.tenantId(request.getWaterConnection().getTenantId())
							.meterStatus(MeterStatusEnum.WORKING)
							.billingPeriod(getBillingPeriod(
									request.getWaterConnection().getConnectionExecutionDate().longValue()))
							.generateDemand(Boolean.FALSE).lastReading(initialMeterReading.doubleValue())
							.lastReadingDate(request.getWaterConnection().getConnectionExecutionDate().longValue())
							.build()).requestInfo(request.getRequestInfo()).build();
					log.info("METER READING CREATE ---->  \n"+req.toString());
					Object response = serviceRequestRepository.fetchResult(waterServiceUtil.getMeterReadingCreateURL(),
							req);
					MeterReadingResponse readingResponse = mapper.convertValue(response, MeterReadingResponse.class);
					log.info(mapper.writeValueAsString(readingResponse));
				}
			} else {
				log.info("Intial Meter Reading Not Present!!");
			}
		} catch (Exception ex) {
			log.error("Error while creating meter reading!!!", ex);
		}
	}

	private String getBillingPeriod(Long connectionExecutionDate) {
		int noLength = (int) (Math.log10(connectionExecutionDate) + 1);
		LocalDate currentDate = Instant
				.ofEpochMilli(noLength > 10 ? connectionExecutionDate : connectionExecutionDate * 1000)
				.atZone(ZoneId.systemDefault()).toLocalDate();
		StringBuilder builder = new StringBuilder();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		return builder.append(currentDate.format(formatter)).append(" - ").append(currentDate.format(formatter))
				.toString();
	}
}
