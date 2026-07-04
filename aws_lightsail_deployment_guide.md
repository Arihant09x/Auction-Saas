# Run & Test Guide: Local EC2 Simulator & AWS Lightsail

This guide covers local orchestration testing (using Docker Compose / Floci simulator) and production deployment strategies on AWS Lightsail Container Services.

---

## 1. Local Testing (Docker Compose)

To orchestrate and run the full stack locally:

### Step A: Configure Local Environment Variables
Create a `.env` file in the **root directory** of the project and populate the required credentials:
```env
# Database Settings (Will feed postgres container and api DATABASE_URL link)
POSTGRES_USER=db_user
POSTGRES_PASSWORD=db_password
POSTGRES_DB=db_name

# Firebase (Matches your dashboard project setup)
FIREBASE_PROJECT_ID="vaulted-botany-445315-d7"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-1ls4c@vaulted-botany-445315-d7.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client (Optional override values)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCCr5bcloLqxUPfMF-NkMgbtHuArkPq_Z0"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="app.auction10.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="vaulted-botany-445315-d7"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="vaulted-botany-445315-d7.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="464872134584"
NEXT_PUBLIC_FIREBASE_APP_ID="1:464872134584:web:ba5ee810b3a7409f86214d"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_Rucoly3LqinHM4"
RAZORPAY_KEY_SECRET="xmpgeDUW7nIB19lkFoiJ8oNW"
```

### Step B: Run Docker Compose
Run the orchestration commands from the monorepo root:
```bash
# Build all local images (NestJS backend API and Next.js frontend pages)
docker-compose build

# Spin up the containers (in detached daemon mode)
docker-compose up -d
```

### Step C: Verify Services
- **Landing Web App**: Accessible at `http://localhost:3001` (or forwarded through Nginx gateway at `http://localhost`).
- **Dashboard App**: Accessible at `http://localhost:3002`.
- **API Health Check**: Accessible at `http://localhost:3000/api/health` (or through reverse proxy at `http://localhost/api/health`).

---

## 2. Production Deployment to AWS Lightsail

AWS Lightsail Container Services allows you to deploy containerized monorepo workspaces easily without setting up complex AWS ECS clusters.

### Step A: Push Images to a Container Registry
Deploy the built images to your private GitHub Container Registry (GHCR) using the deploy pipeline or push them manually to AWS Lightsail Registry:
```bash
# Tag local image to GHCR format
docker tag auction-api:latest ghcr.io/<your-github-username>/auction-saas/api:latest
docker tag auction-web:latest ghcr.io/<your-github-username>/auction-saas/web:latest

# Push
docker push ghcr.io/<your-github-username>/auction-saas/api:latest
docker push ghcr.io/<your-github-username>/auction-saas/web:latest
```

### Step B: Create a Lightsail Container Service
1. Log in to the **AWS Lightsail Console**.
2. Click **Containers** and select **Create container service**.
3. Choose your scale/capacity node size (e.g. Nano node size: 512MB RAM, 0.25 vCPUs).

### Step C: Define Service Deployment Configuration
Add the three core services within the Lightsail deployment UI:

#### 1. Backend Container (`api`)
- **Image**: `ghcr.io/<your-github-username>/auction-saas/api:latest`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `3000`
  - `DATABASE_URL`: Deployed Postgres URL (e.g., Neon endpoint)
  - `REDIS_HOST`: Deployed Redis host endpoint
  - `REDIS_PORT`: `6379`
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

#### 2. Frontend Container (`web`)
- **Image**: `ghcr.io/<your-github-username>/auction-saas/web:latest`
  > [!IMPORTANT]
  > Ensure that the Web container is compiled with production build arguments pointing to the live API domain. In your GitHub Actions deployment workflows, make sure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` build arguments are configured to point to your live Lightsail API endpoint (e.g., `https://api.your-domain.com`).

#### 3. Nginx Gateway (`nginx`)
- **Image**: `nginx:alpine`
- **Volume Mounts**: Mount the `nginx.conf` to `/etc/nginx/nginx.conf` via the AWS CLI or upload it directly.
- **Port Mapping**: Set Public Endpoint to the Nginx container on port `80`.

### Step D: Custom Domains & SSL Setup
1. In the **Lightsail Container service** console, click **Custom domains**.
2. Create an SSL certificate for your domains:
   - `your-domain.com` (pointing to the Web container via Nginx)
   - `api.your-domain.com` (pointing to the API container via Nginx)
3. Attach the DNS CNAME records to verify ownership and bind the SSL certificate.
