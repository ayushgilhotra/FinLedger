# Finance Dashboard Backend API

A production-quality REST API for a finance dashboard system.

## Setup Steps

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Copy `.env.example` to `.env` and update the values if necessary.
    ```bash
    cp .env.example .env
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Run Production Server**:
    ```bash
    npm start
    ```

## API Endpoints

| Method | Path | Auth Required | Roles Allowed | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | No | Any | Register a new user |
| POST | `/api/auth/login` | No | Any | Login and get JWT |
| GET | `/api/users` | Yes | admin | List all users (paginated) |
| GET | `/api/users/:id` | Yes | admin | Get single user |
| PATCH | `/api/users/:id/role` | Yes | admin | Update user role |
| PATCH | `/api/users/:id/status` | Yes | admin | Toggle user status |
| GET | `/api/transactions` | Yes | viewer, analyst, admin | List transactions (filtered/paginated) |
| POST | `/api/transactions` | Yes | analyst, admin | Create transaction |
| GET | `/api/transactions/:id` | Yes | viewer, analyst, admin | Get single transaction |
| PATCH | `/api/transactions/:id` | Yes | analyst, admin | Update transaction |
| DELETE | `/api/transactions/:id` | Yes | analyst, admin | Soft delete transaction |
| GET | `/api/dashboard/summary` | Yes | any | Get finance summary |
| GET | `/api/dashboard/categories` | Yes | any | Get spending by category |
| GET | `/api/dashboard/trends` | Yes | any | Get 6-month trends |
| GET | `/api/dashboard/recent` | Yes | any | Get 10 recent transactions |

## Sample CURLs

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@finance.com", "password": "admin123"}'
```

### Create Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 150.50, "type": "expense", "category": "Food", "date": "2025-01-20", "notes": "Lunch with team"}'
```

### Dashboard Summary
```bash
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"
```

## Assumptions & Logic

- **Soft Delete**: Transactions are never hard deleted; `is_deleted` is set to 1.
- **Role Hierarchy**: 
    - `admin`: Full access to everything.
    - `analyst`: Can see all data, but only modify their own transactions.
    - `viewer`: Can only see and access their own data.
- **Pagination**: Default is 10 items per page.
- **Validation**: All inputs are validated using Zod schemas.
- **Error Handling**: Global middleware ensures consistent JSON error responses without leaking stack traces.
