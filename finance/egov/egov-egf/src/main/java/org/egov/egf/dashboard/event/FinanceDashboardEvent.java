package org.egov.egf.dashboard.event;


import org.springframework.context.ApplicationEvent;
import org.springframework.stereotype.Component;
@Component
public class FinanceDashboardEvent extends ApplicationEvent{

    Object data;
    FinanceEventType eventType;
    String tenantId;
    String token;
    
    public FinanceDashboardEvent(Object source, Object data, FinanceEventType eventType, String tenantId, String token) {
        super(source);
        this.data = data;
        this.eventType = eventType;
        this.tenantId = tenantId;
        this.token = token;
    }

    public Object getData() {
        return data;
    }

    public FinanceEventType getEventType() {
        return eventType;
    }
    
    public String getTenantId() {
        return tenantId;
    }
    
    public String getToken() {
        return token;
    }

    @Override
    public String toString() {
        return "FinanceDashboardEvent [data=" + data + ", eventType=" + eventType + ", tenantId=" + tenantId + ", token=" + token
                + "]";
    }

}
