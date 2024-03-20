package com.myboard.board_back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.myboard.board_back.filter.JwtAuthenticationFilter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configurable
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @SuppressWarnings("deprecation")
    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity)throws Exception{
        httpSecurity
            .cors((cors)-> cors.disable())     
            .csrf((csrfConfig) -> csrfConfig.disable())     /* 위조 방지. 사용자가 로그인한 서비스에서 특정 이벤트를 발생시키는 것. 데이터 변조 등 crossSiteRequestForgery*/
            .httpBasic((basicConfig)->basicConfig.disable())
            .sessionManagement(management ->management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeRequests(authorizeRequests->
                authorizeRequests
                    .requestMatchers("/","/api/v1/auth/**","/api/v1/search/**", "/file/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/board/**", "/api/v1/user/*").permitAll()
                    .anyRequest().authenticated()
            )
            .exceptionHandling(eHandling->
                eHandling.authenticationEntryPoint(new AuthenticationEntryPoint().commence(()->);)
            );
        
        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}

/**
 * InnerWebSecurityConfig
 */
public class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("{\"code:\" : \"NP\", \"message\" : \" Do Not Have Permission.\"}");
    }

    
}