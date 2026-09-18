package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.UpdateProfileRequest;
import com.finsightai.finsight_ai_backend.dto.response.ProfileResponse;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;

    /**
     * Returns the currently logged-in user entity.
     */
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return userRepository.findById(principal.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getCurrentUserProfile() {

        User user = getLoggedInUser();

        return ProfileResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .accountStatus(user.getAccountStatus())
                .build();
    }

    @Override
    public ProfileResponse updateProfile(UpdateProfileRequest request) {

        User user = getLoggedInUser();

        user.setFullName(request.getFullName());

        User updatedUser = userRepository.save(user);

        return ProfileResponse.builder()
                .userId(updatedUser.getUserId())
                .fullName(updatedUser.getFullName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole())
                .accountStatus(updatedUser.getAccountStatus())
                .build();
    }

    @Override
    public void deleteCurrentUser() {

        User user = getLoggedInUser();

        userRepository.delete(user);
    }
}