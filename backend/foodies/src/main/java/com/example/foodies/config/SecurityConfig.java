package com.example.foodies.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.foodies.filter.JwtFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                    "/api/auth/**"
                                    ).permitAll()
                                .requestMatchers(
                                    "/api/foods/getFoodByCategory/{id}",
                                    "/oauth2/**",
                                    "/api/category/allCategory"
                                    ).permitAll()
                                .requestMatchers(
                                    "/api/category/allCategory"
                                    ).permitAll()
                                .requestMatchers(
                                    "/api/size/foodId/{foodId}",
                                    "/api/customization/getByCategory/{categoryId}"
                                    
                                    ).permitAll()
                                .requestMatchers(
                                    "/api/foods/allFoods"
                                    ).permitAll()
                                .requestMatchers(
                                    "/api/foods/{id}"
                                    ).permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // @Bean
    // public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    //     return config.getAuthenticationManager();
    // }
}

