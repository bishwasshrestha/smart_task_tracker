# 🧠 Task Manager App with Smart Suggestions

This **full-stack** task manager lets you create, categorize, and manage your tasks. It uses a *Python* service to suggest categories for tasks based on content indicated by different color background, and stores everything in a PostgreSQL database. All components are containerized using **Docker**.

---

## 🚀 Features

- ✍️ Add tasks with automatic category suggestions
- 📋 View all tasks
- ✅ Mark tasks as done
- 🗑️ Delete tasks
- 💾 Data is saved in a PostgreSQL database
- 🐳 Fully containerized with Docker Compose

---

## 📦 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **AI Service**: Python + Flask
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

---

## 🧰 Prerequisites

Make sure you have installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

---

## 🛠️ Getting Started

### 1. Clone the repository

  ```bash
  git clone https://github.com/your-username/your-repo-name.git
  cd your-repo-name
```
### 2. Start the app using Docker

```bash
  docker compose up --build
```

### 3. Open the app
Visit htp://localhost:3000 in your browser

### Project Structure
```bash
your-repo/
├── backend/              # Node.js server
├── frontend/             # Static frontend
├── python-service/       # Suggestion service (Flask)
├── db/                   # Database volumes (if used)
├── docker-compose.yml    # Compose config
└── README.md
```

### 4. 🧪 Testing the App


1. Add a new task using the form

1. The Python service will suggest a category

1. The task will appear in the list with its suggestion

1. Click on a task to:

    - ✅ Mark as Done

    - 🗑️ Delete it

### 5. Access the PostgreSQL databse 

````bash
docker exec -it postgres-service psql -U postgres -d tasks_db
