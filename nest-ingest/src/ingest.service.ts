import { Injectable } from '@nestjs/common';
import { Pool as PgPool } from 'pg';
import { createPool as createMysqlPool, Pool as MysqlPool } from 'mysql2/promise';
import { ConnectionPool as MssqlPool, Table } from 'mssql';
import { Histogram, Counter, Gauge, register } from 'prom-client';

interface IngestParams {
  db: string;
  rows: number;
  payloadBytes: number;
  concurrency: number;
  method: string;
  batchSize: number;
}

@Injectable()
export class IngestService {
  private pgPool: PgPool;
  private mysqlPool: MysqlPool;
  private mariadbPool: MysqlPool;
  private mssqlPool: MssqlPool;

  private ingestLatencyHistogram: Histogram<string>;
  private ingestRowsCounter: Counter<string>;
  private ingestInflightGauge: Gauge<string>;
  private ingestFailuresCounter: Counter<string>;

  constructor() {
    this.initializeMetrics();
    this.initializeDatabases();
  }

  private initializeMetrics() {
    this.ingestLatencyHistogram = new Histogram({
      name: 'ingest_latency_ms',
      help: 'Histogram of ingestion latency in milliseconds',
      labelNames: ['db', 'method', 'batch'],
      buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    });

    this.ingestRowsCounter = new Counter({
      name: 'ingest_rows_total',
      help: 'Total number of rows ingested',
      labelNames: ['db', 'method'],
    });

    this.ingestInflightGauge = new Gauge({
      name: 'ingest_inflight_writes',
      help: 'Number of inflight write operations',
      labelNames: ['db', 'method'],
    });

    this.ingestFailuresCounter = new Counter({
      name: 'ingest_failures_total',
      help: 'Total number of ingestion failures',
      labelNames: ['db', 'method'],
    });

    register.registerMetric(this.ingestLatencyHistogram);
    register.registerMetric(this.ingestRowsCounter);
    register.registerMetric(this.ingestInflightGauge);
    register.registerMetric(this.ingestFailuresCounter);
  }

  private async initializeDatabases() {
    this.pgPool = new PgPool({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
      max: 20,
    });

    this.mysqlPool = createMysqlPool({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      connectionLimit: 20,
    });

    this.mariadbPool = createMysqlPool({
      host: process.env.MARIADB_HOST,
      port: parseInt(process.env.MARIADB_PORT),
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASS,
      database: process.env.MARIADB_DB,
      connectionLimit: 20,
    });

    this.mssqlPool = new MssqlPool({
      server: process.env.MSSQL_HOST,
      port: parseInt(process.env.MSSQL_PORT),
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASS,
      database: process.env.MSSQL_DB,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
      pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    });

    await this.mssqlPool.connect();
  }

  async performIngestion(params: IngestParams) {
    const { db, rows, payloadBytes, concurrency, method, batchSize } = params;
    const payload = 'x'.repeat(payloadBytes);

    const labels = { db, method };
    const batchLabel = String(batchSize);

    try {
      this.ingestInflightGauge.inc(labels);

      const startTime = Date.now();
      
      if (method === 'single') {
        await this.performSingleRowInserts(db, rows, payload, concurrency);
      } else {
        await this.performBatchInserts(db, rows, payload, concurrency, batchSize);
      }

      const duration = Date.now() - startTime;
      this.ingestLatencyHistogram.observe({ ...labels, batch: batchLabel }, duration);
      this.ingestRowsCounter.inc(labels, rows);

      return {
        success: true,
        rowsInserted: rows,
        durationMs: duration,
        db,
        method,
        batchSize: method === 'batch' ? batchSize : 1,
      };
    } catch (error) {
      this.ingestFailuresCounter.inc(labels);
      throw error;
    } finally {
      this.ingestInflightGauge.dec(labels);
    }
  }

  private async performSingleRowInserts(db: string, rows: number, payload: string, concurrency: number) {
    const tasks = [];
    const rowsPerTask = Math.ceil(rows / concurrency);

    for (let i = 0; i < concurrency; i++) {
      const startRow = i * rowsPerTask;
      const endRow = Math.min(startRow + rowsPerTask, rows);
      const taskRows = endRow - startRow;

      if (taskRows > 0) {
        tasks.push(this.insertSingleRows(db, taskRows, payload));
      }
    }

    await Promise.all(tasks);
  }

  private async performBatchInserts(db: string, rows: number, payload: string, concurrency: number, batchSize: number) {
    const tasks = [];
    const rowsPerTask = Math.ceil(rows / concurrency);

    for (let i = 0; i < concurrency; i++) {
      const startRow = i * rowsPerTask;
      const endRow = Math.min(startRow + rowsPerTask, rows);
      const taskRows = endRow - startRow;

      if (taskRows > 0) {
        tasks.push(this.insertBatchRows(db, taskRows, payload, batchSize));
      }
    }

    await Promise.all(tasks);
  }

  private async insertSingleRows(db: string, rows: number, payload: string) {
    for (let i = 0; i < rows; i++) {
      switch (db) {
        case 'postgres':
          await this.pgPool.query('INSERT INTO ingest(payload) VALUES($1)', [payload]);
          break;
        case 'mysql':
          await this.mysqlPool.execute('INSERT INTO ingest(payload) VALUES(?)', [payload]);
          break;
        case 'mariadb':
          await this.mariadbPool.execute('INSERT INTO ingest(payload) VALUES(?)', [payload]);
          break;
        case 'mssql':
          await this.mssqlPool.request().input('payload', payload).query('INSERT INTO ingest(payload) VALUES(@payload)');
          break;
      }
    }
  }

  private async insertBatchRows(db: string, rows: number, payload: string, batchSize: number) {
    const batches = Math.ceil(rows / batchSize);

    for (let batch = 0; batch < batches; batch++) {
      const batchStart = batch * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, rows);
      const batchRows = batchEnd - batchStart;

      switch (db) {
        case 'postgres':
          const payloadArray = Array(batchRows).fill(payload);
          await this.pgPool.query('INSERT INTO ingest(payload) SELECT unnest($1::text[])', [payloadArray]);
          break;

        case 'mysql':
        case 'mariadb':
          const pool = db === 'mysql' ? this.mysqlPool : this.mariadbPool;
          const values = Array(batchRows).fill('(?)').join(',');
          const params = Array(batchRows).fill(payload);
          await pool.execute(`INSERT INTO ingest(payload) VALUES ${values}`, params);
          break;

        case 'mssql':
          const table = new Table('ingest');
          table.columns.add('payload', 'nvarchar', { length: 4000 });
          
          for (let i = 0; i < batchRows; i++) {
            table.rows.add(payload);
          }
          
          await this.mssqlPool.request().bulk(table);
          break;
      }
    }
  }
}