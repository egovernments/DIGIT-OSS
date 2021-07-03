package org.egov.commons.service;

import java.util.List;

import org.egov.commons.EgModules;
import org.egov.commons.repository.EgModulesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EgModulesService {
    @Autowired
    EgModulesRepository egModuleRepository;
    
    public List<EgModules> getEgModuleServiceByName(String name){
        return egModuleRepository.findEgModulesByName(name);
    }
}
