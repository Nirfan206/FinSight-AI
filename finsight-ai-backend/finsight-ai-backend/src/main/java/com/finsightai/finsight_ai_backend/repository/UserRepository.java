package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether email already exists.
     */
    boolean existsByEmail(String email);

    /**
     * Find active/inactive user by email.
     */
    Optional<User> findByEmailAndAccountStatus(
            String email,
            AccountStatus accountStatus
    );
}