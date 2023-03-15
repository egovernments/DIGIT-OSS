package org.egov.edcr.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.LayerName;
import org.egov.commons.service.LayerNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@Service
public class LayerNames {

    private Map<String, String> layerNamesMap = new HashMap<>();
    public LayerNameService layerNameService;

    @Autowired
    public LayerNames(LayerNameService layerNameService) {
        this.layerNameService = layerNameService;
        List<LayerName> layerNames = layerNameService.findAll();
        for (LayerName l : layerNames)
            layerNamesMap.put(l.getKey(), l.getValue());
    }

    public String getLayerName(String layerNameKey) {

        return layerNamesMap.get(layerNameKey);

    }

    public void setLayerNameService(LayerNameService layerNameService) {
        this.layerNameService = layerNameService;
    }

}
