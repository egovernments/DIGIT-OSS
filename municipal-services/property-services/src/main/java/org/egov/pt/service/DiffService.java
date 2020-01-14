package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.FIELDS_TO_IGNORE;
import static org.egov.pt.util.PTConstants.VARIABLE_ACTIVE;
import static org.egov.pt.util.PTConstants.VARIABLE_USERACTIVE;

import java.util.LinkedList;
import java.util.List;

import org.egov.pt.models.Property;
import org.egov.tracer.model.CustomException;
import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.core.diff.Diff;
import org.javers.core.diff.changetype.NewObject;
import org.javers.core.diff.changetype.ValueChange;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class DiffService {


    /**
     * Creates a list of Difference object between the update and search
     *
     * @param request      The tradeLicenseRequest for update
     * @param searchResult The searched licenses corresponding to the request
     * @return List of Difference object
     */
//    public Difference getDifference(PropertyRequest request, Property searchResult) {
//
//        Property property = request.getProperty();
//
//        Difference diff = new Difference();
//        diff.setId(property.getId());
//        diff.setFieldsChanged(getUpdatedFields(property, searchResult));
//        diff.setClassesAdded(getObjectsAdded(property, searchResult));
//        diff.setClassesRemoved(getObjectsRemoved(property, searchResult));
//
//        return diff;
//    }
//

    /**
     * Gives the field names whose values are different in the two classes
     *
     * @param propertyFromUpdate License from update request
     * @param propertyFromSearch License from db on which update is called
     * @return List of variable names which are changed
     */
    private List<String> getUpdatedFields(Property propertyFromUpdate, Property propertyFromSearch) {

        Javers javers = JaversBuilder.javers().build();

        Diff diff = javers.compare(propertyFromUpdate, propertyFromSearch);
        List<ValueChange> changes = diff.getChangesByType(ValueChange.class);

        List<String> updatedFields = new LinkedList<>();

        if (CollectionUtils.isEmpty(changes))
            return updatedFields;

        changes.forEach(change -> {
            if (!FIELDS_TO_IGNORE.contains(change.getPropertyName())) {
                updatedFields.add(change.getPropertyName());
            }
        });
        return updatedFields;
    }


    /**
     * Gives the names of the classes whose object are added or removed between the given licenses
     *
     * @param propertyFromUpdate Property from update request
     * @param propertyFromSearch Property from db on which update is called
     * @return Names of Classes added or removed during update
     */
    private List<String> getObjectsAdded(Property propertyFromUpdate, Property propertyFromSearch) {

        Javers javers = JaversBuilder.javers().build();
        Diff diff = javers.compare(propertyFromSearch, propertyFromUpdate);
        List objectsAdded = diff.getObjectsByChangeType(NewObject.class);
        ;

        List<String> classModified = new LinkedList<>();

        if (CollectionUtils.isEmpty(objectsAdded))
            return classModified;

        objectsAdded.forEach(object -> {
            String className = object.getClass().toString().substring(object.getClass().toString().lastIndexOf('.') + 1);
            if (!classModified.contains(className))
                classModified.add(className);
        });
        return classModified;
    }


    /**
     * Gives the names of the classes whose object are added or removed between the given licenses
     *
     * @param propertyFromUpdate License from update request
     * @param propertyFromSearch License from db on which update is called
     * @return Names of Classes added or removed during update
     */
    private List<String> getObjectsRemoved(Property propertyFromUpdate, Property propertyFromSearch) {

        Javers javers = JaversBuilder.javers().build();
        Diff diff = javers.compare(propertyFromUpdate, propertyFromSearch);
        List<ValueChange> changes = diff.getChangesByType(ValueChange.class);

        List<String> classRemoved = new LinkedList<>();

        if (CollectionUtils.isEmpty(changes))
            return classRemoved;

        changes.forEach(change -> {
            if (change.getPropertyName().equalsIgnoreCase(VARIABLE_ACTIVE)
                    || change.getPropertyName().equalsIgnoreCase(VARIABLE_USERACTIVE)) {
                classRemoved.add(getObjectClassName(change.getAffectedObject().toString()));
            }
        });
        return classRemoved;
    }

    /**
     * Extracts the class name from the affectedObject string representation
     *
     * @param affectedObject The object which is removed
     * @return Name of the class of object removed
     */
    private String getObjectClassName(String affectedObject) {
        String className = null;
        try {
            String firstSplit = affectedObject.substring(affectedObject.lastIndexOf('.') + 1);
            className = firstSplit.split("@")[0];
        } catch (Exception e) {
            throw new CustomException("NOTIFICATION ERROR", "Failed to fetch notification");
        }
        return className;
    }


}
