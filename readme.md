title: "💸NogorPay- Digital Wallet System"
description: >
  A full-featured role-based digital wallet system built with Node.js, Express, MongoDB, and TypeScript.
  It supports top-ups, withdrawals, transfers, transaction history, and role-specific functionalities for users, agents, and admins.

features:
  - section: "🔐 Authentication & Authorization"
    items:
      - "Register as a User"
      - "Login as User, Agent, or Admin"
      - "Role-based access control (RBAC)"
      - "JWT-based authentication (stored in cookies)"
      - "Profile access & logout"

  - section: "👤 Users"
    items:
      - "Register a new user (/user/register)"
      - "Add money to wallet"
      - "Withdraw money"
      - "Send money using email"
      - "View personal transaction history"

  - section: "🧑‍💼 Agents"
    items:
      - "Register as agent (/agent/register)"
      - "Cash-in to user wallet"
      - "Cash-out from user wallet"
      - "View own transaction history with comission"

  - section: "🛡️ Admins"
    items:
      - "View all users, agents, wallets"
      - "Block / unblock wallets"
      - "Approve / suspend agents"

  - section: "💳 Wallets"
    items:
      - "Auto-created upon registration"
      - "Can be active or blocked"
      - "Real-time transaction updates"

project_structure: |
  src/
  ├── app/
  │   ├── modules/
  │   │   ├── auth/
  │   │   ├── user/
  │   │   ├── agent/
  │   │   ├── admin/
  │   │   ├── wallet/
  │   │   └── transaction/
  │   ├── middlewares/
  │   ├── utils/
  │   └── app.ts
  ├── config/
  ├── enums/
  ├── errorHelper/
  ├── server.ts
  └── types/

api:
  base_url: "http://localhost:5000/api"
  endpoints:
    auth:
      - "POST /auth/login         # Login (User / Agent / Admin)"
      - "GET /auth/me            # Get logged-in user profile"
      - "POST /auth/logout        # Logout"
    user:
      - "POST /user/register                   # Register new user"
      - "POST /transaction/user/addMoney      # Add money"
      - "POST /transaction/user/withdraw      # Withdraw money"
      - "POST /transaction/user/send          # Send money to another user"
      - "GET /transaction/user/me             # View user's transactions"
    agent:
      - "POST /agent/register                 # Register as agent"
      - "POST /transaction/agent/cashIn      # Cash-in to user wallet"
      - "POST /transaction/agent/cashOut     # Cash-out from user wallet"
      - "GET /transaction/agent/me           # View agent's transactions with comission history"
    admin:
      - "GET /admin/users                   # List all users"
      - "GET /admin/agents                  # List all agents"
      - "GET /admin/wallets                 # List all wallets"
      - "POST /admin/wallet/block/:id      # Block wallet"
      - "POST /admin/wallet/unblock/:id    # Unblock wallet"
      - "POST /admin/agent/approve/:id     # Approve agent"
      - "POST /admin/agent/suspend/:id     # Suspend agent"

testing:
  tool: "Postman"
  instructions:
    - "Enable cookies"
    - "Set baseURL to http://localhost:5000/api"
    - "Login first to access protected routes"

setup:
  steps:
    - step: "Clone the Repository"
      command: |
        git clonehttps://github.com/uthso297/NogorPay_Digital_Wallet.git
        cd NogorPay_Digital_Wallet
    - step: "Install Dependencies"
      command: |
        npm install
    - step: "Create .env File"
      content: |
        PORT=5000
        DATABASE_URL=your_mongo_uri
        BCRYPT_SALT_ROUND=10
        JWT_SECRET=your_jwt_secret
        JWT_EXPIRES_IN=1d
        ADMIN_EMAIL=set admin email
        ADMIN_PASS=set admin pass
    - step: "Start the Server"
      command: |
        npm run dev

tech_stack:
  - Node.js
  - Express.js
  - MongoDB + Mongoose
  - TypeScript
  - Zod
  - JWT + Cookies
  - Passport.js
  - Cookie-parser
  - Custom middlewares

future_improvements:
  - Swagger API documentation
  - Frontend using React or Next.js
  - Email notifications for transactions
  - Commission tracking for agents
  - Admin dashboard UI



