package com.finsightai.finsight_ai_backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {

    @Min(value = 0, message = "Page index must be greater than or equal to 0")
    @Builder.Default
    private int page = 0;

    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size cannot exceed 100 entries for performance safety")
    @Builder.Default
    private int size = 20;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String direction = "DESC";

    /**
     * Converts the custom incoming request parameters into a standard Spring Data Pageable instance.
     */
    public Pageable toPageable() {
        Sort sort = Sort.by(Sort.Direction.fromString(direction.toUpperCase()), sortBy);
        return PageRequest.of(page, size, sort);
    }
}