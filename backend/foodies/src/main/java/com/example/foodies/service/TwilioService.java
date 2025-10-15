package com.example.foodies.service;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;


@Service
public class TwilioService{
    
    private final String fromPhoneNumber;
    
    public TwilioService(String fromPhoneNumber){
        this.fromPhoneNumber = fromPhoneNumber;
    }

    public boolean sentOtp(String toPhoneNumber , String OTP){

        toPhoneNumber = "+91" + toPhoneNumber;
        System.out.println(toPhoneNumber);
        System.out.println(OTP);

        try {
            Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(fromPhoneNumber),
                "Your Verification code : " + OTP + ". OTP is valid for 2 Minutes."
            ).create();
            
           return true;
        } catch (Exception e) {              
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, " Unable to send OTP", e);
        }
    }
}
