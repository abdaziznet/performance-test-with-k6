# Performance Testing Project with k6, InfluxDB, and Grafana

## Structure
- **Performance/**: General performance tests.
- **Load testing/**: Tests to assess system behavior under expected load.
- **Stress testing/**: Tests to find the breaking point of the system.
- **Spike testing/**: Tests for sudden surges in traffic.
- **Soak testing/**: Tests for reliability over long periods.
- **docker-compose.yml**: Stack configuration.
- **grafana/**: Grafana provisioning (datasources).

## How to Run

1. Start the services:
   ```bash
   docker-compose up -d
   ```

2. Access Grafana:
   - URL: http://localhost:3000
   - InfluxDB datasource is pre-configured.

3. Run a test (Example):
   ```bash
   docker-compose run --rm k6 run "/scripts/Load testing/sample-test.js"
   ```

## Folder Descriptions
- **Load Testing**: Verifikasi sistem bisa handle expected load.
- **Stress Testing**: Cari, limit, dan breaking point sistem.
- **Spike Testing**: Test kenaikan user yang tiba-tiba.
- **Soak Testing**: Test endurance dalam jangka waktu lama.
