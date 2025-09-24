# Task Management App

A full-stack task management system with **JWT-based authentication**, user-specific tasks, and CRUD APIs.  

---

## 🚀 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), [JWT](https://jwt.io/), [Bcrypt](https://www.npmjs.com/package/bcrypt)  
- **Frontend**: React + Vite
- **Database**: PostgreSQL 
- **Tools**: ESLint, Prettier  

---

## ⚙️ Project Setup

### 1️⃣ Backend

```bash
# Navigate to backend
cd task-manager-backend

# Install dependencies
npm install

# Run database migrations (creates tables)
npm run typeorm migration:run

# Start development server
npm run start:dev

# Start production build
npm run build
npm run start:prod
```

Backend will be available at:
👉 http://localhost:3000/api

### 1️⃣ Backend

```bash
# Navigate to frontend
cd task-manager-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at:
👉 http://localhost:5173 (default Vite)

### 3️⃣ Database Setup

- Install PostgreSQL locally
  Create a database:
  ```bash
  CREATE DATABASE task_manager;
  ```

  Update backend/.env with your DB config:
  ```bash
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=postgres
  DATABASE_PASSWORD=yourpassword
  DATABASE_NAME=task_manager
  
  JWT_SECRET=supersecretkey
  ```

  Run migrations:
  ```bash
  npm run typeorm migration:run
  ```

  ### 📖 API Documentation
  ## 🔑 Auth
  - POST /api/auth/signup
    Request
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    Response
    {
      "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "token": "jwt_token_here"
    }
  
  - POST /api/auth/login
    Request
    {
      "email": "john@example.com",
      "password": "password123"
    }
    Response
    {
      "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
      "token": "jwt_token_here"
    }

  ## 📋 Tasks

  ⚠️ All task endpoints require Authorization header:
  Authorization: Bearer <jwt_token>

  - POST /api/tasks
    Request
    {
      "tname": "Buy groceries",
      "tdesc": "Milk, Bread, Eggs",
      "status": 0,
      "dueDate": "2025-09-25T15:00:00.000Z"
    }
    
    Response
    {
      "tid": 1,
      "tname": "Buy groceries",
      "tdesc": "Milk, Bread, Eggs",
      "status": 0,
      "dueDate": "2025-09-25T15:00:00.000Z",
      "user": { "id": 1 }
    }

- GET /api/tasks

  Response
  [
    {
      "tid": 1,
      "tname": "Buy groceries",
      "tdesc": "Milk, Bread, Eggs",
      "status": 0,
      "dueDate": "2025-09-25T15:00:00.000Z",
      "user": { "id": 1 }
    }
  ]



- PUT /api/tasks/:id
  Request
  {
    "tname": "Buy vegetables",
    "status": 1
  }
  
  Response
  {
    "tid": 1,
    "tname": "Buy vegetables",
    "tdesc": "Milk, Bread, Eggs",
    "status": 1,
    "dueDate": "2025-09-25T15:00:00.000Z",
    "user": { "id": 1 }
  }

- DELETE /api/tasks/:id

  Response
  {
    "message": "Task deleted successfully"
  }

  
