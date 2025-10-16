package com.example.foodies;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class FoodiesApplication {

	public static void main(String[] args) {
		 // Load .env before Spring context
        Dotenv dotenv = Dotenv.load();
        System.setProperty("AWS_ACCESS_KEY", dotenv.get("AWS_ACCESS_KEY"));
        System.setProperty("AWS_SECRET_KEY", dotenv.get("AWS_SECRET_KEY"));
        System.setProperty("AWS_REGION", dotenv.get("AWS_REGION"));
        System.setProperty("AWS_S3_BUCKET", dotenv.get("AWS_S3_BUCKET"));
        System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
        System.setProperty("MONGODB_DB_NAME", dotenv.get("MONGODB_DB_NAME"));
		System.setProperty("ACCOUNT_SID", dotenv.get("ACCOUNT_SID"));
        System.setProperty("AUTH_TOKEN", dotenv.get("AUTH_TOKEN"));
        System.setProperty("PHONE_NUMBER", dotenv.get("PHONE_NUMBER"));
        System.setProperty("REDIS_HOST_NAME", dotenv.get("REDIS_HOST_NAME"));
        System.setProperty("REDIS_PORT_NAME", dotenv.get("REDIS_PORT_NAME"));
        System.setProperty("REDIS_TIMEOUT", dotenv.get("REDIS_TIMEOUT"));
        System.setProperty("SECRET_KEY", dotenv.get("SECRET_KEY"));
        System.setProperty("REFRESH_SECRET_KEY", dotenv.get("REFRESH_SECRET_KEY"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
        System.setProperty("RAZOR_PAY_KEY_ID", dotenv.get("RAZOR_PAY_KEY_ID"));
        System.setProperty("RAZOR_PAY_SECRET_KEY", dotenv.get("RAZOR_PAY_SECRET_KEY"));
        
        System.setProperty("https.protocols", "TLSv1.2");

		SpringApplication.run(FoodiesApplication.class, args);
	}

}
