package org.egov.user.avm.developer.services;

import java.util.Arrays;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.transaction.Transactional;

import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.springframework.beans.factory.annotation.Autowired;
import org.egov.user.avm.developer.repo.DeveloperRegistrationRepo;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

@Service
public class DeveloperRegistrationService {

	@Autowired
	DeveloperRegistrationRepo develloperRegistrationRepo;
	@Autowired EntityManager em;

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
}
