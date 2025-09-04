CREATE USER exporter WITH PASSWORD 'exporterpass';
GRANT pg_monitor TO exporter;

CREATE TABLE IF NOT EXISTS ingest (
    id SERIAL PRIMARY KEY,
    payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);