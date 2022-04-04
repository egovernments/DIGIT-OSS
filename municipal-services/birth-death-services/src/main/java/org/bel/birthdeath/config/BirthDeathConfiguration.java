package org.bel.birthdeath.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class BirthDeathConfiguration {


    //Idgen Config
    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;

    @Value("${egov.idgen.birthapplnum.name}")
    private String birthApplNumberIdgenName;

    @Value("${egov.idgen.birthapplnum.format}")
    private String birthApplNumberIdgenFormat;


    //Persister Config
    @Value("${persister.save.birth.topic}")
    private String saveBirthTopic;

    @Value("${persister.update.birth.topic}")
    private String updateBirthTopic;

    @Value("${egov.idgen.deathapplnum.name}")
    private String deathApplNumberIdgenName;

    @Value("${egov.idgen.deathapplnum.format}")
    private String deathApplNumberIdgenFormat;


    //Persister Config
    @Value("${persister.save.death.topic}")
    private String saveDeathTopic;

    @Value("${persister.update.death.topic}")
    private String updateDeathTopic;
    
    //MDMS
    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsEndPoint;

    @Value("${egov.billingservice.host}")
    private String billingHost;

    @Value("${egov.bill.gen.endpoint}")
    private String fetchBillEndpoint;

    @Value("${egov.demand.create.endpoint}")
    private String demandCreateEndpoint;
    
    @Value("${egov.pdf.host}")
    private String pdfHost;
    
    @Value("${egov.pdf.birthcert.postendpoint}")
    private String saveBirthCertEndpoint;
    
    @Value("${egov.pdf.deathcert.postendpoint}")
    private String saveDeathCertEndpoint;
    
    @Value("${egov.bnd.birthcert.link}")
    private String birthCertLink;
    
    @Value("${egov.bnd.deathcert.link}")
    private String deathCertLink;

    @Value("${egov.url.shortner.host}")
    private String urlShortnerHost;
    
    @Value("${egov.url.shortner.endpoint}")
    private String urlShortnerEndpoint;
    
    @Value("${egov.ui.app.host}")
	private String uiAppHost;

    @Value("${egov.bnd.default.limit}")
    private Integer defaultBndLimit;

    @Value("${egov.bnd.default.offset}")
    private Integer defaultOffset;

    @Value("${egov.bnd.max.limit}")
    private Integer maxSearchLimit;
    
    @Value("${egov.bnd.download.bufferdays}")
    private Integer downloadBufferDays;
    
    @Value("${egov.collection.service.host}")
	private String collectionServiceHost;
	
	@Value("${egov.payment.search.endpoint}")
	private String	PaymentSearchEndpoint;

    @Value("${egov.pdfservice.host}")
    private String	egovPdfHost;

    @Value("${egov.pdf.birthcert.createEndPoint}")
    private String	egovPdfBirthEndPoint;

    @Value("${egov.pdf.deathcert.createEndPoint}")
    private String	egovPdfDeathEndPoint;

}
