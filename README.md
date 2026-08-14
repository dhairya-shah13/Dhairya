# Task Manager — Full Stack Application (Practical 6)

A full-stack Task Manager built for **Advanced Web Development Frameworks (ITUE301)
Practical 6**, integrating a React frontend with a Node/Express/MongoDB backend.

```
React Frontend (localhost:5173)
        | fetch API calls
        v
Express Backend (localhost:5000)
        | Mongoose
        v
MongoDB (mongodb://127.0.0.1:27017/task-manager-api)
```

## Features

- Create, view, update and delete tasks
- Tasks persisted in MongoDB (survive a browser refresh)
- Loading states and error handling for **every** API interaction
- Delete confirmation dialog
- Toast notifications for successful/failed create, update and delete
- Optimistic UI update when creating a task (rolled back if the server rejects it)
- Task priority (low / medium / high) and completion status
- Light/dark theme

## Repository Structure

```
AWDF_Practical/
├── task-manager-api-24IT090/   # Backend: Node + Express + MongoDB
└── Dhairya/                    # Frontend: React + Vite (this folder)
```

## Prerequisites

- Node.js v18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)

## Running the Backend

Open a terminal in the `task-manager-api-24IT090` folder:

```bash
cd task-manager-api-24IT090
npm install
npm start
```

The API runs at **http://localhost:5000**.

Optional: copy `.env.example` to `.env` to override the port or MongoDB URI.

## Running the Frontend

Open a second terminal in the `Dhairya` folder:

```bash
cd Dhairya
npm install
npm run dev
```

The app runs at **http://localhost:5173** — open the **Tasks** page to manage tasks.

## API Endpoints

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| GET    | `/tasks`        | List all tasks from MongoDB  |
| GET    | `/tasks/:id`    | Get a single task            |
| POST   | `/tasks`        | Create a task                |
| PUT    | `/tasks/:id`    | Update a task                |
| DELETE | `/tasks/:id`    | Delete a task                |

Example task payload:

```json
{
  "title": "Finish practical",
  "description": "Wire React to the Express API",
  "priority": "high"
}
```

## Testing the Full Flow

1. Start both servers (above).
2. On the Tasks page: create a task → it appears in the list.
3. Edit a task and save → the list updates.
4. Toggle a task's completion checkbox → the status updates.
5. Delete a task → confirm in the dialog → it disappears.
6. Refresh the browser → all remaining tasks are still there (they come from MongoDB).

The backend can also be tested independently with Postman/curl against
`http://localhost:5000/tasks`.
