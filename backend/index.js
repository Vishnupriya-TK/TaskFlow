require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');


const app = express();

// Define allowed origins from environment variable
const corsEnv = process.env.CORS_ORIGINS; // e.g., "https://task-flow-jj39.onrender.com,http://localhost:5173"
const allowedOrigins = corsEnv
  ? corsEnv.split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:5173']; // fallback

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests from frontend or server-to-server (no origin)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('Blocked CORS request from', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server or non-browser requests without an Origin header
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.warn('Blocked CORS request from origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
}

app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGODB_URI or MONGO_URI is not set. Exiting.');
  process.exit(1);
}
console.log(`Using MongoDB URI from ${process.env.MONGODB_URI ? 'MONGODB_URI' : 'MONGO_URI'}`);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Task Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  // User identifier (could be email or user id from auth)
  userId: { type: String, required: false },
  favorite: { type: Boolean, default: false },
  // Enum status: Incomplete or Complete. Important is a separate boolean flag.
  status: { type: String, enum: ['Incomplete', 'Complete'], default: 'Incomplete' },
  completed: { type: Boolean, default: false },
  important: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// CRUD Routes
// Get tasks with optional filters: userId, status, favorite, important
app.get('/api/tasks', async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.favorite) filter.favorite = req.query.favorite === 'true';
    if (req.query.important) filter.important = req.query.important === 'true';
    let tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Handle legacy records where status was set to 'Important'
    tasks = tasks.map(t => {
      const obj = t.toObject();
      if (obj.status === 'Important') {
        obj.important = true;
        obj.status = 'Incomplete';
      }
      return obj;
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Lightweight health check for frontend connectivity
app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

// DB health check
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected
  res.json({ ok: state === 1, state });
});

// Create a new task. Accepts either `desc` or `description`.
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, desc, description, userId, favorite, status, important } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    // If client sends status 'Important' (legacy), convert it to important flag.
    let finalStatus = status || 'Incomplete';
    let finalImportant = !!important;
    if (finalStatus === 'Important') {
      finalImportant = true;
      finalStatus = 'Incomplete';
    }

    const task = new Task({
      title,
      description: description || desc || '',
      userId: userId || null,
      favorite: !!favorite,
      status: finalStatus,
      completed: finalStatus === 'Complete',
      important: finalImportant,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// General update
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    // normalize fields
    if (updates.desc && !updates.description) updates.description = updates.desc;
    if (typeof updates.status !== 'undefined') {
      // status should be either 'Complete' or 'Incomplete'
      if (!['Complete', 'Incomplete'].includes(updates.status)) return res.status(400).json({ message: 'Invalid status' });
      updates.completed = updates.status === 'Complete';
    }
    if (typeof updates.important !== 'undefined') {
      updates.important = !!updates.important;
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle favorite
app.patch('/api/tasks/:id/favorite', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.favorite = typeof req.body.favorite === 'boolean' ? req.body.favorite : !task.favorite;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle important flag (independent of status)
app.patch('/api/tasks/:id/important', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.important = typeof req.body.important === 'boolean' ? req.body.important : !task.important;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set status explicitly (Complete / Incomplete / Important)
app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Incomplete', 'Complete', 'Important'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = status;
    task.completed = status === 'Complete';
    task.important = status === 'Important';
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup Route
app.post('/api/users/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
