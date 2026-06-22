# 🔐 auth-service

> **Project 4 of 10** · [30-Day Dev Roadmap](https://github.com/eswarr-dasi/dev-project-roadmap) · Jun 30, 2026
>
> A stateless **JWT authentication microservice** built with Node.js and Express. Uses Redis for refresh
> token storage and access token blacklisting. Supports role-based access control (RBAC) for multi-role
> applications.
>
> ---
>
> ## ✨ Features
>
> - **Register / Login / Logout** — Full auth lifecycle
> - - **Access + Refresh tokens** — Short-lived access tokens, long-lived refresh tokens stored in Redis
>   - - **Token blacklisting** — Revoke access tokens on logout using Redis TTL
>     - - **RBAC** — Role-based middleware (`admin`, `user`, `readonly`)
>       - - **Password hashing** — bcrypt with configurable salt rounds
>         - - **Token refresh endpoint** — Silently renew sessions without re-login
>           - - **Rate limiting** — Login endpoint protected against brute-force
>             - - **Request validation** — Zod schemas on all inputs
>              
>               - ---
>
> ## 🛠️ Tech Stack
>
> | Layer | Technology |
> |-------|------------|
> | Runtime | Node.js 20 |
> | Framework | Express 4 |
> | Auth | jsonwebtoken |
> | Cache / Blacklist | Redis 7 |
> | Password | bcryptjs |
> | Validation | Zod |
> | DB | PostgreSQL (user store) |
> | Testing | Jest + Supertest |
>
> ---
>
> ## 📊 API Endpoints
>
> | Method | Endpoint | Description | Auth required |
> |--------|----------|-------------|---------------|
> | `POST` | `/auth/register` | Create account | No |
> | `POST` | `/auth/login` | Login, returns access + refresh tokens | No |
> | `POST` | `/auth/refresh` | Exchange refresh token for new access token | No |
> | `POST` | `/auth/logout` | Blacklist access token, delete refresh token | Yes |
> | `GET` | `/auth/me` | Return current user profile | Yes |
> | `GET` | `/admin/users` | List all users (admin only) | Yes (admin) |
>
> ---
>
> ## 🏗️ Architecture
>
> ```
> POST /auth/login
>   └── Validate credentials (bcrypt compare)
>   └── Sign access token (15m TTL)
>   └── Sign refresh token (7d TTL)
>   └── Store refresh token in Redis
>   └── Return both tokens
>
> POST /auth/logout
>   └── Add access token to Redis blacklist (TTL = remaining token lifetime)
>   └── Delete refresh token from Redis
>
> Protected route middleware
>   └── Verify JWT signature
>   └── Check Redis blacklist
>   └── Check user role
>   └── Attach user to req.user
> ```
>
> ---
>
> ## 🚀 Getting Started
>
> ### Prerequisites
> - Node.js 20+
> - - Redis 7 running locally (`redis-server`)
>   - - PostgreSQL 15+
>    
>     - ### Install & run
>     - ```bash
>       git clone https://github.com/eswarr-dasi/auth-service.git
>       cd auth-service
>       npm install
>       cp .env.example .env  # fill in DB + JWT secrets
>       npm run dev
>       ```
>
> ### Environment variables
> ```env
> PORT=3001
> JWT_ACCESS_SECRET=your_access_secret
> JWT_REFRESH_SECRET=your_refresh_secret
> REDIS_URL=redis://localhost:6379
> DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db
> ```
>
> ---
>
> ## 🧪 Testing
>
> ```bash
> npm test
> ```
>
> - Login / logout flow integration tests
> - - Token refresh and blacklist tests
>   - - RBAC middleware unit tests
>     - - Rate limiter tests
>      
>       - ---
>
> ## 🎯 Career Relevance
>
> Security and microservices patterns are core to distributed systems design. JWT + Redis blacklisting is the
> industry standard for stateless auth in microservice architectures. This is directly applicable to
> any distributed-systems or senior backend engineering role.
>
> ---
>
> ## 📅 Part of the 30-Day Dev Challenge
>
> See the full roadmap: [dev-project-roadmap](https://github.com/eswarr-dasi/dev-project-roadmap)
>
> *Built by [Eswarr Dasi](https://github.com/eswarr-dasi) · Jun 2026*
