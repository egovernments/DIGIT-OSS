package org.egov.infra.microservice.models;

import java.io.Serializable;

public class MasterDetail implements Serializable{
    
    private String name;
    
    private String filter;

    public MasterDetail(String name, String filter) {
        this.name = name;
        this.filter = filter;
    }
    public MasterDetail(){}
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getFilter() {
        return filter;
    }
    public void setFilter(String filter) {
        this.filter = filter;
    }
    

}
