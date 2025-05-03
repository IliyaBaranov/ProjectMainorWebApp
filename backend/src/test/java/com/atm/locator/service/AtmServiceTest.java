package com.atm.locator.service;

import com.atm.locator.model.Atm;
import com.atm.locator.repository.AtmRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AtmServiceTest {

    private final AtmRepository atmRepository = mock(AtmRepository.class);
    private final AtmService atmService = new AtmService(atmRepository);

    @Test
    void testFindNearestAtm_returnsAtm() {
        Atm atm = new Atm();
        atm.setId(1L);
        when(atmRepository.findNearestAtm(12.34, 56.78)).thenReturn(Optional.of(atm));

        Atm result = atmService.findNearestAtm(12.34, 56.78);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testFindNearestAtm_noResult_throwsException() {
        when(atmRepository.findNearestAtm(0.0, 0.0)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> atmService.findNearestAtm(0.0, 0.0));

        assertEquals("No ATMs found", exception.getMessage());
    }

    @Test
    void testGetAllAtms_returnsList() {
        List<Atm> mockList = List.of(new Atm(), new Atm());
        when(atmRepository.findAll()).thenReturn(mockList);

        List<Atm> result = atmService.getAllAtms();

        assertEquals(2, result.size());
    }
}
