# Backend

Run the backend server (requires Node.js and MongoDB):

1. Create a `.env` file in `backend/` with:

```
MONGODB_URI="your-mongodb-connection-string"
PORT=5000
```

2. Install and start the server:

```
cd backend
npm install
npm start
```

The API base will be available on `http://localhost:5000` by default. Endpoints:

- GET  /api/tasks
- POST /api/tasks
- PUT  /api/tasks/:id
- PATCH /api/tasks/:id/favorite
- PATCH /api/tasks/:id/important
- PATCH /api/tasks/:id/status
- DELETE /api/tasks/:id

Notes:
- Tasks accept `desc` or `description` in payloads (frontend uses `desc`) and will return `description` in DB responses.