package com.myboard.board_back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // TODO Auto-generated method stub
        WebMvcConfigurer.super.addCorsMappings(registry);
        registry.addMapping("/**")
        .allowedMethods("*")
        .allowedOrigins("*");
    }
    
}
