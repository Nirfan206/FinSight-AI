package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.request.UpdateProfileRequest;
import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.dto.response.ProfileResponse;
import com.finsightai.finsight_ai_backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    /**
     * Get Logged-in User Profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {

        ProfileResponse profile =
                userProfileService.getCurrentUserProfile();

        return ResponseEntity.ok(
                ApiResponse.<ProfileResponse>builder()
                        .success(true)
                        .message("Profile fetched successfully.")
                        .data(profile)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    /**
     * Update Logged-in User Profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        ProfileResponse profile =
                userProfileService.updateProfile(request);

        return ResponseEntity.ok(
                ApiResponse.<ProfileResponse>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(profile)
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }

    /**
     * Delete Logged-in User Account
     */
    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> deleteProfile() {

        userProfileService.deleteCurrentUser();

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Account deleted successfully.")
                        .timestamp(LocalDateTime.now())
                        .build()
        );
    }
}