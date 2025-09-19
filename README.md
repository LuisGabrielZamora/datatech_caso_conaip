
# DataTech CONAIP Project

A comprehensive technology stack comprising database observability tools and a production-ready project management API. This project demonstrates modern DevOps practices, database monitoring, and enterprise-grade API development.

## 🏗️ Project Structure

This repository contains two main components:

### 1. 📊 Database Observability Stack

A comprehensive local development stack for testing database ingestion performance and observability. Includes MySQL, MariaDB, PostgreSQL, SQL Server with their Prometheus exporters, plus Prometheus, Grafana, and a NestJS ingestion testing application.

### 2. 🚀 Project Management API

A production-ready NestJS REST API for managing projects, tasks, employees, clients, and assignments. Features include JWT authentication, role-based access control, comprehensive API documentation, and PostgreSQL integration.

**🔗 Live API Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- pnpm (for package management)

## 🚀 Quick Start

### Option 1: Database Observability Stack Only

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd datatech_caso_conaip
   ```

2. Start the observability stack:

   ```bash
   docker compose up -d --build
   ```

### Option 2: Project Management API Only

1. Navigate to the API directory:

   ```bash
   cd project-management-api
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

4. Start the API:

   ```bash
   pnpm run start:dev
   ```

### Option 3: Full Stack (Recommended for Development)

1. Start the database stack:

   ```bash
   docker compose -f docker-compose.pg-only.yml up -d
   ```

2. Start the Project Management API:

   ```bash
   cd project-management-api
   pnpm install
   pnpm run start:dev
   ```

## 🌐 Services & URLs

### Project Management API

| Service | URL | Description |
|---------|-----|-------------|
| **🔗 Production API** | [https://api.thorium-technologies.com](https://api.thorium-technologies.com) | Live production API |
| **📚 API Documentation** | [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs) | Interactive Swagger documentation |
| **🔧 Local API** | <http://localhost:3000> | Local development server |
| **📖 Local API Docs** | <http://localhost:3000/api/docs> | Local Swagger documentation |

### Database Observability Stack

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

``` bash
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

``` bash
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

---

## 🚀 Project Management API

For detailed information about the Project Management API, see the [Project Management API README](./project-management-api/README.md).

### Quick API Overview

The Project Management API is a production-ready NestJS application featuring:

- **🔗 Live API:** [https://api.thorium-technologies.com](https://api.thorium-technologies.com)
- **📚 Interactive Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)
- **🔐 JWT Authentication** with role-based access control
- **📊 Complete CRUD Operations** for projects, tasks, employees, clients, and assignments
- **📄 Pagination Support** with configurable parameters (limit=10, page=0)
- **🔍 Advanced Search & Filtering** across all entities
- **🗄️ PostgreSQL Integration** with SSL support
- **🐳 Docker Deployment** ready

### API Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** | `/api/auth` | User login, registration, and token management |
| **Clients** | `/api/clients` | Client management operations |
| **Employees** | `/api/employees` | Employee management and department filtering |
| **Projects** | `/api/projects` | Project management and client relationships |
| **Tasks** | `/api/tasks` | Task management with project/assignee filtering |
| **Assignments** | `/api/assignments` | Project-employee assignment management |

### Getting Started with the API

1. **Access the live documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)
2. **Authenticate:** Use the `/api/auth/login` endpoint or the "Authorize" button in Swagger
3. **Explore endpoints:** All endpoints support pagination with `limit`, `page`, and `search` parameters
4. **Test locally:** Follow the setup guide in [project-management-api/README.md](./project-management-api/README.md)

### Architecture Highlights

- **Clean Architecture** with domain-driven design
- **Hexagonal Architecture** pattern with clear separation of concerns
- **TypeORM** for database operations with PostgreSQL
- **Class Validation** for comprehensive input validation
- **Swagger/OpenAPI** for interactive API documentation
- **Role-based Security** with JWT token authentication
