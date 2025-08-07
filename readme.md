# 💸 NogorPay – Digital Wallet System

## 🚀 Project Overview

**NogorPay** is a full-featured, role-based digital wallet system built using **Node.js**, **Express**, **MongoDB**, and **TypeScript**. It enables **users**, **agents**, and **admins** to securely perform digital transactions, including top-ups, withdrawals, and peer-to-peer money transfers.

---

## 📸 Screenshot

> _Coming soon_

---

## 🛠️ Tech Stack

### Backend

- **Node.js & Express.js** – RESTful API & server logic  
- **MongoDB & Mongoose** – NoSQL database and ODM  
- **TypeScript** – Type safety  
- **Zod** – Request validation  
- **JWT + Cookies** – Authentication  
- **Passport.js** – Strategy-based authentication  
- **Cookie-parser** – Middleware  
- **Custom Middleware** – RBAC, error handling  

---

## 🔐 Authentication & Authorization

- Role-based Access Control (**User / Agent / Admin**)  
- JWT Authentication (stored in **HttpOnly Cookies**)  
- Authenticated profile route (`/auth/me`)  
- Secure logout and session handling  

---

## 👥 Roles & Features

### 🧍 Users

- Register as a user  
- Add money to wallet  
- Withdraw money  
- Send money to another user (via email)  
- View transaction history  

### 🧑‍💼 Agents

- Register as an agent  
- Cash-in money to user wallets  
- Cash-out money from user wallets  
- View transaction history (with commission details)  

### 🛡️ Admins

- View all users, agents, and wallets  
- Approve or suspend agents  
- Block or unblock wallets  

---

## 🧾 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔐 Authentication

| Method | Endpoint        | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/auth/login`    | Login (User / Agent / Admin)     |
| GET    | `/auth/me`       | Get profile info                 |
| POST   | `/auth/logout`   | Logout                           |

### 👤 User

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/user/register`                  | Register new user        |
| POST   | `/transaction/user/addMoney`      | Add money                |
| POST   | `/transaction/user/withdraw`      | Withdraw money           |
| POST   | `/transaction/user/send`          | Send money (via email)   |
| GET    | `/transaction/user/me`            | Transaction history      |

### 🧑‍💼 Agent

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | `/agent/register`                 | Register as agent              |
| POST   | `/transaction/agent/cashIn`       | Cash in to user wallet         |
| POST   | `/transaction/agent/cashOut`      | Cash out from user wallet      |
| GET    | `/transaction/agent/me`           | Agent transaction history      |

### 🛡️ Admin

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/admin/users`                    | View all users           |
| GET    | `/admin/agents`                   | View all agents          |
| GET    | `/admin/wallets`                  | View all wallets         |
| POST   | `/admin/wallet/block/:id`         | Block a wallet           |
| POST   | `/admin/wallet/unblock/:id`       | Unblock a wallet         |
| POST   | `/admin/agent/approve/:id`        | Approve an agent         |
| POST   | `/admin/agent/suspend/:id`        | Suspend an agent         |

---

## 🧪 Testing (Postman)

- Use **Postman** to test all routes  
- **Enable cookies** to test authentication  
- Set base URL: `http://localhost:5000/api`  
- Login to access protected routes  

---

## ⚙️ Setup Instructions

### Env config:
PORT=5000
DATABASE_URL=your_mongo_uri
BCRYPT_SALT_ROUND=10
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=your_admin_email
ADMIN_PASS=your_admin_password

### Clone the Repository

```bash
git clone https://github.com/uthso297/NogorPay_Digital_Wallet.git
cd NogorPay_Digital_Wallet
npm install
npm run dev
