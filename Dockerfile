# ==============================================================================
# Multi-Stage Dockerfile for NexWatch / CivicFlow ATCS
# Unified Full-Stack Container (Frontend SPA + FastAPI Backend) for Render
# ==============================================================================

# Stage 1: Build the React + TypeScript + Vite frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend Runtime
FROM python:3.11-slim AS runner

WORKDIR /app

# Install system dependencies required for OpenCV, SQLite, and network utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application and data
COPY backend/ ./backend/
COPY data/ ./data/

# Copy compiled frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set environment defaults (Render sets $PORT dynamically, default 8000)
ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 8000

# Health check to allow Render & Docker to monitor container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start container: run DB seed check and launch Uvicorn
CMD ["sh", "-c", "python -m backend.app.services.seed_demo_data || true && uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
