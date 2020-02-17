package org.egov.pt.service;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.PropertyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private Producer producer;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PropertyConfiguration propertyConfiguration;

    @Autowired
    private PropertyUtil util;

    @Value("${notification.url}")
    private String notificationURL;



    
    
}