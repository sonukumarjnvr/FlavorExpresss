package com.example.foodies.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // all endpoints
                        .allowedOrigins("http://localhost:5173") // frontend origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS")
                        .allowCredentials(true) // important for cookies
                        .allowedHeaders("*");
            }
        };
    }
}
