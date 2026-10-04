package com.apexcms.controller;

import com.apexcms.model.ServiceOffering;
import com.apexcms.repository.ServiceOfferingRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class ServiceController extends ContentController<ServiceOffering> {
    public ServiceController(ServiceOfferingRepository repository) {
        super(repository);
    }
}
