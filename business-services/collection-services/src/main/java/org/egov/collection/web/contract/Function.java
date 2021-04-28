package org.egov.collection.web.contract;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Function   {

  private Long id;

  private String name;

  private String code;

  private Integer level;

  private Boolean active;

  private Boolean isParent;

  private Long parentId;
  
}

