# 🚀 Hosting NexWatch / CivicFlow ATCS on Render with Docker

This guide details how to build and host **NexWatch / CivicFlow ATCS** on [Render](https://render.com) using Docker.

The project is structured with a **unified multi-stage Docker architecture**:
- **Stage 1**: Compiles the React + Vite + Tailwind frontend into optimized static production assets.
- **Stage 2**: Launches the lightweight Python 3.11 FastAPI backend, automatically mounting the compiled frontend SPA, static crops directory, API endpoints, and real-time WebSockets on a single unified port.

---

## 📋 Prerequisites
1. A free account on [Render.com](https://render.com).
2. A GitHub or GitLab account with this repository pushed.

---

## ⚡ Method 1: 1-Click Blueprint Deployment (Recommended)

Render Blueprints use the included [`render.yaml`](./render.yaml) file to automatically provision and configure the service.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Docker and Render configuration"
   git push origin main
   ```
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** in the top right and select **Blueprint**.
4. Connect your GitHub/GitLab repository.
5. Render will automatically detect [`render.yaml`](./render.yaml).
6. Click **Apply**.
   - Render will build the Docker container and deploy your live application at `https://nexwatch-atcs.onrender.com`.

---

## 🛠️ Method 2: Manual Web Service Deployment on Render

If you prefer configuring the Web Service manually via the Render UI:

1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service**.
2. Select **Build and deploy from a Git repository** and connect your repo.
3. Configure the following settings:
   - **Name**: `nexwatch-atcs` (or any name you prefer)
   - **Region**: Choose the closest region (e.g., `Oregon`, `Frankfurt`, `Singapore`)
   - **Branch**: `main`
   - **Language / Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: **Free** (or Starter/Standard)
4. Under **Advanced**:
   - **Health Check Path**: `/api/health`
   - **Auto-Deploy**: `Yes`
5. Click **Create Web Service**.

Render will now:
- Execute the multi-stage Docker build.
- Pre-seed sample cameras, trajectories, and impossible speed clone anomalies on cold startup.
- Bind the web server dynamically to Render's allocated `$PORT`.
- Provide an HTTPS URL (e.g., `https://nexwatch-atcs.onrender.com`).

---

## 💻 Local Docker Execution (Optional)

If you have Docker Desktop running locally, you can test the production container on your machine:

### Option A: Using Docker Compose
```bash
docker compose up --build
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option B: Using Plain Docker CLI
```bash
# Build image
docker build -t nexwatch-app .

# Run container
docker run -p 8000:8000 --name nexwatch-container nexwatch-app
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## ⚙️ Environment Variables (Optional)

You can set these in Render under **Environment**:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `10000` (Render default) | Port for the Uvicorn HTTP/WebSocket server |
| `DATABASE_URL` | `sqlite:////app/nexwatch.db` | Override with PostgreSQL URI if using Render Postgres |
| `SPEED_THRESHOLD_KMH` | `120.0` | Kinematic threshold for flagging impossible velocity clones |
| `SIMILARITY_THRESHOLD` | `0.60` | Re-ID visual embedding cosine similarity cutoff |

---

## 🔍 Verification & Health Check

Once deployed, you can verify your service:
- **Application UI**: Visit `https://<your-service-name>.onrender.com`
- **Health Check**: `https://<your-service-name>.onrender.com/api/health`
- **API Documentation**: `https://<your-service-name>.onrender.com/docs`
- **Live Anomaly Alerts**: Connected automatically via `wss://<your-service-name>.onrender.com/ws/alerts`
