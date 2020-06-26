package org.egov.persistence.contract;

import lombok.*;
import org.egov.domain.model.User;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserSearchResponseContent {
    private Long id;
    private String emailId;
    private String mobileNumber;

    public User toDomainUser() {
        return new User(id, emailId, mobileNumber);
    }
}