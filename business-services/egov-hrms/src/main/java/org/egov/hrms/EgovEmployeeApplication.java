/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.hrms;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.hrms.config.PropertiesManager;
import org.egov.hrms.repository.RestCallRepository;
import org.egov.hrms.service.DefaultUserService;
import org.egov.hrms.service.IndividualService;
import org.egov.hrms.service.UserService;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Primary;

@SpringBootApplication
@ComponentScan(basePackages = { "org.egov.hrms", "org.egov.hrms.web.controller" , "org.egov.hrms.config"})
@Import({TracerConfiguration.class, MultiStateInstanceUtil.class})
@Slf4j
public class EgovEmployeeApplication {

    @Value("${app.timezone}")
    private String timeZone;

    @PostConstruct
    public void initialize() {
        TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
    }

    @Bean
    public ObjectMapper getObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.setTimeZone(TimeZone.getTimeZone(timeZone));
        return objectMapper;
    }

    @Bean
    @Primary
    public UserService getUserService(@Value("${egov.hrms.user.service.qualifier}") String userServiceQualifier,
                                      @Autowired PropertiesManager propertiesManager,
                                      @Autowired RestCallRepository restCallRepository,
                                      @Autowired ObjectMapper objectMapper,
                                      @Autowired MultiStateInstanceUtil multiStateInstanceUtil,
                                      @Value("${egov.user.create.endpoint}") String userCreateEndpoint,
                                      @Value("${egov.user.update.endpoint}") String userUpdateEndpoint,
                                      @Value("${egov.user.search.endpoint}") String userSearchEndpoint) {
        if (userServiceQualifier.equalsIgnoreCase("individualService")) {
            log.info("using individual module as user service");
            return new IndividualService(propertiesManager, restCallRepository);
        }
        else {
            log.info("using egov-user module as user service");
            DefaultUserService userService = new DefaultUserService();
            userService.setPropertiesManager(propertiesManager);
            userService.setRestCallRepository(restCallRepository);
            userService.setObjectMapper(objectMapper);
            userService.setCentralInstanceUtil(multiStateInstanceUtil);
            userService.setUserCreateEndpoint(userCreateEndpoint);
            userService.setUserUpdateEndpoint(userUpdateEndpoint);
            userService.setUserSearchEndpoint(userSearchEndpoint);
            return userService;
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(EgovEmployeeApplication.class, args);
    }
}
