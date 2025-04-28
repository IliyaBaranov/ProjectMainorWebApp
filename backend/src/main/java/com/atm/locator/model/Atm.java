package com.atm.locator.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "atms")
@Getter
@Setter
@NoArgsConstructor
public class Atm {

    @Id
    private Long id;

    @Column(nullable = false)
    private String operator;

    private String name;

    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    @JsonSerialize(using = PointSerializer.class)  // Apply the custom serializer here
    private Point location; // This will store lat/lon as a geometric point
}
