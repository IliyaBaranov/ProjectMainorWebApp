package com.atm.locator.service;

import com.atm.locator.model.Atm;
import com.atm.locator.repository.AtmRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AtmService {

    private final AtmRepository atmRepository;

    public Atm findNearestAtm(double userLat, double userLon) {
        return atmRepository.findNearestAtm(userLat, userLon)
                .orElseThrow(() -> new RuntimeException("No ATMs found"));
    }

    public List<Atm> getAllAtms() {
        return atmRepository.findAll();
    }

}
