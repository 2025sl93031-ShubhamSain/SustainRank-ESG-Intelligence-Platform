package com.sustainability.repository;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.CalculationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CalculationHistoryRepository extends JpaRepository<CalculationHistory, Long> {

    List<CalculationHistory> findByUserOrderByCreatedAtDesc(AppUser user);

    Optional<CalculationHistory> findFirstByUserOrderByCreatedAtAsc(AppUser user);

    @Query("SELECT h.id FROM CalculationHistory h WHERE h.user = :user ORDER BY h.createdAt DESC")
    List<Long> findIdsByUserOrderByCreatedAtDesc(@Param("user") AppUser user);

    void deleteByIdIn(List<Long> ids);
}
