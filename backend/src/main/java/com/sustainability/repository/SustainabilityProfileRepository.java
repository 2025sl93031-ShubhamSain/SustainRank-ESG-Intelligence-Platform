package com.sustainability.repository;

import com.sustainability.entity.AppUser;
import com.sustainability.entity.SustainabilityProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SustainabilityProfileRepository extends JpaRepository<SustainabilityProfile, Long> {

    Optional<SustainabilityProfile> findByUser(AppUser user);

    List<SustainabilityProfile> findAllByOrderBySustainabilityScoreDesc();

    List<SustainabilityProfile> findAllByOrderByRoiDesc();

    List<SustainabilityProfile> findAllByOrderByCostBenefitDesc();

    @Query("SELECT p FROM SustainabilityProfile p ORDER BY (p.sustainabilityScore * 0.50 + p.roi * 0.30 + p.costBenefit * 0.20) DESC")
    List<SustainabilityProfile> findAllOrderByCompositeScoreDesc();

    @Query("SELECT AVG(p.roi) FROM SustainabilityProfile p")
    Double findAvgRoi();

    @Query("SELECT AVG(p.sustainabilityScore) FROM SustainabilityProfile p")
    Double findAvgSustainabilityScore();

    @Query("SELECT AVG(p.carbonScore) FROM SustainabilityProfile p")
    Double findAvgCarbonScore();

    @Query("SELECT AVG(p.energyTotal) FROM SustainabilityProfile p")
    Double findAvgEnergyTotal();

    @Query("SELECT AVG(p.totalWaste) FROM SustainabilityProfile p")
    Double findAvgTotalWaste();

    @Query("SELECT AVG(p.environmentalScore) FROM SustainabilityProfile p")
    Double findAvgEnvironmentalScore();

    @Query("SELECT AVG(p.socialScore) FROM SustainabilityProfile p")
    Double findAvgSocialScore();

    @Query("SELECT MAX(p.sustainabilityScore) FROM SustainabilityProfile p")
    Double findMaxSustainabilityScore();

    @Query("SELECT MIN(p.sustainabilityScore) FROM SustainabilityProfile p")
    Double findMinSustainabilityScore();
}
