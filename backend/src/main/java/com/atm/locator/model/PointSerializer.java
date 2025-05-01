package com.atm.locator.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.locationtech.jts.geom.Point;

import java.io.IOException;

public class PointSerializer extends JsonSerializer<Point> {

    @Override
    public void serialize(Point value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value != null) {
            double lat = value.getY();
            double lon = value.getX();

            gen.writeStartObject();
            gen.writeNumberField("lat", lat);
            gen.writeNumberField("lon", lon);
            gen.writeEndObject();
        }
    }
}
