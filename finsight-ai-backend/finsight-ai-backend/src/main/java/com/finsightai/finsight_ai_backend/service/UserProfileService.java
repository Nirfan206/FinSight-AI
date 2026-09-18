package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.dto.request.UpdateProfileRequest;
import com.finsightai.finsight_ai_backend.dto.response.ProfileResponse;

public interface UserProfileService {

    /**
     * Returns the currently authenticated user's profile.
     */
    ProfileResponse getCurrentUserProfile();

    /**
     * Updates the currently authenticated user's profile.
     */
    ProfileResponse updateProfile(UpdateProfileRequest request);

    /**
     * Deletes the currently authenticated user's account.
     */
    void deleteCurrentUser();

}