package org.egov.common.util;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.User;
import org.egov.egf.master.web.contract.RequestInfoWrapper;

import java.util.ArrayList;
import java.util.List;


public class ApplicationThreadLocals {

    private static ThreadLocal<String> tenantId = new ThreadLocal<>();
    private static ThreadLocal<String> fallBackTenantId = new ThreadLocal<>();
    private static ThreadLocal<User> user = new ThreadLocal<>();
    private static ThreadLocal<RequestInfo> requestInfo = new ThreadLocal<>();
    private static ThreadLocal<RequestInfoWrapper> requestInfoWrapper = new ThreadLocal<>();

    public static ThreadLocal<String> getTenantId() {
        return tenantId;
    }

    public static void setTenantId(String tenantId) {
        ThreadLocal threadLocal = new ThreadLocal<String>();
        threadLocal.set(tenantId);
        ApplicationThreadLocals.tenantId = threadLocal;
        threadLocal = new ThreadLocal<String>();
        String str = tenantId;
      /*  in.ap.kurnool should result in
        in,in.ap,in.ap.kurnool*/
        List<String> tenants = new ArrayList<>();
        while (str != null && str.lastIndexOf(".") != -1) {
            tenants.add(str);
            str = str.substring(0, str.lastIndexOf("."));
        }
        if (str != null)
            tenants.add(str);
        if (!tenants.contains("default"))
            tenants.add("default");
        threadLocal.set(tenantId);
        System.out.print(tenants);
        ApplicationThreadLocals.fallBackTenantId = threadLocal;
    }

    public static ThreadLocal<User> getUser() {
        return user;
    }

    public static void setUser(ThreadLocal<User> user) {
        ApplicationThreadLocals.user = user;
    }

    public static ThreadLocal<RequestInfo> getRequestInfo() {
        return requestInfo;
    }

    public static void setRequestInfo(final RequestInfo requestInfo) {
        ThreadLocal threadLocal = new ThreadLocal<RequestInfo>();
        threadLocal.set(requestInfo);
        ApplicationThreadLocals.requestInfo = threadLocal;
        RequestInfoWrapper requestInfoWrapper = new RequestInfoWrapper();
        requestInfoWrapper.setRequestInfo(requestInfo);
        threadLocal = new ThreadLocal<RequestInfoWrapper>();
        threadLocal.set(requestInfoWrapper);
        ApplicationThreadLocals.requestInfoWrapper = threadLocal;
    }

    public static void clearValues() {
        tenantId.remove();
        fallBackTenantId.remove();
        requestInfo.remove();
        requestInfoWrapper.remove();
        user.remove();

    }

}
