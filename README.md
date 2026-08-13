# Student Study Planner

A web application to help students plan and manage their studies.

## Features

- Add study tasks
- Manage subjects
- Track study progress
- Organize daily study activities

## Technologies

- Node.js
- Express.js
- JavaScript
- HTML
- CSS

## Installation

```bash
npm install
```

## Running locally

1. Ensure you have a MongoDB server available. For local MongoDB, start `mongod` or start the `MongoDB` service.

2. (Optional) Set `MONGO_URI` to your Mongo connection string. By default the app uses `mongodb://127.0.0.1:27017/student-planner`.

On Windows (PowerShell):
```powershell
$env:MONGO_URI = "mongodb://127.0.0.1:27017/student-planner"
node server.js
```

On Linux/macOS:
```bash
export MONGO_URI="mongodb://127.0.0.1:27017/student-planner"
node server.js
```

3. Open http://localhost:3000 in your browser.

## API

- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create task (JSON body: `{ subject, task, date, priority }`)
- `PATCH /api/tasks/:id` — update task fields (e.g. `{ completed: true }`)
- `DELETE /api/tasks/:id` — delete task

## Notes
- The front-end now persists tasks to the MongoDB backend via the API.
- Keep `MONGO_URI` private for production deployments.