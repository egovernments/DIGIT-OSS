package org.egov.web.util;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Import({TracerConfiguration.class})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class OtpConfiguration {
    @Value("${egov.otp.ttl}")
    private long ttl;

    @Value("${egov.otp.length}")
    private int otpLength;

    @Value("${egov.otp.encrypt}")
    private boolean encryptOTP;

}