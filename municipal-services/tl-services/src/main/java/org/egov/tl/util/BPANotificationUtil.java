package org.egov.tl.util;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.producer.Producer;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.*;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.tl.util.BPAConstants.*;
import static org.egov.tl.util.TLConstants.NOTIFICATION_LOCALE;

@Component
@Slf4j
public class BPANotificationUtil {

    private TLConfiguration config;

    private ServiceRequestRepository serviceRequestRepository;

    private Producer producer;

    @Value("${egov.host.domain.name}")
    private String egovhost;

    @Value("${egov.common.pay.endpoint}")
    private String commonPayEndpoint;

    @Value("${egov.citizen.home.endpoint}")
    private String citizenHomeEndpoint;

    @Autowired
    public BPANotificationUtil(TLConfiguration config, ServiceRequestRepository serviceRequestRepository,
                               Producer producer) {
        this.config = config;
        this.serviceRequestRepository = serviceRequestRepository;
        this.producer = producer;
    }

    final String receiptNumberKey = "receiptNumber";

    final String amountPaidKey = "amountPaid";

    /**
     * Creates customized message based on tradelicense
     *
     * @param license
     *            The tradeLicense for which message is to be sent
     * @param localizationMessage
     *            The messages from localization
     * @return customized message based on tradelicense
     */

    /**
     * Returns the uri for the localization call
     *
     * @param tenantId TenantId of the propertyRequest
     * @return The uri for localization search call
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

        if (config.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;
        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
            locale = requestInfo.getMsgId().split("\\|")[1];

        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
                .append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(BPAConstants.MODULE);

        return uri;
    }

    /**
     * Fetches messages from localization service
     *
     * @param tenantId    tenantId of the tradeLicense
     * @param requestInfo The requestInfo of the request
     * @return Localization messages for the module
     */
    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
                requestInfo);
        String jsonString = new JSONObject(responseMap).toString();
        return jsonString;
    }

    public String getCustomizedMsg(RequestInfo requestInfo, TradeLicense license, String localizationMessage) {
        String message = null, messageTemplate;
        String ACTION_STATUS = license.getAction() + "_" + license.getStatus();

        switch (ACTION_STATUS) {

            case ACTION_STATUS_PENDINGPAYMENT:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGPAYMENT, localizationMessage);
                message = getPendingPaymentMsg(license, messageTemplate, localizationMessage);
                break;

            // payment notification handled in receipt consumer
//            case ACTION_STATUS_PENDINGDOCVERIFICATION:
//                break;

            case ACTION_STATUS_PENDINGAPPROVAL:
                messageTemplate = getMessageTemplate(NOTIFICATION_PENDINGAPPROVAL, localizationMessage);
                message = getPendingApprovalMsg(license, messageTemplate);
                break;

            case ACTION_STATUS_APPROVED:
                messageTemplate = getMessageTemplate(NOTIFICATION_APPROVED, localizationMessage);
                message = getApprovedMsg(license, messageTemplate, localizationMessage);
                break;


            case ACTION_STATUS_REJECTED:
                messageTemplate = getMessageTemplate(NOTIFICATION_REJECTED, localizationMessage);
                message = getRejectedMsg(license, messageTemplate);
                break;
        }

        return message;
    }

    /**
     * Extracts message for the specific code
     *
     * @param notificationCode    The code for which message is required
     * @param localizationMessage The localization messages
     * @return message for the specific code
     */
    public String getMessageTemplate(String notificationCode, String localizationMessage) {
        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            Object messageObj = JsonPath.parse(localizationMessage).read(path);
            message = ((ArrayList<String>) messageObj).get(0);
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }
        return message;
    }

    /**
     * Creates customized message for apply
     *
     * @param license tenantId of the tradeLicense
     * @param message Message from localization for apply
     * @return customized message for apply
     */
    private String getPendingPaymentMsg(TradeLicense license, String message, String localizationMessage) {
        message = message.replace("<2>", license.getApplicationNumber());
        String licensetype = license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
        message = message.replace("<3>", getMessageTemplate(TRADE_LOCALISATION_PREFIX + licensetype.split("\\.")[0], localizationMessage));
        message = message.replace("<4>", getMessageTemplate(TRADE_LOCALISATION_PREFIX + licensetype.replace(".", "_"), localizationMessage));
        String payEndpoint = commonPayEndpoint.replace("$applicationNo", license.getApplicationNumber()).replace("$tenantId", license.getTenantId());
        message = message.replace("<5>", egovhost + payEndpoint);
        return message;
    }


    public String getPendingDocVerificationMsg(TradeLicense license, String message, String localizationMessage, String totalAmountPaid) {
        message = message.replace("<2>", totalAmountPaid);
        message = message.replace("<3>", egovhost + citizenHomeEndpoint);
        return message;
    }

    /**
     * Creates customized message for approved
     *
     * @param license tenantId of the tradeLicense
     * @param message Message from localization for approved
     * @return customized message for approved
     */
    private String getApprovedMsg(TradeLicense license, String message, String localizationMessage) {
        message = message.replace("<2>", license.getApplicationNumber());
        String licensetype = license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
        message = message.replace("<3>", getMessageTemplate(TRADE_LOCALISATION_PREFIX + licensetype.split("\\.")[0], localizationMessage));
        message = message.replace("<4>", getMessageTemplate(TRADE_LOCALISATION_PREFIX + licensetype.replace(".", "_"), localizationMessage));
        return message;
    }

    private String getRejectedMsg(TradeLicense license, String message) {
        message = message.replace("<2>", license.getApplicationNumber());
        return message;
    }

    /**
     * Creates customized message for rejected
     *
     * @param license tenantId of the tradeLicense
     * @param message Message from localization for rejected
     * @return customized message for rejected
     */
    private String getPendingApprovalMsg(TradeLicense license, String message) {
        message = message.replace("<2>", license.getApplicationNumber());
        return message;
    }
}
