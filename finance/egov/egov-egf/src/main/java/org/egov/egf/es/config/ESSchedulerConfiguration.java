package org.egov.egf.es.config;

import static org.quartz.CronTrigger.MISFIRE_INSTRUCTION_DO_NOTHING;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.egov.egf.es.scheduler.ESDashboardJob;
import org.egov.infra.config.scheduling.QuartzSchedulerConfiguration;
import org.egov.infra.config.scheduling.SchedulerConfigCondition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
@Configuration
@Conditional(SchedulerConfigCondition.class)
public class ESSchedulerConfiguration extends QuartzSchedulerConfiguration{
    private static final String FIN_ROLLOUT_DASHBOARD_TRIGGER = "FIN_ROLLOUT_DASHBOARD__TRIGGER";
    private static final String FIN_ROLLOUT_DASHBOARD_TRIGGER_GROUP = "FIN_ROLLOUT_DASHBOARD_TRIGGER_GROUP";
    private static final String FINANCE_SCHEDULER = "finance-scheduler";
    private static final String MODULE_NAME = "finance";
    private static final String FIN_ROLLOUT_DASHBOARD_RECON_JOB = "FIN_ROLLOUT_DASHBOARD_RECON_JOB";
    private static final String FIN_ROLLOUT_DASHBOARD_JOB_GROUP = "FIN_ROLLOUT_DASHBOARD_JOB_GROUP";
    @Value("${finance-rollout-dashboard-cron-expression}")
    private String finRolloutCronExp;
    
    @Bean(destroyMethod = "destroy")
    public SchedulerFactoryBean esDashboardScheduler(DataSource dataSource) {
        SchedulerFactoryBean esDashboardScheduler = createScheduler(dataSource);
        esDashboardScheduler.setSchedulerName(FINANCE_SCHEDULER);
        esDashboardScheduler.setAutoStartup(true);
        esDashboardScheduler.setOverwriteExistingJobs(true);
        esDashboardScheduler.setTriggers(
                esDashboardCronTrigger().getObject());
        return esDashboardScheduler;
    }
    
    @Bean
    public CronTriggerFactoryBean esDashboardCronTrigger() {
        CronTriggerFactoryBean esDashboardCron = new CronTriggerFactoryBean();
        esDashboardCron.setJobDetail(esDashboardJobDetail().getObject());
        esDashboardCron.setGroup(FIN_ROLLOUT_DASHBOARD_TRIGGER_GROUP);
        esDashboardCron.setName(FIN_ROLLOUT_DASHBOARD_TRIGGER);
        esDashboardCron.setCronExpression(finRolloutCronExp);
        esDashboardCron.setMisfireInstruction(MISFIRE_INSTRUCTION_DO_NOTHING);
        return esDashboardCron;
    }

    @Bean
    public JobDetailFactoryBean esDashboardJobDetail() {
        JobDetailFactoryBean esDashboardJobDetail = new JobDetailFactoryBean();
        esDashboardJobDetail.setGroup(FIN_ROLLOUT_DASHBOARD_JOB_GROUP);
        esDashboardJobDetail.setName(FIN_ROLLOUT_DASHBOARD_RECON_JOB);
        esDashboardJobDetail.setDurability(true);
        esDashboardJobDetail.setJobClass(ESDashboardJob.class);
        esDashboardJobDetail.setRequestsRecovery(true);
        Map<String, String> jobDetailMap = prepareJobDetailMap();
        jobDetailMap.put("jobBeanName", "esDashboardJob");
        esDashboardJobDetail.setJobDataAsMap(jobDetailMap);
        return esDashboardJobDetail;
    }
    
    private Map<String, String> prepareJobDetailMap() {
        Map<String, String> jobDetailMap = new HashMap<>();
        jobDetailMap.put("userName", "system");
        jobDetailMap.put("cityDataRequired", "true");
        jobDetailMap.put("moduleName", MODULE_NAME);
        return jobDetailMap;
    }
    
    @Bean("esDashboardJob")
    public ESDashboardJob axisReconciliationJob() {
        return new ESDashboardJob();
    }
}
