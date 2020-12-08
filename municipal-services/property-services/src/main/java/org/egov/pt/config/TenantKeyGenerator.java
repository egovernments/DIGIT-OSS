package org.egov.pt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;

public class TenantKeyGenerator implements KeyGenerator {
    @Value("${cache.tenant.statelevel:true}")
    private Boolean stateLevel;

    public Object generate(Object target, Method method, Object... params) {
        return target.getClass().getSimpleName() + "_"
                + method.getName() + "_"
                + (stateLevel ? "fixed" : StringUtils.arrayToDelimitedString(params, "_"));
    }
}