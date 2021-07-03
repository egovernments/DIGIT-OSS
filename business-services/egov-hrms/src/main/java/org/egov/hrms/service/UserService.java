/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.hrms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.config.PropertiesManager;
import org.egov.hrms.model.Employee;
import org.egov.hrms.model.enums.UserType;
import org.egov.hrms.repository.RestCallRepository;
import org.egov.hrms.utils.HRMSConstants;
import org.egov.hrms.web.contract.UserRequest;
import org.egov.hrms.web.contract.UserResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
public class UserService {

	@Autowired
	private PropertiesManager propertiesManager;
	
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private RestCallRepository restCallRepository;

	@Value("${egov.user.create.endpoint}")
	private String userCreateEndpoint;

	@Value("${egov.user.search.endpoint}")
	private String userSearchEndpoint;

	@Value("${egov.user.update.endpoint}")
	private String userUpdateEndpoint;
	
	public UserResponse createUser(UserRequest userRequest) {
		StringBuilder uri = new StringBuilder();
		uri.append(propertiesManager.getUserHost()).append(propertiesManager.getUserCreateEndpoint());
		UserResponse userResponse = null;
		try {
			userResponse = userCall(userRequest,uri);
		}catch(Exception e) {
			log.error("User created failed: ",e);
		}

		return userResponse;
	}
	
	public UserResponse updateUser(UserRequest userRequest) {
		StringBuilder uri = new StringBuilder();
		uri.append(propertiesManager.getUserHost()).append(propertiesManager.getUserUpdateEndpoint());
		UserResponse userResponse = null;
		try {
			userResponse = userCall(userRequest,uri);
		}catch(Exception e) {
			log.error("User created failed: ",e);
		}

		return userResponse;
	}
	
	public UserResponse getUser(RequestInfo requestInfo, Map<String, Object> UserSearchCriteria ) {
		StringBuilder uri = new StringBuilder();
		Map<String, Object> userSearchReq = new HashMap<>();
		userSearchReq.put("RequestInfo", requestInfo);
		userSearchReq.put(HRMSConstants.HRMS_USER_SERACH_CRITERIA_USERTYPE_CODE,HRMSConstants.HRMS_USER_SERACH_CRITERIA_USERTYPE);
		for( String key: UserSearchCriteria.keySet())
			userSearchReq.put(key, UserSearchCriteria.get(key));
		uri.append(propertiesManager.getUserHost()).append(propertiesManager.getUserSearchEndpoint());
		UserResponse userResponse = new UserResponse();
		try {
			userResponse = userCall(userSearchReq,uri);
		}catch(Exception e) {
			log.error("User search failed: ",e);
		}

		return userResponse;
	}


	/**
	 * Returns UserDetailResponse by calling user service with given uri and object
	 * @param userRequest Request object for user service
	 * @param uri The address of the endpoint
	 * @return Response from user service as parsed as userDetailResponse
	 */
	@SuppressWarnings("all")
	private UserResponse userCall(Object userRequest, StringBuilder uri) {
		String dobFormat = null;
		if(uri.toString().contains(userSearchEndpoint) || uri.toString().contains(userUpdateEndpoint))
			dobFormat="yyyy-MM-dd";
		else if(uri.toString().contains(userCreateEndpoint))
			dobFormat = "dd/MM/yyyy";
		try{
			LinkedHashMap responseMap = (LinkedHashMap) restCallRepository.fetchResult(uri, userRequest);
			parseResponse(responseMap,dobFormat);
			UserResponse userDetailResponse = objectMapper.convertValue(responseMap,UserResponse.class);
			return userDetailResponse;
		}
		catch(IllegalArgumentException  e) {
			throw new CustomException("IllegalArgumentException","ObjectMapper not able to convertValue in userCall");
		}
	}


	/**
	 * Parses date formats to long for all users in responseMap
	 * @param responeMap LinkedHashMap got from user api response
	 * @param dobFormat dob format (required because dob is returned in different format's in search and create response in user service)
	 */
	@SuppressWarnings("all")
	private void parseResponse(LinkedHashMap responeMap,String dobFormat){
		List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
		String format1 = "dd-MM-yyyy HH:mm:ss";
		if(users!=null){
			users.forEach( map -> {
						map.put("createdDate",dateTolong((String)map.get("createdDate"),format1));
						if((String)map.get("lastModifiedDate")!=null)
							map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),format1));
						if((String)map.get("dob")!=null)
							map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
						if((String)map.get("pwdExpiryDate")!=null)
							map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),format1));
					}
			);
		}
	}

	/**
	 * Converts date to long
	 * @param date date to be parsed
	 * @param format Format of the date
	 * @return Long value of date
	 */
	private Long dateTolong(String date,String format){
		SimpleDateFormat f = new SimpleDateFormat(format);
		Date d = null;
		try {
			d = f.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return  d.getTime();
	}


}