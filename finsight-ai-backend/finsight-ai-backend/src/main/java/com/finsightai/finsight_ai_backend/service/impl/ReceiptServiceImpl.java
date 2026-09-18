package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.entity.Receipt;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.ReceiptRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final com.finsightai.finsight_ai_backend.repository.UserRepository userRepository;

    @Value("${aws.access.key}") private String accessKey;
    @Value("${aws.secret.key}") private String secretKey;
    @Value("${aws.region}") private String region;
    @Value("${aws.s3.bucket}") private String bucketName;

    private S3Client s3Client;

    @PostConstruct
    private void initializeS3Client() {
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    @Override
    @Transactional
    public Receipt uploadReceipt(MultipartFile file, UserPrincipal principal) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Identity instance invalid."));

        String uniqueFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            // 1. Upload the object directly to the private S3 storage pool
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(uniqueFilename)
                            .contentType(file.getContentType())
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // 2. Instantiate the S3Presigner wrapper using your credentials configuration context
            try (S3Presigner presigner = S3Presigner.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                    .build()) {

                // 3. Configure temporary token validation payload (valid for 15 minutes)
                GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(15))
                        .getObjectRequest(builder -> builder.bucket(bucketName).key(uniqueFilename))
                        .build();

                // 4. Extract the cryptographically secure pre-signed URL string
                String securePresignedUrl = presigner.presignGetObject(presignRequest).url().toString();

                Receipt receipt = Receipt.builder()
                        .fileName(file.getOriginalFilename())
                        .fileUrl(securePresignedUrl) // Persist the secure token link to database layers
                        .user(user)
                        .build();

                return receiptRepository.saveAndFlush(receipt);
            }
        } catch (Exception e) {
            log.error("Cloud container upload failed: ", e);
            throw new RuntimeException("Cloud container upload rejected by structural storage metrics.");
        }
    }

    @Override
    @Transactional
    public void deleteReceipt(Long receiptId, UserPrincipal principal) {
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Document reference missing."));

        try {
            // Safe URL parsing: strip query parameters if present, then pull out the key identifier
            String rawUrl = receipt.getFileUrl();
            if (rawUrl.contains("?")) {
                rawUrl = rawUrl.substring(0, rawUrl.indexOf("?"));
            }
            String key = rawUrl.substring(rawUrl.lastIndexOf("/") + 1);

            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(key).build());
        } catch (Exception e) {
            log.warn("Cloud eviction execution skipped or aborted: {}", e.getMessage());
        }

        receiptRepository.delete(receipt);
        receiptRepository.flush();
    }

    @Override
    public List<Receipt> getReceiptsByUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile out of bounds."));
        return receiptRepository.findByUserOrderByUploadDateDesc(user);
    }

    @Override
    public Receipt getReceiptById(Long receiptId, UserPrincipal principal) {
        return receiptRepository.findById(receiptId).orElseThrow(() -> new ResourceNotFoundException("Missing record reference."));
    }
}