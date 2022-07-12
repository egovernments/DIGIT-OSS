package org.egov.pg.web.controllers;

import java.util.List;

import org.egov.pg.constants.PgConstants;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.TransactionService;
import org.egov.pg.web.models.TransactionCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class RedirectController {

    @Value("${egov.default.citizen.url}")
    private String defaultURL;

    @Value("${paygov.original.return.url.key}")
    private String returnUrlKey;
    
    @Value("${paygov.citizen.redirect.domain.name}")
    private String citizenRedirectDomain;
    

    private final TransactionService transactionService;


    @Autowired
    public RedirectController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    
    @PostMapping(value = "/transaction/v1/_redirect", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Object> method(@RequestBody MultiValueMap<String, String> formData) {
        String returnURL = formData.get(returnUrlKey).get(0);
        MultiValueMap<String, String> params = UriComponentsBuilder.fromUriString(returnURL).build().getQueryParams();
        
        /*
         * From redirect URL get transaction id.
         * And using transaction id fetch transaction details.
         * And from transaction details get the GATEWAY info.
         */
        String gateway = null;
        if(!params.isEmpty()) {
            List<String> txnId = params.get(PgConstants.PG_TXN_IN_LABEL);
            TransactionCriteria critria = new TransactionCriteria();
            critria.setTxnId(txnId.get(0));
            List<Transaction> transactions = transactionService.getTransactions(critria);
            if(!transactions.isEmpty())
                gateway = transactions.get(0).getGateway();
        }
        HttpHeaders httpHeaders = new HttpHeaders();
        /*
         * The NSDL PAYGOV integration is not allowing multiple schems or protocols (ex: HTTP, HTTPS)
         * in the success or fail or redirect URL after completing payment from payment gateway
         * used for posting response.
         * Example the URL resposne getting as follows,
         * https://test.org/pg-service/transaction/v1/_redirect?originalreturnurl=/digit-ui/citizen/payment/success/PT/PG-PT-2022-03-10-006063/pg.citya?eg_pg_txnid=PB_PG_2022_07_12_002082_48
         * Here we are reading originalreturnurl value and then forming redirect URL with domain name.
         */
        if(gateway != null && gateway.equalsIgnoreCase("PAYGOV")) {
            StringBuilder redirectURL = new StringBuilder();
            redirectURL.append(citizenRedirectDomain).append(returnURL);
            formData.remove(returnUrlKey);
            httpHeaders.setLocation(UriComponentsBuilder.fromHttpUrl(redirectURL.toString())
                    .queryParams(formData).build().encode().toUri());
        } else {
            httpHeaders.setLocation(UriComponentsBuilder.fromHttpUrl(formData.get(returnUrlKey).get(0))
                    .queryParams(formData).build().encode().toUri());
        }
        
        return new ResponseEntity<>(httpHeaders, HttpStatus.FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleError(Exception e) {
        log.error("EXCEPTION_WHILE_REDIRECTING", e);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setLocation(UriComponentsBuilder.fromHttpUrl(defaultURL).build().encode().toUri());
        return new ResponseEntity<>(httpHeaders, HttpStatus.FOUND);
    }

}
