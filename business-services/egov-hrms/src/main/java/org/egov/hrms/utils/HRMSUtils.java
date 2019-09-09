package org.egov.hrms.utils;

import java.util.List;
import java.util.Random;

import org.egov.hrms.web.contract.EmployeeSearchCriteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class HRMSUtils {
	
	@Value("${egov.hrms.default.pwd.length}")
	private Integer pwdLength;
	
	/**
	 * Generates random password for the user to login. Process:
	 * 1. Takes a list of parameters for password
	 * 2. Applies a random select logic and generates a password of constant length.
	 * 3. The length of the password is configurable.
	 * 
	 * @param params
	 * @return
	 */
	public String generatePassword(List<String> params) {
		StringBuilder password = new StringBuilder();
		Random random = new Random();
		try {
			for(int i = 0; i < params.size(); i++) {
				String param = params.get(i);
				String val = param.split("")[random.nextInt(param.length() - 1)];
				if(val.equals(".") || val.equals("-"))
					password.append("x");
				else
					password.append(val);
				if(password.length() == pwdLength)
					break;
				else {
					if(i == params.size() - 1)
						i = 0;
				}
			}
		}catch(Exception e) {
			password.append("123456");
		}

		return password.toString().replaceAll("\\s+", "");
	}

	public boolean isAssignmentSearchReqd(EmployeeSearchCriteria criteria) {
		return (! CollectionUtils.isEmpty(criteria.getPositions()) || null != criteria.getAsOnDate()
				|| !CollectionUtils.isEmpty(criteria.getDepartments()) || !CollectionUtils.isEmpty(criteria.getDesignations()));
	}
}
