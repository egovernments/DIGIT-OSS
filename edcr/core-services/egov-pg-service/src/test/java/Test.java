import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.pg.models.Transaction;
import org.egov.pg.service.Gateway;
import org.egov.pg.service.gateways.axis.AxisGateway;
import org.egov.pg.service.gateways.paytm.PaytmGateway;
import org.egov.pg.service.gateways.phonepe.PhonepeGateway;
import org.egov.pg.utils.Utils;
import org.egov.pg.web.models.User;
import org.junit.Before;
import org.junit.Ignore;
import org.springframework.core.env.Environment;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URI;
import java.text.DecimalFormat;
import java.util.Collections;

@Ignore
public class Test {

    private User user;
    private ObjectMapper objectMapper;
    private RestTemplate restTemplate;
    private Environment environment;

    @Before
    public void setUp() {
        user = User.builder().userName("USER001").mobileNumber("9XXXXXXXXX").name("XYZ").tenantId("pb").emailId("").build();
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.environment = new MockEnvironment();
    }

    @org.junit.Test
    public void axisTest() {
        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("ABC231")
                .billId("ORDER001")
                .productInfo("Property Tax Payment")
                .gateway("AXIS")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .user(user).build();

        Gateway gateway = new AxisGateway(restTemplate, environment, objectMapper);
        URI redirectUri = gateway.generateRedirectURI(txn);
        System.out.println(redirectUri.toString());

    }

    @org.junit.Test
    public void phonepeTest() {
        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("ABC2312")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("PHONEPE")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .user(user).build();


        Gateway gateway = new PhonepeGateway(restTemplate, objectMapper, environment);

        URI redirectUri = gateway.generateRedirectURI(txn);
        System.out.println(redirectUri);
    }

    @org.junit.Test
    public void paytmTest() {
        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("PB_PG_2018_06_08_000014_55")
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .user(user).build();


        Gateway gateway = new PaytmGateway(restTemplate,  environment);

        URI redirectUri = gateway.generateRedirectURI(txn);
        System.out.println(redirectUri);
    }

//    @org.junit.Test
//    public void payUTest() {
//        Transaction txn = Transaction.builder().txnAmount("100")
//                .txnId("ABC231")
//                .billId("ORDER001")
//                .productInfo("Property Tax Payment")
//                .gateway("AXIS")
//                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
//                .user(user).build();
//
//
//        Gateway gateway = new PayuGateway();
//
//        URI redirectUri = gateway.generateRedirectURI(txn);
//        System.out.println(redirectUri);
//    }


    @org.junit.Test
    public void phonepeStatus() {

        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("PB_PG_2018_06_09-000013_13")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("PHONEPE")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .build();


        Gateway gateway = new PhonepeGateway(restTemplate, objectMapper, environment);
        gateway.fetchStatus(txn, Collections.singletonMap("transactionId", "PB_PG_2018_06_09-000013_13"));
    }

    @org.junit.Test
    public void paytmStatus() {

        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("PB_PG_2018_06_09-000014_24")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("PAYTM")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .build();

        Gateway gateway = new PaytmGateway(restTemplate, environment);
        gateway.fetchStatus(txn, Collections.singletonMap("transactionId", "PB_PG_2018_06_09-000014_24"));


    }

    @org.junit.Test
    public void axisStatus() {

        Transaction txn = Transaction.builder().txnAmount("100")
                .txnId("PB_PG_2018_06_11-000024_17")
                .billId("ORDER0012")
                .productInfo("Property Tax Payment")
                .gateway("AXIS")
                .callbackUrl("http://2a91377b.ngrok.io/egov-pay/payments/v1/_update")
                .build();

        Gateway gateway = new AxisGateway(restTemplate, environment, objectMapper);
        gateway.fetchStatus(txn, Collections.singletonMap("transactionId", "PB_PG_2018_06_09-000014_24"));


    }

    @org.junit.Test
    public void name1() {
        final DecimalFormat CURRENCY_FORMATTER_RUPEE = new DecimalFormat("0.00");
        System.out.println(Double.valueOf(CURRENCY_FORMATTER_RUPEE.format(Double.valueOf("141"))));
        BigDecimal decimal = new BigDecimal(10488.88);
        BigDecimal decimal1 = new BigDecimal(10488);
        System.out.println(decimal.longValueExact());
        System.out.println(decimal == decimal1);
    }

    @org.junit.Test
    public void name3() {
        System.out.println(Utils.convertPaiseToRupee("10"));
    }
}
