package org.egov.user.avm.developer.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.transaction.Transactional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.egov.user.avm.developer.repo.DeveloperRegistrationRepo;
import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.enums.AddressType;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.domain.service.UserService;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

@Service
public class DeveloperRegistrationService {

	@Autowired
	DeveloperRegistrationRepo develloperRegistrationRepo;
	@Autowired EntityManager em;
	@Autowired UserService userService;

	@Transactional
	public DeveloperRegistration addDeveloperRegistraion(DeveloperRegistration developerRegistrationMain)
			throws JsonProcessingException {

		
		if(develloperRegistrationRepo.existsById(developerRegistrationMain.getId())) {
			DeveloperRegistration devRegistration = em.find(DeveloperRegistration.class, developerRegistrationMain.getId(),LockModeType.PESSIMISTIC_WRITE);
		
			for(int i =0 ; i < developerRegistrationMain.getDeveloperDetail().size();i++) {
				developerRegistrationMain.getDeveloperDetail().get(i).setVersion(devRegistration.getCurrentVersion()+0.1f);
			}
			devRegistration.setCurrentVersion(devRegistration.getCurrentVersion()+0.1f);
			devRegistration.getDeveloperDetail().addAll(developerRegistrationMain.getDeveloperDetail());
			return devRegistration;
		}
		
		developerRegistrationMain.setCurrentVersion(0.0f);
		return develloperRegistrationRepo.save(developerRegistrationMain);
		
	}
	
	public DeveloperRegistration getById(Long id) {
		
		DeveloperRegistration developerRegistration = develloperRegistrationRepo.findById(id);
		
		System.out.println("Developer detail : " + developerRegistration.getCurrentVersion());
		
		for(int i =0 ; i< developerRegistration.getDeveloperDetail().size(); i++) {
			if(developerRegistration.getCurrentVersion() == developerRegistration.getDeveloperDetail().get(i).getVersion()) {
				
				developerRegistration.setDeveloperDetail(Arrays.asList(developerRegistration.getDeveloperDetail().get(i)));
			}
		}
		
		return developerRegistration;
	}

	public List<DeveloperRegistration> findAllDeveloperDetail() {
		return this.develloperRegistrationRepo.findAll();
	}
	
	public List<User> setUserInfo(DeveloperRegistration developerRegistration,RequestInfo requestInfo) {

        //RequestInfo requestInfo = new RequestInfo();
		List<User> userList = new ArrayList<>();
         
		int authorizedUserList = 0;
		
		if(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().size()>0) {
			authorizedUserList = developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().size();
			System.out.println("authorized user list : " + authorizedUserList);
		}
		
		
		for(int i=0;i<authorizedUserList;i++) {
			
			User user = new User();
			//user.setAadhaarNumber(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().get(i).getUploadAadharPdf());
			user.setMobileNumber(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().get(i).getMobileNumber());
			user.setName("RahulTiwar09");
			user.setActive(true);
			
			//Address address = new Address("246439", "Guptakashi", "Guptakashi", AddressType.PERMANENT, 1l, "hr", "", "PERMANENT", 0L,new Date());
			user.setUsername("Rahul");
			user.setMobileNumber("7895877833");
			user.setType(UserType.EMPLOYEE);
			Role role = new Role();
			role.setCode("101");
			//role.setId(id);
			role.setName("SUPERUSER");
			role.setTenantId("pb");
			Set<Role> roles = new HashSet<Role>();
			roles.add(role);
			
			user.setRoles(roles);
			
			//user.setPermanentAddress("permanent address");
			user.setEmailId(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().get(i).getEmailId());
			user.setPan(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().get(i).getPan());
			user.setSignature(developerRegistration.getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().get(i).getSignature());
			//user.setParentId(developerRegistration.getId());
			userList.add(userService.createUser(user, requestInfo));
		}
		
		
		return userList;
	}
}
