package org.egov;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.CodeSignature;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.util.ApplicationThreadLocals;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Arrays;

@Aspect
@Component
public class SetThreadLocals {

    /**
     * A join point is in the web layer if the method is defined
     * in a type in the com.xyz.someapp.web package or any sub-package
     * under that.
     */

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void inWebLayer() {
        System.out.print("---Before Method Execution---inWebLayer()");
    }

    @Before(value = "inWebLayer() ")
    public void logMethodAcceptionEntityAnnotatedBean(JoinPoint jp) {
        String tenantId = "";

        String[] paramNames = ((CodeSignature) jp.getSignature()).getParameterNames();
        int i = 0;
        int index = Arrays.asList(paramNames).indexOf("tenantId");
        if (index != -1) {
            tenantId = (String) jp.getArgs()[index];
            ApplicationThreadLocals.setTenantId(tenantId);
        }

        for (Object obj : jp.getArgs()) {
            if (obj.getClass().equals(RequestInfo.class)) {
                ApplicationThreadLocals.setRequestInfo((RequestInfo) obj);
                break;
            }
            if (obj.toString().contains("requestInfo")) {
                try {
                    Field f = obj.getClass().getDeclaredField("requestInfo");
                    if (f != null) {
                        f.setAccessible(true);
                        RequestInfo info = (RequestInfo) f.get(obj);
                        ApplicationThreadLocals.setRequestInfo(info);
                        break;
                    }

                } catch (Exception e) {
                    System.out.print(e.getMessage());
                }
            }


        }
    }

    @AfterReturning(value = "inWebLayer()")
    public void logMethodAcceptionEntityAnnotatedBeanAfter(JoinPoint jp) {
        System.out.print("---After Method Execution---inWebLayer()");
        ApplicationThreadLocals.clearValues();

    }
}