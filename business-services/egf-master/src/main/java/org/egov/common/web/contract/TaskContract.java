package org.egov.common.web.contract;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskContract {

    /**
     * Id of the task getting updated. This field Maps to Id of the Task or
     * ProcessInstance in case of eGov internal Work flow or the Work flow
     * Matrix based implementation .
     */
    @NotNull
    private String id = null;

    /**
     * businessKey is the name representing the process flow of the a particular
     * Item For example For Financial vouchers work flow process may be defined
     * with a businessKey of "voucher_workflow" . For eGov internal work flow
     * Implementation it is same as the class name of the java object under
     * going work flow. example businessKey "Voucher"
     */
    @Length(max = 128, min = 1)
    @NotNull
    private String businessKey = null;
    /**
     * type field can be used to further divide the work flow processes. For
     * example Voucher might have 4 different flows 1. Expense Work flow 2.
     * Contractor Journal Work flow 3. Supplier Journal Work flow 4. General JV
     * Work flow Each process is different .Another example is Property might
     * have different flows like 1.Create,Transfer,Bifurcation,Update etc.
     */
    @Length(max = 128, min = 1)
    private String type = null;
    /**
     * assignee is the position of the user to be set while creating a
     * instantiating of Process. For Automatic work flow this comes from the
     * process definition for manual work flow it is the position selected from
     * the UI.
     */
    @NotNull
    private PositionContract assignee = null;

    /**
     * comments is the comment provided by the user while he is initiating a
     * process
     */
    @Length(max = 1024, min = 1)
    private String comments = null;
    /**
     * createDate is the date on which the process is instantiated. This is set
     * internally by the system . For clients it is read only data
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createdDate = null;

    /**
     * lastupdatedSince is the date on which the process is updated last time.
     * This is set internally by the system . For clients it is read only data
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date lastupdatedSince = null;

    /**
     * owner gives the Position current owner of the process. This data is only
     * for the display purpose. So it will not be considered in the request .
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
     * url provides the complete url of the work flow item. This link takes you
     * to the view of the item along with provision to select the next assignee.
     * This data is also configured in work flow type object. This data is also
     * read only . UI Can consider this field to redirect to the page or UI can
     * be build without consuming this.
     */
    @Length(max = 256, min = 1)
    private String url = null;
    /**
     * action represents the action performed by the end user . it can be
     * forward,approve,reject,cancel etc For eGov internal work flow these four
     * values are confirmed and will do the tasks of
     * forwarding,approving,rejecting,cancelling accordingly. This is mandatory
     * data in case of manual work flow
     */
    @NotBlank
    @Length(max = 128, min = 1)
    private String action = null;

    /**
     * senderName represents who initiated the work flow process. This is the
     * logged in users primary position . Also this is set by system by taking
     * the logged in users primary position.
     */

    @Length(max = 128, min = 1)
    private String senderName;

    /**
     * details provides more information on the processs/Task instance. Example
     * : In voucher work flow it is VoucherNumber, Property it is the propertyId
     * ,Grievance it is the complaint or request number This data is set
     * internally by the system which is configured in work flow type
     */

    @Length(max = 128, min = 1)
    private String details;
    /**
     * natureOfTask Detaild Description of the task or process . For example in
     * case of voucher it can be set as "Finaicial Voucher Workflow " . This
     * data is also configured by the display name of the workflowtype object.
     * This data is read only. .
     */
    @Length(max = 128, min = 1)
    private String natureOfTask;
    /**
     * entity Maps to the json representation of the item under workflow. This
     * will be used when work flow considers rule engine. like amount based flow
     * etc
     */
    private String entity;

    private String tenantId;

    private Map<String, AttributeContract> attributes = new HashMap<String, AttributeContract>();

    // To be used to fetch single value attributes
    public String getValueForKey(final String key) {
        if (Objects.nonNull(attributes) && Objects.nonNull(attributes.get(key)))
            return attributes.get(key).getValues().get(0).getName();

        return "";
    }

}
