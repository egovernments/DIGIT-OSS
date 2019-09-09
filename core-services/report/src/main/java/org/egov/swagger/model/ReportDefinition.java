package org.egov.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.*;

import org.egov.domain.model.ReportDefinitions;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
/**
 * Combination of below properties provides the decription of a report that can be generically obtained from the framework. Please note that in this version, only reports out of RDBMS are supported - but later the framework will be enhanced to support reports out of RDBMS/Cross service non join reports from RDBMS/Elastic search and mashups. 
 */
@Component
@ConfigurationProperties 
@EnableConfigurationProperties(ReportDefinition.class)
public class ReportDefinition   {

    @JsonProperty("additionalConfig")
    private Object additionalConfig = null;
	
	@JsonProperty("searchFilter")
	private boolean searchFilter = false;
	
	@JsonProperty("sorting")
	private boolean sorting = true;
	
	@JsonProperty("serialNo")
	private boolean serialNo = false;
    
	public boolean isSerialNo() {
		return serialNo;
	}
	public void setSerialNo(boolean serialNo) {
		this.serialNo = serialNo;
	}
	public boolean isSorting() {
		return sorting;
	}
	public void setSorting(boolean sorting) {
		this.sorting = sorting;
	}
	public boolean isSearchFilter() {
		return searchFilter;
	}
	public void setSearchFilter(boolean searchFilter) {
		this.searchFilter = searchFilter;
	}
	@JsonProperty("externalService")
	private List<ExternalService> externalService = new ArrayList<ExternalService>();
	
	public List<ExternalService> getExternalService() {
		return externalService;
	}
	public void setExternalService(List<ExternalService> externalService) {
		this.externalService = externalService;
	}
	@JsonProperty("subReport")
	private boolean subReport = false;
	
	@JsonProperty("subReportNames")
	private List<String> subReportNames;

	public boolean isSubReport() {
		return subReport;
	}
	public void setSubReport(boolean subReport) {
		this.subReport = subReport;
	}
	public List<String> getSubReportNames() {
		return subReportNames;
	}
	public void setSubReportNames(List<String> subReportNames) {
		this.subReportNames = subReportNames;
	}
	@JsonProperty("viewPath")
	private String viewPath = null;
	
	@JsonProperty("selectiveDownload")
	private boolean selectiveDownload = false;
	
	
	public boolean isSelectiveDownload() {
		return selectiveDownload;
	}
	public void setSelectiveDownload(boolean selectiveDownload) {
		this.selectiveDownload = selectiveDownload;
	}
	public String getViewPath() {
		return viewPath;
	}
	public void setViewPath(String viewPath) {
		this.viewPath = viewPath;
	}

	@JsonProperty("moduleName")
	private String moduleName = null;
	
  public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

  @JsonProperty("reportName")
  private String reportName = null;

  @JsonProperty("summary")
  private String summary = null;

  @JsonProperty("version")
  private String version = null;

  @JsonProperty("query")
  private String query = null;
  
  @JsonProperty("groupBy")
  private String groupByQuery = null;
  

  @JsonProperty("orderBy")
  private String orderByQuery = null;
  
  public String getOrderByQuery() {
	return orderByQuery;
}

public void setOrderByQuery(String orderByQuery) {
	this.orderByQuery = orderByQuery;
}

public String getGroupByQuery() {
	return groupByQuery;
}

public void setGroupByQuery(String groupByQuery) {
	this.groupByQuery = groupByQuery;
}

@JsonProperty("linkedReport")
  private LinkedReport linkedReport = null;

  

public LinkedReport getLinkedReport() {
	return linkedReport;
}

public void setLinkedReport(LinkedReport linkedReport) {
	this.linkedReport = linkedReport;
}

  @JsonProperty("sourceColumns")
  private List<SourceColumn> sourceColumns = new ArrayList<SourceColumn>();
 
  @JsonProperty("searchParams")
  private List<SearchColumn> searchParams = new ArrayList<SearchColumn>();

  public ReportDefinition reportName(String reportName) {
    this.reportName = reportName;
    return this;
  }

   /**
   * name of the report. A tenant specific report can be defined with tenantId as the prefix of the report name. So if the system finds two reports - report1 and mytenant.report1 and the tenantId for this request is mytenant then report definition mytenant.report1 will be picked.  Please note that by convention reportname.title and reportname.summary will be the localization key for the report title and brief description. 
   * @return reportName
  **/
  
