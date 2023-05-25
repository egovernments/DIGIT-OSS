package org.egov.collection.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Fund   {
  private Long id;

  private String name;

  private String code;

  private String identifier;

  private Long level;

  private Long parentId;

  private Boolean isParent;

  private Boolean active;

}

