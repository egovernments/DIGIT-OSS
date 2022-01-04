package org.egov.edcr;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.PlanInformation;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.feature.PlanInfoFeatureExtract;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.jfree.util.Log;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.parser.DXFParser;
import org.kabeja.parser.ParseException;
import org.kabeja.parser.Parser;
import org.kabeja.parser.ParserBuilder;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnit44Runner;
import org.springframework.context.support.ResourceBundleMessageSource;

@RunWith(MockitoJUnit44Runner.class)

public class BaseTest {
	private static final Logger LOG = Logger.getLogger(BaseTest.class);
    protected PlanDetail pl;
    protected DXFDocument doc;
    ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    PlanInfoFeatureExtract featureExtract = new PlanInfoFeatureExtract();
    String dxfFile = "test2.dxf";// override this in subfeature test
    protected Parser parser = ParserBuilder.createDefaultParser();
    
    @Mock
    private Util util;
    
    @Mock
    private LayerNames layerNames;

    @BeforeClass
    public static void init() {
        BasicConfigurator.configure();

    }

	/*
	 * @AfterClass public static void tearDownAfterClass() {
	 * 
	 * }
	 * 
	 * @Test public final void testVal() {
	 * 
	 * }
	 */

    @Before
    public void setUp() throws IOException {
        featureExtract.setUtil(util);
        featureExtract.setLayerNames(layerNames);
        messageSource.setBasename("i18n/messages");
        File file = new File(
                featureExtract.getClass().getClassLoader().getResource("messages/service-message-edcr-extract.properties").getFile());
        
        try (FileInputStream stm = new FileInputStream(file);) {
        	Properties commonMessages = new Properties();
            commonMessages.load(stm);
            messageSource.setCommonMessages(commonMessages);

            pl = new PlanDetail();
            pl.setPlanInformation(new PlanInformation());
            DXFDocument doc = getDxfDocument(dxfFile);
            pl.setDoc(doc);

            featureExtract.setEdcrMessageSource(messageSource);

            pl = featureExtract.extract(pl);
		} catch (IOException e) {
			LOG.error("Error occurred while loading file", e);
		} 

    }

	/*
	 * @After public void tearDown() throws Exception {
	 * 
	 * }
	 */

    protected DXFDocument getDxfDocument(String fileName) {
        // Parser parser = ParserBuilder.createDefaultParser();
        DXFDocument doc = new DXFDocument();
        try {
            File file = new File(getClass().getClassLoader().getResource(fileName).getFile());
            parser.parse(file.getPath(), DXFParser.DEFAULT_ENCODING);
            doc = parser.getDocument();

        } catch (ParseException e) {

        	LOG.error("Error while parsing..................", e);
        } 

        return doc;
    }

}