  public String getReportName() {
    return reportName;
  }

  public void setReportName(String reportName) {
    this.reportName = reportName;
  }

  public ReportDefinition summary(String summary) {
    this.summary = summary;
    return this;
  }

   /**
   * Brief description about the report and its usage. E.g. \"This report gives you a list of active reources within the date range provided in the search criteria\" 
   * @return summary
  **/
  
  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public ReportDefinition version(String version) {
    this.version = version;
    return this;
  }

   /**
   * Version of the report farmework - this will help in enhancing the reporting framework in phased manner - planning to support upto two recent versions of backward compatibility. Versioning scheme is purely number based and decided by the framework an dnot indivdual Report definitions 
   * @return version
  **/
  
  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public ReportDefinition query(String query) {
    this.query = query;
    return this;
  }

   /**
   * SQL style search clause with display column mapping and replaceable search parameters. Please note that all placeholders column in the query (represented within {} e.g. {username}) should match corresponding sourceColumn or searchParam as the case may be. 
   * @return query
  **/
  
  public String getQuery() {
    return query;
  }

  public void setQuery(String query) {
    this.query = query;
  }

  public ReportDefinition sourceColumns(List<SourceColumn> sourceColumns) {
    this.sourceColumns = sourceColumns;
    return this;
  }

  public ReportDefinition addSourceColumnsItem(SourceColumn sourceColumnsItem) {
    this.sourceColumns.add(sourceColumnsItem);
    return this;
  }

   /**
   * list of columns to to select from the source tables. This should then correspond to the list of report columns that are send back to the caller in report metadata. Please note that all columns must have one one of the sources from above list as their source or the report definition will not be loaded. 
   * @return sourceColumns
  **/
  
  public List<SourceColumn> getSourceColumns() {
    return sourceColumns;
  }

  public void setSourceColumns(List<SourceColumn> sourceColumns) {
    this.sourceColumns = sourceColumns;
  }

  public ReportDefinition searchParams(List<SearchColumn> searchParams) {
    this.searchParams = searchParams;
    return this;
  }

  public ReportDefinition addSearchParamsItem(SearchColumn searchParamsItem) {
    this.searchParams.add(searchParamsItem);
    return this;
  }

   /**
   * list of the supported parameters for search.  
   * @return searchParams
  **/
  
  public List<SearchColumn> getSearchParams() {
    return searchParams;
  }

  public void setSearchParams(List<SearchColumn> searchParams) {
    this.searchParams = searchParams;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ReportDefinition reportDefinition = (ReportDefinition) o;
    return Objects.equals(this.moduleName, reportDefinition.moduleName) &&
    	Objects.equals(this.reportName, reportDefinition.reportName) &&
        Objects.equals(this.summary, reportDefinition.summary) &&
        Objects.equals(this.version, reportDefinition.version) &&
        Objects.equals(this.query, reportDefinition.query) &&
        Objects.equals(this.linkedReport, reportDefinition.linkedReport) &&
        Objects.equals(this.sourceColumns, reportDefinition.sourceColumns) &&
        Objects.equals(this.searchParams, reportDefinition.searchParams);
  }

  @Override
  public int hashCode() {
    return Objects.hash( moduleName,reportName, summary, version, query,linkedReport, sourceColumns, searchParams);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ReportDefinition {\n");
    sb.append("    moduleName: ").append(toIndentedString(moduleName)).append("\n");
    sb.append("    reportName: ").append(toIndentedString(reportName)).append("\n");
    sb.append("    summary: ").append(toIndentedString(summary)).append("\n");
    sb.append("    version: ").append(toIndentedString(version)).append("\n");
    sb.append("    query: ").append(toIndentedString(query)).append("\n");
    sb.append("    linkedReport: ").append(toIndentedString(linkedReport)).append("\n");
    sb.append("    sourceColumns: ").append(toIndentedString(sourceColumns)).append("\n");
    sb.append("    searchParams: ").append(toIndentedString(searchParams)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

    public Object getAdditionalConfig() {
        return additionalConfig;
    }

    public void setAdditionalConfig(Object additionalConfig) {
        this.additionalConfig = additionalConfig;
    }
}

