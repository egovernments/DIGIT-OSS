package org.egov.common.web.contract;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import org.egov.common.web.contract.AttributeContract;
import org.egov.common.web.contract.PositionContract;
import org.egov.common.web.contract.TaskContract;
import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ProcessInstance {

    /**
     * Id of the ProcessInstance gets created. This field Maps to Id of the Task in case of eGov internal Work flow or the Work
     * flow Matrix based Implementation.
     */

    private String id = null;

    /**
     * businessKey is the name representing the process flow of the a particular Item For example For Financial vouchers work flow
     * process may be defined with a businessKey of "voucher_workflow" . For eGov internal work flow Implementation it is same as
     * the class name of the java object under going work flow. example businessKey "Voucher"
     */
    @Length(max = 128, min = 1)
    @NotNull
    private String businessKey = null;
    /**
     * type field can be used to further divide the work flow processes. For example Voucher might have 4 different flows 1.
     * Expense Work flow 2. Contractor Journal Work flow 3. Supplier Journal Work flow 4. General JV Work flow Each process is
     * different .Another example is Property might have different flows like 1.Create,Transfer,Bifurcation,Update etc.
     */
    @Length(max = 128, min = 1)
    private String type = null;
    /**
     * assignee is the position of the user to be set while creating a instantiating of Process. For Automatic work flow this
     * comes from the process definition for manual work flow it is the position selected from the UI.
     */
    @NotNull
    private PositionContract assignee = null;

    /**
     * comments is the comment provided by the user while he is initiating a process
     */
    @Length(max = 1024, min = 1)
    private String comments = null;
    /**
     * createDate is the date on which the process is instantiated. This is set internally by the system . For clients it is read
     * only data
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createdDate = null;

    /**
     * lastupdatedSince is the date on which the process is updated last time. This is set internally by the system . For clients
     * it is read only data
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date lastupdatedSince = null;

    /**
     * owner gives the Position current owner of the process. This data is only for the display purpose. So it will not be
     * considered in the request .
     */
    private PositionContract owner = null;

    /**
     * state gives the current state of the process.
     */

    @Length(max = 128, min = 1)
    private String state = null;

    /**
     * status also another representation of the status of the process
     */
    @Length(max = 128, min = 1)
    private String status = null;

    /**
     * senderName represents who initiated the work flow process. This is the logged in users primary position . Also this is set
     * by system by taking the logged in users primary position.
     */
    @Length(max = 128, min = 1)
    private String senderName;

    /**
     * details provides more information on the processs/Task instance. Example : In voucher work flow it is VoucherNumber,
     * Property it is the propertyId ,Grievance it is the complaint or request number This data is set internally by the system
     * which is configured in work flow type
     */

    @Length(max = 128, min = 1)
    private String details;

    /**
     * tasks gives the list of tasks owned by the process. For eGov internal work flow this value will be empty.
     * 
     */

    List<TaskContract> tasks = new ArrayList<TaskContract>();

    private String tenantId;
    /**
     * attributes used to pass any additional properties which is not defined in here .
     */
    private Map<String, AttributeContract> attributes = new HashMap<String, AttributeContract>();

    private Long initiatorPosition;

    /*
     * @JsonIgnore public String getComments() { return getValueForKey("approvalComments"); }
     * @JsonIgnore public boolean isGrievanceOfficer() { return getValueForKey("userRole").equals("Grievance Officer"); }
     */
    /*
     * public void setStateId(Long stateId) { Value value = new Value("stateId", String.valueOf(stateId)); List<Value>
     * attributeValues = Collections.singletonList(value); Attribute attribute = new Attribute(true, "stateId", "String", true,
     * "This is the id of state", attributeValues,null); attributeValues.put("stateId", attribute); }
     */
    // To be used to fetch single value attributes
    public String getValueForKey(final String key) {
        if (Objects.nonNull(attributes) && Objects.nonNull(attributes.get(key)))
            return attributes.get(key).getValues().get(0).getName();

        return "";
    }

}