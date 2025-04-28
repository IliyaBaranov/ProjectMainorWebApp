package com.atm.locator.repository;

import com.atm.locator.model.Atm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface AtmRepository extends JpaRepository<Atm, Long> {

    @Query(value = """
        SELECT a.* FROM atms a
        ORDER BY ST_Distance(
            a.location,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
        ) ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<Atm> findNearestAtm(@Param("lat") double lat, @Param("lon") double lon);
}
