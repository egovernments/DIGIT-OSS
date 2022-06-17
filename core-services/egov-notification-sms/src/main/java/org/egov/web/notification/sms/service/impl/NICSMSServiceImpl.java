package org.egov.web.notification.sms.service.impl;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyStore;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.codec.binary.Hex;
import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.BaseSMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "NIC")
public class NICSMSServiceImpl extends BaseSMSService {



    @Autowired
    private SMSProperties smsProperties;

    private SSLContext sslContext;

    @PostConstruct
    private void postConstruct() {
        log.info("postConstruct() start");
        try
        {
            sslContext = SSLContext.getInstance("TLSv1.2");
            if(smsProperties.isVerifyCertificate()) {
                log.info("checking certificate");
                KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
                //File file = new File(System.getenv("JAVA_HOME")+"/lib/security/cacerts");
                File file = new File(getClass().getClassLoader().getResource("smsgwsmsgovin-Mar22.cer").getFile());
                InputStream is = new FileInputStream(file);
                trustStore.load(is, "changeit".toCharArray());
                TrustManagerFactory trustFactory = TrustManagerFactory
                        .getInstance(TrustManagerFactory.getDefaultAlgorithm());
                trustFactory.init(trustStore);

                TrustManager[] trustManagers = trustFactory.getTrustManagers();
                sslContext.init(null, trustManagers, null);
            }
            else {
                log.info("not checking certificate");
                TrustManager tm = new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType)
                            throws java.security.cert.CertificateException {
                    }

                    @Override
                    public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType)
                            throws java.security.cert.CertificateException {
                    }

                    @Override
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                };
                sslContext.init(null, new TrustManager[] { tm }, null);
            }
            SSLContext.setDefault(sslContext);

        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void submitToExternalSmsService(Sms sms) {
        log.info("submitToExternalSmsService() start");
        try {

            String final_data="";
            final_data+="username="+ smsProperties.getUsername();
            final_data+="&pin="+ smsProperties.getPassword();

            String smsBody = sms.getMessage();

            if(smsBody.split("#").length > 1) {
                String templateId = smsBody.split("#")[1];

                sms.setTemplateId(templateId);
                smsBody = smsBody.split("#")[0];

            }else if(StringUtils.isEmpty(sms.getTemplateId())){
                log.info("No template Id, Message Not sent"+smsBody);
                return;
            }

            String message= "" + smsBody ;
            message=URLEncoder.encode(message,"UTF-8");


            final_data+="&message="+ message;
            final_data+="&mnumber=91"+ sms.getMobileNumber();
            final_data+="&signature="+ smsProperties.getSenderid();
            final_data+="&dlt_entity_id="+ smsProperties.getSmsEntityId();
            if(null == sms.getTemplateId())
            {
                final_data+="&dlt_template_id="+smsProperties.getSmsDefaultTmplid();
            }
            else
                final_data+="&dlt_template_id="+sms.getTemplateId();

            if(smsProperties.isSmsEnabled()) {
                HttpsURLConnection conn = (HttpsURLConnection) new URL(smsProperties.getUrl()+"?"+final_data).openConnection();
                conn.setSSLSocketFactory(sslContext.getSocketFactory());
                conn.setDoOutput(true);
                conn.setRequestMethod("GET");
                final BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                final StringBuffer stringBuffer = new StringBuffer();
                String line;
                while ((line = rd.readLine()) != null) {
                    stringBuffer.append(line);
                }
                log.info("conn: "+conn.toString());
                if(smsProperties.isDebugMsggateway())
                {
                    log.info("sms api url : "+ smsProperties.getUrl() );
                    log.info("sms response: " + stringBuffer.toString());
                    log.info("sms data: " + final_data);
                }
                rd.close();
                conn.disconnect();
            }
            else {
                log.info("SMS Data: "+final_data);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            log.error("Error occurred while sending SMS to : " + sms.getMobileNumber(), e);
        }
    }

    private boolean textIsInEnglish(String text) {
        ArrayList<Character.UnicodeBlock> english = new ArrayList<>();
        english.add(Character.UnicodeBlock.BASIC_LATIN);
        english.add(Character.UnicodeBlock.LATIN_1_SUPPLEMENT);
        english.add(Character.UnicodeBlock.LATIN_EXTENDED_A);
        english.add(Character.UnicodeBlock.GENERAL_PUNCTUATION);
        for (char currentChar : text.toCharArray()) {
            Character.UnicodeBlock unicodeBlock = Character.UnicodeBlock.of(currentChar);
            if (!english.contains(unicodeBlock)){
                return false;
            }
        }
        return true;
    }





}