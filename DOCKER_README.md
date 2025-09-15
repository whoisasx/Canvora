# 🐳 Docker Setup for Skema/Canvora

Simple production Docker setup with NeonDB support.

## 🚀 Quick Start

### 1. Prerequisites

- Docker & Docker Compose installed
- NeonDB database (sign up at [neon.tech](https://neon.tech))
- Resend API key (sign up at [resend.com](https://resend.com))

### 2. Environment Setup

```bash
# The .env file is already created, just update these values:
nano .env
```

**Required values:**

- `DATABASE_URL` - Your NeonDB connection string
- `NEXTAUTH_SECRET` - Random 32+ character string
- `JWT_SECRET` - Random 32+ character string
- `RESEND_API_KEY` - Your Resend API key

### 3. Start Application

```bash
chmod +x docker-setup.sh
./docker-setup.sh start
```

### 4. Access Your App

- **Web Application**: http://localhost:3000
- **WebSocket Server**: ws://localhost:8080

## 📋 Available Commands

```bash
./docker-setup.sh start    # Start the application
./docker-setup.sh stop     # Stop all services
./docker-setup.sh restart  # Restart all services
./docker-setup.sh logs     # Show application logs
./docker-setup.sh migrate  # Run database migrations
./docker-setup.sh clean    # Clean up containers and volumes
```

## 🗄️ NeonDB Setup

1. Create account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string from dashboard
4. Paste it in your `.env` file as `DATABASE_URL`

Your connection string should look like:

```
postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🏗️ Architecture

### Services

### Services

- **Web App** (Next.js) - Main application on port 3000
- **WebSocket Server** - Real-time collaboration on port 8080

### External Services

- **NeonDB** - PostgreSQL database (managed)
- **Resend** - Email service for authentication

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8080
lsof -i :6379

# Stop any conflicting services
```

**Database connection issues:**

- Verify your NeonDB connection string in `.env`
- Check if your IP is allowed in Neon dashboard
- Ensure `sslmode=require` is in the connection string

**Docker issues:**

```bash
# Clean up and restart
./docker-setup.sh clean
./docker-setup.sh start
```

### Health Checks

```bash
# Check if services are running
docker-compose ps

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:8080/health
```

## 📊 Production Deployment

For production deployment on a server:

1. Update `NEXTAUTH_URL` in `.env` to your domain
2. Use strong, unique secrets (32+ characters)
3. Set up SSL/HTTPS with a reverse proxy
4. Configure firewall rules
5. Set up monitoring and backups

## 🔐 Security

- All secrets should be 32+ characters
- NeonDB handles database security and backups
- Update secrets before production deployment

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NeonDB Documentation](https://neon.tech/docs)
- [Docker Documentation](https://docs.docker.com)
- [Resend Documentation](https://resend.com/docs)

---

**That's it!** Your Skema/Canvora application is now running with Docker and NeonDB. 🎉
