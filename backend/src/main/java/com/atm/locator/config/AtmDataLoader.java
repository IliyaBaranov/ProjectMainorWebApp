package com.atm.locator.config;

import com.atm.locator.model.Atm;
import com.atm.locator.repository.AtmRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class AtmDataLoader implements CommandLineRunner {

    private final AtmRepository atmRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public void run(String... args) throws Exception {
        if (!atmRepository.findAll().isEmpty()) return;

        var resource = new ClassPathResource("estonian_atms.csv");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            reader.readLine(); // skip header

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(";");
                Long id = Long.parseLong(parts[0]);
                double lat = Double.parseDouble(parts[1]);
                double lon = Double.parseDouble(parts[2]);
                String name = parts[3];
                String operator = parts[4];

                Point location = geometryFactory.createPoint(new org.locationtech.jts.geom.Coordinate(lon, lat));
                location.setSRID(4326);

                Atm atm = new Atm();
                atm.setId(id);
                atm.setLocation(location);
                atm.setName(name);
                atm.setOperator(operator);

                atmRepository.save(atm);
            }
        }
    }
}
