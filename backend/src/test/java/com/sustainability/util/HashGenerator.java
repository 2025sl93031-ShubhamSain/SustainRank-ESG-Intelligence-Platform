package com.sustainability.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        System.out.println("testuser12: " + enc.encode("testuser12"));
        System.out.println("demo12345:  " + enc.encode("demo12345"));
        System.out.println("admin123:   " + enc.encode("admin123"));
    }
}
