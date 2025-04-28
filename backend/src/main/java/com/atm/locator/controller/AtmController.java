package com.atm.locator.controller;

import com.atm.locator.model.Atm;
import com.atm.locator.service.AtmService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/atm")
@RequiredArgsConstructor
public class AtmController {

    private final AtmService atmService;

    @GetMapping("/nearest")
    public Atm getNearestATM(@RequestParam double lat, @RequestParam double lon) {
        return atmService.findNearestAtm(lat, lon);
    }
}
