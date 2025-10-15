package com.example.foodies.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.foodies.service.TwilioService;
import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;


@Configuration
public class TwilioConfig {
    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromPhoneNumber;

    
    //intialise twilio
    @Bean
    public TwilioInitializer twilioInitializer(){
        return new TwilioInitializer(accountSid, authToken);
    }

    @Bean
    public TwilioService twilioService(TwilioInitializer initializer){
        return new TwilioService(fromPhoneNumber);
    }
}

