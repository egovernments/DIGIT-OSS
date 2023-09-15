package org.egov.infra.custom;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
public class CustomImplProvider {
    private static final String COLON = " : ";
    public static final String ULB_CODE = "ULB_CODE";
    public static final String ULB_NAME = "ULB_NAME";
    public static final String DISTRICT_CODE = "DISTRICT_CODE";
    public static final String DISTRICT_NAME = "DISTRICT_NAME";
    public static final String GRADE = "GRADE";
    public static final String STATE_NAME = "STATE_NAME";
    private static final Logger LOG = LogManager.getLogger(CustomImplProvider.class);

    @Value("${client.id}")
    private String clientId;

    @Autowired
    private ApplicationContext applicationContext;
    @Autowired
    private CityService cityService;

    @Deprecated()
    public Map<String, String> getCityDetails() {
        LOG.info("Getting city Details");
        Map<String, String> cityDetails = new HashMap<>();
        try {
            cityDetails.put(STATE_NAME, clientId);
            cityDetails.put(ULB_CODE, ApplicationThreadLocals.getCityCode());
            City city = cityService.getCityByCode(ApplicationThreadLocals.getCityCode());
            if (city != null) {
                cityDetails.put(ULB_NAME, city.getName());
                cityDetails.put(DISTRICT_CODE, city.getDistrictCode());
                cityDetails.put(DISTRICT_NAME, city.getDistrictName());
                cityDetails.put(STATE_NAME, clientId);
                cityDetails.put(GRADE, city.getGrade());
            }
            LOG.info(cityDetails);

        } catch (NullPointerException e) {

            LOG.error("Error while getting city Details", e);
        }

        LOG.info("Getting city Details completed");
        return cityDetails;
    }

    public Object find(String beanName, Map<String, String> cityDetails) {
        Object bean = null;
        try {
            bean = applicationContext.getBean(beanName);
            if (bean == null)
                return null;
        } catch (BeansException e) {
            return null;
            // Ignore as you may not find right class
        }
        return find(bean.getClass(), cityDetails);

    }

    public Object getBeanByName(String beanName) {
        Object bean = null;
        try {
            bean = applicationContext.getBean(beanName);
        } catch (BeansException e) {
            // Ignore error . Handle by callee
        }
        return bean;

    }

    /**
     * 
     * @param <T>
     * @param <T>
     * @param parentClazz
     * @param cityDetails
     * @return
     * 
     * 1.Find if the city specific file is present 2.Find if the District file present 3.Find if the type of municipality file
     * present 4.
     * 
     */

