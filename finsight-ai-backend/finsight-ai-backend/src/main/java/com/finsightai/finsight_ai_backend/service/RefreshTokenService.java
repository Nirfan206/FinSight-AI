package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.entity.RefreshToken;
import com.finsightai.finsight_ai_backend.entity.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user);

    RefreshToken verifyExpiration(RefreshToken token);

    RefreshToken findByToken(String token);

    void revokeAllUserTokens(User user);
}