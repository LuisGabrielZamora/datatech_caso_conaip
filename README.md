
# Database Observability Stack

A comprehensive local development stack for testing database ingestion performance and observability. Includes MySQL, MariaDB, PostgreSQL, SQL Server with their Prometheus exporters, plus Prometheus, Grafana, and a NestJS ingestion testing application.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone or extract this project
2. Navigate to the project directory:

   ```bash
   cd db-observability-stack
   ```

3. Start the entire stack:

   ```bash
   docker compose up -d --build
   ```

## Services & URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana** | <http://localhost:3000> | admin/admin |
| **Prometheus** | <http://localhost:9090> | - |
| **NestJS Health** | <http://localhost:4000/health> | - |
| **NestJS Metrics** | <http://localhost:4000/metrics> | - |
| **cAdvisor** | <http://localhost:8080> | - |
| **Node Exporter** | <http://localhost:9100> | - |

### Database Ports

- **MySQL**: localhost:3306
- **MariaDB**: localhost:3307  
- **PostgreSQL**: localhost:5432
- **SQL Server**: localhost:1433

### Exporter Ports

- **MySQL Exporter**: localhost:9104
- **MariaDB Exporter**: localhost:9105
- **PostgreSQL Exporter**: localhost:9187
- **SQL Server Exporter**: localhost:9214

## Ingestion Testing

The NestJS application provides an endpoint for testing database ingestion performance:

### Endpoint

