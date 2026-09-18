package com.finsightai.finsight_ai_backend.dto.response;

import com.finsightai.finsight_ai_backend.enums.AccountStatus;
import com.finsightai.finsight_ai_backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long userId;

    private String fullName;

    private String email;

    private Role role;

    private AccountStatus accountStatus;

}