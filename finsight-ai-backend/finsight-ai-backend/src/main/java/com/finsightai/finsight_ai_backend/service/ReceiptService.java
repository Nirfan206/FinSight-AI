package com.finsightai.finsight_ai_backend.service;

import com.finsightai.finsight_ai_backend.entity.Receipt;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReceiptService {
    Receipt uploadReceipt(MultipartFile file, UserPrincipal principal);
    List<Receipt> getReceiptsByUser(UserPrincipal principal);
    void deleteReceipt(Long receiptId, UserPrincipal principal);
    Receipt getReceiptById(Long receiptId, UserPrincipal principal);
}