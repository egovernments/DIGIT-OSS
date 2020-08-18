package org.egov.tl.util;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.service.URLShorterService;
import org.egov.tl.web.models.TradeLicense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ShortUrlTest implements CommandLineRunner {

	@Autowired
	private NotificationUtil notificationUtil;

	@Autowired
	private ShortUrlUtil shortUrlUtil;

	@Value("${egov.ui.app.host}")
	private String domainName;

	@Value("${egov.tl.citizen.search}")
	private String tlCitizenSearchUrl;

	@Autowired
	private URLShorterService urlShorterService;
	
	@Autowired
	private TLRenewalNotificationUtil tlRenewalNotificationUtil; 

	@Override
	public void run(String... args) throws Exception {

		TradeLicense license = new TradeLicense();
		license.setTradeName("Sanjeev Trade");
		license.setTenantId("uk");
		license.setApplicationNumber("lal-sl");
		Map<String, String> valMap = new HashMap<String, String>();
		valMap.put("amountPaid", "12365");
		valMap.put("receiptNumber", "189-uio-ak");

		String localizationMessages = "{\n" + "  \"messages\": [\n" + "    {\n"
				+ "      \"code\": \"tl.en.counter.approved\",\n"
				+ "      \"message\": \"Dear <1>, Your Trade License application for <2> is now approved. Please pay your Trade License Fee of INR <3> online by logging into your NagarSewa account using this link <5> or at your municipal office to get your Trade License Certificate. Thank You. NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    },\n" + "    {\n"
				+ "      \"code\": \"tl.en.counter.payment.successful.owner\",\n"
				+ "      \"message\": \"Dear <1>, Thank You for making payment of <2> against your Trade license application for <3> with application number <applicationNumber>. Your receipt no. is <4>. You can download the receipt by clicking on this link <5> . Thank You. NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    },\n" + "    {\n"
				+ "      \"code\": \"tl.en.counter.payment.successful.payer\",\n"
				+ "      \"message\": \"Dear <1>, Thank You for making payment of <2> against your Trade license application for <3> with application number <applicationNumber>. Your receipt no. is <4>. You can download the receipt by clicking on this link <5> . Thank You. NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    },\n" + "    {\n"
				+ "      \"code\": \"tl.en.counter.renewal.payment.successful.owner\",\n"
				+ "      \"message\": \"Dear <1>, Thank You for making payment of <2> against your renew application for <3> with application number <applicationNumber>. Your receipt no. is <4>. You can download the receipt by clicking on this link <5> . Thank You. NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    },\n" + "    {\n"
				+ "      \"code\": \"tl.en.counter.renewal.payment.successful.payer\",\n"
				+ "      \"message\": \"Dear <1>, Thank You for making payment of <2> against your renew application for <3> with application number <applicationNumber>. Your receipt no. is <4>. You can download the receipt by clicking on this link <5> . Thank You. NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    },\n" + "    {\n"
				+ "      \"code\": \"tl.renew.en.counter.approved\",\n"
				+ "      \"message\": \"Dear <1>, your trade license renewal application for license number <3> is approved. Please pay your Trade License Renewal Fee of INR <4> online by logging into your NagarSewa account using this link <5> or at your municipal office to get the renewed certificate. Thank You.NagarSewa.\",\n"
				+ "      \"module\": \"rainmaker-tl\",\n" + "      \"locale\": \"en_IN\"\n" + "    }\n" + "  ]\n" + "}";

		System.out.println(notificationUtil.getOwnerPaymentMsg(license, valMap, localizationMessages));
		System.out.println(notificationUtil.getPayerPaymentMsg(license, valMap, localizationMessages));
		System.out.println(tlRenewalNotificationUtil.getOwnerPaymentMsg(license, valMap, localizationMessages));
		System.out.println(tlRenewalNotificationUtil.getPayerPaymentMsg(license, valMap, localizationMessages));
		
		license.setAction("APPROVE");
		license.setStatus("PENDINGPAYMENT");
		license.setValidTo(1597646075l);
		
		System.out.println(notificationUtil.getCustomizedMsg(new RequestInfo(), license, localizationMessages));
		System.out.println(tlRenewalNotificationUtil.getCustomizedMsg(new RequestInfo(), license, localizationMessages));

		System.out.println("end");
	}

}
