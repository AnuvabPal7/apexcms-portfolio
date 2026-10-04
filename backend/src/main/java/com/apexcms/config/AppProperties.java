package com.apexcms.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Admin admin, Cors cors, Upload upload, Mail mail) {
    public record Jwt(String secret, long accessTokenMinutes, long refreshTokenDays) {}
    public record Admin(String name, String email, String password) {}
    public record Cors(List<String> allowedOrigins) {}
    public record Upload(String dir) {}
    public record Mail(String to, String from) {}
}
