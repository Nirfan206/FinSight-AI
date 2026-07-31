package com.finsightai.finsight_ai_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FinsightAiBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinsightAiBackendApplication.class, args);
	}

}