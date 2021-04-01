package egov.casemanagement.web.models;


import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Employee {

    private String emailId;

    private String name;

    private List<String> roles;

    private String tenantId;

}
