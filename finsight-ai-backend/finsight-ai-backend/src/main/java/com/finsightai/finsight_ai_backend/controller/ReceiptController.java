package com.finsightai.finsight_ai_backend.controller;

import com.finsightai.finsight_ai_backend.dto.response.ApiResponse;
import com.finsightai.finsight_ai_backend.entity.Receipt;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Receipt>> uploadReceipt(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Receipt result = receiptService.uploadReceipt(file, principal);
            return ResponseEntity.ok(ApiResponse.<Receipt>builder()
                    .success(true)
                    .message("Document structure committed to secure vault storage bounds.")
                    .data(result)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.<Receipt>builder()
                    .success(false)
                    .message("Vault write operations failed: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Receipt>>> getReceipts(@AuthenticationPrincipal UserPrincipal principal) {
        List<Receipt> list = receiptService.getReceiptsByUser(principal);
        return ResponseEntity.ok(ApiResponse.<List<Receipt>>builder()
                .success(true)
                .message("Index tracking logs telemetry parsed.")
                .data(list)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReceipt(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            receiptService.deleteReceipt(id, principal);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Target document evicted from tracking vectors permanently.")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Eviction operations aborted: " + e.getMessage())
                    .build());
        }
    }

    // Direct Binary Stream File Reader View Routing Controller
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = "application/octet-stream";
                if(filename.toLowerCase().endsWith(".pdf")) contentType = "application/pdf";
                else if(filename.toLowerCase().endsWith(".png")) contentType = "image/png";
                else if(filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}