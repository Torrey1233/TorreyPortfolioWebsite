# Database Setup Guide

## Option 1: Free Cloud PostgreSQL (Recommended for Development)

### 1. Create a free PostgreSQL database with Neon
1. Go to [Neon](https://neon.tech/) and sign up for a free account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

### 2. Update your .env file
Replace the DATABASE_URL in your .env file with the Neon connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## Option 2: Local PostgreSQL Installation

### Windows (using Chocolatey)
```bash
# Install Chocolatey if you don't have it
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install PostgreSQL
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14
```

### Windows (using PostgreSQL Installer)
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user
4. Update your .env file with:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/torrey_portfolio"
```

## Option 3: Docker (if you have Docker installed)
```bash
# Run PostgreSQL in Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=torrey_portfolio -p 5432:5432 -d postgres:15

# Update your .env file
DATABASE_URL="postgresql://postgres:password@localhost:5432/torrey_portfolio"
```

## After Setting Up Database

Once you have your DATABASE_URL configured, run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with initial data
npx prisma db seed
```

## Quick Start with Neon (Recommended)

1. Go to https://neon.tech/
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string
5. Update your .env file
6. Run the migration commands above

This will get you up and running in under 5 minutes!