```
POST /ingest
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `db` | string | **required** | Database: `postgres`, `mysql`, `mariadb`, `mssql` |
| `rows` | number | 100 | Number of rows to insert |
| `payloadBytes` | number | 256 | Size of payload per row in bytes |
| `concurrency` | number | 1 | Number of concurrent operations |
| `method` | string | single | Insert method: `single` or `batch` |
| `batchSize` | number | 100 | Rows per batch (when method=batch) |

### Example Requests

**PostgreSQL - Batch Insert (20k rows, 512 bytes each, 4 concurrent streams, 1k batch size):**

```bash
curl -X POST "http://localhost:4000/ingest?db=postgres&rows=20000&payloadBytes=512&concurrency=4&method=batch&batchSize=1000"
```

**MySQL - Batch Insert:**

```bash
curl -X POST "http://localhost:4000/ingest?db=mysql&rows=20000&payloadBytes=512&concurrency=4&method=batch&batchSize=1000"
```

**MariaDB - Batch Insert:**

```bash
curl -X POST "http://localhost:4000/ingest?db=mariadb&rows=20000&payloadBytes=512&concurrency=4&method=batch&batchSize=1000"
```

**SQL Server - Batch Insert:**

```bash
curl -X POST "http://localhost:4000/ingest?db=mssql&rows=20000&payloadBytes=512&concurrency=4&method=batch&batchSize=1000"
```

**Single Row Insert (for comparison):**

```bash
curl -X POST "http://localhost:4000/ingest?db=postgres&rows=1000&payloadBytes=256&concurrency=2&method=single"
```

## Ingestion Methods

### Single Row Method

- **PostgreSQL**: `INSERT INTO ingest(payload) VALUES($1)` per row
- **MySQL/MariaDB**: `INSERT INTO ingest(payload) VALUES(?)` per row  
- **SQL Server**: `INSERT INTO ingest(payload) VALUES(@payload)` per row

### Batch Method

- **PostgreSQL**: `INSERT INTO ingest(payload) SELECT unnest($1::text[])` with array of payloads
- **MySQL/MariaDB**: `INSERT INTO ingest(payload) VALUES (?,?...)` multi-values insert
- **SQL Server**: Uses `mssql` library's `bulk()` API with Table object

## Prometheus Metrics

The NestJS application exposes the following metrics at `/metrics`:

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| `ingest_latency_ms` | Histogram | db, method, batch | Ingestion latency in milliseconds |
| `ingest_rows_total` | Counter | db, method | Total number of rows ingested |
| `ingest_inflight_writes` | Gauge | db, method | Number of inflight write operations |
| `ingest_failures_total` | Counter | db, method | Total number of ingestion failures |

## Grafana Dashboards

Pre-provisioned dashboards available at <http://localhost:3000>:

1. **DB Ingestion - NestJS**: Ingestion performance metrics
   - P95 latency by database and method
   - Rows ingested per second
   - Inflight operations
   - Failure rates

2. **PostgreSQL - Basics**: Core PostgreSQL metrics
   - Transaction commits/sec
   - Tuples inserted/sec
   - Database conflicts
   - Background writer metrics
   - Ingestion overlay

3. **MySQL & MariaDB - Basics**: Core MySQL/MariaDB metrics
   - Queries/sec
   - Connected threads
   - InnoDB buffer pool reads
   - Slow queries
   - Ingestion overlay

4. **SQL Server - Basics**: Core SQL Server metrics
   - Connections
   - CPU percentage
   - Deadlocks
   - IO stall read time
   - Ingestion overlay

## Prometheus Alerts

The following alert rules are configured:

| Alert | Condition | Severity | Description |
|-------|-----------|----------|-------------|
| **ExporterDown** | `up == 0` for 1m | Critical | Any exporter is down |
| **HighIngestionLatencyP95** | P95 > 500ms for 2m | Warning | High ingestion latency detected |
| **NoRowsIngested** | Rate < 0.1 rps for 5m | Info | No recent ingestion activity |

**Note**: For alert notifications, add Alertmanager configuration (optional future enhancement).

## Database Schema

Each database contains an `ingest` table:

```sql
-- PostgreSQL
CREATE TABLE ingest (
    id SERIAL PRIMARY KEY,
    payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MySQL/MariaDB  
CREATE TABLE ingest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SQL Server
CREATE TABLE ingest (
    id INT IDENTITY(1,1) PRIMARY KEY,
    payload NVARCHAR(4000),
    created_at DATETIME2 DEFAULT SYSDATETIME()
);
```

## Database Users

Prometheus exporters use dedicated users:

- **MySQL/MariaDB**: `exporter` / `exporterpass` with PROCESS, REPLICATION CLIENT, SELECT permissions
- **PostgreSQL**: `exporter` / `exporterpass` with pg_monitor role
- **SQL Server**: Uses `sa` account (exporter connects to master database)

## Troubleshooting

### Services Won't Start

```bash
# Check service status
docker compose ps

# View logs for specific service
docker compose logs [service_name]

# Restart services
docker compose restart [service_name]
```

### Database Connection Issues

```bash
# Test database connections
docker compose exec mysql mysql -u root -prootpass -e "SELECT 1"
docker compose exec mariadb mysql -u root -prootpass -e "SELECT 1"  
docker compose exec postgres psql -U postgres -d testdb -c "SELECT 1"
docker compose exec mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -Q "SELECT 1"
```

### Exporter Issues

```bash
# Check exporter logs
docker compose logs mysql_exporter
docker compose logs postgres_exporter
docker compose logs mssql_exporter

# Test exporter endpoints
curl http://localhost:9104/metrics  # MySQL
curl http://localhost:9105/metrics  # MariaDB
curl http://localhost:9187/metrics  # PostgreSQL
curl http://localhost:9214/metrics  # SQL Server
```

## Security Note

⚠️ **This stack uses default passwords for demonstration purposes. Change all passwords before using in production environments.**

## Cleanup

```bash
# Stop all services
docker compose down

# Remove volumes (deletes all data)
docker compose down -v

# Remove images
docker compose down --rmi all
```

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Grafana    │────│  Prometheus   │────│ Exporters    │
│   :3000      │    │    :9090      │     │ 9104,9105    │
└─────────────┘    └──────────────┘    │ 9187,9214     │
                                          └─────────────┘
                                                │
                                                │
                           ┌──────────────────┼──────────────────┐
                           │                    │                    │
                    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                    │    MySQL     │  │ PostgreSQL   │  │   SQL Server  │
                    │    :3306     │  │    :5432     │  │     :1433     │
                    └─────────────┘  └─────────────┘  └─────────────┘
                           │                  │                  │
                           └────────────────┼─────────────────┘
                                              │
                                    ┌─────────────┐
                                    │   NestJS     │
                                    │   :4000      │
                                    └─────────────┘
```

This stack provides comprehensive monitoring and testing capabilities for database ingestion performance across multiple database systems.
