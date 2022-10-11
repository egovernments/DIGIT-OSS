package org.egov.user.avm.developer.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.user.avm.developer.entity.AddRemoveAuthoizedUsers;
import org.egov.user.avm.developer.entity.DeveloperInfo;
import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.egov.user.avm.developer.entity.Developerdetail;
import org.egov.user.avm.developer.repo.DeveloperRegistrationRepo;
import org.egov.user.avm.developer.services.DeveloperRegistrationService;
import org.egov.user.domain.model.User;
import org.egov.user.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;


@RestController
@RequestMapping("/developer")
public class DeveloperRegistrationController {

	
	@Autowired DeveloperRegistrationService developerRegistrationService;
	@Autowired DeveloperRegistrationRepo developerRegistrationRepo;
	@Autowired UserService userService;
	
	@PostMapping("/_registration")
	public DeveloperRegistration createDeveloperRegistraion(@RequestBody DeveloperRegistration developerRegistration) throws JsonProcessingException {
		
		//System.out.println("Request Info : " + developerInfo.getDeveloperRegistration().getDeveloperDetail().size());
		
		System.out.println("Registration Api..");
		//DeveloperRegistration insertedDeveloper = this.developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		//List<User> userList = this.developerRegistrationService.setUserInfo(developerRegistration);
		
		//User createdUser = userService.createCitizen(user, createUserRequest.getRequestInfo());
		return developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		//return null;
		
	}
	
	
	
	public DeveloperRegistration createDeveloperRegistraionWithUser(@RequestBody DeveloperInfo developerInfo) throws JsonProcessingException {
		
		System.out.println("Request Info : " + developerInfo.getDeveloperRegistration().getDeveloperDetail().size());
		
		System.out.println("Registration Api.."+ developerInfo.getDeveloperRegistration().getDeveloperDetail().get(0).getDevDetail().getAddRemoveAuthoizedUsers().size());
		//DeveloperRegistration insertedDeveloper = this.developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		List<User> userList = this.developerRegistrationService.setUserInfo(developerInfo.getDeveloperRegistration(),developerInfo.getRequestInfo());
		
		//User createdUser = userService.createCitizen(user, createUserRequest.getRequestInfo());
		return developerRegistrationService.addDeveloperRegistraion(developerInfo.getDeveloperRegistration());
		//return null;
		
	}
	
	
	
	@GetMapping("/_searchall")
	public List<DeveloperRegistration> searchDeveloperRegistraion(){
		
		
		System.out.println("Searching api..");
		return this.developerRegistrationService.findAllDeveloperDetail();
		
	}
	
	@GetMapping("/_get")
	public DeveloperRegistration getById(@RequestParam(value = "id") Long id) {
		System.out.println("Developer Id : " + id);
		return developerRegistrationService.getById(id);
		
	}
	
	@GetMapping("/_getAuthorizedUser")
	public String getAuthorizeUser() {
		
		Developerdetail d = developerRegistrationRepo.findAuthorizedUser("7895877833");
		System.out.println("user : " + d.getVersion());
		return null;
	}
	
	
	//@GetMapping("/_getAuthorized")
	//public String getAuthorizedUser(@requestParam(value=""))
	
	
	
	public AddRemoveAuthoizedUsers getAuthorize(@RequestParam(value = "mobileNumber") String mobileNumber) {
		
		//String mobileNumber = "7895877833";
		List<DeveloperRegistration> d = developerRegistrationRepo.findAll();
		
		if(d.size()>0) {
			for(int i=0;i<d.size();i++) {
				if(d.get(i).getDeveloperDetail().size()>0) {
					System.out.println("1 : " + d.get(i).getDeveloperDetail().size());
				
					for(int j=0;j<d.get(i).getDeveloperDetail().size();j++) {
						
						
						if(d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().size()>0) {
							System.out.println("2 : " + d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().size());
						
							for(int k=0;k<d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().size();k++) {
								
								System.out.println("==================================3 " + d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().get(k).getMobileNumber());
								
								if(d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().get(k).getMobileNumber().equals(mobileNumber)) {
									System.out.println("======================found mobile number : ==============================");
									
									return d.get(i).getDeveloperDetail().get(j).getDevDetail().getAddRemoveAuthoizedUsers().get(k);
									
								}else {
									System.out.println("hello");
								}
							}
						}
					}
				}
			}
		}
		//System.out.println("user : " + d.getVersion());
		return null;
	}
	
		
		

	
}