    public Object find(Class parentClazz, Map<String, String> cityDetails) {
        Object ulbBean = null;
        Object districtBean = null;
        Object stateBean = null;
        Object gradeBean = null;
        Object defaultBean = null;
        Object bean = null;

        try {
            Map beans = applicationContext.getBeansOfType(parentClazz);
            Set<String> keySet = beans.keySet();

            for (String s : keySet) {

                Object c = beans.get(s);
                String serviceName = c.getClass().getSimpleName().toLowerCase();
                if (!serviceName.contains(parentClazz.getSimpleName().toLowerCase())) {
                    continue;
                }

                if (!ApplicationThreadLocals.getCityName().isEmpty()
                        && serviceName.contains(ApplicationThreadLocals.getCityName().toLowerCase())) {
                    ulbBean = c;
                    break;
                }
                if (ApplicationThreadLocals.getDistrictName() == null) {
                    throw new RuntimeException("District name is not present. Please update and try again");
                }
                if (!ApplicationThreadLocals.getDistrictName().isEmpty()
                        && serviceName.contains(ApplicationThreadLocals.getDistrictName().toLowerCase())) {
                    if (serviceName.contains("District".toLowerCase())) {
                        districtBean = c;
                    }
                }

                if (ApplicationThreadLocals.getStateName() == null) {
                    throw new RuntimeException("State  name is not present. Please update and try again");
                }

                if (!ApplicationThreadLocals.getStateName().isEmpty()
                        && serviceName.contains(ApplicationThreadLocals.getStateName().toLowerCase())) {
                    stateBean = c;
                }

                if (!ApplicationThreadLocals.getGrade().isEmpty()
                        && serviceName.contains(ApplicationThreadLocals.getGrade().toLowerCase())) {
                    gradeBean = c;
                }
            }

            if (ulbBean != null) {
                bean = ulbBean;
                LOG.debug("Returning ulb implementation for service " + parentClazz + COLON
                        + ulbBean.getClass().getName());
            } else if (districtBean != null) {
                bean = districtBean;
                LOG.debug("Returning district implementation for service " + parentClazz + COLON
                        + bean.getClass().getName());
            } else if (gradeBean != null) {
                bean = gradeBean;
                LOG.debug("Returning Gradewise implementation for service " + parentClazz + COLON
                        + gradeBean.getClass().getName());
            } else if (stateBean != null) {
                bean = stateBean;
            }

            else {
                LOG.debug("returning default implementation for " + parentClazz);
                String beanName = parentClazz.getSimpleName();
                beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);
                defaultBean = applicationContext.getBean(beanName);
                bean = defaultBean;
            }

            if (bean == null) {
                LOG.error("No Service Found for " + parentClazz.getClass().getSimpleName());
            }

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + parentClazz, e);
        } 
        return bean;
    }

    public Object find(String beanName) {
        Object ulbBean = null;
        Object districtBean = null;
        Object stateBean = null;
        Object gradeBean = null;
        Object defaultBean = null;
        Object bean = null;
        beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);

        try {

            // get City wise bean

            if (ApplicationThreadLocals.getCityName() == null || ApplicationThreadLocals.getCityName().isEmpty()) {
                throw new RuntimeException("City name is not present. Please update and try again");
            } else {
                ulbBean = getBeanByName(beanName + "_" + ApplicationThreadLocals.getCityName());
            }

            // get District wise bean
            if (ApplicationThreadLocals.getDistrictName() == null) {
                throw new RuntimeException("District name is not present. Please update and try again");
            } else {
                districtBean = getBeanByName(
                        beanName + "_" + ApplicationThreadLocals.getDistrictName() + "_District");
            }

            // get State wise bean

            if (ApplicationThreadLocals.getStateName() == null || ApplicationThreadLocals.getStateName().isEmpty()) {
                throw new RuntimeException("State  name is not present. Please update and try again");
            } else {
                stateBean = getBeanByName(beanName + "_" + ApplicationThreadLocals.getStateName());
            }

            // get ULB grade wise bean
            if (ApplicationThreadLocals.getGrade() == null || ApplicationThreadLocals.getGrade().isEmpty()) {
                throw new RuntimeException("ULB grade not defined. Please update and try again");
            } else {
                gradeBean = getBeanByName(beanName + "_" + ApplicationThreadLocals.getGrade());
            }

            // decide the order in which to return

            if (ulbBean != null) {
                bean = ulbBean;
                LOG.debug(
                        "Returning ulb implementation for service " + beanName + COLON + ulbBean.getClass().getName());
            } else if (districtBean != null) {
                bean = districtBean;
                LOG.debug("Returning district implementation for service " + beanName + COLON
                        + bean.getClass().getName());
            } else if (gradeBean != null) {
                bean = gradeBean;
                LOG.debug("Returning Gradewise implementation for service " + beanName + COLON
                        + gradeBean.getClass().getName());
            } else if (stateBean != null) {
                bean = stateBean;
            }

            else {
                LOG.debug("returning default implementation for " + beanName);
                defaultBean = getBeanByName(beanName);
                bean = defaultBean;
            }

            if (bean == null) {
                LOG.debug("No Service Found for " + beanName);
            }

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + beanName, e);
        }
        return bean;
    }
}
