package org.egov.user.avm.developer.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.avm.developer.dto.UserDeveloperDto;
import org.egov.user.avm.developer.entity.AddRemoveAuthoizedUsers;
import org.egov.user.avm.developer.entity.DeveloperInfo;
import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.egov.user.avm.developer.entity.Developerdetail;
import org.egov.user.avm.developer.repo.DeveloperRegistrationRepo;
import org.egov.user.avm.developer.services.DeveloperRegistrationService;
import org.egov.user.domain.model.User;
import org.egov.user.domain.service.UserService;
import org.egov.user.web.contract.CreateUserRequest;
import org.egov.user.web.contract.UserRequest;
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

		System.out.println("Registration Api..");
		
		DeveloperRegistration developerRegistration1 = developerRegistrationService.addDeveloperRegistraion(developerRegistration); 
		
		System.out.println("developer1 detail size ==== : " + developerRegistration1.getDeveloperDetail().size());
			
		User newUser = null;
		Long devId=developerRegistration1.getId();
		UserRequest userRequest ;
		
		for(int i =0;i<developerRegistration1.getDeveloperDetail().size();i++) {		
			
			for(int j =0; j<developerRegistration1.getDeveloperDetail().get(i).getDevDetail().getAddRemoveAuthoizedUsers().size();j++ ) {
				
				userRequest = new UserRequest();
				
				CreateUserRequest createUserRequest = new CreateUserRequest();
				RequestInfo requestInfo = new RequestInfo();
				requestInfo.setApiId("1");
				requestInfo.setVer("1");
				requestInfo.setDid("");
				requestInfo.setAction("_create");
				requestInfo.setAuthToken("null");
				createUserRequest.setRequestInfo(requestInfo);
				
				userRequest = developerRegistration1.getDeveloperDetail().get(i).getDevDetail().getAddRemoveAuthoizedUsers().get(j);
				
				createUserRequest.setUser(userRequest);
				createUserRequest.getUser().setParentid(devId);
				
				User user = createUserRequest.toDomain(true);
				System.out.println("dev Id ======> " + devId);
				
				newUser = userService.createUser(user, requestInfo);
				 
			}
		}
		return developerRegistration1;
		
	}
	
	@GetMapping("/_getAuthorizedUser")
	public UserDeveloperDto viewAuthorizedUserDetail() {
		
		String mobileNumber = "";
		UserDeveloperDto userDeveloperDto = new UserDeveloperDto();
		
		User user = userService.getAuthorizedUser(mobileNumber);
		if(!user.equals(null) && user.getParentid()!=null) {
			Long parentId = user.getParentid();
			DeveloperRegistration developerRegistration = developerRegistrationRepo.findById(parentId);
			userDeveloperDto.setUser(user);
			userDeveloperDto.setDeveloperRegistration(developerRegistration);
		}
		return userDeveloperDto;
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
	
	
	public Developerdetail getAuthorizeUser() {
		
		Developerdetail d = developerRegistrationRepo.findAuthorizedUser("12312312");
		System.out.println("user : " + d.getVersion());
		return d;
	}
	
	
	//@GetMapping("/_getAuthorized")
	//public String getAuthorizedUser(@requestParam(value=""))
	
	
	

	
	//@GetMapping("/_getAuthorizedUser")
	public UserRequest getAuthorize() {
		
		String mobileNumber = "12312312";
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
	
	
	@PostMapping("/_create")
	public DeveloperRegistration createDeveloperRegistraion1(@RequestBody DeveloperRegistration developerRegistration) throws JsonProcessingException {
		
		//System.out.println("Request Info : " + developerInfo.getDeveloperRegistration().getDeveloperDetail().size());
		
		System.out.println("Registration Api..");
		//DeveloperRegistration insertedDeveloper = this.developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		//List<User> userList = this.developerRegistrationService.setUserInfo(developerRegistration);
		
		//User createdUser = userService.createCitizen(user, createUserRequest.getRequestInfo());
		return developerRegistrationService.addDeveloperRegistraion(developerRegistration);
		//return null;
		
	}
		
		

	
}
