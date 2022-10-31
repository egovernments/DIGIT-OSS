package org.egov.land.abm.service;

import org.egov.land.abm.newservices.entity.NewServiceInfo;
import org.egov.land.abm.repo.NewServiceInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NewServiceInfoService {

	@Autowired NewServiceInfoRepo newServiceInfoRepo;
	
	public NewServiceInfo createNewServic(NewServiceInfo newServiceInfo){
		
		return newServiceInfoRepo.save(newServiceInfo);
	}
}
