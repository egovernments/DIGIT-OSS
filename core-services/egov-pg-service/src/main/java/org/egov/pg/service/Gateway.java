package org.egov.pg.service;

import org.egov.pg.models.Transaction;

import java.net.URI;
import java.util.Map;

/**
 * Gateway operations
 */
public interface Gateway {
    /**
     * Generate a redirect URI to the gateway using the transaction object
     * 1. Convert to appropriate currency representation, app default is rupee, ex 51.23
     * 2. Compute hash
     * 3. Assemble request, makes call to gateway if necessary
     * 4. Return final redirect URI
     *
     * @param transaction for which payment gateway redirect URI is to be generated
     * @return redirect URI
     */
    URI generateRedirectURI(Transaction transaction);

    /**
     * Fetch the current status of the given transaction from the gateway
     * 1. Fetch the current status of the transaction or parse from response params [currently not used]
     * 2. Convert to app default rupee format, ex 51.23, irrespective of gateway response
     * 2. Update the status in the Transaction object including raw response.
     *
     * @param currentStatus Current status of a transaction
     * @param params        Response Parameters sent by Payment gateway
     * @return Updated transaction status
     */
    Transaction fetchStatus(Transaction currentStatus, Map<String, String> params);

    /**
     * If the gateway is to be used or disabled, preferably retrieved from a config file
     *
     * @return true for enabled, false for disabled
     */
    boolean isActive();

    /**
     * Name of the gateway
     * ex, Axis
     *
     * @return Gateway name
     */
    String gatewayName();

    /**
     * Gateway specific TransactionID key,
     * ex, TXNID in Paytm, vpc_transactionId in Axis etc
     *
     * @return Transaction ID
     */
    String transactionIdKeyInResponse();
}