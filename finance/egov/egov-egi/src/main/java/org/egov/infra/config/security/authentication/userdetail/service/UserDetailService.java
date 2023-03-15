/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.infra.config.security.authentication.userdetail.service;

import org.egov.infra.admin.master.service.UserService;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class UserDetailService implements UserDetailsService {
    
	@Autowired
	public MicroserviceUtils microserviceUtils;
	
	private UserService userService;

    public UserDetailService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
//    	 System.out.println("************** retrieving user information - started*******************");
//         User user= this.loadUserFromMS(username);
////         User user= this.getDummyUser();
//         System.out.println("************** retrieving user information - end*******************");
//         return new CurrentUser(user);
    	return null;
    }
    
//    private User loadUserFromMS(String accessToken)
//    {
//    	System.out.println("*************** User Info microservice - started ****************");
//    	System.out.println("Recieved token:"+accessToken);
//    	//MicroserviceUtils msutil = new MicroserviceUtils();
//    	CustomUserDetails user = msUtil.getUserDetails(accessToken);
//    	System.out.println("*************** User Info microservice - end ****************");
//    	return this.parepareCurrentUser(user);
//    }
//    
//    private User parepareCurrentUser(CustomUserDetails userdetails) {
//    
//    		
//    	
//    	User user =new User(UserType.EMPLOYEE);
//    //	user.setId(userdetails.getId());
//    	user.setId(userdetails.getId());
//    	user.setUsername(userdetails.getUserName());
//    	user.setActive(true);
//    	user.setAccountLocked(false);
//    	user.setGender(Gender.FEMALE);
//    	user.setPassword("demo");
//    	user.setName(userdetails.getName());
//    	user.setPwdExpiryDate(new Date(2090,01,01));
//    	user.setLocale(userdetails.getLocale());
//    	System.out.println("***************** is password expired :  "+user.getPwdExpiryDate().isAfterNow());
//    	
////    	for(Role _role:userdetails.getRoles()){
////    		
////    	}
////    	Role role = new Role();
////    	role.setId(4L);
////    	role.setName("SYSTEM");
//    	Set<Role> roles = new HashSet<>(userdetails.getRoles());
//    	//roles.add(role);
//    	
//    	user.setRoles(roles);
//    	
////    	user.setRoles(new HashSet<>(userdetails.getRoles()));
//    	
//    	
//    	
//    	return user;
////    	currentUser.setRoles(new Set(userdetails.getRoles()));
//    	
//    }
//    
//    private User getDummyUser(){
//    	User user =new User(UserType.EMPLOYEE);
//        //	user.setId(userdetails.getId());
//        	user.setId(1L);
//        	user.setUsername("egovernments");
//        	user.setActive(true);
//        	user.setAccountLocked(false);
//        	user.setGender(Gender.MALE);
//        	user.setPassword("demo");
//        	user.setName("egovernments");
//        	user.setPwdExpiryDate(new Date(2090,01,01));
//        	user.setLocale("en_lan");
//        	System.out.println("***************** is password expired :  "+user.getPwdExpiryDate().isAfterNow());
//        	
//        	Role role = new Role();
//        	role.setId(4L);
//        	role.setName("SYSTEM");
//        	Set<Role> roles = new HashSet<>();
//        	roles.add(role);
//        	
//        	user.setRoles(roles);
//        	
////        	user.setRoles(new HashSet<>(userdetails.getRoles()));
//        	
//        	
//        	
//        	return user;
//    }
}