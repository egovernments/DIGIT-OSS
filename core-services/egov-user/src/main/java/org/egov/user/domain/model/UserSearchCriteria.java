package org.egov.user.domain.model;

import lombok.*;
import org.egov.user.domain.exception.InvalidUserSearchCriteriaException;
import org.egov.user.domain.model.enums.UserType;
import org.springframework.util.CollectionUtils;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class UserSearchCriteria {

    private List<Long> id;
    private List<String> uuid;
    private String userName;
    private String name;
    private String mobileNumber;
    private String emailId;
    private boolean fuzzyLogic;
    private Boolean active;
    private Integer offset;
    private Integer limit;
    private List<String> sort;
    private UserType type;
    private String tenantId;
    private List<String> roleCodes;
    private String alternatemobilenumber;

    public void validate(boolean isInterServiceCall) {
        if (validateIfEmptySearch(isInterServiceCall) || validateIfTenantIdExists(isInterServiceCall)) {
            throw new InvalidUserSearchCriteriaException(this);
        }
    }

    private boolean validateIfEmptySearch(boolean isInterServiceCall) {
        /*
            for "InterServiceCall" ->
                at least one is compulsory --> 'userName' or 'name' or 'mobileNumber' or 'emailId' or 'uuid' or 'id' or 'roleCodes'

            and for calls from outside->
                at least one is compulsory --> 'userName' or 'name' or 'mobileNumber' or 'emailId' or 'uuid'
         */
        if (isInterServiceCall)
            return isEmpty(userName) && isEmpty(name) && isEmpty(mobileNumber) && isEmpty(emailId) &&
                    CollectionUtils.isEmpty(uuid) && CollectionUtils.isEmpty(id) && CollectionUtils.isEmpty(roleCodes);
        else
            return isEmpty(userName) && isEmpty(name) && isEmpty(mobileNumber) && isEmpty(emailId) &&
                    CollectionUtils.isEmpty(uuid);
    }

    private boolean validateIfTenantIdExists(boolean isInterServiceCall) {
        /*
            for calls from outside->
                tenantId is compulsory if one of these is non empty--> 'userName' or 'name', 'mobileNumber'  or 'roleCodes'
            and for "InterServiceCall" ->
                tenantId is compulsory if one of these is non empty --> 'userName' or 'name' or 'mobileNumber'
         */
        if (isInterServiceCall)
            return (!isEmpty(userName) || !isEmpty(name) || !isEmpty(mobileNumber) ||
                    !CollectionUtils.isEmpty(roleCodes))
                    && isEmpty(tenantId);
        else
            return (!isEmpty(userName) || !isEmpty(name) || !isEmpty(mobileNumber))
                    && isEmpty(tenantId);

    }
}
