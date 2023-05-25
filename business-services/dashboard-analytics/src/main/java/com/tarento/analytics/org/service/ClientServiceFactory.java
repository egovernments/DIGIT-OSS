package com.tarento.analytics.org.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientServiceFactory {

    @Autowired
    TarentoServiceImpl tarentoServiceImpl;

    @Autowired
    MdmsServiceImpl mdmsServiceImpl;

    @Autowired
    ConfigurationLoader configurationLoader;

    public ClientService getInstance(Constants.ClienServiceType clientServiceName){

        if(clientServiceName.equals(Constants.ClienServiceType.DEFAULT_CLIENT))
            return tarentoServiceImpl;
        else if(clientServiceName.equals(Constants.ClienServiceType.MDMS_CLIENT))
            return mdmsServiceImpl;

        else
            throw new RuntimeException(clientServiceName + "not found");

    }

    public ClientService get(String chartId){

        ObjectNode node = configurationLoader.get(Constants.ConfigurationFiles.CHART_API_CONFIG);
        ObjectNode chartNode = (ObjectNode) node.get(chartId);
        boolean mdmsEnable = chartNode.get(Constants.JsonPaths.IS_MDMS_ENABALED) == null ? false : chartNode.get(Constants.JsonPaths.IS_MDMS_ENABALED).asBoolean();

        if(mdmsEnable)
            return mdmsServiceImpl;
        else
            return tarentoServiceImpl;

    }

}
