package org.egov.infra.web.struts.interceptors;

import java.util.Locale;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.struts2.interceptor.I18nInterceptor;

import com.opensymphony.xwork2.ActionInvocation;

public class CustomI18nInterceptor extends I18nInterceptor{
    private static final Logger LOG = LogManager.getLogger(CustomI18nInterceptor.class);
@Override
public String intercept(ActionInvocation invocation) throws Exception {
    LOG.debug("Intercept '{}/{}'", invocation.getProxy().getNamespace(), invocation.getProxy().getActionName());

    LocaleHandler localeHandler = getLocaleHandler(invocation);
    Locale locale = localeHandler.find();
    
    if (locale == null) {
        locale = localeHandler.read(invocation);
    }

    if (localeHandler.shouldStore()) {
        locale = localeHandler.store(invocation, locale);
    }

    locale = new Locale(locale.getLanguage(), "EN");
    useLocale(invocation, locale);

    if (LOG.isDebugEnabled()) {
        LOG.debug("Before action invocation Locale={}", invocation.getStack().findValue("locale"));
    }

    try {
        return invocation.invoke();
    } finally {
        if (LOG.isDebugEnabled()) {
            LOG.debug("After action invocation Locale={}", invocation.getStack().findValue("locale"));
        }
    }
}
}
