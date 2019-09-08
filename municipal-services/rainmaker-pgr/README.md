***PGR v1.1***

This doc contains the changes done in the rainmaker-pgr service for the v1.1 release. It includes the details of refactoring and enhancements done as part of v1.1 release. Every section in the doc contains code changes done to accommodate the new requirements whilst cleaning the redundant code that was needed during v1. This doc doesn't contain the granular details of every task as to which loop was added, what variables were removed, which methods were broken into different methods and things like that. It gives a top-level idea of the changes done.

Note - The artifact id of this service is updated to 0.0.2-SNAPSHOT from 0.0.1-SNAPSHOT. The updates listed below are part of 0.0.2-SNAPSHOT.

**Changes in pom.xml:**
1. artifact id updated to 0.0.2-SNAPSHOT from 0.0.1-SNAPSHOT
2. tracer version updated to 1.1.5-SNAPSHOT from 1.1.4-SNAPSHOT.
3. junit version has been removed to avoid conflicts, it will be picked on runtime.
4. services-common version has been updated to 1.0.0 from 0.9.0.   


**Refactoring Validator:** 
   1. Moved a part of action validation lying in business logic to validator.
   2. Validator did data transformation of the input request like modifying its status, adding actions, creating user while csr is filing the complaint etc which now are moved to service.
   3. Assignment validation happened in loop which would be a performance hamper for bulk request. It has been moved to perform parallel operations.
   4. Action validation had very cluttered code for validating actions for roles and for current statuses of the complaint, It has been seperated out and moved to parallel streams
   5. Validations for action on DGRO like update allowed only for his dept, update only within his tenant and for GRO like update only within his tenant etc have been newly added.
      **Approach:**
      1. Check the role from the RequestInfo, based on the role, make a call to hr-employee-v2 to fetch employee details
      2. Based on dept of the employee, for DGRO, check if the complaint category of the complaint being created/updated belongs to his dept, otherwise exception.
      3. Based on tenant of the employee, for DGRO and GRO, check if the complaints being filed belong to his tenant.
   6. Data sanity checks like - All complaints must belong to the same tenant, Role of the logged in user must be one of the following: EMPLOYEE, GRO, DGRO, CSR, CITIZEN and some other checks.
   7. If a user has multile conflicting roles, logic to obtain the precedent role is applied. This logic has been modified to support all PGR roles.
   8. Since port forwarding is an option, to be secure, an RBAC logic is implemented to verify the logged in user details for search.
   9. Basic validations for create, update like duplicate check and others have been refactored.
   10. Unecessary logs have been removed and necessary ones are moved to debug.

**Validator is heavy-loaded with operations because it doesn't make sense to allow faulty data into business logic and then fail on exceptions.** 


**Refactoring Service:** 
   1. logic for enrichingrequest for create and update was cluttered due to actionInfo and Service structure, It has been refactored.
   2. A few methods like building request for API, formatting the search result etc are moved to utils and refactored so that it can be used for other use-cases also
   3. A major performance hamper was replacing media ids with the filestore urls in the search result, It had 4 loops running one inside the other, it has been refactored to use streams. Parallel streams have been used where data transformation isn't atomic. The change was a bit tricky because we had non-final variables being used inside the logic.
   4. Logic for Setting fields like status, assignee etc have been refactored. There was duplicate code in that area.
   5. Enriching boundary data in search result has been introduced.
   6. Unecessary logs have been removed and necessary ones are moved to debug
   7. Complaint search on last 6 digit is enabled as per the new requirement.
      **Approach:**
      1. This uses a LIKE query at the backend to search through the results combined with a partial primary key - tenantId for better performance.
      2. This implementation is enabled only when a single complaint is being fetched. For all complaints search and search on different criteria, the old implementation with '=' is used.
      3. This feature is enabled only when the search is made on the servicerequestId with atleast 6 characters, for less than 6, it throws an exception.
      4. (2) and (3) have been introduced for better performance of the search functionality.
   8. With the introduction of 'active' field, search results will only show complaints with active = true. This is applicable to reports as well.
   9. With the introduction of 'active' field, update will happen on only those complaints with active = true, This is configurable.
   10. With the introduction of 'active' field, create will always create complaints with active = true.


