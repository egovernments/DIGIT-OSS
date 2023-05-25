package org.egov.egf.es.scheduler;

import org.egov.egf.es.integration.service.ESSchedularService;
import org.egov.infra.scheduler.quartz.AbstractQuartzJob;
import org.quartz.DisallowConcurrentExecution;
import org.springframework.beans.factory.annotation.Autowired;

@DisallowConcurrentExecution
public class ESDashboardJob extends AbstractQuartzJob{
    
    @Autowired
    private transient ESSchedularService schedularService;
    
    @Override
    public void executeJob() {
        schedularService.pushRollOutAdoption();
    }
}
