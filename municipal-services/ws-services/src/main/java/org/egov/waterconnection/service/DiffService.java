package org.egov.waterconnection.service;



import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.core.diff.Diff;
import org.javers.core.diff.changetype.NewObject;
import org.javers.core.diff.changetype.ValueChange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class DiffService {
	
	@Autowired
	private EditNotificationService editNotificationService;
	/**
	 * Creates a list of Difference object between the update and search
	 *
	 * @param request The water connection request for update
	 */
	public void checkDifferenceAndSendEditNotification(WaterConnectionRequest request) {
		try {
				editNotificationService.sendEditNotification(request);
		} catch (Exception ex) {
			log.error("Edit Notification Error!!", ex);
		}
	}
	
	/**
	 * Check updated fields
	 * 
	 * @param updateConnection WaterConnection Object
	 * @param searchResult WaterConnection Object
	 * @return List of updated fields
	 */
	private List<String> getUpdateFields(WaterConnection updateConnection, WaterConnection searchResult) {
		Javers javers = JaversBuilder.javers().build();
		Diff diff = javers.compare(updateConnection, searchResult);
		List<ValueChange> changes = diff.getChangesByType(ValueChange.class);
		if (CollectionUtils.isEmpty(changes))
			return Collections.emptyList();
		List<String> updatedValues = new LinkedList<>();
		changes.forEach(change -> {
			if (WCConstants.FIELDS_TO_CHECK.contains(change.getPropertyName())) {
				updatedValues.add(change.getPropertyName());
            }
		});
		log.info("Updated Fields :----->  "+ updatedValues.toString());
		return updatedValues;
	}
	/**
	 * Check for added new object
	 * 
	 * @param updateConnection WaterConnection Object
	 * @param searchResult WaterConnection Object
	 * @return list of added object
	 */
	@SuppressWarnings("unchecked")
	private List<String> getObjectsAdded(WaterConnection updateConnection, WaterConnection searchResult) {
		Javers javers = JaversBuilder.javers().build();
		Diff diff = javers.compare(updateConnection, searchResult);
		List<NewObject> objectsAdded = diff.getObjectsByChangeType(NewObject.class);
		if (CollectionUtils.isEmpty(objectsAdded))
			return Collections.emptyList();
		List<String> classModified = new LinkedList<>();
		for(Object object: objectsAdded) {
			String className = object.getClass().toString()
					.substring(object.getClass().toString().lastIndexOf('.') + 1);
			
			if (!classModified.contains(className) && !WCConstants.IGNORE_CLASS_ADDED.contains(className))
					classModified.add(className);
		}
		log.info("Class Modified :----->  "+ classModified.toString());
		return classModified;
	}
	
	/**
	 * 
	 * @param updateConnection WaterConnection Object
	 * @param searchResult WaterConnection Object
	 * @return List of added or removed object
	 */
    private List<String> getObjectsRemoved(WaterConnection updateConnection, WaterConnection searchResult) {

        Javers javers = JaversBuilder.javers().build();
        Diff diff = javers.compare(updateConnection, searchResult);
        List<ValueChange> changes = diff.getChangesByType(ValueChange.class);
        if (CollectionUtils.isEmpty(changes))
            return Collections.emptyList();
        List<String> classRemoved = new LinkedList<>();
//        changes.forEach(change -> {
//            if (change.getPropertyName().equalsIgnoreCase(VARIABLE_ACTIVE)
//                    || change.getPropertyName().equalsIgnoreCase(VARIABLE_USERACTIVE)) {
//                classRemoved.add(getObjectClassName(change.getAffectedObject().toString()));
//            }
//        });
        return classRemoved;
    }
    
}
