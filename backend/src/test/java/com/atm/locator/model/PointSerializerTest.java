package com.atm.locator.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import java.io.IOException;

import static org.mockito.Mockito.*;

public class PointSerializerTest {

    @Test
    void testSerialize_validPoint() throws IOException {
        Point point = new GeometryFactory().createPoint(new org.locationtech.jts.geom.Coordinate(56.78, 12.34));
        JsonGenerator gen = mock(JsonGenerator.class);
        SerializerProvider provider = mock(SerializerProvider.class);

        new PointSerializer().serialize(point, gen, provider);

        verify(gen).writeStartObject();
        verify(gen).writeNumberField("lat", 12.34);
        verify(gen).writeNumberField("lon", 56.78);
        verify(gen).writeEndObject();
    }
}
