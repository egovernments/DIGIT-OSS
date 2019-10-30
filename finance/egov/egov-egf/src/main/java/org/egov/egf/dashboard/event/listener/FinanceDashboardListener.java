package org.egov.egf.dashboard.event.listener;

import org.egov.egf.dashboard.event.FinanceDashboardEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class FinanceDashboardListener {
    private static final Logger LOG = LoggerFactory.getLogger(FinanceDashboardListener.class);
    @Autowired
    FinanceDashboardService finDashboardService;
    @Async
//    @TransactionalEventListener(phase=TransactionPhase.AFTER_COMMIT)
    @EventListener
    public void handleEvent(FinanceDashboardEvent event) throws InterruptedException {
        finDashboardService.pushtoEskIndex(event);
    }
}
