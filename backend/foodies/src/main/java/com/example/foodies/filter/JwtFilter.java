package com.example.foodies.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.foodies.Util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        //System.out.println("jwt filter is called : " );

        String path = request.getRequestURI();
        //System.out.println("path :" + path);
        // if (path.equals("/api/auth/refresh")) {
        //     Cookie[] cookies = request.getCookies();
        //     if (cookies != null) {
        //         for (Cookie cookie : cookies) {
        //             if ("refreshToken".equals(cookie.getName())) {
        //                 String refreshToken = cookie.getValue();
        //                 System.out.println("Refresh Token in filter :" + refreshToken);

        //                 if(jwtUtil.validateRefreshToken(refreshToken)){
        //                     String userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);
        //                     UsernamePasswordAuthenticationToken auth =
        //                     new UsernamePasswordAuthenticationToken(userId, null, null);

        //                     auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        //                     SecurityContextHolder.getContext().setAuthentication(auth);
        //                 }
        //             }
        //         }
        //     }
        //     chain.doFilter(request, response);
        //     return;
        // }

        // Skip JWT validation for all GET requests
        // if ("GET".equalsIgnoreCase(request.getMethod())) {
        //     chain.doFilter(request, response);
        //     return;
        // }

        String header = request.getHeader("Authorization");
        //System.out.println("header from filter : " + header);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            //System.out.println("Access token from frontend : " + token);
            boolean valid = jwtUtil.validateToken(token);
            //System.out.println("token valid or not in filter : " + valid);
            if (valid) {
                String userId = jwtUtil.extractUserId(token);
                List<String> roles = jwtUtil.getRoles(token);

               
                // Convert roles to Spring Security authorities
                List<GrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
                
                //create authentication object
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userId, null, authorities);

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
            
        }
        chain.doFilter(request, response);
    }
}
