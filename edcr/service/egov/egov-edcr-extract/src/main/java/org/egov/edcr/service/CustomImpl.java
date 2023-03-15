package org.egov.edcr.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
public class CustomImpl {
    public static final String ULB_CODE = "ULB_CODE";
    public static final String ULB_NAME = "ULB_NAME";
    public static final String DISTRICT_CODE = "DISTRICT_CODE";
    public static final String DISTRICT_NAME = "DISTRICT_NAME";
    public static final String GRADE = "GRADE";
    public static final String STATE_NAME = "STATE_NAME";
    private static final Logger LOG = LogManager.getLogger(CustomImpl.class);

    @Autowired
    private ApplicationContext applicationContext;
    /*
     * @Autowired private CityService cityService;
     */

    public Map<String, String> getCityDetails() {

        Map<String, String> cityDetails = new HashMap<>();
        /*
         * cityDetails.put(ULB_CODE, ApplicationThreadLocals.getCityCode()); City city =
         * cityService.getCityByCode(ApplicationThreadLocals.getCityCode());
         */
        /*
         * cityDetails.put(ULB_NAME, city.getName()); cityDetails.put(DISTRICT_CODE, city.getDistrictCode());
         * cityDetails.put(DISTRICT_NAME, city.getDistrictName()); cityDetails.put(STATE_NAME, city.getDistrictName());
         * cityDetails.put(GRADE, city.getGrade());
         */
        return cityDetails;
    }

    public Object find(String beanName, Map<String, String> cityDetails) {
        Object bean = applicationContext.getBean(beanName);
        return find(bean.getClass(), cityDetails);

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
                if (!c.getClass().getSimpleName().toLowerCase().contains(parentClazz.getSimpleName().toLowerCase()))
                    continue;

                if (c.getClass().getSimpleName().toLowerCase().contains(cityDetails.get(ULB_NAME).toLowerCase())) {
                    ulbBean = c;
                    break;
                }
                if (c.getClass().getSimpleName().contains(cityDetails.get(DISTRICT_NAME)))
                    districtBean = c;

                if (c.getClass().getSimpleName().contains(cityDetails.get(STATE_NAME)))
                    stateBean = c;

                if (c.getClass().getSimpleName().contains(cityDetails.get(GRADE)))
                    gradeBean = c;

            }

            if (ulbBean != null) {
                bean = ulbBean;
                LOG.debug("Returning ulb implementation for service " + parentClazz + " : " + ulbBean.getClass().getName());
            } else if (districtBean != null) {
                bean = districtBean;
                LOG.debug("Returning ulb implementation for service " + parentClazz + " : " + districtBean.getClass().getName());
            } else if (gradeBean != null) {
                bean = gradeBean;
                LOG.debug("Returning ulb implementation for service " + parentClazz + " : " + districtBean.getClass().getName());
            } else if (stateBean != null)
                bean = stateBean;
            else {
                LOG.debug("returning default implementation for " + parentClazz);
                String beanName = parentClazz.getSimpleName();
                beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);
                defaultBean = applicationContext.getBean(beanName);
                bean = defaultBean;
            }

            if (bean == null)
                LOG.error("No Service Found for " + parentClazz.getClass().getSimpleName());

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + parentClazz, e);
        }
        return bean;
    }
}