**Refactoring Utils:** 
   1. No of methods used to prepare external service call requests have been reduced by combining them.
   2. New util methods required for the changes done in service have been added.
   3. Commonly used objects like ObjectMapper etc have been abstracted out to util.
   4. Util is added with methods that help the service to use a common repository to make API calls.
   5. Unecessary logs have been removed and necessary ones are moved to debug.


**Refactoring Controller:** 
   1. Time logging has been moved to tracer and removed out of the controller.


**Refactoring Contracts:** 
   1. A new object called 'addressDetail' has been added to the Service object for the create/update request. This addressDetail refers to Address object of the PGR codebase. It can be abstracted out to point to any common codebase/library as needed. (https://raw.githubusercontent.com/egovernments/egov-services/master/rainmaker/rainmaker-pgr/src/main/java/org/egov/pgr/contract/Address.java)
   2. A new field called 'active' is added to support the feature of making obsolete complaints inactive. (https://raw.githubusercontent.com/egovernments/egov-services/master/rainmaker/rainmaker-pgr/src/main/java/org/egov/pgr/model/Service.java)

**Refactoring Constant file and Workflow configs:**
   1. Many constants being used at multiple places where scattered across constant files, they have all been segregated to fall into respective locations.
   2. Workflow related data like action-status map, role-action map, and other maps have been refactored a little.
   3. A new flow was introduced in v1.1 wherein RE-ASSIGN had to happen even without REQUEST-FOR-REASSIGN:
      **Approach:**
      1. A new entry in the actionCurrentStatusMap map is added to allow RE-ASSIGN on just ASSIGNED state without having to expect REQUESTFORREASSIGNED state.


**Changes in Searcher configs:** 
   1. Search query has been changed to return address details along with the complaint and action history.
   2. Search query has been changed to return only active complaints unless it is explicitly mentioned that inactive complaints or all complaints have to be returned.


**Changes in Persister configs:** 
   1. A new insert query has been added to insert the address detail into the address table. Id of this entry is stored in the addressId field of the eg_pgr_service table.
   2. A new parameter called 'active' is added to the insert/update query. 

**Changes in Indexer configs:** 
   1. A new index for reindex activity is added. It is disabled for now. The index for create and update is still the old one, it will be changed during the reindex activity.

**Changes in Notifications:** 
   1. Notification to Employee on RE-OPEN has been removed.
   2. Notification content on RESOLVE, REOPEN and SUBMIT being sent to the CITIZEN has been modified.
   3. Needless to say, these changes are done at message table owned by egov-localization.
   4. Notification code in pgr remains the same as v1, there's no refactoring done except for fetching sla hours which is needed for v1.1 notification.  

**Changes in MDMS:**
1. NoStreetLight is removed from ServiceDefs.json (When active flag is added to MDMS, it will be re-introduced but will be marked inactive.).
2. ReplaceOrProvideGarbageBin is replaced with DamagedGarbageBin.
3. NotWaterSupply is replaced with NoWaterSupply.
4. Complaints in the eg_pgr_service table with belonging to 'NoStreetLight' have not been marked inactive as the product team still wants actions on them.
5. A new flag 'active' is added in the ServiceDefs.json to support activation and deactivation of complaint categories.

**Changes in application.properties:**
1. 'are.inactive.complaintcategories.enabled' boolean key has been added. If it is true, validation of servicecodes will check for both active and inactive complaint categories, if it is false validation of servicecodes will check for only active complaint categories
2. 'is.update.on.inactive.categories.enabled' boolean key has been added. If it is true, validation of servicecodes will be disabled for update flow. if it is false, validation of servicecodes happens for the update flow.
    **Why?:**
        The key (a) has been added to support the functionality of searching servicodes as per the need. The key (b) is added because, v1.1 came up with a feature of disabling 'NoStreetlight' category from the system. However, there were a few complaints already filed under this category, if we mark all these complaints as invalid, it would be a bad UX to the users who have filed these complaints as they suddenly dissappear from their inbox. Therefore, the product decision was to allow these old complaints to go through the normal workflow but creating any new complaints under this category should be disabled. Since 'NoStreetlight' is marked as an inactive category in MDMS, if validation of servicecodes was allowed for update, no update could be performed on the old complaints. Also, bypassing the validation for update is wrong, therefore a boolean flag is added to enable and disable it as per our necessity.
