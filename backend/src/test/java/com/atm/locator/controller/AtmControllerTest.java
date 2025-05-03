package com.atm.locator.controller;

import com.atm.locator.model.Atm;
import com.atm.locator.service.AtmService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.locationtech.jts.geom.GeometryFactory;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AtmControllerTest {

    @Mock
    private AtmService atmService;

    @InjectMocks
    private AtmController atmController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(atmController).build();
    }

    @Test
    void testGetAllAtms_returnsList() throws Exception {
        Atm atm1 = new Atm();
        atm1.setId(1L);
        atm1.setOperator("Bank A");

        Atm atm2 = new Atm();
        atm2.setId(2L);
        atm2.setOperator("Bank B");

        when(atmService.getAllAtms()).thenReturn(List.of(atm1, atm2));

        mockMvc.perform(get("/api/atms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetNearestAtm_returnsSingleAtm() throws Exception {
        Atm atm = new Atm();
        atm.setId(1L);
        atm.setOperator("Bank X");
        atm.setLocation(new GeometryFactory().createPoint(new org.locationtech.jts.geom.Coordinate(56.78, 12.34)));

        when(atmService.findNearestAtm(12.34, 56.78)).thenReturn(atm);

        mockMvc.perform(get("/api/atms/nearest")
                        .param("lat", "12.34")
                        .param("lon", "56.78"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.operator").value("Bank X"));
    }
}
