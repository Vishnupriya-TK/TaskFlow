# TaskFlow – Task Management App

TaskFlow is a full-stack task management application built using **React + Vite** for the frontend and **Node.js + Express + MongoDB** for the backend. It allows users to create, update, filter, and delete tasks with features like marking tasks as important or favorite.

🔗 **Live Demo:** [Visit here](https://task-flow-jj39.onrender.com)

---

## ✨ Features

🔐 **Login & Signup** with secure hashed passwords

🗂 **Task Management**

* Create tasks with title, description, status, and favorite/important flags
* Update or toggle task status, favorite, and important
* Delete tasks

📊 **Task Filtering**

* View All Tasks, Completed Tasks, Important Tasks, Incomplete Tasks
* Supports filters via query parameters

🩺 **Lightweight Health Check**

* `GET /api/ping` for server status

📱 **Responsive UI** for mobile & desktop

---

## 🛠 Tech Stack

**Frontend**

* React
* Vite
* Axios
* CSS

**Backend**

* Node.js
* Express.js
* MongoDB
* JWT & bcrypt

---

## 📂 Project Structure

**Frontend** (`src/`)

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   └── pages/
│       ├── AllTasks.jsx
│       ├── CompletedTasks.jsx
│       ├── Home.jsx
│       ├── ImportantTasks.jsx
│       ├── IncompletedTasks.jsx
│       ├── Login.jsx
│       └── Signup.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── node_modules
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── eslint.config.js
└── index.html

```

**Backend** (`backend/`)

```
backend/
├── index.js        
├── package.json
├── package-lock.json
├── .env             
├── node_modules
└── README.md

```

---

## 🔄 How It Works

1. **Start / Auth** 🔐

   * User opens the frontend → Login / Signup pages
   * Signup: `POST /api/users/signup` (stores hashed password)
   * Login: `POST /api/users/login` (verifies credentials; returns basic user info)

2. **Load Dashboard / Tasks** ✅

   * After login, dashboard loads and fetches tasks:
     `GET /api/tasks` (supports query: userId, status, favorite, important)

3. **Create a Task** ✍️

   * `POST /api/tasks` accepts `title`, `description` (or `desc`), `userId`, `favorite`, `status`, `important`

4. **Update / Toggle Task** 🔧

   * Full update: `PUT /api/tasks/:id`
   * Toggle favorite: `PATCH /api/tasks/:id/favorite`
   * Toggle important: `PATCH /api/tasks/:id/important`
   * Set status: `PATCH /api/tasks/:id/status`

5. **Delete Task** 🗑️

   * `DELETE /api/tasks/:id`

---

## ⚙️ Environment Variables (Backend)

```
MONGODB_URI=your_mongodb_connection
CORS_ORIGINS=allowed_frontend_origins
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Run Locally

**Clone Repository**

```bash
git clone https://github.com/Vishnupriya-TK/TaskFlow.git
cd TaskFlow
```

**Start Backend**

```bash
cd backend
npm install
npm start
```

**Start Frontend**

```bash
cd ../
npm install
npm run dev
```

Open browser 👉 [http://localhost:5173](http://localhost:5173)

---

## 👩‍💻 Author

Vishnu Priya Kannan 📬 Open to collaboration and feedback

🌟 *“TaskFlow makes managing tasks effortless, organized, and productive.”*

