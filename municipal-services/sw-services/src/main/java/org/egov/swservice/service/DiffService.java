package org.egov.swservice.service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.egov.swservice.web.models.SewerageConnection;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.util.SWConstants;
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
	 * @param request
	 *            The sewerage connection request for update
	 * @param searchResult
	 *            The searched result
	 */
	public void checkDifferenceAndSendEditNotification(SewerageConnectionRequest request,
			SewerageConnection searchResult) {
		try {
				editNotificationService.sendEditNotification(request);
		} catch (Exception ex) {
			log.error("Edit Notification Error!!", ex);
		}
	}

	/**
	 * Check updated fields
	 * 
	 * @param updateConnection - Sewerage Connection Object
	 * @param searchResult - Sewerage Connection Object
	 * @return List of updated fields
	 */
	private List<String> getUpdateFields(SewerageConnection updateConnection, SewerageConnection searchResult) {
		Diff diff = JaversBuilder.javers().build().compare(updateConnection, searchResult);
		
		List<ValueChange> changes = diff.getChangesByType(ValueChange.class);
		if (CollectionUtils.isEmpty(changes))
			return Collections.emptyList();
		
		List<String> updatedValues = new LinkedList<>();
		changes.forEach(change -> {
			if (SWConstants.FIELDS_TO_CHECK.contains(change.getPropertyName()) &&
					!SWConstants.FIELDS_TO_IGNORE.contains(change.getPropertyName())) {
				updatedValues.add(change.getPropertyName());
			}
		});
		log.info("Updated Fields :----->  "+ updatedValues.toString());
		return updatedValues;
	}

	/**
	 * Check for added new object
	 * 
	 * @param updateConnection - Sewerage Connection Object
	 * @param searchResult - Sewerage Connection Object
	 * @return list of added object
	 */
	@SuppressWarnings("unchecked")
	private List<String> getObjectsAdded(SewerageConnection updateConnection, SewerageConnection searchResult) {
		Diff diff = JaversBuilder.javers().build().compare(updateConnection, searchResult);
		List<NewObject> objectsAdded = diff.getObjectsByChangeType(NewObject.class);
		
		if (CollectionUtils.isEmpty(objectsAdded))
			return Collections.emptyList();
		
		List<String> classModified = new LinkedList<>();
		for (Object object : objectsAdded) {
			String className = object.getClass().toString()
					.substring(object.getClass().toString().lastIndexOf('.') + 1);
			if (!classModified.contains(className) && !SWConstants.IGNORE_CLASS_ADDED.contains(className))
				classModified.add(className);
		}
		log.info("Class Modified :----->  "+ classModified.toString());
		return classModified;
	}

	/**
	 * 
	 * @param updateConnection - Sewerage Connection Object
	 * @param searchResult - Sewerage Connection Object
	 * @return List of added or removed object
	 */
	private List<String> getObjectsRemoved(SewerageConnection updateConnection, SewerageConnection searchResult) {

		Diff diff = JaversBuilder.javers().build().compare(updateConnection, searchResult);
		List<ValueChange> changes = diff.getChangesByType(ValueChange.class);
		
		if (CollectionUtils.isEmpty(changes))
			return Collections.emptyList();
		List<String> classRemoved = new LinkedList<>();
		for (Object object : changes) {
			String className = object.getClass().toString()
					.substring(object.getClass().toString().lastIndexOf('.') + 1);
			if (!classRemoved.contains(className) && !SWConstants.IGNORE_CLASS_ADDED.contains(className))
				classRemoved.add(className);
		}
		log.info("Class Modified :----->  "+ classRemoved.toString());
		return classRemoved;
	}
}