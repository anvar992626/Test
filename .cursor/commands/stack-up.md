---
description: Start or recover the full Signal Lab stack (Docker Compose)
---

From the repository root, ensure Docker Desktop (or the Docker engine) is running. Run `docker compose up -d --build`. Then list each service status with `docker compose ps`. Summarize URLs for the interviewer: UI `http://localhost:3000`, API `http://localhost:3001`, metrics `http://localhost:3001/metrics`, Grafana `http://localhost:3020` (admin/admin), Prometheus `http://localhost:9090`, Loki `http://localhost:3100`. If any service is unhealthy, show the last 50 log lines for that container only.
