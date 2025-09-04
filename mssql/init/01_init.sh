#!/bin/bash

# Wait a bit for SQL Server to be fully ready
sleep 10

# Create database and table if they don't exist
/opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "YourStrong!Passw0rd" -Q "
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'testdb')
BEGIN
    CREATE DATABASE testdb;
END
"

/opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "YourStrong!Passw0rd" -d testdb -Q "
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ingest')
BEGIN
    CREATE TABLE ingest (
        id INT IDENTITY(1,1) PRIMARY KEY,
        payload NVARCHAR(4000),
        created_at DATETIME2 DEFAULT SYSDATETIME()
    );
END
"