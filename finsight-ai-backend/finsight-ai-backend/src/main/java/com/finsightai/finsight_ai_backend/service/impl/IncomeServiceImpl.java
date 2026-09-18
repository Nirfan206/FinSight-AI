package com.finsightai.finsight_ai_backend.service.impl;

import com.finsightai.finsight_ai_backend.dto.request.IncomeRequest;
import com.finsightai.finsight_ai_backend.dto.response.IncomeResponse;
import com.finsightai.finsight_ai_backend.entity.Income;
import com.finsightai.finsight_ai_backend.entity.User;
import com.finsightai.finsight_ai_backend.exception.ResourceNotFoundException;
import com.finsightai.finsight_ai_backend.repository.IncomeRepository;
import com.finsightai.finsight_ai_backend.repository.UserRepository;
import com.finsightai.finsight_ai_backend.security.UserPrincipal;
import com.finsightai.finsight_ai_backend.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public IncomeResponse createIncome(IncomeRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);

        Income income = new Income();
        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setSource(request.getSource());
        income.setDescription(request.getDescription());
        income.setRecordDate(request.getRecordDate());
        income.setUser(user);

        // Uses saveAndFlush to materialize persistence states inside MySQL transaction borders instantly
        Income savedIncome = incomeRepository.saveAndFlush(income);
        return mapToResponse(savedIncome);
    }

    @Override
    @Transactional
    public IncomeResponse updateIncome(Long incomeId, IncomeRequest request, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));

        validateOwnership(income, principal);

        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setSource(request.getSource());
        income.setDescription(request.getDescription());
        income.setRecordDate(request.getRecordDate());

        Income updatedIncome = incomeRepository.saveAndFlush(income);
        return mapToResponse(updatedIncome);
    }

    @Override
    public IncomeResponse getIncomeById(Long incomeId, UserPrincipal principal) {
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));

        validateOwnership(income, principal);
        return mapToResponse(income);
    }

    @Override
    public Page<IncomeResponse> getAllIncomes(UserPrincipal principal, Pageable pageable) {
        User user = fetchCurrentUser(principal);
        return incomeRepository.findByUser(user, pageable).map(this::mapToResponse);
    }

    @Override
    public List<IncomeResponse> getIncomesByDateRange(UserPrincipal principal, LocalDate startDate, LocalDate endDate) {
        User user = fetchCurrentUser(principal);
        return incomeRepository.findByUserAndRecordDateBetween(user, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteIncome(Long incomeId, UserPrincipal principal) {
        User user = fetchCurrentUser(principal);
        Income income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + incomeId));

        validateOwnership(income, principal);
        incomeRepository.delete(income);
        incomeRepository.flush(); // Enforce deletion flush to sync baseline totals
    }

    @Override
    public BigDecimal getTotalIncomeByMonth(UserPrincipal principal, int month, int year) {
        User user = fetchCurrentUser(principal);
        BigDecimal total = incomeRepository.sumIncomeByUserAndMonth(user, month, year);
        return total != null ? total : BigDecimal.ZERO;
    }

    private User fetchCurrentUser(UserPrincipal principal) {
        return userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User reference not found inside active clusters."));
    }

    private void validateOwnership(Income income, UserPrincipal principal) {
        if (!income.getUser().getUserId().equals(principal.getUserId())) {
            throw new AccessDeniedException("Access denied. Resource modification forbidden on this identity instance.");
        }
    }

    private IncomeResponse mapToResponse(Income income) {
        return IncomeResponse.builder()
                .incomeId(income.getIncomeId())
                .amount(income.getAmount())
                .category(income.getCategory())
                .source(income.getSource())
                .description(income.getDescription())
                .recordDate(income.getRecordDate())
                .createdAt(income.getCreatedAt())
                .updatedAt(income.getUpdatedAt())
                .build();
    }
}