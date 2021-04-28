package org.egov.win.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.collections.CollectionUtils;
import org.apache.velocity.Template;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.egov.tracer.model.CustomException;
import org.egov.win.model.Body;
import org.egov.win.model.Email;
import org.egov.win.model.EmailRequest;
import org.egov.win.model.Firenoc;
import org.egov.win.model.MiscCollections;
import org.egov.win.model.PGR;
import org.egov.win.model.PGRChannelBreakup;
import org.egov.win.model.PT;
import org.egov.win.model.SearcherRequest;
import org.egov.win.model.StateWide;
import org.egov.win.model.TL;
import org.egov.win.model.WaterAndSewerage;
import org.egov.win.producer.Producer;
import org.egov.win.repository.ServiceCallRepository;
import org.egov.win.utils.CronConstants;
import org.egov.win.utils.CronUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CronService {

	@Autowired
	private EmailService emailService;
	
	@Autowired
	private CronUtils utils;
	
	@Autowired
	private ExternalAPIService externalAPIService;

	@Autowired
	private Producer producer;

	@Value("${egov.core.notification.email.topic}")
	private String emailTopic;

	@Value("${egov.impact.emailer.interval.in.secs}")
	private Long timeInterval;

	@Value("${egov.impact.emailer.email.to.address}")
	private String toAddress;

	@Value("${egov.impact.emailer.email.subject}")
	private String subject;

	public void fetchData() {
		try {
			Email email = getDataFromDb();
			String content = emailService.formatEmail(email);
			send(email, content);
		} catch (Exception e) {
			log.info("Email will not be sent, ERROR: ", e);
		}

	}

	private Email getDataFromDb() {
		Body body = new Body();
		List<Map<String, Object>> wsData = externalAPIService.getWSData();
		if(CollectionUtils.isEmpty(wsData))
			throw new CustomException("EMAILER_DATA_RETREIVAL_FAILED", "Failed to retrieve data from WS module");
		enrichHeadersOfTheTable(body);
		enrichBodyWithStateWideData(body, wsData);
		enrichBodyWithPGRData(body);
		enrichBodyWithPTData(body);
		enrichBodyWithTLData(body);
		enrichBodyWithMiscCollData(body);
		enrichBodyWithWSData(body, wsData);
		enrichBodyWithFirenocData(body);
		return Email.builder().body(body).build();
	}

	private void enrichHeadersOfTheTable(Body body) {
		String prefix = "Week";
		Integer noOfWeeks = 6;
		List<Map<String, Object>> header = new ArrayList<>();
		for (int week = 0; week < noOfWeeks; week++) {
			Map<String, Object> date = new HashMap<>();
			date.put(prefix + week,
					utils.getDayAndMonth((System.currentTimeMillis() - ((timeInterval * 1000) * week))));
			header.add(date);
		}
		body.setHeader(header);
	}

	private void enrichBodyWithStateWideData(Body body, List<Map<String, Object>> wsData) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_SW);
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> revenueCollected = new ArrayList<>();
		List<Map<String, Object>> servicesApplied = new ArrayList<>();
		List<Map<String, Object>> noOfCitizensResgistered = new ArrayList<>();
		Map<String, Object> map = utils.getWeekWiseRevenue(wsData);
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> revenueCollectedPerWeek = new HashMap<>();
			Map<String, Object> servicesAppliedPerWeek = new HashMap<>();
			Map<String, Object> noOfCitizensResgisteredPerWeek = new HashMap<>();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			Integer wsIndex = 0;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ulbCoveredPerWeek.put("w" + week + "ulbc", record.get("ulbcovered")); //ws not added because we need a union logic.
					revenueCollectedPerWeek.put("w" + week + "revcoll", 
							(new BigDecimal(record.get("revenuecollected").toString()).add(new BigDecimal(((Map) (map.get(prefix + week))).get("revenueCollected").toString()))));
					servicesAppliedPerWeek.put("w" + week + "serapp", 
							(new BigDecimal(record.get("servicesapplied").toString()).add(new BigDecimal(((Map) (map.get(prefix + week))).get("servicesApplied").toString()))));
					noOfCitizensResgisteredPerWeek.put("w" + week + "citreg", record.get("noofusersregistered"));
					wsIndex++;
				}
			}					
			ulbCovered.add(ulbCoveredPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
			servicesApplied.add(servicesAppliedPerWeek);
			noOfCitizensResgistered.add(noOfCitizensResgisteredPerWeek);
		}

		StateWide stateWide = StateWide.builder().noOfCitizensResgistered(noOfCitizensResgistered)
				.revenueCollected(revenueCollected).servicesApplied(servicesApplied).ulbCovered(ulbCovered).build();
		body.setStateWide(stateWide);		
	}

	private void enrichBodyWithPGRData(Body body) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_PGR);
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> totalComplaints = new ArrayList<>();
		List<Map<String, Object>> redressal = new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> totalComplaintsPerWeek = new HashMap<>();
			Map<String, Object> redressalPerWeek = new HashMap<>();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ulbCoveredPerWeek.put("w" + week + "pgrulbc", record.get("ulbcovered"));
					totalComplaintsPerWeek.put("w" + week + "pgrtcmp", record.get("totalcomplaints"));
					redressalPerWeek.put("w" + week + "pgrredd", record.get("redressal"));
				}
			}
			ulbCovered.add(ulbCoveredPerWeek);
			totalComplaints.add(totalComplaintsPerWeek);
			redressal.add(redressalPerWeek);
		}
		PGR pgr = PGR.builder().redressal(redressal).totalComplaints(totalComplaints).ulbCovered(ulbCovered).build();
		enrichBodyWithPGRChannelData(body, pgr);
		body.setPgr(pgr);
	}

	private void enrichBodyWithPGRChannelData(Body body, PGR pgr) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_PGR_CHANNEL);
		List<Map<String, Object>> ivr = new ArrayList<>();
		List<Map<String, Object>> mobiileApp = new ArrayList<>();
		List<Map<String, Object>> webApp = new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> ivrPerWeek = new HashMap<>();
			Map<String, Object> mobileAppPerWeek = new HashMap<>();
			Map<String, Object> webAppPerWeek = new HashMap<>();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ivrPerWeek.put("w" + week + "pgrchnlivr", record.get("ivr"));
					mobileAppPerWeek.put("w" + week + "pgrchnlmapp", record.get("mobileapp"));
					webAppPerWeek.put("w" + week + "pgrchnlweb", record.get("webapp"));
				}
			}
			ivr.add(ivrPerWeek);
			mobiileApp.add(mobileAppPerWeek);
			webApp.add(webAppPerWeek);
		}

		PGRChannelBreakup channel = PGRChannelBreakup.builder().ivr(ivr).mobileApp(mobiileApp).webApp(webApp).build();
		pgr.setChannelBreakup(channel);
	}

	private void enrichBodyWithPTData(Body body) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_PT);
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> revenueCollected = new ArrayList<>();
		List<Map<String, Object>> noOfProperties = new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> revenueCollectedPerWeek = new HashMap<>();
			Map<String, Object> noOfPropertiesPerWeek = new HashMap<>();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ulbCoveredPerWeek.put("w" + week + "ptulbc", record.get("ulbcovered"));
					revenueCollectedPerWeek.put("w" + week + "ptrevcoll", record.get("revenuecollected"));
					noOfPropertiesPerWeek.put("w" + week + "ptnoofprp", record.get("noofpropertiescreated"));
				}
			}
			ulbCovered.add(ulbCoveredPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
			noOfProperties.add(noOfPropertiesPerWeek);
		}

		PT pt = PT.builder().noOfProperties(noOfProperties).ulbCovered(ulbCovered).revenueCollected(revenueCollected)
				.build();
		body.setPt(pt);
	}

	private void enrichBodyWithTLData(Body body) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_TL);
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> licenseIssued = new ArrayList<>();
		List<Map<String, Object>> revenueCollected= new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> licenseIssuedPerWeek = new HashMap<>();
			Map<String,Object> revenueCollectedPerWeek=new HashMap<> ();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ulbCoveredPerWeek.put("w" + week + "tlulbc", record.get("ulbcovered"));
					licenseIssuedPerWeek.put("w" + week + "tllicissued", record.get("licenseissued"));
					revenueCollectedPerWeek.put("w" + week + "tlrevcoll", record.get("revenuecollected"));
					
				}
			}
			ulbCovered.add(ulbCoveredPerWeek);
			licenseIssued.add(licenseIssuedPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
		}

		TL tl = TL.builder().ulbCovered(ulbCovered).licenseIssued(licenseIssued).revenueCollected(revenueCollected).build();
		body.setTl(tl);
	}
	
	private void enrichBodyWithFirenocData(Body body) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_FIRENOC);
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> certificatesIssued = new ArrayList<>();
		List<Map<String, Object>> revenueCollected= new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> certificatesIssuedPerWeek = new HashMap<>();
			Map<String,Object> revenueCollectedPerWeek=new HashMap<> ();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					ulbCoveredPerWeek.put("w" + week + "fnulbc", record.get("ulbcovered"));
					certificatesIssuedPerWeek.put("w" + week + "fncertissued", record.get("certificatesissued"));
					revenueCollectedPerWeek.put("w" + week + "fnrevcoll", record.get("revenuecollected"));
					
				}
			}
			ulbCovered.add(ulbCoveredPerWeek);
			certificatesIssued.add(certificatesIssuedPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
		}

		Firenoc firenoc = Firenoc.builder().ulbCovered(ulbCovered).certificatesIssued(certificatesIssued).revenueCollected(revenueCollected).build();
		body.setFirenoc(firenoc);
	}
	
	private void enrichBodyWithWSData(Body body, List<Map<String, Object>> data) {
		List<Map<String, Object>> ulbCovered = new ArrayList<>();
		List<Map<String, Object>> revenueCollected = new ArrayList<>();
		List<Map<String, Object>> servicesApplied = new ArrayList<>();
		Integer week = 0;
		for (Map<String, Object> record : data) {
			Map<String, Object> ulbCoveredPerWeek = new HashMap<>();
			Map<String, Object> revenueCollectedPerWeek = new HashMap<>();
			Map<String, Object> servicesAppliedPerWeek = new HashMap<>();
			ulbCoveredPerWeek.put("w" + week + "wsulbc", record.get("ulbsCovered"));
			revenueCollectedPerWeek.put("w" + week + "wsrevcoll", record.get("revenueCollected"));
			servicesAppliedPerWeek.put("w" + week + "wsserapp", record.get("servicesApplied"));
			ulbCovered.add(ulbCoveredPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
			servicesApplied.add(servicesAppliedPerWeek);
			
			week++;
		}

		WaterAndSewerage waterAndSewerage = WaterAndSewerage.builder()
				.revenueCollected(revenueCollected).serviceApplied(servicesApplied).ulbCovered(ulbCovered).build();
		body.setWaterAndSewerage(waterAndSewerage);
	
	}
	
	
	private void enrichBodyWithMiscCollData(Body body) {
		List<Map<String, Object>> data = externalAPIService.getRainmakerData(CronConstants.SEARCHER_MC);
		List<Map<String, Object>> receiptsGenerated = new ArrayList<>();
		List<Map<String, Object>> revenueCollected = new ArrayList<>();
		for (Map<String, Object> record : data) {
			Map<String, Object> receiptsGeneratedPerWeek = new HashMap<>();
			Map<String, Object> revenueCollectedPerWeek = new HashMap<>();
			String prefix = "Week";
			Integer noOfWeeks = 6;
			for (int week = 0; week < noOfWeeks; week++) {
				if (record.get("day").equals(prefix + week)) {
					receiptsGeneratedPerWeek.put("w" + week + "mcrecgen", record.get("receiptscreated"));
					revenueCollectedPerWeek.put("w" + week + "mcrevcoll", record.get("revenuecollected"));
				}
			}
			receiptsGenerated.add(receiptsGeneratedPerWeek);
			revenueCollected.add(revenueCollectedPerWeek);
		}

		MiscCollections miscCollections = MiscCollections.builder().receiptsGenerated(receiptsGenerated).revenueCollected(revenueCollected).build();
		body.setMiscCollections(miscCollections);
	}

		

	private void send(Email email, String content) {
		String[] addresses = toAddress.split(",");
		for (String address : Arrays.asList(addresses)) {
			email.setTo(address);
			email.setSubject(subject);
			EmailRequest request = EmailRequest.builder().email(email.getTo()).subject(email.getSubject()).isHTML(true)
					.body(content).build();
			log.info("Sending email.......");
			producer.push(emailTopic, request);
		}
	}

	public Template getVelocityTemplate() {
		VelocityEngine ve = new VelocityEngine();
		ve.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		ve.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		ve.init();
		Template t = ve.getTemplate("velocity/weeklyimpactflasher.vm");
		return t;
	}

}