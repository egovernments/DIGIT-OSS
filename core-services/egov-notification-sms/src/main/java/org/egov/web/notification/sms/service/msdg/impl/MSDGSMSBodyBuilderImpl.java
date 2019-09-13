package org.egov.web.notification.sms.service.msdg.impl;

import java.security.MessageDigest;

import org.egov.web.notification.sms.config.MSDGProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "MSDG")
public class MSDGSMSBodyBuilderImpl implements SMSBodyBuilder {

	@Autowired
	private MSDGProperties smsProps;

	public MultiValueMap<String, String> getSmsRequestBody(Sms sms) {
		String encryptedPassword = MD5(smsProps.getPassword());
		String genratedhashKey = hashGenerator(smsProps.getUsername(), smsProps.getSenderid(), sms.getMessage(),
				smsProps.getSecureKey());

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add(smsProps.getUsernameParameter(), smsProps.getUsername());
		map.add(smsProps.getPasswordParameter(), encryptedPassword);
		map.add(smsProps.getSenderidParameter(), smsProps.getSenderid());
		map.add(smsProps.getSmsservicetypeParameter(), smsProps.getSmsservicetype());
		map.add(smsProps.getMobileNoParameter(), sms.getMobileNumber());
		map.add(smsProps.getMessageParameter(), sms.getMessage());
		map.add(smsProps.getKeyParameter(), genratedhashKey);

		return map;
	}

	protected String hashGenerator(String userName, String senderId, String content, String secureKey) {
		StringBuffer finalString = new StringBuffer();
		finalString.append(userName.trim()).append(senderId.trim()).append(content.trim()).append(secureKey.trim());
		String hashGen = finalString.toString();
		StringBuffer sb = null;
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("SHA-512");
			md.update(hashGen.getBytes());
			byte byteData[] = md.digest();
			// convert the byte to hex format method 1
			sb = new StringBuffer();
			for (int i = 0; i < byteData.length; i++) {
				sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
			}

		} catch (Exception e) {
			log.error("Exception while generating the hash: ", e);
		}
		return sb.toString();
	}

	private static String MD5(String text) {
		MessageDigest md;
		byte[] md5 = new byte[64];
		try {
			md = MessageDigest.getInstance("SHA-1");
			md.update(text.getBytes("iso-8859-1"), 0, text.length());
			md5 = md.digest();
		}catch(Exception e) {
			log.error("Exception while encrypting the pwd: ",e);
		}
		return convertedToHex(md5);

	}

	private static String convertedToHex(byte[] data) {
		StringBuffer buf = new StringBuffer();

		for (int i = 0; i < data.length; i++) {
			int halfOfByte = (data[i] >>> 4) & 0x0F;
			int twoHalfBytes = 0;

			do {
				if (0 <= halfOfByte && halfOfByte <= 9)
					buf.append((char) ('0' + halfOfByte));
				else 
					buf.append((char) ('a' + (halfOfByte - 10)));

				halfOfByte = data[i] & 0x0F;

			} while (twoHalfBytes++ < 1);
		}
		return buf.toString();
	}

}
