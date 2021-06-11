//package org.egov.persistence.repository;
//
//import org.egov.domain.model.Category;
//import org.egov.domain.model.OtpRequest;
//import org.egov.domain.model.OtpRequestType;
//import org.egov.persistence.contract.SMSRequest;
//import org.egov.tracer.kafka.CustomKafkaTemplate;
//import org.hamcrest.*;
//import org.junit.Before;
//import org.junit.Ignore;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.*;
//import org.mockito.junit.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.support.SendResult;
//
//import static org.mockito.ArgumentMatchers.argThat;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//@RunWith(MockitoJUnitRunner.class)
//@Ignore
//public class OtpSMSRepositoryTest {
//    private static final String SMS_TOPIC = "sms.topic";
//
//    @Value("${expiry.time.for.otp:}")
//    private long maxExecutionTime=3000L ;
//
//    private Long currentTime = System.currentTimeMillis() + maxExecutionTime;
//
//    @Mock
//    private CustomKafkaTemplate<String, SMSRequest> kafkaTemplate;
//    private OtpSMSRepository otpSMSRepository;
//
//    @Before
//    public void before() {
//        otpSMSRepository = new OtpSMSRepository(kafkaTemplate, SMS_TOPIC);
//    }
//
//    @Ignore
//    @Test
//    public void test_should_send_user_register_sms_request_to_topic() {
//        final String mobileNumber = "mobileNumber";
//        final String tenantId = "tenantId";
//        final String otpNumber = "otpNumber";
//        final OtpRequestType type = OtpRequestType.REGISTER;
//        final OtpRequest otpRequest = new OtpRequest(mobileNumber, tenantId, type, "CITIZEN");
//        final String expectedMessage = "Dear Citizen, Welcome to mSeva Punjab. Your OTP to complete your mSeva Registration is otpNumber";
//        final SMSRequest expectedSmsRequest = new SMSRequest(mobileNumber, expectedMessage, Category.OTP, currentTime);
//        final SendResult<String, SMSRequest> sendResult = new SendResult<>(null, null);
//        when(kafkaTemplate.send(eq(SMS_TOPIC), argThat(new SmsRequestMatcher(expectedSmsRequest))))
//                .thenReturn(sendResult);
//
//        otpSMSRepository.send(otpRequest, otpNumber);
//
//        verify(kafkaTemplate).send(eq(SMS_TOPIC), argThat(new SmsRequestMatcher(expectedSmsRequest)));
//    }
//
//    @Test
//    @Ignore
//    public void test_should_send_password_reset_sms_request_to_topic() {
//        final String mobileNumber = "mobileNumber";
//        final String tenantId = "tenantId";
//        final String otpNumber = "otpNumber";
//        final OtpRequestType type = OtpRequestType.PASSWORD_RESET;
//        final OtpRequest otpRequest = new OtpRequest(mobileNumber, tenantId, type, "CITIZEN");
//        final String expectedMessage = "Your OTP for recovering password is otpNumber.";
//        final SMSRequest expectedSmsRequest = new SMSRequest(mobileNumber, expectedMessage, Category.OTP, currentTime);
//        final SendResult<String, SMSRequest> sendResult = new SendResult<>(null, null);
//        when(kafkaTemplate.send(eq(SMS_TOPIC), argThat(new SmsRequestMatcher(expectedSmsRequest))))
//                .thenReturn(sendResult);
//
//        otpSMSRepository.send(otpRequest, otpNumber);
//
//        verify(kafkaTemplate).send(eq(SMS_TOPIC), argThat(new SmsRequestMatcher(expectedSmsRequest)));
//    }
//
//    @Test(expected = RuntimeException.class)
//    public void test_should_raise_run_time_exception_when_sending_message_to_topic_fails() {
//        final String mobileNumber = "mobileNumber";
//        final String tenantId = "tenantId";
//        final String otpNumber = "otpNumber";
//        final OtpRequestType type = OtpRequestType.REGISTER;
//        final OtpRequest otpRequest = new OtpRequest(mobileNumber, tenantId, type, "CITIZEN");
//        final String expectedMessage = "Use OTP otpNumber for portal registration.";
//        final SMSRequest expectedSmsRequest = new SMSRequest(mobileNumber, expectedMessage, Category.OTP, currentTime);
//        when(kafkaTemplate.send(eq(SMS_TOPIC), argThat(new SmsRequestMatcher(expectedSmsRequest))))
//                .thenThrow(new InterruptedException());
//
//        otpSMSRepository.send(otpRequest, otpNumber);
//    }
//
//    private class SmsRequestMatcher extends CustomMatcher<SMSRequest> {
//
//
//        private SMSRequest expectedSMSRequest;
//
//        public SmsRequestMatcher(SMSRequest expectedSMSRequest) {
//            super("SMSRequest matcher");
//            this.expectedSMSRequest = expectedSMSRequest;
//        }
//
//        @Override
//        public boolean matches(Object o) {
//            SMSRequest actual = (SMSRequest) o;
//            return expectedSMSRequest.getMessage().equals(actual.getMessage())
//                    && expectedSMSRequest.getMobileNumber().equals(actual.getMobileNumber());
//        }
//    }
//}