// package org.egov.web.notification.sms.consumer;

// import org.egov.web.notification.sms.consumer.contract.SMSRequest;
// import org.egov.web.notification.sms.models.Priority;
// import org.egov.web.notification.sms.models.RequestContext;
// import org.egov.web.notification.sms.models.Sms;
// import org.egov.web.notification.sms.services.SMSService;
// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.runners.MockitoJUnitRunner;

// import static org.junit.Assert.assertNotNull;
// import static org.mockito.Mockito.verify;

// @RunWith(MockitoJUnitRunner.class)
// public class SmsNotificationListenerTest {

//     @Mock
//     private SMSService smsService;

//     @InjectMocks
//     private SmsNotificationListener listener;

//     @Test
//     public void test_should_send_sms() {
//         final SMSRequest smsRequest = new SMSRequest("mobileNumber", "message");

//         listener.process(smsRequest);

//         verify(smsService).sendSMS(new Sms("mobileNumber", "message", Priority.HIGH));
//     }

//     @Test
//     public void test_should_set_correlation_id() {
//         final SMSRequest smsRequest = new SMSRequest("mobileNumber", "message");

//         listener.process(smsRequest);

//         assertNotNull(RequestContext.getId());
//     }
// }