package com.example.foodies.config;

import com.twilio.Twilio;

public class TwilioInitializer {
    public TwilioInitializer(String accountSid, String authToken){
        Twilio.init(accountSid, authToken);
        System.out.println("Twilio initialized successfully!");
    }
}
