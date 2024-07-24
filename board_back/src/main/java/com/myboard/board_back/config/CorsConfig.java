package com.myboard.board_back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import io.micrometer.common.lang.NonNull;

@Configuration
public class CorsConfig implements WebMvcConfigurer{

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        
        WebMvcConfigurer.super.addCorsMappings(registry);
        registry.addMapping("/**")
        .allowedMethods("*")
        .allowedOrigins("*");
    }
    
}
