package org.egov.web.notification.sms.config;

import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.util.*;
import java.util.regex.*;

@Configuration
@Data
public class SMSProperties {

    @Value("${sms.provider.class}")
    public String gatewayToUse;

    @Value("${sms.provider.requestType}")
    public String requestType;

    @Value("${sms.provider.contentType:application/x-www-form-urlencoded}")
    public String contentType;

    @Value("${sms.mobile.prefix:}")
    private String mobileNumberPrefix;

    @Value("${sms.provider.url}")
    public String url;

    @Value("${sms.provider.username}")
    public String username;

    @Value("${sms.provider.password}")
    public String password;

    @Value("${sms.senderid}")
    public String senderid;

    @Value("${sms.sender.secure.key}")
    public String secureKey;

    @Value("#{${sms.config.map}}")
    Map<String, String> configMap;

    @Value("#{${sms.extra.config.map}}")
    Map<String, String> extraConfigMap;

    @Value("#{${sms.category.map}}")
    Map<String, Map<String, String>> categoryMap;

    @Value("#{'${sms.error.codes}'.split(',')}")
    protected List<String> smsErrorCodes;

    @Value("#{'${sms.success.codes}'.split(',')}")
    protected List<String> smsSuccessCodes;

    @Value("${sms.verify.response:false}")
    private boolean verifyResponse;

    @Value("${sms.verify.responseContains:}")
    private String verifyResponseContains;


    @Value("${sms.verify.ssl:true}")
    private boolean verifySSL;

    @Value("${sms.blacklist.numbers}")
    private List<String> blacklistNumbers;

    @Value("${sms.whitelist.numbers}")
    private List<String> whitelistNumbers;

    @Setter(AccessLevel.PROTECTED) private List<Pattern> whitelistPatterns;
    @Setter(AccessLevel.PROTECTED) private List<Pattern> blacklistPatterns;

    private List<Pattern> convertToPattern(List<String> data) {
        List<Pattern> patterns = new ArrayList<>(data.size());

        for (int i = 0; i < data.size(); i++) {
            patterns.add(
                    Pattern.compile(
                            "^" +
                            data.get(i)
                            .replace("X", "[0-9]")
                            .replace("*","[0-9]+") + "$"));
        }
        return patterns;
    }

    public boolean isNumberBlacklisted(String number) {
        if (this.blacklistPatterns == null) {
            this.blacklistPatterns = convertToPattern(blacklistNumbers);
        }

        if (blacklistPatterns.size() > 0) {
            for (Pattern p: blacklistPatterns) {
                if (p.matcher(number).find())
                    return true;
            }
        }

        return false;
    }

    public boolean isNumberWhitelisted(String number) {
        if (this.whitelistPatterns == null) {
            this.whitelistPatterns = convertToPattern(whitelistNumbers);
        }

        if (whitelistPatterns.size() > 0) {
            for (Pattern p: whitelistPatterns) {
                if (p.matcher(number).find())
                    return true;
            }
            return false;
        } else {
            return true;
        }
    }

}
