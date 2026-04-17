package com.sliit.smart_campus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusApplication {

	public static void main(String[] args) {
		org.springframework.context.ConfigurableApplicationContext context = SpringApplication.run(SmartCampusApplication.class, args);
		String clientId = context.getEnvironment().getProperty("GOOGLE_CLIENT_ID");
		System.out.println("================================");
		System.out.println("DEBUG: Google Client ID Loaded: " + (clientId != null && !clientId.isEmpty() ? "YES" : "NO"));
		if (clientId != null && clientId.contains("${")) {
			System.out.println("CRITICAL: Environment variables are NOT being resolved!");
		}
		System.out.println("================================");
	}

}
