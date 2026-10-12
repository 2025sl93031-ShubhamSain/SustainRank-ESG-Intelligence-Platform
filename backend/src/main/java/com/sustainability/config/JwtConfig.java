package com.sustainability.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConfig {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    public String getSecret() { return secret; }
    public long getExpirationMs() { return expirationMs; }
}
