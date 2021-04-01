package org.egov.infra.indexer.web.contract;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class Mapping   {
	
  @JsonProperty("topic")
  private String topic;
  
  @JsonProperty("configKey")
  public ConfigKeyEnum configKey;

  @JsonProperty("indexes")
  private List<Index> indexes;
  
  public enum ConfigKeyEnum {
	  
		INDEX("INDEX"),
		
		REINDEX("REINDEX"),
		        
	    LEGACYINDEX("LEGACYINDEX");   

	    private String value;

	    ConfigKeyEnum(String value) {
	      this.value = value;
	    }

	    @Override
	    @JsonValue
	    public String toString() {
	      return String.valueOf(value);
	    }

	    @JsonCreator
	    public static ConfigKeyEnum fromValue(String text) {
	      for (ConfigKeyEnum b : ConfigKeyEnum.values()) {
	        if (String.valueOf(b.value).equalsIgnoreCase(text)) {
	          return b;
	        }
	      }
	      return null;
	    }
	  }
}
