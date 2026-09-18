package com.finsightai.finsight_ai_backend.repository;

import com.finsightai.finsight_ai_backend.entity.Receipt;
import com.finsightai.finsight_ai_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    // FIXED: Query name token matches your exact entity property tracking layout (uploadDate)
    List<Receipt> findByUserOrderByUploadDateDesc(User user);
}