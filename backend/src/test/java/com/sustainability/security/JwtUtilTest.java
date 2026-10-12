package com.sustainability.security;

import com.sustainability.config.JwtConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        JwtConfig cfg = new JwtConfig() {
            @Override public String getSecret() {
                // 256-bit Base64-encoded key for tests
                return "dGVzdHNlY3JldGtleXRlc3RzZWNyZXRrZXkxMjM0NTY3ODk=";
            }
            @Override public long getExpirationMs() {
                return 3_600_000L; // 1 hour
            }
        };
        jwtUtil = new JwtUtil(cfg);
    }

    @Test
    void generateToken_returnsNonBlankToken() {
        String token = jwtUtil.generateToken("alice");
        assertThat(token).isNotBlank();
    }

    @Test
    void extractUsername_roundTrip() {
        String token = jwtUtil.generateToken("alice");
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("alice");
    }

    @Test
    void validateToken_validToken_returnsTrue() {
        String token = jwtUtil.generateToken("bob");
        assertThat(jwtUtil.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_tamperedToken_returnsFalse() {
        String token = jwtUtil.generateToken("bob");
        String tampered = token.substring(0, token.length() - 4) + "XXXX";
        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }

    @Test
    void validateToken_randomString_returnsFalse() {
        assertThat(jwtUtil.validateToken("not.a.token")).isFalse();
    }

    @Test
    void validateToken_expiredToken_returnsFalse() {
        JwtConfig expired = new JwtConfig() {
            @Override public String getSecret() {
                return "dGVzdHNlY3JldGtleXRlc3RzZWNyZXRrZXkxMjM0NTY3ODk=";
            }
            @Override public long getExpirationMs() { return -1000L; }
        };
        JwtUtil expiredUtil = new JwtUtil(expired);
        String token = expiredUtil.generateToken("charlie");
        assertThat(expiredUtil.validateToken(token)).isFalse();
    }
}
