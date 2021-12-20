package org.egov.common.web.contract;

import lombok.Data;

@Data

//class variables not used
public class PositionContract {

    private Long id;

    private String name;

    private DepartmentDesignationContract deptdesig;

    private Boolean isPostOutsourced;

    private Boolean active;

}
