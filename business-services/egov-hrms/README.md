**HRMS v1**



*Features:*
1. Create Employee
2. Update Employee
3. Search Employee
4. Deactivate Employee.


*API Contract:* https://raw.githubusercontent.com/egovernments/egov-services/master/docs/rainmaker/egov-hrms/v1-0-0.yml



**Create Employee: (Bulk API)**
API to create an employee with the following details: Assignments, Jurisdictions, Service History, Educational Details, Departmental Tests


**Update Employee: (Bulk API)**
API to update the details of an employee with the following details: Assignments, Jurisdictions, Service History, Educational Details, Departmental Tests. There are constraints under which the update works, which are listed in the details of entities. As part of the personal details of the employee, Code of the employee cannot be updated once created.


**Search Employee:** 
API to search the employee in the system on the following criteria: Id, UUID, Name, Code, Status, Type, Department, Designation, Position. All of them being arrays, at a time more than one employees can be fetched.  
Constraints:
a. Open Search is enabled only for a set of users. Currently it is enabled only for SUPERUSER, if it has to be enabled for other roles, add those roles to the parameter 'open.search.enabled.roles' in app.properties with values(role codes) separated by comma. 


**Deactivate Employee:**
This is a part of the update API where the employee is marked inactive. This marks the user entry of this employee also as inactive. While deactivating an employee it is mandatory to provide deactivation details as well.




**Details of all the entities involved:** 

a) Assignments: Every employee is assigned a list of assignments, every assignment is a designation provided to that employee for a given period of time. These designations are mapped to departments. This also includes marking the employee as HOD for that dept if needed. Employee can also provide information on who does he report to.
   Constraints:
   1. For a given period of time an employee shouldn't have more than one assignments.
   2. The department and designation part of the employee must be configured in the system.
   3. Details of assignment once entered in the system cannot be deleted.
   4. An employee cannot have more than one active assignment.

b) Jurisdictions: A jurisdiction is a area of power for any employee. It can be a zone, ward, block, city, state or the country. Currently a jurisdiction is defined as combination of Hierarchy type, Boundary Type and the actual Boundary. However, in the current system we are not validating these jurisdictions. This is being collected only for the sake of data.
   Constraints:
   1. The details pertaining to a jurisdiction like Hierarchy, Boundary Type and Boundary must be configured in the system.
   2. An employee can have more than one jurisdictions.
   3. Currently in the system jurisdiction is limited to within a ULB.

c) Service History: Service history is the record of an employee's professional experience. It captures information about location and period of work with necessary order number. Information about the current work details are to be entered here.
   Constraints:
   1. There's no rule on period, dates of different services can overlap.
   2. There's no cap on the number of entries in the service history.
   3. Captured as legacy data.

d) Educational Details: Captures educational details of the employee. Captures information like Degree, Year of Passing, University, Specialization etc as part of the educational details.
   Constraints:
   1. Details pertaining to educational details like Degree, Specialization must be configured.


e) Departmental Tests: Captures details of the tests undertaken by the employee. Like name of the test and year of passing.
   Constraints:
   1. Test details must be configures in the system.  

f) Deactivation Details: Details of deactivation of the employee, which captures reason for deactivation, period of deactivation and other necessary details. 
   1. Deactivation details are compulsory while deactivating an employee.
   


**Uniqueness Constraints:**

a) Employee code has to be unique and will be used as username for login.
b) Phone number has to be unique, which means no 2 employees can have the same phone number. 



**Notification:**

a) Notification is sent to the phone number of the employee who has been created in the system. This is an SMS notification.