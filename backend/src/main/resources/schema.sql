CREATE TABLE IF NOT EXISTS atms (
    id BIGINT PRIMARY KEY,
    operator VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    location geometry(Point, 4326) NOT NULL
);
