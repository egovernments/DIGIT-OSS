package org.egov.pg.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.GatewayStatus;
import org.egov.pg.models.Transaction;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.*;

@Slf4j
@Service
public class GatewayService {


    private final List<Gateway> gateways;
    private Set<String> TXN_IDS_KEY_SET = new LinkedHashSet<>();
    private Map<String, GatewayStatus> GATEWAY_MAP = new HashMap<>();

    @Autowired
    public GatewayService(List<Gateway> gateways) {
        this.gateways = Collections.unmodifiableList(gateways);
        initialize();
    }

    /**
     * Get the transaction id from the raw request
     * <p>
     * The TXNID key can be anything, as this is gateway specific,
     * *  ex., txnid, vpc_txnid etc,
     * check all payment gateway specific keys for txnid and returns txnid
     *
     * @param params Request parameters
     * @return Transaction id
     */
    public Optional<String> getTxnId(Map<String, String> params) {

        Map<String, String> caseInsensitiveMap = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        caseInsensitiveMap.putAll(params);
        for (String txnId : TXN_IDS_KEY_SET) {
            if (caseInsensitiveMap.containsKey(txnId))
                return Optional.of(caseInsensitiveMap.get(txnId));
        }

        return Optional.empty();
    }


    /**
     * Returns the active payment gateways
     *
     * @return list of active gateways that can be used for payments
     */
    public Set<String> getActiveGateways() {
        return GATEWAY_MAP.keySet();
    }

    /**
     * Returns the redirectURI from the requested gateway if exists
     * else throws CustomException
     *
     * @param transaction Txn for which payment should be initiated
     * @return Redirect URI to the gateway
     */
    URI initiateTxn(Transaction transaction) {
        if (!isGatewayActive(transaction.getGateway()))
            throw new CustomException("INVALID_PAYMENT_GATEWAY", "Invalid or inactive payment gateway provided");

        Gateway gateway = getGateway(transaction.getGateway());
        return gateway.generateRedirectURI(transaction);
    }

    /**
     * Fetch the live transaction status from the gateway
     *
     * @param currentStatus Current transaction details
     * @param params        Response params sent by the gateway
     * @return Updated live transaction status
     */
    Transaction getLiveStatus(Transaction currentStatus, Map<String, String> params) {
        Gateway gateway = getGateway(currentStatus.getGateway());
        return gateway.fetchStatus(currentStatus, params);
    }


    public boolean isGatewayActive(String gateway) {
        return GATEWAY_MAP.containsKey(gateway) && GATEWAY_MAP.get(gateway).isActive();
    }

    private Gateway getGateway(String gateway) {
        return GATEWAY_MAP.get(gateway).getGateway();
    }


    private void initialize() {
        // Try getting txnid from request param that was set by pg in callback
        TXN_IDS_KEY_SET.add(PgConstants.PG_TXN_IN_LABEL);

        if (Objects.isNull(gateways))
            throw new IllegalStateException("No gateways found, spring initialization failed.");

        if (!gateways.isEmpty() && GATEWAY_MAP.isEmpty())
            gateways.forEach(gateway -> {
                GATEWAY_MAP.put(gateway.gatewayName().toUpperCase(), new GatewayStatus(gateway, gateway.isActive()));
                TXN_IDS_KEY_SET.add(gateway.transactionIdKeyInResponse());
            });

        GATEWAY_MAP = Collections.unmodifiableMap(GATEWAY_MAP);
        TXN_IDS_KEY_SET = Collections.unmodifiableSet(TXN_IDS_KEY_SET);

        log.info(GATEWAY_MAP.toString());
        log.info(TXN_IDS_KEY_SET.toString());
    }


}
