package com.apexcms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

// UserDetailsServiceAutoConfiguration is excluded because we do our own JWT login
// (otherwise Spring creates a random "user" password on startup).
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@ConfigurationPropertiesScan
public class ApexCmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApexCmsApplication.class, args);
    }
}
