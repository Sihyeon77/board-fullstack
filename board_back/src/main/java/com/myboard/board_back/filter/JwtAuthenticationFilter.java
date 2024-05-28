package com.myboard.board_back.filter;

import java.io.IOException;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.myboard.board_back.provider.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)throws ServletException, IOException {
        // Filter 거르기
        try {
            String token = parseBearerToken(request);
            if (token ==null){
                filterChain.doFilter(request, response);
                return ;
            }
            String email = jwtProvider.validate(token);
            if(email == null){
                filterChain.doFilter(request, response);
                return ;
            }
    
    
            //  세부정보 설정
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            //  Context등록
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authenticationToken);
    
            //  Context를 외부에서 사용가능하게 Holder에 담기
            SecurityContextHolder.setContext(securityContext);

        } catch (Exception e) {
            e.printStackTrace();
        }
        filterChain.doFilter(request, response);
        
    }
//  return token
    private String parseBearerToken(HttpServletRequest request){
        String authorization = request.getHeader("Authorization");
        // hastext -> length 0 or null or whitespace = false 
        
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if (!hasAuthorization) {
            return null;
        }
        
        boolean isBearer = authorization.startsWith("Bearer ");
        if (!isBearer) {
            return null;
        }
        String token = authorization.substring(7);

        return token;
    }
}
