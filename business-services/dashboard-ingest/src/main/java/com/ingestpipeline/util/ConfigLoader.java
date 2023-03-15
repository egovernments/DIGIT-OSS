package com.ingestpipeline.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Component;

@Component("configLoader")
public class ConfigLoader {

    private static Logger logger = LoggerFactory.getLogger(ConfigLoader.class);
    private Map<String, String> nameContentMap = new HashMap<>();
    @Autowired
    private ResourceLoader resourceLoader;
    
    @Value("${config.schema.paths}") 
    private String RESOURCE_LOCATION;
    
    /**
     * Loads config resources
     * @throws Exception
     */
	public void loadResources() throws Exception {
	    logger.info("RESOURCE_LOCATION:: "+RESOURCE_LOCATION);
		Resource[] resources = getResources(RESOURCE_LOCATION);

		for (Resource resource : resources) {
			String jsonContent = getContent(resource);
			nameContentMap.put(resource.getFilename(), jsonContent);
		}
		logger.info("Number of resources loaded " + nameContentMap.size());

	}

    /**
     * To fetch a particular string content for a give resource/file name
     * @param name
     * @return
     */
    public String get(String name) {
        return nameContentMap.get(name);
    }

    /**
     * Loads all the resources/files with a given pattern *.json
     * @param pattern   path with *json
     * @return
     * @throws IOException
     */
    private Resource[] getResources(String pattern) throws IOException {
        Resource[] resources = ResourcePatternUtils.getResourcePatternResolver(resourceLoader).getResources(pattern);
        return resources;
    }

    /**
     * Returns a content of resource
     * 
     * @param resource
     * @return
     */
    private String getContent(Resource resource) {
        String content = null;
        InputStream is = null;
        try {
            is = resource.getInputStream();
            byte[] encoded = IOUtils.toByteArray(is);
            content = new String(encoded, Charset.forName("UTF-8"));

        } catch (IOException e) {
            logger.error("Cannot load resource " + resource.getFilename());

        } finally{
            try {
                is.close();
            } catch (IOException e) {
                logger.error("Error while closing input stream. ");
            }
        }
        return content;
    }

}
