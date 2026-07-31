package com.finsightai.finsight_ai_backend.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * The Base64 encoded secret key used for signing access tokens.
     */
    private String secret;

    /**
     * Access token expiration duration in milliseconds (e.g., 900000 for 15 minutes).
     */
    private long accessTokenExpirationMs;

    /**
     * Refresh token expiration duration in milliseconds (e.g., 604800000 for 7 days).
     */
    private long refreshTokenExpirationMs;
}