package org.egov;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.egov.domain.model.ReportDefinitions;
import org.egov.swagger.model.ReportDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;



@Configuration
@PropertySource("classpath:application.properties")
@SpringBootApplication
public class ReportApp implements EnvironmentAware {

	public static final Logger LOGGER = LoggerFactory.getLogger(ReportApp.class);

    @Autowired
    public static ResourceLoader resourceLoader;
   
    @Autowired
    private static Environment env;
    
    @Override
    public void setEnvironment(final Environment env) {
        ReportApp.env = env;
    }
    
    @Autowired
    private static ReportDefinitions reportDefinitions;
    
    public void setReportDefinitions(ReportDefinitions reportDefinitions) {
		ReportApp.reportDefinitions = reportDefinitions;
	}

	public ReportApp(ResourceLoader resourceLoader) {
    	this.resourceLoader = resourceLoader;
    }


	public static void main(String[] args) throws Exception {
		SpringApplication.run(ReportApp.class, args);
	}

	private static String locationspath;

	@Value("${report.locationsfile.path}")
	public void setLocationspath(String locationspath) {
		ReportApp.locationspath = locationspath;
	}
	
	@Bean("reportDefinitions")
	@Value("common")
	public static ReportDefinitions loadYaml(String moduleName) throws Exception {
    
	ObjectMapper mapper = getMapperConfig();
	List<ReportDefinition> localrd = new ArrayList<ReportDefinition>();
	ReportDefinitions rd = new ReportDefinitions();
	ReportDefinitions localReportDefinitions = new ReportDefinitions();

	if(!moduleName.equals("common")){
		localrd.addAll(reportDefinitions.getReportDefinitions());
	}
	loadReportDefinitions(moduleName, mapper, localrd, rd); 
	
	localReportDefinitions.setReportDefinitions(localrd);

	reportDefinitions = localReportDefinitions;
     
	LOGGER.info("ModuleName : "+moduleName);
	
	return reportDefinitions;
	

	}

	private static void loadReportDefinitions(String moduleName, ObjectMapper mapper, List<ReportDefinition> localrd,
			ReportDefinitions rd) throws Exception {
		BufferedReader br;
		FileReader fr;
		String yamlLocation;
		try {
		//Local Testing

/*		Resource resource = resourceLoader.getResource("file://home/vishal/ws/reportFileLocations.txt");
		File file = resource.getFile();
		fr = new FileReader(file);
		br = new BufferedReader(fr);*/
		
		//Dev Testing
		 URL url = new URL(locationspath);
		 URLConnection urlConnection = url.openConnection();
		 br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
		 
		 
		 
			while ((yamlLocation = br.readLine()) != null) {
				String[] moduleYaml = yamlLocation.split("=");  

				if(moduleName.equals("common")){
				if(moduleYaml[1].startsWith("https")) {
					LOGGER.info("The Yaml Location is : "+yamlLocation);
					URL oracle = new URL(moduleYaml[1]);
					try{
					rd = mapper.readValue(new InputStreamReader(oracle.openStream()), ReportDefinitions.class);
					} catch(Exception e) {
						LOGGER.info("Skipping the report definition "+yamlLocation);
						e.printStackTrace();
						
					}
					localrd.addAll(rd.getReportDefinitions());
					
					} else if(moduleYaml[1].startsWith("file://")){
						LOGGER.info("The Yaml Location is : "+yamlLocation);
						Resource yamlResource = resourceLoader.getResource(moduleYaml[1].toString());
						File yamlFile = yamlResource.getFile();
						try{
						rd = mapper.readValue(yamlFile, ReportDefinitions.class);
						 } catch(Exception e) {
							LOGGER.info("Skipping the report definition "+yamlLocation);
							e.printStackTrace();
						}
						localrd.addAll(rd.getReportDefinitions());
						
					} 
				
			} else {
				  if(moduleYaml[0].equals(moduleName) && moduleYaml[1].startsWith("https")) {
					LOGGER.info("The Yaml Location is : "+moduleYaml[1]);
					URL oracle = new URL(moduleYaml[1]);
					try{
					rd = mapper.readValue(new InputStreamReader(oracle.openStream()), ReportDefinitions.class);
					} catch(Exception e) {
						LOGGER.info("Skipping the report definition "+yamlLocation);
						throw new Exception(e.getMessage());
					}
					localrd.addAll(rd.getReportDefinitions());
					
					} else if(moduleYaml[0].equals(moduleName) && moduleYaml[1].startsWith("file://")){
						LOGGER.info("The Yaml Location is : "+moduleYaml[1]);
						 Resource yamlResource = resourceLoader.getResource(moduleYaml[1].toString());
						 File yamlFile = yamlResource.getFile();
						try{
						rd = mapper.readValue(yamlFile, ReportDefinitions.class);
						 } catch(Exception e) {
							LOGGER.info("Skipping the report definition "+moduleYaml[1]);
							throw new Exception(e.getMessage());
						}
						localrd.addAll(rd.getReportDefinitions());
						
					} 
				}
			}

		} catch (IOException e) {
			e.printStackTrace();

		}
	}

	private static ObjectMapper getMapperConfig() {
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.setSerializationInclusion(Include.NON_NULL);
		return mapper;
	}
	
	

	public static ReportDefinitions getReportDefs() {
		return reportDefinitions;
	}
	
	
}