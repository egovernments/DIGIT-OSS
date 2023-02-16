package org.egov.pg.service.jobs.earlyReconciliation;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pg.config.AppProperties;
import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.Transaction;
import org.egov.pg.repository.TransactionRepository;
import org.egov.pg.service.TransactionService;
import org.egov.pg.web.models.TransactionCriteria;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Updates all transactions in pending state and created in the last 15 minutes
 */
@Component
@Slf4j
public class EarlyReconciliationJob implements Job {

    private static RequestInfo requestInfo;

    @PostConstruct
    public void init() {
        User userInfo = User.builder()
                .uuid(appProperties.getEgovPgReconciliationSystemUserUuid())
                .type("SYSTEM")
                .roles(Collections.emptyList()).id(0L).build();

        requestInfo = new RequestInfo();
        requestInfo.setUserInfo(userInfo);    }

    @Autowired
    private AppProperties appProperties;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * Fetch live status for pending transactions
     * that were created for ex, between 15-30 minutes, configurable value
     *
     * @param jobExecutionContext execution context with optional job parameters
     * @throws JobExecutionException
     */
    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        Integer startTime, endTime;

        startTime = appProperties.getEarlyReconcileJobRunInterval() * 2;
        endTime = startTime - appProperties.getEarlyReconcileJobRunInterval();

        List<Transaction> pendingTxns = transactionRepository.fetchTransactionsByTimeRange(TransactionCriteria.builder()
                        .txnStatus(Transaction.TxnStatusEnum.PENDING).build(),
                System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(startTime),
                System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(endTime));

        log.info("Attempting to reconcile {} pending transactions", pendingTxns.size());

        for (Transaction txn : pendingTxns) {
            log.info(transactionService.updateTransaction(requestInfo, Collections.singletonMap(PgConstants.PG_TXN_IN_LABEL, txn
                    .getTxnId
                    ())).toString());
        }

    }

}
