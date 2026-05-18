# PerfAI - Employee Performance Analytics and Recommendation System

A full-stack MERN application that tracks employee performance data and generates AI-powered
promotion recommendations, training suggestions, and employee rankings using OpenRouter AI.

---

## Tech Stack

**Backend**
- Node.js - runtime environment
- Express.js - web framework and REST API
- MongoDB - NoSQL database
- Mongoose - ODM for schema modeling and validation
- JSON Web Token (JWT) - stateless authentication
- bcryptjs - password hashing
- axios - HTTP client for OpenRouter API calls
- dotenv - environment variable management
- cors - cross-origin resource sharing
- nodemon - development auto-restart

**Frontend**
- React 18 - UI library
- Vite - build tool and dev server
- React Router DOM - client-side routing and protected routes
- axios - API communication with backend
- CSS variables - theming and design system
- Google Fonts (Cabinet Grotesk, Instrument Sans) - typography

**AI Integration**
- OpenRouter API - AI gateway
- Model: openai/gpt-4o-mini - candidate analysis and recommendations

**Deployment**
- Render - backend web service and frontend static site
- MongoDB Atlas - cloud database hosting
- GitHub - version control and CI trigger for Render

---

## Project Structure

```
employee-analytics/
    backend/
        config/
            db.js
        controllers/
            authController.js
            employeeController.js
            aiController.js
        middleware/
            authMiddleware.js
            errorMiddleware.js
        models/
            User.js
            Employee.js
        routes/
            authRoutes.js
            employeeRoutes.js
            aiRoutes.js
        .env
        .gitignore
        server.js
        package.json
    frontend/
        public/
            _redirects
        src/
            components/
                Navbar.jsx
                PrivateRoute.jsx
            pages/
                Login.jsx
                Register.jsx
                Dashboard.jsx
                AddEmployee.jsx
                EmployeeList.jsx
                AIRecommendations.jsx
            App.jsx
            main.jsx
            index.css
        index.html
        .gitignore
        package.json
```

---

## System Architecture

```
+------------------+        HTTP / Axios        +-------------------+
|                  | -------------------------> |                   |
|  React Frontend  |                            |  Express Backend  |
|  (Vite / JSX)    | <------------------------- |  (Node.js)        |
|                  |      JSON Responses        |                   |
+------------------+                            +-------------------+
                                                        |
                                                        | Mongoose ODM
                                                        v
                                               +-------------------+
                                               |   MongoDB Atlas   |
                                               |   (Cloud DB)      |
                                               +-------------------+
                                                        |
                                               +-------------------+
                                               |  OpenRouter API   |
                                               |  (AI Gateway)     |
                                               +-------------------+
```

---

## Authentication Flow

```
Client                        Server                        Database
  |                              |                              |
  |-- POST /api/auth/register -->|                              |
  |                              |-- Check duplicate email ---->|
  |                              |<-- Email not found ----------|
  |                              |-- Hash password (bcrypt)     |
  |                              |-- Save user ---------------->|
  |                              |<-- User saved ---------------|
  |<-- JWT Token + user data ----|                              |
  |                              |                              |
  |-- POST /api/auth/login ----->|                              |
  |                              |-- Find user by email ------->|
  |                              |<-- User document ------------|
  |                              |-- Compare password (bcrypt)  |
  |<-- JWT Token + user data ----|                              |
  |                              |                              |
  |-- GET /api/employees ------->|                              |
  |   Authorization: Bearer JWT  |-- Verify JWT (middleware)    |
  |                              |-- Attach user to req         |
  |                              |-- Fetch employees ---------->|
  |<-- Employee array -----------|<-- Documents ---------------|
```

---

## API Endpoints

```
Auth Routes         /api/auth
                    POST   /register        Create HR/Admin account
                    POST   /login           Login and receive JWT
                    GET    /me              Get logged-in user profile (protected)

Employee Routes     /api/employees
                    POST   /               Add new employee (protected)
                    GET    /               Get all employees (protected)
                    GET    /search         Search and filter employees (protected)
                    GET    /:id            Get single employee by ID (protected)
                    PUT    /:id            Update employee data (protected)
                    DELETE /:id            Delete employee (protected)

AI Routes           /api/ai
                    POST   /recommend      Generate AI recommendations (protected)
```

---

## Employee Data Schema

```
Employee
    name             String      required
    email            String      required, unique, lowercase
    department       String      required
    skills           [String]    required, min 1 item
    performanceScore Number      required, 0 to 100
    experience       Number      required, min 0
    createdAt        Date        default now
```

---

## AI Recommendation Flow

```
POST /api/ai/recommend
        |
        v
Fetch all employees from MongoDB
        |
        v
Build structured prompt with employee profiles
        |
        v
Send prompt to OpenRouter (openai/gpt-4o-mini)
        |
        v
Parse JSON response from AI
        |
        v
Enrich AI output with DB fields (email, skills, _id)
        |
        v
Return enriched recommendations to frontend

AI Output per employee:
    - rank (1 to N)
    - promotionRecommendation (Yes / No / Maybe)
    - promotionReason
    - trainingSuggestions (array of skills)
    - performanceFeedback
    - overallRating (Excellent / Good / Average / Needs Improvement)
```

---

## Performance Score Rating System

```
Score Range     Rating                  Action
85 to 100       Excellent               Strong promotion candidate
70 to 84        Good                    Ready for more responsibilities
50 to 69        Average                 Targeted training recommended
0 to 49         Needs Improvement       Immediate improvement plan
```

---

## Search and Filter Options

```
GET /api/employees/search

Query Parameters:
    name            Partial match, case-insensitive
    department      Partial match, case-insensitive
    skill           Matches any skill in the skills array
    minScore        Minimum performance score (inclusive)
    maxScore        Maximum performance score (inclusive)

Example:
    /api/employees/search?department=Development&minScore=80
```

---

## Environment Variables

Backend `.env` file requires:

```
PORT                5000
MONGO_URI           MongoDB Atlas connection string
JWT_SECRET          Secret key for signing JWT tokens
OPENROUTER_API_KEY  API key from openrouter.ai
```

---

## Frontend Routes

```
/login                  Public      Login page
/register               Public      Register page
/dashboard              Protected   Stats overview and recent employees
/add-employee           Protected   Add new employee form
/employees              Protected   Full employee list with search and filter
/ai-recommendations     Protected   AI-powered analysis and recommendations
```

---

## Deployment

**Backend on Render (Web Service)**
- Root Directory: backend
- Build Command: npm install
- Start Command: node server.js
- Environment Variables: set MONGO_URI, JWT_SECRET, OPENROUTER_API_KEY in Render dashboard

**Frontend on Render (Static Site)**
- Root Directory: frontend
- Build Command: npm install && npm run build
- Publish Directory: dist
- Routing fix: add /* /index.html 200 to public/_redirects
- Add Rewrite Rule in Render dashboard: /* to /index.html with action Rewrite

---

## Local Development

```
# Clone the repository
git clone https://github.com/GIT-KrishSandhu/PerfAI.git

# Backend setup
cd backend
npm install
# Create .env file with required variables
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Backend runs on http://localhost:5000
Frontend runs on http://localhost:5173

---

## Security

- Passwords are hashed using bcryptjs before storing in MongoDB
- JWT tokens expire after 7 days
- All non-auth routes are protected by JWT middleware
- CORS is restricted to known frontend origins
- Secrets are stored in .env and excluded from version control via .gitignore
- Duplicate email validation on both user and employee registration
