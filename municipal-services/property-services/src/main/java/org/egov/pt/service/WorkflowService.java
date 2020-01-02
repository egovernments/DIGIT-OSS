package org.egov.pt.service;


import org.egov.pt.models.Difference;
import org.egov.pt.models.Property;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

import static org.egov.pt.util.PTConstants.FIELDS_FOR_OWNER_MUTATION;
import static org.egov.pt.util.PTConstants.FIELDS_FOR_PROPERTY_MUTATION;
import static org.egov.pt.util.PTConstants.VARIABLE_OWNER;

@Service
public class WorkflowService {


    @Autowired
    private DiffService diffService;

    /**
     * method to process requests for workflow
     * @param request
     */
    public void processWorkflowAndPersistData(PropertyRequest request, Property propertyFromDb) {

        Boolean isDiffOnWorkflowFields = false;

        Difference difference =  diffService.getDifference(request, propertyFromDb);
        /*
         *
         * 1. is record active or not
         *
         * 2. if inactive get workflow information
         *
         * 3. check if update is possible, if yes the do update else throw error
         *
         * 4. if record is active and changes are there , then trigger the workflow they are asking for
         * then persist the record
         *
         * 5.
         */


    }


    private List<String> getSwitches(Difference difference){

        List<String> switches = new LinkedList<>();

        if(!CollectionUtils.isEmpty(difference.getFieldsChanged())){

            if(Collections.disjoint( difference.getFieldsChanged(), FIELDS_FOR_OWNER_MUTATION))
                switches.add("OWNERMUTATION") ;

            if(Collections.disjoint(difference.getFieldsChanged(), FIELDS_FOR_PROPERTY_MUTATION))
                switches.add("PROPERTYMUTATION");
        }

        if(!CollectionUtils.isEmpty(difference.getClassesRemoved())){
            if(difference.getClassesRemoved().contains(VARIABLE_OWNER))
                switches.add("OWNERMUTATION") ;
        }

        if(!CollectionUtils.isEmpty(difference.getClassesAdded())){
            if(difference.getClassesAdded().contains(VARIABLE_OWNER))
                switches.add("OWNERMUTATION") ;
        }



        return switches;


    }











}
