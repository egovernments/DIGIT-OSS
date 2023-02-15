package org.egov.pg.service.jobs.dailyReconciliation;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Daily Reconciliation of pending transactions
 */
@Component
@Slf4j
public class DailyReconciliationJob implements Job {

    private static RequestInfo requestInfo;

    @PostConstruct
    public void init() {
        User userInfo = User.builder()
                .uuid(appProperties.getEgovPgReconciliationSystemUserUuid())
                .type("SYSTEM")
                .roles(Collections.emptyList()).id(0L).build();

        requestInfo = new RequestInfo();
        requestInfo.setUserInfo(userInfo);
    //("", "", 0L, "", "", "", "", "", "", userInfo);
    }

    @Autowired
    private AppProperties appProperties;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * Fetch live status for all pending transactions
     * except for ones which were created < 30 minutes ago, configurable value
     *
     * @param jobExecutionContext execution context with optional job parameters
     */
    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        List<Transaction> pendingTxns = transactionRepository.fetchTransactionsByTimeRange(TransactionCriteria.builder()
                        .txnStatus(Transaction.TxnStatusEnum.PENDING).build(), 0L,
                System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(appProperties.getEarlyReconcileJobRunInterval
                        () * 2));

        log.info("Attempting to reconcile {} pending transactions", pendingTxns.size());

        for (Transaction txn : pendingTxns) {
            log.info(transactionService.updateTransaction(requestInfo, Collections.singletonMap(PgConstants.PG_TXN_IN_LABEL, txn
                    .getTxnId
                    ())).toString());
        }

    }
}
